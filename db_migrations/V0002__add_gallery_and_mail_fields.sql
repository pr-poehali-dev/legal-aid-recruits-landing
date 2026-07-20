ALTER TABLE articles ADD COLUMN IF NOT EXISTS gallery_images JSONB DEFAULT '[]'::jsonb;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS source VARCHAR(20) DEFAULT 'telegram';
ALTER TABLE articles ADD COLUMN IF NOT EXISTS mail_uid VARCHAR(100);
CREATE INDEX IF NOT EXISTS idx_articles_mail_uid ON articles (mail_uid);
