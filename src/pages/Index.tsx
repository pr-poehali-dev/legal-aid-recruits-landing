import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMAGE =
  "https://cdn.poehali.dev/projects/49883a6d-fc50-4167-8b23-47aa1127425a/files/07d5c5b8-45b1-442a-9bdb-c43753de11d9.jpg";

const steps = [
  {
    num: "01",
    title: "Бесплатная консультация",
    text: "Наш специалист знакомится с тобой в офисе или дистанционно, рассказывает о том, как мы работаем, отвечает на вопросы и оценивает твои шансы — без каких-либо обязательств.",
    icon: "MessageCircle",
    color: "bg-blue-50 text-blue-500",
  },
  {
    num: "02",
    title: "Договор и гарантии",
    text: "Заключаем договор, в котором чётко прописаны все этапы и гарантии — включая возврат средств, если мы не выполним свои обязательства.",
    icon: "FileSignature",
    color: "bg-teal-50 text-teal-600",
  },
  {
    num: "03",
    title: "Анализ медицинских документов",
    text: "Наши врачи детально изучают твою ситуацию, определяют перспективные направления и объясняют, какие обследования нужно пройти.",
    icon: "Stethoscope",
    color: "bg-purple-50 text-purple-500",
  },
  {
    num: "04",
    title: "Медкомиссия в военкомате",
    text: "Готовим тебя к прохождению медкомиссии. Наши специалисты сопровождают тебя на каждом этапе — ты не остаёшься один.",
    icon: "ClipboardCheck",
    color: "bg-orange-50 text-orange-500",
  },
  {
    num: "05",
    title: "Получение военного билета",
    text: "Ты получаешь военный билет категории «В». Договор считается выполненным — и ты свободен.",
    icon: "BadgeCheck",
    color: "bg-green-50 text-green-600",
  },
];

