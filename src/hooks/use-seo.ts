import { useEffect } from "react";

interface SeoOptions {
  title: string;
  description?: string;
  noindex?: boolean;
}

const setMeta = (name: string, content: string, attr: "name" | "property" = "name") => {
  let el = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

export function useSeo({ title, description, noindex }: SeoOptions) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;
    if (description) {
      setMeta("description", description);
      setMeta("og:title", title, "property");
      setMeta("og:description", description, "property");
      setMeta("twitter:title", title);
      setMeta("twitter:description", description);
    }
    if (noindex) {
      setMeta("robots", "noindex, follow");
    }
    return () => {
      document.title = prevTitle;
      if (noindex) {
        setMeta("robots", "index, follow");
      }
    };
  }, [title, description, noindex]);
}
