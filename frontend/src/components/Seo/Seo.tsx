import { useLang } from "@/context/Lang/LangContext";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const Seo: React.FC = (): React.ReactElement => {
  const router = useRouter();
  const { translations } = useLang();

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = translations.file;
    }
  }, [translations]);

  // State pour stocker l'URL canonique
  const [canonicalUrl, setCanonicalUrl] = useState<string>("");
  const [urlDomaine, setUrlDomaine] = useState<string>("");

  useEffect(() => {
    // Vérification pour s'assurer que le code s'exécute côté client
    if (typeof window !== "undefined") {
      // Construit l'URL canonique en utilisant le chemin actuel
      const url = `${window.location.origin}${router.asPath}`;
      setCanonicalUrl(url);
      setUrlDomaine(window.location.origin);
    }
  }, [router.asPath]);

  return (
    <Head>
      <title>{translations.titleHTML}</title>
      <meta name="title" content={translations.titleHTML} />
      <meta name="description" content={translations.descHTML} />
      <meta name="url" content={canonicalUrl}></meta>
      <meta property="og:title" content={translations.titleHTML} />
      <meta property="og:description" content={translations.descHTML} />
      <meta property="og:url" content={canonicalUrl ? canonicalUrl : ""} />
      <meta property="og:type" content="Alexandre Renard - Portfolio" />
      <meta property="og:image" content="/img/logo.jpeg" />
      <meta property="og:site_name" content={translations.titleHTML} />
      <meta property="twitter:card" content="summary" />
      <meta property="twitter:title" content={translations.titleHTML} />
      <meta property="twitter:description" content={translations.descHTML} />
      <meta property="twitter:site" content={canonicalUrl} />
      <meta property="twitter:image" content="/img/logo.jpeg" />

      <link rel="canonical" href={canonicalUrl} />
      <link rel="icon" href="/img/logo.jpeg" />
      <script type="application/ld+json">
        {/* Organisation */}
        {`{
            "@context": "http://schema.org",
            "@type": "Organization",
            "name": ${translations.titleHTML},
            "url": ${urlDomaine},
            "contactPoint": {
            "@type": "ContactPoint",
            "email": "contact.alexandre-renard.dev",
            "contactType": "Service client"
            }
        }`}
        {/* BreadcrumbList (fil d'Ariane) */}
        {`{
          "@context": "http://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
              {
              "@type": "ListItem",
              "position": 1,
              "name": "Accueil",
              "item": ${canonicalUrl}
              }
          ]
        }`}
      </script>
    </Head>
  );
};

export default Seo;
