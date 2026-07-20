ALTER TABLE articles ADD COLUMN IF NOT EXISTS article_code VARCHAR(20) UNIQUE;

WITH numbered AS (
    SELECT id,
           to_char(published_at, 'YYYYMMDD') AS day_str,
           row_number() OVER (PARTITION BY to_char(published_at, 'YYYYMMDD') ORDER BY published_at, id) AS rn
    FROM articles
    WHERE article_code IS NULL
)
UPDATE articles a
SET article_code = numbered.day_str || '-' || numbered.rn
FROM numbered
WHERE a.id = numbered.id;

CREATE INDEX IF NOT EXISTS idx_articles_article_code ON articles (article_code);
