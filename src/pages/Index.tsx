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
    bg: "bg-violet",
  },
  {
    num: "02",
    title: "Договор и гарантии",
    text: "Заключаем договор, в котором чётко прописаны все этапы и гарантии — включая возврат средств, если мы не выполним свои обязательства.",
    icon: "FileSignature",
    bg: "bg-lime",
  },
  {
    num: "03",
    title: "Анализ медицинских документов",
    text: "Наши врачи детально изучают твою ситуацию, определяют перспективные направления и объясняют, какие обследования нужно пройти.",
    icon: "Stethoscope",
    bg: "bg-pink-brand",
  },
  {
    num: "04",
    title: "Медкомиссия в военкомате",
    text: "Готовим тебя к прохождению медкомиссии. Наши специалисты сопровождают тебя на каждом этапе — ты не остаёшься один.",
    icon: "ClipboardCheck",
    bg: "bg-orange-brand",
  },
  {
    num: "05",
    title: "Получение военного билета",
    text: "Ты получаешь военный билет категории «В». Договор считается выполненным — и ты свободен.",
    icon: "BadgeCheck",
    bg: "bg-violet",
  },
];

const services = [
  { icon: "FileText", title: "Анализ документов", text: "Оценка медицинских документов юристами и врачами для определения оснований.", bg: "bg-violet" },
  { icon: "Shield", title: "Сопровождение на комиссии", text: "Наш специалист лично присутствует на медкомиссии в военкомате.", bg: "bg-lime" },
  { icon: "Scale", title: "Правовая защита", text: "Полное сопровождение от консультации до военного билета категории «В».", bg: "bg-pink-brand" },
  { icon: "UserCheck", title: "Подготовка документации", text: "Формируем полный пакет документов по требованиям законодательства РФ.", bg: "bg-orange-brand" },
  { icon: "HeartPulse", title: "Врачебная экспертиза", text: "Медэксперты определят направления работы и нужные обследования.", bg: "bg-violet" },
  { icon: "ReceiptText", title: "Договор с гарантиями", text: "Возврат средств при невыполнении обязательств — прописано в договоре.", bg: "bg-lime" },
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[hsl(40,30%,96%)]/95 backdrop-blur-md border-b-2 border-ink" : "bg-transparent"}`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="font-display text-lg font-bold text-foreground bg-lime px-3 py-1.5 border-2 border-ink shadow-brutal-sm -rotate-2">
          Призывник 59
        </a>
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
          <div className="flex items-center gap-2">
            <a href="https://vk.com/voenkomgarant" target="_blank" rel="noopener noreferrer" aria-label="ВКонтакте" className="w-9 h-9 flex items-center justify-center bg-white border-2 border-ink font-display text-xs font-bold text-foreground shadow-brutal-sm hover:bg-lime hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
              VK
            </a>
            <a href="https://t.me/+SUjTZ3GcUyAwNDAy" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="w-9 h-9 flex items-center justify-center bg-white border-2 border-ink shadow-brutal-sm hover:bg-lime hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
              <Icon name="Send" size={16} className="text-foreground" />
            </a>
          </div>
          <a href="#contact" className="font-golos text-sm font-bold bg-violet text-white px-5 py-2.5 border-2 border-ink shadow-brutal-sm hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all">
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
          <a href="#contact" onClick={() => setMenuOpen(false)} className="font-golos text-sm font-bold bg-violet text-white px-5 py-3 border-2 border-ink text-center shadow-brutal-sm">
            Бесплатная консультация
          </a>
          <div className="flex items-center gap-2">
            <a href="https://vk.com/voenkomgarant" target="_blank" rel="noopener noreferrer" aria-label="ВКонтакте" className="w-9 h-9 flex items-center justify-center bg-white border-2 border-ink font-display text-xs font-bold text-foreground shadow-brutal-sm">
              VK
            </a>
            <a href="https://t.me/+SUjTZ3GcUyAwNDAy" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="w-9 h-9 flex items-center justify-center bg-white border-2 border-ink shadow-brutal-sm">
              <Icon name="Send" size={16} className="text-foreground" />
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 80); return () => clearTimeout(t); }, []);
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20 bg-[hsl(40,30%,96%)]">
      <div className="absolute top-24 right-[8%] w-16 h-16 rounded-full bg-lime border-2 border-ink hidden md:block animate-wiggle" />
      <div className="absolute bottom-32 left-[6%] w-10 h-10 bg-pink-brand border-2 border-ink hidden md:block rotate-12" />
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, black 1.5px, transparent 1.5px)", backgroundSize: "24px 24px" }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center w-full">
        <div>
          <div className={`transition-all duration-500 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <span className="inline-flex items-center gap-2 font-golos text-xs font-bold text-foreground bg-lime border-2 border-ink px-3 py-1.5 mb-6 -rotate-1">
              ⚡ Законное освобождение · ФЗ №53
            </span>
          </div>

          <h1 className={`font-display font-bold text-4xl md:text-5xl lg:text-6xl leading-[1.08] text-foreground mb-6 transition-all duration-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ transitionDelay: "100ms" }}>
            Твой путь
            <br />
            <span className="relative inline-block">
              <span className="relative z-10 text-white px-2">к свободе</span>
              <span className="absolute inset-0 bg-violet -rotate-1 border-2 border-ink" />
            </span>
            <br />
            по закону
          </h1>

          <p className={`font-golos text-lg text-foreground/65 leading-relaxed mb-10 max-w-lg font-medium transition-all duration-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            style={{ transitionDelay: "200ms" }}>
            Помогаем призывникам реализовать свои права по состоянию здоровья. Только честные и законные методы — без рисков и серых схем.
          </p>

          <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            style={{ transitionDelay: "300ms" }}>
            <a href="#contact" className="font-golos font-bold bg-violet text-white px-8 py-4 border-2 border-ink text-base shadow-brutal hover:shadow-none hover:translate-x-[5px] hover:translate-y-[5px] transition-all text-center">
              Бесплатная консультация
            </a>
            <a href="#steps" className="font-golos font-bold bg-white text-foreground px-8 py-4 border-2 border-ink text-base shadow-brutal hover:shadow-none hover:translate-x-[5px] hover:translate-y-[5px] transition-all text-center">
              Как мы работаем
            </a>
          </div>

          <div className={`flex gap-6 mt-12 transition-all duration-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            style={{ transitionDelay: "400ms" }}>
            {[{ val: "98%", label: "успешных дел", bg: "bg-lime" }, { val: "1500+", label: "клиентов", bg: "bg-pink-brand" }, { val: "10+ лет", label: "практики", bg: "bg-orange-brand" }].map((s) => (
              <div key={s.val} className={`${s.bg} border-2 border-ink px-4 py-3`}>
                <div className="font-display text-xl font-bold text-foreground">{s.val}</div>
                <div className="font-golos text-xs text-foreground/70 mt-0.5 font-semibold">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={`relative transition-all duration-700 ${loaded ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"}`}
          style={{ transitionDelay: "300ms" }}>
          <div className="relative border-2 border-ink overflow-hidden shadow-brutal-violet">
            <img src={HERO_IMAGE} alt="Юриспруденция" className="w-full h-[440px] object-cover" />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-white border-2 border-ink shadow-brutal-sm px-5 py-4 flex items-center gap-3 rotate-[-2deg]">
            <div className="w-10 h-10 bg-lime border-2 border-ink flex items-center justify-center">
              <Icon name="ShieldCheck" size={20} className="text-foreground" fallback="Check" />
            </div>
            <div>
              <div className="font-display text-sm font-bold text-foreground">Гарантия возврата</div>
              <div className="font-golos text-xs text-foreground/55 font-medium">Прописано в договоре</div>
            </div>
          </div>
          <div className="absolute -top-5 -right-5 bg-pink-brand border-2 border-ink shadow-brutal-sm px-4 py-3 rotate-[3deg]">
            <div className="font-display text-sm font-bold text-white">ФЗ №53 ✓</div>
            <div className="font-golos text-xs text-white/80 font-medium">Работаем по закону</div>
          </div>
        </div>
      </div>
    </section>
  );
};

const About = () => {
  const { ref, inView } = useInView();
  return (
    <section id="about" className="py-24 bg-white border-y-2 border-ink">
      <div ref={ref} className="max-w-6xl mx-auto px-6">
        <div className={`grid md:grid-cols-2 gap-14 items-center transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div>
            <span className="inline-block font-golos text-xs font-bold text-foreground bg-orange-brand border-2 border-ink px-3 py-1.5 mb-5 rotate-1">О нас</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-6 leading-tight">
              Только честные
              <br />
              <span className="text-violet">и законные</span> пути
            </h2>
            <p className="font-golos text-base text-foreground/65 leading-relaxed mb-4 font-medium">
              Наша работа полностью соответствует требованиям <strong className="text-foreground font-bold">Федерального Закона №53</strong> и <strong className="text-foreground font-bold">Постановления Правительства №565</strong>. Мы ориентированы на предоставление законных путей для тех, кто соответствует медицинским условиям.
            </p>
            <p className="font-golos text-base text-foreground/65 leading-relaxed mb-8 font-medium">
              Наша цель — помочь гражданам понять и реализовать свои права в соответствии с законодательством РФ. Мы никогда не обещаем невозможного.
            </p>
            <a href="#contact" className="inline-flex items-center gap-2 font-golos font-bold text-foreground bg-lime border-2 border-ink px-5 py-3 hover:gap-3 transition-all text-sm shadow-brutal-sm hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]">
              Записаться на консультацию
              <Icon name="ArrowRight" size={16} />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: "BookOpen", title: "ФЗ №53", desc: "Соответствие Федеральному Закону о воинской обязанности", bg: "bg-violet", tc: "text-white" },
              { icon: "FileCheck", title: "ПП №565", desc: "Работа в рамках Постановления о военно-врачебной экспертизе", bg: "bg-lime", tc: "text-foreground" },
              { icon: "Award", title: "Гарантии", desc: "Договор с прописанными условиями и возвратом средств", bg: "bg-pink-brand", tc: "text-white" },
              { icon: "HeartHandshake", title: "Честность", desc: "Реальная оценка шансов уже на первой консультации", bg: "bg-orange-brand", tc: "text-white" },
            ].map((item, i) => (
              <div
                key={i}
                className={`${item.bg} border-2 border-ink p-5 hover:shadow-none shadow-brutal-sm hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-300 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{ transitionDelay: `${i * 80 + 150}ms` }}
              >
                <div className="w-10 h-10 bg-white border-2 border-ink flex items-center justify-center mb-3">
                  <Icon name={item.icon} size={18} className="text-foreground" fallback="Star" />
                </div>
                <h4 className={`font-display text-base font-bold ${item.tc} mb-1`}>{item.title}</h4>
                <p className={`font-golos text-xs ${item.tc} opacity-80 leading-relaxed font-medium`}>{item.desc}</p>
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
    <section id="services" className="py-24 bg-[hsl(40,30%,96%)]">
      <div ref={ref} className="max-w-6xl mx-auto px-6">
        <div className={`text-center mb-14 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <span className="inline-block font-golos text-xs font-bold text-foreground bg-pink-brand text-white border-2 border-ink px-3 py-1.5 mb-4 -rotate-1">Услуги</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground">Полное сопровождение</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <div
              key={i}
              className={`bg-white border-2 border-ink p-7 shadow-brutal hover:shadow-none hover:translate-x-[5px] hover:translate-y-[5px] transition-all duration-300 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <div className={`w-12 h-12 ${s.bg} border-2 border-ink flex items-center justify-center mb-5`}>
                <Icon name={s.icon} size={22} className="text-foreground" fallback="Star" />
              </div>
              <h3 className="font-display text-base font-bold text-foreground mb-2">{s.title}</h3>
              <p className="font-golos text-sm text-foreground/60 leading-relaxed font-medium">{s.text}</p>
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
    <section id="steps" className="py-24 bg-white border-y-2 border-ink">
      <div ref={ref} className="max-w-5xl mx-auto px-6">
        <div className={`text-center mb-14 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <span className="inline-block font-golos text-xs font-bold text-foreground bg-lime border-2 border-ink px-3 py-1.5 mb-4 rotate-1">Этапы</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">Как мы работаем</h2>
          <p className="font-golos text-base text-foreground/55 max-w-lg mx-auto font-medium">
            Прозрачный процесс от первой встречи до военного билета
          </p>
        </div>
        <div className="flex flex-col gap-5">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`bg-[hsl(40,30%,96%)] border-2 border-ink p-6 md:p-8 flex gap-6 items-start shadow-brutal-sm hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-300 ${inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className={`w-14 h-14 ${step.bg} border-2 border-ink flex items-center justify-center flex-shrink-0`}>
                <Icon name={step.icon} size={24} className="text-foreground" fallback="Star" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-display text-xs font-bold text-foreground/35 tracking-widest">{step.num}</span>
                  <h3 className="font-display text-lg font-bold text-foreground">{step.title}</h3>
                </div>
                <p className="font-golos text-sm text-foreground/60 leading-relaxed font-medium">{step.text}</p>
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
    <section id="contact" className="py-24 bg-[hsl(40,30%,96%)]">
      <div ref={ref} className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-14 items-start">
          <div className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <span className="inline-block font-golos text-xs font-bold text-foreground bg-orange-brand text-white border-2 border-ink px-3 py-1.5 mb-5 -rotate-1">Контакты</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4 leading-tight">
              Запишись на
              <br />
              <span className="text-violet">бесплатную</span>
              <br />
              консультацию
            </h2>
            <p className="font-golos text-base text-foreground/60 leading-relaxed mb-10 font-medium">
              Расскажем о перспективах твоего дела, ответим на все вопросы — без обязательств.
            </p>
            <div className="flex flex-col gap-4">
              {[
                { icon: "Phone", text: "+7 (342) 234-19-18", bg: "bg-violet", tc: "text-white" },
                { icon: "Mail", text: "help_me@prizivnik59.ru", bg: "bg-lime", tc: "text-foreground" },
                { icon: "MapPin", text: "г. Пермь, ул. Екатерининская 109А, офис 305 (вход с ул. Попова)", bg: "bg-pink-brand", tc: "text-white" },
                { icon: "Clock", text: "Пн–Пт: 10:00–19:00, Сб: 10:00–16:00 (строго по записи)", bg: "bg-orange-brand", tc: "text-white" },
              ].map((c, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-10 h-10 ${c.bg} border-2 border-ink flex items-center justify-center flex-shrink-0`}>
                    <Icon name={c.icon} size={17} className={c.tc} fallback="Info" />
                  </div>
                  <span className="font-golos text-sm text-foreground/70 font-semibold">{c.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            style={{ transitionDelay: "200ms" }}>
            <div className="bg-white border-2 border-ink p-8 shadow-brutal">
              <h3 className="font-display text-xl font-bold text-foreground mb-6">Оставить заявку</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="font-golos text-xs text-foreground/60 font-bold uppercase tracking-wider mb-1.5 block">Ваше имя</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Иван Иванов"
                    className="w-full bg-[hsl(40,30%,96%)] border-2 border-ink px-4 py-3 font-golos text-sm text-foreground placeholder:text-foreground/35 focus:outline-none focus:bg-white transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="font-golos text-xs text-foreground/60 font-bold uppercase tracking-wider mb-1.5 block">Телефон</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+7 (999) 000-00-00"
                    className="w-full bg-[hsl(40,30%,96%)] border-2 border-ink px-4 py-3 font-golos text-sm text-foreground placeholder:text-foreground/35 focus:outline-none focus:bg-white transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="font-golos text-xs text-foreground/60 font-bold uppercase tracking-wider mb-1.5 block">Вопрос</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Кратко опишите ситуацию..."
                    rows={4}
                    className="w-full bg-[hsl(40,30%,96%)] border-2 border-ink px-4 py-3 font-golos text-sm text-foreground placeholder:text-foreground/35 focus:outline-none focus:bg-white transition-all resize-none font-medium"
                  />
                </div>
                <button className="font-golos font-bold bg-violet text-white px-6 py-4 border-2 border-ink text-base shadow-brutal hover:shadow-none hover:translate-x-[5px] hover:translate-y-[5px] transition-all w-full mt-1">
                  Отправить заявку →
                </button>
                <p className="font-golos text-xs text-foreground/45 text-center font-medium">
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
  <footer className="bg-white border-t-2 border-ink py-10">
    <div className="max-w-6xl mx-auto px-6 flex flex-col gap-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-display text-base font-bold text-foreground bg-lime border-2 border-ink px-3 py-1 inline-block -rotate-1">Призывник 59</span>
          <p className="font-golos text-xs text-foreground/50 mt-2 font-medium">Юридическое сопровождение призывников</p>
          <div className="flex items-center gap-2 mt-3">
            <a href="https://vk.com/voenkomgarant" target="_blank" rel="noopener noreferrer" aria-label="ВКонтакте" className="w-8 h-8 flex items-center justify-center bg-[hsl(40,30%,96%)] border-2 border-ink font-display text-[10px] font-bold text-foreground hover:bg-lime transition-colors">
              VK
            </a>
            <a href="https://t.me/+SUjTZ3GcUyAwNDAy" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="w-8 h-8 flex items-center justify-center bg-[hsl(40,30%,96%)] border-2 border-ink hover:bg-lime transition-colors">
              <Icon name="Send" size={14} className="text-foreground" />
            </a>
          </div>
        </div>
        <img src="https://cdn.poehali.dev/projects/49883a6d-fc50-4167-8b23-47aa1127425a/bucket/8d14a79e-8a80-4e5d-80a9-97b8e95d01f1.jpg" alt="Военком-Гарант" className="w-16 h-auto" />
        <p className="font-golos text-xs text-foreground/45 text-center font-medium">
          Деятельность соответствует ФЗ №53 и ПП №565 · Только законные методы
        </p>
      </div>
      <div className="border-t border-ink/10 pt-4 flex flex-col md:flex-row items-center justify-between gap-2">
        <p className="font-golos text-xs text-foreground/45 font-medium">
          © 2014–{new Date().getFullYear()} Призывник 59. Все права защищены. ИП Хабибрахманов А.Ф. ОГРНИП: 323595800035942
        </p>
        <p className="font-golos text-xs text-foreground/45 font-medium">
          Сайт является собственностью компании «Военком-Гарант»
        </p>
      </div>
    </div>
  </footer>
);

const Index = () => (
  <div className="bg-[hsl(40,30%,96%)] min-h-screen">
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