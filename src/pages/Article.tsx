import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Icon from "@/components/ui/icon";
import CookieBanner from "@/components/CookieBanner";
import { useSeo } from "@/hooks/use-seo";
import funcUrls from "../../backend/func2url.json";

interface ArticleData {
  id: number;
  slug: string;
  title: string;
  content: string;
  image_url: string;
  gallery_images: string[];
  article_code: string;
  published_at: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

const Gallery = ({ images, title }: { images: string[]; title: string }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="font-display text-lg font-bold text-foreground mb-4">Фотографии</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setOpenIndex(i)}
            className="border-2 border-ink shadow-brutal-sm overflow-hidden aspect-square hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            <img src={src} alt={`${title} — фото ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-ink/90 flex items-center justify-center p-6"
          onClick={() => setOpenIndex(null)}
        >
          <button
            onClick={() => setOpenIndex(null)}
            className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center bg-white border-2 border-ink shadow-brutal-sm"
          >
            <Icon name="X" size={20} />
          </button>
          <img
            src={images[openIndex]}
            alt={`${title} — фото ${openIndex + 1}`}
            className="max-w-full max-h-full border-2 border-ink object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

const SITE_URL = "https://prizivnik59.ru";

const ArticleSeo = ({ article }: { article: ArticleData }) => {
  const description = article.content.slice(0, 160).replace(/\s+/g, " ").trim();
  const url = `${SITE_URL}/blog/${article.slug}`;

  useSeo({
    title: `${article.title} | Военком-Гарант — Призывник 59`,
    description,
    canonical: url,
    image: article.image_url,
    type: "article",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BlogPosting",
          "@id": `${url}#article`,
          mainEntityOfPage: { "@type": "WebPage", "@id": url },
          headline: article.title,
          description,
          image: [article.image_url, ...(article.gallery_images || [])],
          datePublished: article.published_at,
          dateModified: article.published_at,
          author: {
            "@type": "Organization",
            name: "Военком-Гарант",
            url: SITE_URL,
          },
          publisher: {
            "@type": "Organization",
            name: "Военком-Гарант",
            logo: {
              "@type": "ImageObject",
              url: "https://cdn.poehali.dev/projects/49883a6d-fc50-4167-8b23-47aa1127425a/bucket/8d14a79e-8a80-4e5d-80a9-97b8e95d01f1.jpg",
            },
          },
          articleSection: "Статьи о призыве",
          inLanguage: "ru-RU",
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Статьи", item: `${SITE_URL}/blog` },
            { "@type": "ListItem", position: 3, name: article.title, item: url },
          ],
        },
      ],
    },
  });
  return null;
};

const Article = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    fetch(`${funcUrls["articles"]}?slug=${encodeURIComponent(slug || "")}`)
      .then((r) => {
        if (r.status === 404) {
          setNotFound(true);
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data) setArticle(data);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className="bg-[hsl(40,30%,96%)] min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[hsl(40,30%,96%)]/95 backdrop-blur-md border-b-2 border-ink">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-display text-lg font-bold text-foreground bg-lime px-3 py-1.5 border-2 border-ink shadow-brutal-sm -rotate-2">
            Призывник 59
          </Link>
          <Link to="/blog" className="font-golos text-sm font-bold text-foreground/75 hover:text-violet transition-colors flex items-center gap-1.5">
            <Icon name="ArrowLeft" size={16} />
            Все статьи
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-28 pb-20">
        {loading && (
          <div className="text-center py-20 font-golos text-foreground/50 font-medium">Загрузка статьи...</div>
        )}

        {!loading && notFound && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-white border-2 border-ink flex items-center justify-center mx-auto mb-4">
              <Icon name="FileX" size={28} className="text-foreground/40" />
            </div>
            <h1 className="font-display text-xl font-bold text-foreground mb-3">Статья не найдена</h1>
            <Link to="/blog" className="font-golos text-sm font-bold text-violet underline hover:no-underline">
              Вернуться к списку статей
            </Link>
          </div>
        )}

        {!loading && article && (
          <>
            <ArticleSeo article={article} />
            <span className="inline-block font-golos text-xs font-bold text-foreground bg-lime border-2 border-ink px-3 py-1.5 mb-5 -rotate-1">
              {formatDate(article.published_at)}
            </span>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-6 leading-tight">
              {article.title}
            </h1>
            <div className="border-2 border-ink shadow-brutal overflow-hidden mb-8">
              <img src={article.image_url} alt={article.title} className="w-full max-h-[440px] object-cover" />
            </div>
            <div className="bg-white border-2 border-ink shadow-brutal p-6 md:p-10 font-golos text-base text-foreground/80 leading-relaxed whitespace-pre-wrap">
              {article.content}
            </div>

            <Gallery images={article.gallery_images} title={article.title} />

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-violet border-2 border-ink p-6 shadow-brutal">
              <p className="font-golos text-sm text-white font-semibold">
                Остались вопросы? Получите бесплатную консультацию юриста.
              </p>
              <Link
                to="/#contact"
                className="font-golos font-bold bg-white text-foreground px-5 py-3 border-2 border-ink text-sm shadow-brutal-sm hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all whitespace-nowrap"
              >
                Задать вопрос →
              </Link>
            </div>

            {article.article_code && (
              <p className="mt-6 text-center font-golos text-xs text-foreground/35 font-medium">
                ID статьи: {article.article_code}
              </p>
            )}
          </>
        )}
      </div>

      <CookieBanner />
    </div>
  );
};

export default Article;