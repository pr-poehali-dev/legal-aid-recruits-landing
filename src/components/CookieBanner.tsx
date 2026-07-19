import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

const STORAGE_KEY = "cookie-consent";

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6">
      <div className="max-w-3xl mx-auto bg-white border-2 border-ink shadow-brutal p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="w-10 h-10 flex-shrink-0 bg-lime border-2 border-ink flex items-center justify-center">
          <Icon name="Cookie" size={18} className="text-foreground" />
        </div>
        <p className="font-golos text-sm text-foreground/70 font-medium leading-relaxed flex-1">
          Мы используем файлы cookie для корректной работы сайта и улучшения сервиса в соответствии
          с 152-ФЗ «О персональных данных». Продолжая пользоваться сайтом, вы соглашаетесь с их
          использованием и{" "}
          <Link to="/privacy-policy" target="_blank" className="text-violet underline hover:no-underline">
            политикой обработки персональных данных
          </Link>
          .
        </p>
        <button
          onClick={accept}
          className="font-golos text-sm font-bold bg-violet text-white px-6 py-3 border-2 border-ink shadow-brutal-sm hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all whitespace-nowrap w-full md:w-auto"
        >
          Хорошо
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
