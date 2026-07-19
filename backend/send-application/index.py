import json
import os
import re
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def handler(event: dict, context) -> dict:
    """Принимает заявку с сайта (имя, телефон, вопрос) и отправляет её на почту получателя через SMTP (Timeweb)"""
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token, X-Session-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    headers = {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}

    if method != 'POST':
        return {'statusCode': 405, 'headers': headers, 'body': json.dumps({'error': 'Method not allowed'})}

    body_data = json.loads(event.get('body') or '{}')
    name = (body_data.get('name') or '').strip()
    phone = (body_data.get('phone') or '').strip()
    message = (body_data.get('message') or '').strip()

    if not name or len(name) < 2:
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Укажите корректное имя'})}

    phone_digits = re.sub(r'\D', '', phone)
    if len(phone_digits) != 11 or phone_digits[0] not in ('7', '8'):
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Укажите корректный номер телефона'})}

    smtp_user = os.environ.get('SMTP_USER')
    smtp_password = os.environ.get('SMTP_PASSWORD')
    recipient = 'almaz.habibrahmanov@gmail.com'

    if not smtp_user or not smtp_password:
        return {'statusCode': 500, 'headers': headers, 'body': json.dumps({'error': 'Отправка почты не настроена'})}

    msg = MIMEMultipart()
    msg['From'] = smtp_user
    msg['To'] = recipient
    msg['Subject'] = f'Новая заявка с сайта — {name}'

    body_text = f"Новая заявка с сайта Призывник 59\n\nИмя: {name}\nТелефон: {phone}\nВопрос: {message or '—'}"
    msg.attach(MIMEText(body_text, 'plain', 'utf-8'))

    with smtplib.SMTP_SSL('smtp.timeweb.ru', 465) as server:
        server.login(smtp_user, smtp_password)
        server.sendmail(smtp_user, recipient, msg.as_string())

    return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'success': True})}