const services = [
  { icon: "FileText", title: "Анализ документов", text: "Оценка медицинских документов юристами и врачами для определения оснований." },
  { icon: "Shield", title: "Сопровождение на комиссии", text: "Наш специалист лично присутствует на медкомиссии в военкомате." },
  { icon: "Scale", title: "Правовая защита", text: "Полное сопровождение от консультации до военного билета категории «В»." },
  { icon: "UserCheck", title: "Подготовка документации", text: "Формируем полный пакет документов по требованиям законодательства РФ." },
  { icon: "HeartPulse", title: "Врачебная экспертиза", text: "Медэксперты определят направления работы и нужные обследования." },
  { icon: "ReceiptText", title: "Договор с гарантиями", text: "Возврат средств при невыполнении обязательств — прописано в договоре." },
];

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { setInView(true); observer.disconnect(); }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, inView };
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
    { href: "#about", label: "О нас" },
    { href: "#services", label: "Услуги" },
    { href: "#steps", label: "Этапы" },
    { href: "#contact", label: "Контакты" },
  ];
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white/80 backdrop-blur-sm"}`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="font-montserrat text-xl font-extrabold text-[hsl(212,95%,48%)]">
          ЮрПризыв
        </a>
        <div className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="font-golos text-sm text-foreground/65 hover:text-[hsl(212,95%,48%)] transition-colors">
              {l.label}
            </a>
          ))}
          <a href="#contact" className="font-golos text-sm font-semibold bg-[hsl(212,95%,48%)] text-white px-5 py-2.5 rounded-xl hover:bg-[hsl(212,95%,42%)] transition-colors shadow-md shadow-blue-200">
            Консультация
          </a>
        </div>
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <Icon name={menuOpen ? "X" : "Menu"} size={22} className="text-foreground/70" />
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-border px-6 pb-6 pt-4 flex flex-col gap-4 shadow-lg">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="font-golos text-sm text-foreground/70">
              {l.label}
            </a>
          ))}
          <a href="#contact" onClick={() => setMenuOpen(false)} className="font-golos text-sm font-semibold bg-[hsl(212,95%,48%)] text-white px-5 py-3 rounded-xl text-center">
            Бесплатная консультация
          </a>
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 80); return () => clearTimeout(t); }, []);
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20 bg-[hsl(215,40%,97%)]">
      <div className="absolute top-10 right-0 w-[520px] h-[520px] rounded-full bg-blue-100/70 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[380px] h-[380px] rounded-full bg-teal-100/50 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center w-full">
        <div>
          <div className={`transition-all duration-500 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <span className="inline-flex items-center gap-2 font-golos text-xs font-semibold text-[hsl(212,95%,48%)] bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-[hsl(212,95%,48%)] animate-pulse" />
              Законное освобождение · ФЗ №53
            </span>
          </div>

          <h1 className={`font-montserrat font-black text-5xl md:text-6xl lg:text-7xl leading-[1.0] text-foreground mb-6 transition-all duration-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ transitionDelay: "100ms" }}>
            Твой путь
            <br />
            <span className="text-[hsl(212,95%,48%)]">к свободе</span>
            <br />
            по закону
          </h1>

          <p className={`font-golos text-lg text-foreground/55 leading-relaxed mb-10 max-w-lg transition-all duration-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            style={{ transitionDelay: "200ms" }}>
            Помогаем призывникам реализовать свои права по состоянию здоровья. Только честные и законные методы — без рисков и серых схем.
          </p>

          <div className={`flex flex-col sm:flex-row gap-3 transition-all duration-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            style={{ transitionDelay: "300ms" }}>
            <a href="#contact" className="font-golos font-semibold bg-[hsl(212,95%,48%)] text-white px-8 py-4 rounded-2xl text-base hover:bg-[hsl(212,95%,42%)] transition-all shadow-lg shadow-blue-200 text-center">
              Бесплатная консультация
            </a>
            <a href="#steps" className="font-golos font-semibold bg-white text-foreground/70 px-8 py-4 rounded-2xl text-base border border-border hover:border-[hsl(212,95%,48%)] hover:text-[hsl(212,95%,48%)] transition-all text-center">
              Как мы работаем
            </a>
          </div>

          <div className={`flex gap-8 mt-10 transition-all duration-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            style={{ transitionDelay: "400ms" }}>
            {[{ val: "98%", label: "успешных дел" }, { val: "1500+", label: "клиентов" }, { val: "5 лет", label: "практики" }].map((s) => (
              <div key={s.val}>
                <div className="font-montserrat text-2xl font-black text-foreground">{s.val}</div>
                <div className="font-golos text-xs text-foreground/45 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={`relative transition-all duration-700 ${loaded ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"}`}
          style={{ transitionDelay: "300ms" }}>
          <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-100/60">
            <img src={HERO_IMAGE} alt="Офис" className="w-full h-[480px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent" />
          </div>
          <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl px-5 py-4 flex items-center gap-3 border border-border">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <Icon name="ShieldCheck" size={20} className="text-green-500" fallback="Check" />
            </div>
            <div>
              <div className="font-montserrat text-sm font-bold text-foreground">Гарантия возврата</div>
              <div className="font-golos text-xs text-foreground/45">Прописано в договоре</div>
            </div>
          </div>
          <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl px-4 py-3 border border-border">
            <div className="font-montserrat text-sm font-bold text-[hsl(212,95%,48%)]">ФЗ №53 ✓</div>
            <div className="font-golos text-xs text-foreground/45">Работаем по закону</div>
          </div>
        </div>
      </div>
    </section>
  );
};

const About = () => {
  const { ref, inView } = useInView();
  return (
    <section id="about" className="py-24 bg-white">
      <div ref={ref} className="max-w-6xl mx-auto px-6">
        <div className={`grid md:grid-cols-2 gap-14 items-center transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div>
            <span className="inline-block font-golos text-xs font-semibold text-[hsl(212,95%,48%)] bg-blue-50 px-3 py-1.5 rounded-full mb-5">О нас</span>
            <h2 className="font-montserrat font-extrabold text-4xl md:text-5xl text-foreground mb-6 leading-tight">
              Только честные
              <br />
              <span className="text-[hsl(212,95%,48%)]">и законные</span> пути
            </h2>
            <p className="font-golos text-base text-foreground/60 leading-relaxed mb-4">
              Наша работа полностью соответствует требованиям <strong className="text-foreground/80">Федерального Закона №53</strong> и <strong className="text-foreground/80">Постановления Правительства №565</strong>. Мы ориентированы на предоставление законных путей для тех, кто соответствует медицинским условиям.
            </p>
            <p className="font-golos text-base text-foreground/60 leading-relaxed mb-8">
              Наша цель — помочь гражданам понять и реализовать свои права в соответствии с законодательством РФ. Мы никогда не обещаем невозможного.
            </p>
            <a href="#contact" className="inline-flex items-center gap-2 font-golos font-semibold text-[hsl(212,95%,48%)] hover:gap-3 transition-all text-base">
              Записаться на консультацию
              <Icon name="ArrowRight" size={16} />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: "BookOpen", title: "ФЗ №53", desc: "Соответствие Федеральному Закону о воинской обязанности", bg: "bg-blue-50", ic: "text-blue-500" },
              { icon: "FileCheck", title: "ПП №565", desc: "Работа в рамках Постановления о военно-врачебной экспертизе", bg: "bg-teal-50", ic: "text-teal-600" },
              { icon: "Award", title: "Гарантии", desc: "Договор с прописанными условиями и возвратом средств", bg: "bg-purple-50", ic: "text-purple-500" },
              { icon: "HeartHandshake", title: "Честность", desc: "Реальная оценка шансов уже на первой консультации", bg: "bg-orange-50", ic: "text-orange-500" },
            ].map((item, i) => (
              <div
                key={i}
                className={`bg-white border border-border rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{ transitionDelay: `${i * 80 + 150}ms` }}
              >
                <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mb-3`}>
                  <Icon name={item.icon} size={18} className={item.ic} fallback="Star" />
                </div>
                <h4 className="font-montserrat text-base font-bold text-foreground mb-1">{item.title}</h4>
                <p className="font-golos text-xs text-foreground/50 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  const { ref, inView } = useInView();
  return (
    <section id="services" className="py-24 bg-[hsl(215,40%,97%)]">
      <div ref={ref} className="max-w-6xl mx-auto px-6">
        <div className={`text-center mb-14 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <span className="inline-block font-golos text-xs font-semibold text-[hsl(212,95%,48%)] bg-blue-50 px-3 py-1.5 rounded-full mb-4">Услуги</span>
          <h2 className="font-montserrat font-extrabold text-4xl md:text-5xl text-foreground">Полное сопровождение</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <div
              key={i}
              className={`bg-white rounded-2xl p-7 border border-border hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-5">
                <Icon name={s.icon} size={22} className="text-[hsl(212,95%,48%)]" fallback="Star" />
              </div>
              <h3 className="font-montserrat text-lg font-bold text-foreground mb-2">{s.title}</h3>
              <p className="font-golos text-sm text-foreground/55 leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Steps = () => {
  const { ref, inView } = useInView(0.05);
  return (
    <section id="steps" className="py-24 bg-white">
      <div ref={ref} className="max-w-5xl mx-auto px-6">
        <div className={`text-center mb-14 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <span className="inline-block font-golos text-xs font-semibold text-[hsl(212,95%,48%)] bg-blue-50 px-3 py-1.5 rounded-full mb-4">Этапы</span>
          <h2 className="font-montserrat font-extrabold text-4xl md:text-5xl text-foreground mb-4">Как мы работаем</h2>
          <p className="font-golos text-base text-foreground/50 max-w-lg mx-auto">
            Прозрачный процесс от первой встречи до военного билета
          </p>
        </div>
        <div className="flex flex-col gap-5">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`bg-[hsl(215,40%,97%)] rounded-2xl p-6 md:p-8 flex gap-6 items-start border border-border hover:border-[hsl(212,95%,48%)]/30 hover:shadow-md transition-all duration-300 ${inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center flex-shrink-0`}>
                <Icon name={step.icon} size={24} fallback="Star" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-montserrat text-xs font-bold text-foreground/30 tracking-widest">{step.num}</span>
                  <h3 className="font-montserrat text-xl font-bold text-foreground">{step.title}</h3>
                </div>
                <p className="font-golos text-sm text-foreground/55 leading-relaxed">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const { ref, inView } = useInView();
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  return (
    <section id="contact" className="py-24 bg-[hsl(215,40%,97%)]">
      <div ref={ref} className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-14 items-start">
          <div className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <span className="inline-block font-golos text-xs font-semibold text-[hsl(212,95%,48%)] bg-blue-50 px-3 py-1.5 rounded-full mb-5">Контакты</span>
            <h2 className="font-montserrat font-extrabold text-4xl md:text-5xl text-foreground mb-4 leading-tight">
              Запишись на
              <br />
              <span className="text-[hsl(212,95%,48%)]">бесплатную</span>
              <br />
              консультацию
            </h2>
            <p className="font-golos text-base text-foreground/55 leading-relaxed mb-10">
              Расскажем о перспективах твоего дела, ответим на все вопросы — без обязательств.
            </p>
            <div className="flex flex-col gap-4">
              {[
                { icon: "Phone", text: "+7 (999) 000-00-00", bg: "bg-blue-50", ic: "text-blue-500" },
                { icon: "Mail", text: "info@yourlaw.ru", bg: "bg-teal-50", ic: "text-teal-600" },
                { icon: "MapPin", text: "Москва, ул. Примерная, д. 1", bg: "bg-purple-50", ic: "text-purple-500" },
                { icon: "Clock", text: "Пн–Пт: 9:00–19:00, Сб: 10:00–16:00", bg: "bg-orange-50", ic: "text-orange-500" },
              ].map((c, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${c.bg}`}>
                    <Icon name={c.icon} size={17} className={c.ic} fallback="Info" />
                  </div>
                  <span className="font-golos text-sm text-foreground/65">{c.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            style={{ transitionDelay: "200ms" }}>
            <div className="bg-white rounded-3xl border border-border p-8 shadow-xl shadow-blue-50">
              <h3 className="font-montserrat text-2xl font-bold text-foreground mb-6">Оставить заявку</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="font-golos text-xs text-foreground/45 font-semibold uppercase tracking-wider mb-1.5 block">Ваше имя</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Иван Иванов"
                    className="w-full bg-[hsl(215,40%,97%)] border border-border rounded-xl px-4 py-3 font-golos text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-[hsl(212,95%,48%)] focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
                <div>
                  <label className="font-golos text-xs text-foreground/45 font-semibold uppercase tracking-wider mb-1.5 block">Телефон</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+7 (999) 000-00-00"
                    className="w-full bg-[hsl(215,40%,97%)] border border-border rounded-xl px-4 py-3 font-golos text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-[hsl(212,95%,48%)] focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
                <div>
                  <label className="font-golos text-xs text-foreground/45 font-semibold uppercase tracking-wider mb-1.5 block">Вопрос</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Кратко опишите ситуацию..."
                    rows={4}
                    className="w-full bg-[hsl(215,40%,97%)] border border-border rounded-xl px-4 py-3 font-golos text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-[hsl(212,95%,48%)] focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                  />
                </div>
                <button className="font-golos font-semibold bg-[hsl(212,95%,48%)] text-white px-6 py-4 rounded-2xl text-base hover:bg-[hsl(212,95%,42%)] transition-all shadow-lg shadow-blue-200 w-full mt-1">
                  Отправить заявку →
                </button>
                <p className="font-golos text-xs text-foreground/35 text-center">
                  Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-white border-t border-border py-10">
    <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div>
        <span className="font-montserrat text-lg font-extrabold text-[hsl(212,95%,48%)]">ЮрПризыв</span>
        <p className="font-golos text-xs text-foreground/40 mt-1">Юридическое сопровождение призывников</p>
      </div>
      <p className="font-golos text-xs text-foreground/35 text-center">
        Деятельность соответствует ФЗ №53 и ПП №565 · Только законные методы
      </p>
      <p className="font-golos text-xs text-foreground/35">© 2024 ЮрПризыв</p>
    </div>
  </footer>
);

const Index = () => (
  <div className="bg-[hsl(215,40%,97%)] min-h-screen">
    <NavBar />
    <Hero />
    <About />
    <Services />
    <Steps />
    <Contact />
    <Footer />
  </div>
);

export default Index;