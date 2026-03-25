import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  type?: string;
  image?: string;
  url?: string;
}

export default function SEO({
  title,
  description,
  type = "website",
  image = "/logo.png",
  url,
}: SEOProps) {
  useEffect(() => {
    const siteName = "Cœur UA PAM";
    const fullTitle = `${title} | ${siteName}`;

    // Mise à jour du titre de l'onglet
    document.title = fullTitle;

    // Utilitaire pour mettre à jour ou créer des balises meta
    const setMeta = (name: string, content: string, isProperty = false) => {
      const selector = isProperty
        ? `meta[property="${name}"]`
        : `meta[name="${name}"]`;
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement("meta");
        if (isProperty) element.setAttribute("property", name);
        else element.setAttribute("name", name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    const origin = window.location.origin;
    const absoluteImage = image.startsWith("http")
      ? image
      : `${origin}${image}`;
    const absoluteUrl = url ? `${origin}${url}` : window.location.href;

    // Balises standards
    setMeta("description", description);

    // Open Graph (Facebook, LinkedIn, etc.)
    setMeta("og:title", fullTitle, true);
    setMeta("og:description", description, true);
    setMeta("og:type", type, true);
    setMeta("og:url", absoluteUrl, true);
    setMeta("og:image", absoluteImage, true);
    setMeta("og:site_name", siteName, true);

    // Twitter
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:image", absoluteImage);

    // Lien canonique
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", absoluteUrl);
  }, [title, description, type, image, url]);

  return null;
}
