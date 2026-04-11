import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/49883a6d-fc50-4167-8b23-47aa1127425a/files/d0c89902-85c8-46cb-ad3b-99ae4240cc74.jpg";

const steps = [
  {
    num: "01",
    title: "Бесплатная консультация",
    text: "Наш специалист знакомится с тобой в офисе или дистанционно, рассказывает о том, как мы работаем, отвечает на вопросы и оценивает твои шансы — без каких-либо обязательств с твоей стороны.",
  },
  {
    num: "02",
    title: "Договор и гарантии",
    text: "После обсуждения всех условий мы заключаем договор, в котором чётко прописаны все этапы работы и гарантии, включая возврат средств в случае невыполнения наших обязательств.",
  },
  {
    num: "03",
    title: "Анализ медицинских документов",
    text: "Наши врачи детально изучают твою ситуацию, определяют перспективные направления, разъясняют, какие обследования необходимо пройти и какие документы нужно получить.",
  },
  {
    num: "04",
    title: "Медкомиссия в военкомате",
    text: "Готовим тебя к прохождению медкомиссии и получению медицинского заключения. Наши специалисты курируют тебя на каждом этапе — ты не остаёшься один.",
  },
  {
    num: "05",
    title: "Получение военного билета",
    text: "Финал пути. Ты получаешь военный билет категории «В» в своём военном комиссариате. Условия договора считаются полностью выполненными.",
  },
];

