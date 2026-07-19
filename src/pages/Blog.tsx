import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import CookieBanner from "@/components/CookieBanner";
import { useSeo } from "@/hooks/use-seo";
import funcUrls from "../../backend/func2url.json";

interface Article {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  image_url: string;
  published_at: string;
}

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const links = [
    { href: "/#about", label: "О нас" },
    { href: "/#services", label: "Услуги" },
    { href: "/#steps", label: "Этапы" },
    { href: "/blog", label: "Статьи" },
    { href: "/#contact", label: "Контакты" },
  ];
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[hsl(40,30%,96%)]/95 backdrop-blur-md border-b-2 border-ink" : "bg-[hsl(40,30%,96%)]"}`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-display text-lg font-bold text-foreground bg-lime px-3 py-1.5 border-2 border-ink shadow-brutal-sm -rotate-2">
          Призывник 59
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="font-golos text-sm font-semibold text-foreground/75 hover:text-violet transition-colors">
              {l.label}
            </a>
          ))}
          <a href="tel:+73422341918" className="font-golos text-sm font-bold text-foreground hover:text-violet transition-colors flex items-center gap-1.5">
            <Icon name="Phone" size={16} />
            +7 (342) 234-19-18
          </a>
          <a href="/#contact" className="font-golos text-sm font-bold bg-violet text-white px-5 py-2.5 border-2 border-ink shadow-brutal-sm hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all">
            Консультация
          </a>
        </div>
        <button className="md:hidden w-10 h-10 flex items-center justify-center bg-white border-2 border-ink" onClick={() => setMenuOpen(!menuOpen)}>
          <Icon name={menuOpen ? "X" : "Menu"} size={20} className="text-foreground" />
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-[hsl(40,30%,96%)] border-t-2 border-ink px-6 pb-6 pt-4 flex flex-col gap-4">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="font-golos text-sm font-semibold text-foreground/80">
              {l.label}
            </a>
          ))}
          <a href="tel:+73422341918" className="font-golos text-sm font-bold text-foreground flex items-center gap-1.5">
            <Icon name="Phone" size={16} />
            +7 (342) 234-19-18
          </a>
          <a href="/#contact" onClick={() => setMenuOpen(false)} className="font-golos text-sm font-bold bg-violet text-white px-5 py-3 border-2 border-ink text-center shadow-brutal-sm">
            Консультация
          </a>
        </div>
      )}
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-white border-t-2 border-ink py-10">
    <div className="max-w-6xl mx-auto px-6 flex flex-col gap-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-display text-base font-bold text-foreground bg-lime border-2 border-ink px-3 py-1 inline-block -rotate-1">Призывник 59</span>
          <p className="font-golos text-xs text-foreground/50 mt-2 font-medium">Юридическое сопровождение призывников</p>
        </div>
        <p className="font-golos text-xs text-foreground/45 text-center font-medium">
          Деятельность соответствует ФЗ №53 и ПП №565 · Только законные методы
        </p>
      </div>
      <div className="border-t border-ink/10 pt-4 flex flex-col md:flex-row items-center justify-between gap-2">
        <p className="font-golos text-xs text-foreground/45 font-medium">
          © 2014–{new Date().getFullYear()} Призывник 59. Все права защищены.
        </p>
        <Link to="/privacy-policy" className="font-golos text-xs text-foreground/45 font-medium underline hover:text-violet transition-colors">
          Политика обработки персональных данных
        </Link>
      </div>
    </div>
  </footer>
);

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

const cardBg = ["bg-violet", "bg-lime", "bg-pink-brand", "bg-orange-brand"];

const Blog = () => {
  useSeo({
    title: "Статьи и новости | Военком-Гарант — Призывник 59",
    description: "Полезные статьи о призыве, освобождении от военной службы по состоянию здоровья и правах призывников от юристов Военком-Гарант в Перми.",
  });

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetch(`${funcUrls["articles"]}?page=${page}&limit=9`)
      .then((r) => r.json())
      .then((data) => {
        setArticles(data.articles || []);
        setTotalPages(data.totalPages || 1);
      })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="bg-[hsl(40,30%,96%)] min-h-screen">
      <NavBar />

      <section className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <span className="inline-block font-golos text-xs font-bold text-foreground bg-lime border-2 border-ink px-3 py-1.5 mb-5 -rotate-1">Блог</span>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-foreground mb-4 leading-tight">
            Статьи и новости
          </h1>
          <p className="font-golos text-base text-foreground/60 leading-relaxed max-w-xl font-medium">
            Разбираем законы о призыве, делимся кейсами и объясняем, как законно защитить свои права.
          </p>
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          {loading && (
            <div className="text-center py-20 font-golos text-foreground/50 font-medium">Загрузка статей...</div>
          )}

          {!loading && articles.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-white border-2 border-ink flex items-center justify-center mx-auto mb-4">
                <Icon name="Newspaper" size={28} className="text-foreground/40" />
              </div>
              <p className="font-golos text-foreground/50 font-medium">Статей пока нет. Скоро здесь появятся новые материалы.</p>
            </div>
          )}

          {!loading && articles.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((a, i) => (
                <Link
                  key={a.id}
                  to={`/blog/${a.slug}`}
                  className="group bg-white border-2 border-ink shadow-brutal hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all overflow-hidden flex flex-col"
                >
                  <div className="relative h-48 overflow-hidden border-b-2 border-ink">
                    <img src={a.image_url} alt={a.title} className="w-full h-full object-cover" loading="lazy" />
                    <span className={`absolute top-3 left-3 ${cardBg[i % cardBg.length]} border-2 border-ink px-2 py-1 font-golos text-[10px] font-bold text-white uppercase tracking-wider`}>
                      Статья
                    </span>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <span className="font-golos text-xs text-foreground/45 font-semibold mb-2">{formatDate(a.published_at)}</span>
                    <h3 className="font-display text-base font-bold text-foreground mb-2 leading-snug line-clamp-2">{a.title}</h3>
                    <p className="font-golos text-sm text-foreground/60 leading-relaxed font-medium line-clamp-3 flex-1">{a.excerpt}</p>
                    <span className="font-golos text-sm font-bold text-violet mt-4 flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                      Читать далее <Icon name="ArrowRight" size={15} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-12">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="w-10 h-10 flex items-center justify-center bg-white border-2 border-ink shadow-brutal-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Icon name="ChevronLeft" size={18} />
              </button>
              <span className="font-golos text-sm font-bold text-foreground/70">
                {page} / {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="w-10 h-10 flex items-center justify-center bg-white border-2 border-ink shadow-brutal-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Icon name="ChevronRight" size={18} />
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
      <CookieBanner />
    </div>
  );
};

export default Blog;
