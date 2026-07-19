import json
import os
import re
import uuid
from datetime import datetime

import boto3
import psycopg2
import requests


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


def handler(event: dict, context) -> dict:
    """Принимает посты из Telegram-бота (текст + одна фотография) и публикует их как статьи блога на сайте"""
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    headers = {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}

    params = event.get('queryStringParameters') or {}
    if method == 'GET' and params.get('setup') == '1':
        bot_token = os.environ['TELEGRAM_BOT_TOKEN']
        webhook_secret = os.environ.get('TELEGRAM_WEBHOOK_SECRET', '')
        self_url = params.get('url', '')
        resp = requests.post(
            f'https://api.telegram.org/bot{bot_token}/setWebhook',
            json={
                'url': self_url,
                'secret_token': webhook_secret,
                'allowed_updates': ['message', 'channel_post'],
            },
            timeout=15,
        )
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps(resp.json())}

    if method != 'POST':
        return {'statusCode': 405, 'headers': headers, 'body': json.dumps({'error': 'Method not allowed'})}

    webhook_secret = os.environ.get('TELEGRAM_WEBHOOK_SECRET')
    req_headers = event.get('headers') or {}
    provided_secret = req_headers.get('X-Telegram-Bot-Api-Secret-Token') or req_headers.get('x-telegram-bot-api-secret-token')
    if webhook_secret and provided_secret != webhook_secret:
        return {'statusCode': 403, 'headers': headers, 'body': json.dumps({'error': 'Forbidden'})}

    update = json.loads(event.get('body') or '{}')
    message = update.get('message') or update.get('channel_post')

    if not message:
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True, 'skipped': 'no message'})}

    chat_id = str(message.get('chat', {}).get('id', ''))
    allowed_chat_id = os.environ.get('TELEGRAM_ALLOWED_CHAT_ID', '')
    allowed_ids = [c.strip() for c in allowed_chat_id.split(',') if c.strip()]
    if allowed_ids and chat_id not in allowed_ids:
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True, 'skipped': 'chat not allowed'})}

    photos = message.get('photo')
    caption = (message.get('caption') or message.get('text') or '').strip()

    if not photos or not caption:
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True, 'skipped': 'need photo and caption'})}

    bot_token = os.environ['TELEGRAM_BOT_TOKEN']
    largest_photo = photos[-1]
    file_id = largest_photo['file_id']

    file_info_resp = requests.get(f'https://api.telegram.org/bot{bot_token}/getFile', params={'file_id': file_id}, timeout=15)
    file_path = file_info_resp.json()['result']['file_path']
    file_url = f'https://api.telegram.org/file/bot{bot_token}/{file_path}'

    image_resp = requests.get(file_url, timeout=30)
    image_bytes = image_resp.content
    ext = file_path.split('.')[-1] if '.' in file_path else 'jpg'

    lines = caption.split('\n')
    title = lines[0].strip()[:200]
    content = caption

    slug_base = slugify(title)
    image_key = f"articles/{slug_base}-{uuid.uuid4().hex[:8]}.{ext}"

    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )
    content_type = f'image/{"jpeg" if ext == "jpg" else ext}'
    s3.put_object(Bucket='files', Key=image_key, Body=image_bytes, ContentType=content_type)
    image_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{image_key}"

    dsn = os.environ['DATABASE_URL']
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    table = f'"{schema}".articles'
    conn = psycopg2.connect(dsn)
    conn.autocommit = True
    cur = conn.cursor()

    slug = slug_base
    cur.execute(f'SELECT 1 FROM {table} WHERE slug = %s', (slug,))
    if cur.fetchone():
        slug = f"{slug_base}-{uuid.uuid4().hex[:6]}"

    telegram_message_id = message.get('message_id')

    cur.execute(
        f"""INSERT INTO {table} (slug, title, content, image_url, telegram_message_id, published_at)
            VALUES (%s, %s, %s, %s, %s, NOW()) RETURNING id""",
        (slug, title, content, image_url, telegram_message_id)
    )
    article_id = cur.fetchone()[0]
    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({'ok': True, 'article_id': article_id, 'slug': slug})
    }