import os
from xml.sax.saxutils import escape

import psycopg2

SITE_URL = 'https://prizivnik59.ru'

STATIC_URLS = [
    {'loc': '/', 'changefreq': 'weekly', 'priority': '1.0'},
    {'loc': '/blog', 'changefreq': 'daily', 'priority': '0.8'},
    {'loc': '/privacy-policy', 'changefreq': 'monthly', 'priority': '0.3'},
]


def handler(event: dict, context) -> dict:
    """Формирует sitemap.xml со всеми статьями блога из базы данных для правильной индексации поисковиками"""
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

    if method != 'GET':
        return {'statusCode': 405, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': 'Method not allowed'}

    dsn = os.environ['DATABASE_URL']
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    table = f'"{schema}".articles'
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    cur.execute(f'SELECT slug, published_at FROM {table} ORDER BY published_at DESC')
    rows = cur.fetchall()
    cur.close()
    conn.close()

    xml_parts = ['<?xml version="1.0" encoding="UTF-8"?>']
    xml_parts.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')

    for item in STATIC_URLS:
        xml_parts.append('  <url>')
        xml_parts.append(f'    <loc>{escape(SITE_URL + item["loc"])}</loc>')
        xml_parts.append(f'    <changefreq>{item["changefreq"]}</changefreq>')
        xml_parts.append(f'    <priority>{item["priority"]}</priority>')
        xml_parts.append('  </url>')

    for slug, published_at in rows:
        loc = f'{SITE_URL}/blog/{slug}'
        lastmod = published_at.strftime('%Y-%m-%d')
        xml_parts.append('  <url>')
        xml_parts.append(f'    <loc>{escape(loc)}</loc>')
        xml_parts.append(f'    <lastmod>{lastmod}</lastmod>')
        xml_parts.append('    <changefreq>monthly</changefreq>')
        xml_parts.append('    <priority>0.6</priority>')
        xml_parts.append('  </url>')

    xml_parts.append('</urlset>')
    xml_body = '\n'.join(xml_parts)

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/xml; charset=utf-8',
        },
        'body': xml_body
    }