const services = [
  {
    icon: "FileText",
    title: "Анализ медицинских документов",
    text: "Профессиональная оценка вашей документации юристами и врачами для определения оснований освобождения.",
  },
  {
    icon: "Shield",
    title: "Сопровождение на комиссии",
    text: "Личное присутствие специалиста на медицинской комиссии в военкомате — вы не одни в этом процессе.",
  },
  {
    icon: "Scale",
    title: "Правовая защита",
    text: "Полное юридическое сопровождение: от консультации до получения военного билета категории «В».",
  },
  {
    icon: "UserCheck",
    title: "Подготовка документации",
    text: "Формирование полного пакета документов в соответствии с требованиями законодательства РФ.",
  },
  {
    icon: "Stethoscope",
    title: "Врачебная экспертиза",
    text: "Наши медицинские эксперты определят направления работы и необходимые обследования.",
  },
  {
    icon: "ReceiptText",
    title: "Договор с гарантиями",
    text: "Прозрачные условия работы, закреплённые договором. Возврат средств при невыполнении обязательств.",
  },
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
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
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { href: "#about", label: "О нас" },
    { href: "#services", label: "Услуги" },
    { href: "#steps", label: "Этапы" },
    { href: "#contact", label: "Контакты" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[hsl(220,25%,8%)] shadow-lg shadow-black/30" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="font-cormorant text-xl font-semibold text-gold tracking-wide">
          ЮрПризыв
        </a>
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-golos text-sm text-foreground/70 hover:text-gold transition-colors duration-200 tracking-wide"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="font-golos text-sm bg-gold text-[hsl(220,25%,8%)] px-5 py-2 font-semibold hover:bg-gold/90 transition-colors"
          >
            Консультация
          </a>
        </div>
        <button
          className="md:hidden text-foreground"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Icon name={menuOpen ? "X" : "Menu"} size={22} />
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-[hsl(220,22%,11%)] border-t border-border px-6 pb-6 pt-4 flex flex-col gap-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="font-golos text-sm text-foreground/80 hover:text-gold transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="font-golos text-sm bg-gold text-[hsl(220,25%,8%)] px-5 py-2 font-semibold text-center"
          >
            Бесплатная консультация
          </a>
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${HERO_IMAGE})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[hsl(220,25%,6%)] via-[hsl(220,25%,8%)]/85 to-[hsl(220,25%,8%)]/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,25%,8%)] via-transparent to-transparent" />

      <div className="relative max-w-6xl mx-auto px-6 py-32 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div
            className={`transition-all duration-700 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="inline-block font-golos text-xs tracking-[0.25em] text-gold uppercase mb-6 border border-gold/30 px-3 py-1">
              Законное освобождение от службы
            </span>
          </div>

          <h1
            className={`font-cormorant text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] text-foreground mb-6 transition-all duration-700 delay-100 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Защита ваших
            <br />
            <em className="text-gold not-italic">прав и свободы</em>
            <br />
            по закону
          </h1>

          <p
            className={`font-golos text-base text-foreground/65 leading-relaxed mb-10 max-w-md transition-all duration-700 delay-200 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Юридическое сопровождение призывников в рамках ФЗ №53 и Постановления Правительства №565. Только законные пути для тех, кто имеет медицинские основания.
          </p>

          <div
            className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-300 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <a
              href="#contact"
              className="font-golos font-semibold bg-gold text-[hsl(220,25%,8%)] px-8 py-4 text-sm tracking-wide hover:bg-gold/90 transition-colors text-center"
            >
              Бесплатная консультация
            </a>
            <a
              href="#steps"
              className="font-golos font-medium border border-foreground/25 text-foreground/80 px-8 py-4 text-sm tracking-wide hover:border-gold hover:text-gold transition-colors text-center"
            >
              Узнать о процессе
            </a>
          </div>
        </div>

        <div
          className={`hidden md:flex flex-col gap-4 transition-all duration-700 delay-400 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {[
            { val: "98%", label: "Успешных дел" },
            { val: "5+", label: "Лет практики" },
            { val: "1500+", label: "Довольных клиентов" },
          ].map((stat) => (
            <div
              key={stat.val}
              className="border border-border bg-[hsl(220,22%,11%)]/60 backdrop-blur-sm px-6 py-4 flex items-center gap-5"
            >
              <span className="font-cormorant text-4xl font-semibold text-gold">{stat.val}</span>
              <span className="font-golos text-sm text-foreground/60">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-golos text-xs text-foreground/30 tracking-widest uppercase">Прокрутите вниз</span>
        <div className="w-px h-8 bg-gradient-to-b from-gold/50 to-transparent" />
      </div>
    </section>
  );
};

const About = () => {
  const { ref, inView } = useInView();

  return (
    <section id="about" className="py-28 bg-[hsl(220,22%,10%)]">
      <div ref={ref} className="max-w-6xl mx-auto px-6">
        <div className={`grid md:grid-cols-2 gap-16 items-center transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div>
            <span className="font-golos text-xs tracking-[0.2em] text-gold uppercase mb-4 block">О нас</span>
            <h2 className="font-cormorant text-4xl md:text-5xl font-semibold text-foreground mb-6 leading-tight">
              Работаем в рамках
              <br />
              <em className="text-gold not-italic">закона и честности</em>
            </h2>
            <div className="w-12 h-px bg-gold mb-8" />
            <p className="font-golos text-foreground/65 leading-relaxed mb-5 text-sm">
              Наша работа полностью соответствует требованиям <strong className="text-foreground/90">Федерального Закона №53</strong> и <strong className="text-foreground/90">Постановления Правительства №565</strong>. Мы ориентированы на предоставление законных и честных путей для тех, кто соответствует медицинским условиям для освобождения от службы.
            </p>
            <p className="font-golos text-foreground/65 leading-relaxed mb-5 text-sm">
              Наша цель — помочь гражданам понять и в полной мере реализовать свои права в соответствии с действующим законодательством Российской Федерации.
            </p>
            <p className="font-golos text-foreground/65 leading-relaxed text-sm">
              Мы никогда не обещаем невозможного. Каждый случай оцениваем индивидуально и честно — ещё на стадии бесплатной консультации.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: "BookOpen", title: "ФЗ №53", desc: "Полное соответствие Федеральному Закону о воинской обязанности" },
              { icon: "FileCheck", title: "ПП №565", desc: "Работа в рамках Постановления Правительства о военно-врачебной экспертизе" },
              { icon: "Award", title: "Гарантии", desc: "Договор с прописанными гарантиями и возвратом средств" },
              { icon: "HeartHandshake", title: "Честность", desc: "Реальная оценка шансов уже на первой бесплатной консультации" },
            ].map((item, i) => (
              <div
                key={i}
                className={`bg-[hsl(220,25%,8%)] border border-border p-5 transition-all duration-500 hover:border-gold/40 ${
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: `${i * 100 + 200}ms` }}
              >
                <div className="w-9 h-9 flex items-center justify-center bg-gold/10 mb-3">
                  <Icon name={item.icon} size={18} className="text-gold" fallback="Star" />
                </div>
                <h4 className="font-cormorant text-lg font-semibold text-foreground mb-1">{item.title}</h4>
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
    <section id="services" className="py-28 bg-[hsl(220,25%,8%)]">
      <div ref={ref} className="max-w-6xl mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <span className="font-golos text-xs tracking-[0.2em] text-gold uppercase mb-4 block">Услуги</span>
          <h2 className="font-cormorant text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Полное сопровождение
          </h2>
          <div className="w-12 h-px bg-gold mx-auto" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {services.map((s, i) => (
            <div
              key={i}
              className={`bg-[hsl(220,25%,8%)] p-8 transition-all duration-500 hover:bg-[hsl(220,22%,11%)] group ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="w-10 h-10 flex items-center justify-center bg-gold/10 mb-5 group-hover:bg-gold/20 transition-colors">
                <Icon name={s.icon} size={20} className="text-gold" fallback="Star" />
              </div>
              <h3 className="font-cormorant text-xl font-semibold text-foreground mb-3">{s.title}</h3>
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
    <section id="steps" className="py-28 bg-[hsl(220,22%,10%)]">
      <div ref={ref} className="max-w-6xl mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <span className="font-golos text-xs tracking-[0.2em] text-gold uppercase mb-4 block">Этапы работы</span>
          <h2 className="font-cormorant text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Как мы работаем
          </h2>
          <div className="w-12 h-px bg-gold mx-auto mb-5" />
          <p className="font-golos text-sm text-foreground/50 max-w-xl mx-auto">
            Прозрачный процесс от первой встречи до военного билета
          </p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute left-[3.25rem] top-0 bottom-0 w-px bg-border" />

          <div className="flex flex-col gap-0">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`relative flex gap-8 md:gap-12 items-start group transition-all duration-600 ${
                  inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                }`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div className="relative flex-shrink-0 w-[6.5rem] flex flex-col items-center">
                  <div className="w-14 h-14 flex items-center justify-center bg-[hsl(220,25%,8%)] border border-border group-hover:border-gold/50 transition-colors z-10">
                    <span className="font-cormorant text-xl font-semibold text-gold">{step.num}</span>
                  </div>
                </div>

                <div className="pb-12 flex-1">
                  <div className="bg-[hsl(220,25%,8%)] border border-border p-6 group-hover:border-gold/20 transition-colors">
                    <h3 className="font-cormorant text-2xl font-semibold text-foreground mb-3">{step.title}</h3>
                    <p className="font-golos text-sm text-foreground/60 leading-relaxed">{step.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const { ref, inView } = useInView();
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  return (
    <section id="contact" className="py-28 bg-[hsl(220,25%,8%)]">
      <div ref={ref} className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <span className="font-golos text-xs tracking-[0.2em] text-gold uppercase mb-4 block">Контакты</span>
            <h2 className="font-cormorant text-4xl md:text-5xl font-semibold text-foreground mb-4">
              Запишитесь на
              <br />
              <em className="text-gold not-italic">консультацию</em>
            </h2>
            <div className="w-12 h-px bg-gold mb-8" />
            <p className="font-golos text-sm text-foreground/55 leading-relaxed mb-10">
              Первая консультация — бесплатно. Расскажем о перспективах вашего дела, ответим на все вопросы без обязательств.
            </p>

            <div className="flex flex-col gap-5">
              {[
                { icon: "Phone", text: "+7 (999) 000-00-00" },
                { icon: "Mail", text: "info@yourlaw.ru" },
                { icon: "MapPin", text: "Москва, ул. Примерная, д. 1" },
                { icon: "Clock", text: "Пн–Пт: 9:00–19:00, Сб: 10:00–16:00" },
              ].map((c, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-9 h-9 flex items-center justify-center bg-gold/10 flex-shrink-0">
                    <Icon name={c.icon} size={16} className="text-gold" fallback="Info" />
                  </div>
                  <span className="font-golos text-sm text-foreground/65">{c.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`transition-all duration-700 delay-200 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div className="bg-[hsl(220,22%,11%)] border border-border p-8">
              <h3 className="font-cormorant text-2xl font-semibold text-foreground mb-6">Оставить заявку</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="font-golos text-xs text-foreground/50 uppercase tracking-wider mb-2 block">Ваше имя</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Иван Иванов"
                    className="w-full bg-[hsl(220,25%,8%)] border border-border px-4 py-3 font-golos text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-gold/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="font-golos text-xs text-foreground/50 uppercase tracking-wider mb-2 block">Номер телефона</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+7 (999) 000-00-00"
                    className="w-full bg-[hsl(220,25%,8%)] border border-border px-4 py-3 font-golos text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-gold/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="font-golos text-xs text-foreground/50 uppercase tracking-wider mb-2 block">Вопрос или комментарий</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Кратко опишите вашу ситуацию..."
                    rows={4}
                    className="w-full bg-[hsl(220,25%,8%)] border border-border px-4 py-3 font-golos text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-gold/50 transition-colors resize-none"
                  />
                </div>
                <button className="font-golos font-semibold bg-gold text-[hsl(220,25%,8%)] px-6 py-4 text-sm tracking-wide hover:bg-gold/90 transition-colors w-full mt-2">
                  Отправить заявку
                </button>
                <p className="font-golos text-xs text-foreground/35 text-center leading-relaxed">
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
  <footer className="bg-[hsl(220,22%,6%)] border-t border-border py-10">
    <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div>
        <span className="font-cormorant text-lg font-semibold text-gold">ЮрПризыв</span>
        <p className="font-golos text-xs text-foreground/35 mt-1">
          Юридическое сопровождение призывников
        </p>
      </div>
      <p className="font-golos text-xs text-foreground/30 text-center">
        Деятельность соответствует ФЗ №53 и ПП №565. <br className="md:hidden" />
        Только законные методы защиты прав граждан.
      </p>
      <p className="font-golos text-xs text-foreground/30">
        © 2024 ЮрПризыв
      </p>
    </div>
  </footer>
);

const Index = () => {
  return (
    <div className="bg-[hsl(220,25%,8%)] min-h-screen">
      <NavBar />
      <Hero />
      <About />
      <Services />
      <Steps />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
