import { useEffect } from "react";

interface SeoOptions {
  title: string;
  description?: string;
  noindex?: boolean;
  canonical?: string;
  image?: string;
  type?: string;
  jsonLd?: object;
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

const setCanonical = (href: string) => {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

const setJsonLd = (id: string, data: object) => {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.id = id;
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
};

export function useSeo({ title, description, noindex, canonical, image, type, jsonLd }: SeoOptions) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;
    setMeta("og:title", title, "property");
    setMeta("twitter:title", title);

    if (description) {
      setMeta("description", description);
      setMeta("og:description", description, "property");
      setMeta("twitter:description", description);
    }
    if (canonical) {
      setCanonical(canonical);
      setMeta("og:url", canonical, "property");
    }
    if (image) {
      setMeta("og:image", image, "property");
      setMeta("twitter:image", image);
      setMeta("twitter:card", "summary_large_image");
    }
    if (type) {
      setMeta("og:type", type, "property");
    }
    if (noindex) {
      setMeta("robots", "noindex, follow");
    }
    if (jsonLd) {
      setJsonLd("dynamic-jsonld", jsonLd);
    }

    return () => {
      document.title = prevTitle;
      if (noindex) {
        setMeta("robots", "index, follow");
      }
      if (jsonLd) {
        const el = document.getElementById("dynamic-jsonld");
        if (el) el.remove();
      }
    };
  }, [title, description, noindex, canonical, image, type, jsonLd]);
}
