import email
import imaplib
import json
import os
import re
import uuid
from email.header import decode_header
from email.utils import parseaddr

import boto3
import psycopg2


def slugify(text: str) -> str:
    text = text.lower().strip()
    translit_map = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
        'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya', ' ': '-',
    }
    result = ''.join(translit_map.get(ch, ch) for ch in text)
    result = re.sub(r'[^a-z0-9\-]', '', result)
    result = re.sub(r'-+', '-', result).strip('-')
    return result[:80] or str(uuid.uuid4())[:8]


def decode_mime_text(value: str) -> str:
    if not value:
        return ''
    parts = decode_header(value)
    result = ''
    for text, enc in parts:
        if isinstance(text, bytes):
            result += text.decode(enc or 'utf-8', errors='replace')
        else:
            result += text
    return result


def extract_body_and_images(msg):
    body_text = ''
    images = []

    if msg.is_multipart():
        for part in msg.walk():
            content_type = part.get_content_type()
            disposition = str(part.get('Content-Disposition') or '')

            if content_type == 'text/plain' and 'attachment' not in disposition and not body_text:
                payload = part.get_payload(decode=True)
                charset = part.get_content_charset() or 'utf-8'
                if payload:
                    body_text = payload.decode(charset, errors='replace')

            if content_type.startswith('image/'):
                payload = part.get_payload(decode=True)
                if payload:
                    ext = content_type.split('/')[-1].split(';')[0]
                    if ext == 'jpeg':
                        ext = 'jpg'
                    images.append({'bytes': payload, 'ext': ext, 'content_type': content_type})
    else:
        payload = msg.get_payload(decode=True)
        charset = msg.get_content_charset() or 'utf-8'
        if payload:
            body_text = payload.decode(charset, errors='replace')

    return body_text.strip(), images


def handler(event: dict, context) -> dict:
    """Проверяет почтовый ящик по IMAP и публикует новые письма (текст + фото) как статьи блога"""
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    headers = {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}

    if method != 'GET':
        return {'statusCode': 405, 'headers': headers, 'body': json.dumps({'error': 'Method not allowed'})}

    params = event.get('queryStringParameters') or {}
    poll_secret = os.environ.get('BLOG_MAIL_POLL_SECRET')
    if poll_secret and params.get('secret') != poll_secret:
        return {'statusCode': 403, 'headers': headers, 'body': json.dumps({'error': 'Forbidden'})}

    mail_user = os.environ['BLOG_MAIL_USER']
    mail_password = os.environ['BLOG_MAIL_PASSWORD']
    allowed_sender = (os.environ.get('BLOG_ALLOWED_SENDER') or '').strip().lower()

    imap = imaplib.IMAP4_SSL('imap.timeweb.ru', 993)
    imap.login(mail_user, mail_password)
    imap.select('INBOX')

    status, uid_data = imap.uid('search', None, 'UNSEEN')
    uids = uid_data[0].split() if uid_data and uid_data[0] else []

    dsn = os.environ['DATABASE_URL']
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    table = f'"{schema}".articles'
    conn = psycopg2.connect(dsn)
    conn.autocommit = True
    cur = conn.cursor()

    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )

    processed = []
    skipped = []

    for uid in uids:
        uid_str = uid.decode() if isinstance(uid, bytes) else str(uid)

        cur.execute(f'SELECT 1 FROM {table} WHERE mail_uid = %s', (uid_str,))
        if cur.fetchone():
            imap.uid('store', uid, '+FLAGS', '\\Seen')
            continue

        status, msg_data = imap.uid('fetch', uid, '(RFC822)')
        if status != 'OK' or not msg_data or not msg_data[0]:
            continue

        raw_email = msg_data[0][1]
        msg = email.message_from_bytes(raw_email)

        from_header = msg.get('From', '')
        sender_email = parseaddr(from_header)[1].strip().lower()

        if allowed_sender and sender_email != allowed_sender:
            skipped.append({'uid': uid_str, 'reason': 'sender not allowed', 'sender': sender_email})
            imap.uid('store', uid, '+FLAGS', '\\Seen')
            continue

        body_text, images = extract_body_and_images(msg)

        if not body_text or not images:
            skipped.append({'uid': uid_str, 'reason': 'need text and at least one image'})
            imap.uid('store', uid, '+FLAGS', '\\Seen')
            continue

        lines = [l for l in body_text.split('\n') if l.strip()]
        title = (lines[0].strip() if lines else 'Без названия')[:200]
        content = body_text.strip()

        slug_base = slugify(title)
        slug = slug_base
        cur.execute(f'SELECT 1 FROM {table} WHERE slug = %s', (slug,))
        if cur.fetchone():
            slug = f"{slug_base}-{uuid.uuid4().hex[:6]}"

        uploaded_urls = []
        for idx, img in enumerate(images):
            key = f"articles/{slug}-{idx}-{uuid.uuid4().hex[:8]}.{img['ext']}"
            s3.put_object(Bucket='files', Key=key, Body=img['bytes'], ContentType=img['content_type'])
            url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"
            uploaded_urls.append(url)

        cover_image = uploaded_urls[0]
        gallery_images = uploaded_urls[1:]

        cur.execute(
            f"""INSERT INTO {table} (slug, title, content, image_url, gallery_images, mail_uid, source, published_at)
                VALUES (%s, %s, %s, %s, %s, %s, 'email', NOW()) RETURNING id""",
            (slug, title, content, cover_image, json.dumps(gallery_images), uid_str)
        )
        article_id = cur.fetchone()[0]
        processed.append({'article_id': article_id, 'slug': slug, 'title': title})

        imap.uid('store', uid, '+FLAGS', '\\Seen')

    cur.close()
    conn.close()
    imap.logout()

    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({'ok': True, 'processed': processed, 'skipped': skipped}, ensure_ascii=False)
    }
