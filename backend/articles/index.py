import json
import os
import math

import psycopg2
import psycopg2.extras


def handler(event: dict, context) -> dict:
    """Отдаёт список статей блога (с пагинацией) или одну статью по slug"""
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
    slug = params.get('slug')

    dsn = os.environ['DATABASE_URL']
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    table = f'"{schema}".articles'
    conn = psycopg2.connect(dsn)
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    if slug:
        cur.execute(
            f'SELECT id, slug, title, content, image_url, gallery_images, article_code, published_at FROM {table} WHERE slug = %s',
            (slug,)
        )
        row = cur.fetchone()
        cur.close()
        conn.close()
        if not row:
            return {'statusCode': 404, 'headers': headers, 'body': json.dumps({'error': 'Статья не найдена'})}
        row['published_at'] = row['published_at'].isoformat()
        row['gallery_images'] = row['gallery_images'] or []
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps(row, ensure_ascii=False)}

    page = max(int(params.get('page', 1)), 1)
    limit = min(max(int(params.get('limit', 9)), 1), 50)
    offset = (page - 1) * limit

    cur.execute(f'SELECT COUNT(*) AS total FROM {table}')
    total = cur.fetchone()['total']

    cur.execute(
        f'SELECT id, slug, title, content, image_url, published_at FROM {table} ORDER BY published_at DESC LIMIT %s OFFSET %s',
        (limit, offset)
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()

    articles = []
    for row in rows:
        row['published_at'] = row['published_at'].isoformat()
        excerpt = row['content'][:180]
        row['excerpt'] = excerpt + ('…' if len(row['content']) > 180 else '')
        articles.append(row)

    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({
            'articles': articles,
            'total': total,
            'page': page,
            'totalPages': math.ceil(total / limit) if total else 1,
        }, ensure_ascii=False)
    }