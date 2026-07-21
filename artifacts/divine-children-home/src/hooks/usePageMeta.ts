import { useEffect } from "react";
import { siteConfig } from "@/config/site";

function setMeta(name: string, content: string, property = false) {
  const selector = property
    ? `meta[property="${name}"]`
    : `meta[name="${name}"]`;
  const element = document.querySelector(selector);
  if (element) {
    element.setAttribute("content", content);
  }
}

export function usePageMeta(title: string, description: string = siteConfig.description) {
  useEffect(() => {
    document.title = title.includes(siteConfig.shortName)
      ? title
      : `${title} | ${siteConfig.name}`;

    setMeta("description", description);
    setMeta("og:title", document.title, true);
    setMeta("og:description", description, true);
    setMeta("twitter:title", document.title);
    setMeta("twitter:description", description);
  }, [title, description]);
}
