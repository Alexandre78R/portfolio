import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import { useLang } from "@/context/Lang/LangContext";
import type Lang  from "@/lang/typeLang";

type CanonicalState = string;

const getWindowOrigin: () => string = (): string => {
  if (typeof window === "undefined") return "";
  return window.location.origin;
};

const buildCanonicalUrl: (origin: string, path: string) => string = (origin: string, path: string): string =>
  origin ? `${origin}${path}` : "";

const Seo: () => JSX.Element = (): JSX.Element => {
  const router: ReturnType<typeof useRouter> = useRouter();

  const { translations }: { translations: Lang } = useLang();

  const [canonicalUrl, setCanonicalUrl]: [CanonicalState, React.Dispatch<React.SetStateAction<CanonicalState>>] = useState<CanonicalState>("");

  useEffect((): void => {
    document.documentElement.lang = translations.file;
  }, [translations.file]);

  useEffect((): void => {
    const origin: string = getWindowOrigin();
    const canonical: string = buildCanonicalUrl(origin, router.asPath);

    setCanonicalUrl(canonical);
  }, [router.asPath]);
  
const jsonLd: string = useMemo((): string => {
  return JSON.stringify(
    [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: translations.titleHTML,
        url: getWindowOrigin(),
        contactPoint: {
          "@type": "ContactPoint",
          email: "contact@alexandre-renard.dev",
          contactType: "customer support",
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Accueil",
            item: canonicalUrl,
          },
        ],
      },
    ],
    null,
    2
  );
}, [translations.titleHTML, canonicalUrl]);

  return (
    <Head>
      {/* ------------------------------- BASIC SEO ------------------------------ */}
      <title>{translations.titleHTML}</title>

      <meta name="title" content={translations.titleHTML} />
      <meta name="description" content={translations.descHTML} />

      <link rel="canonical" href={canonicalUrl} />
      <link rel="icon" href="/img/logo.jpeg" />

      {/* ---------------------------- OPEN GRAPH -------------------------------- */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={translations.titleHTML} />
      <meta property="og:description" content={translations.descHTML} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content="/img/logo.jpeg" />
      <meta property="og:site_name" content={translations.titleHTML} />

      {/* ------------------------------ TWITTER ---------------------------------- */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" property="twitter:title" content={translations.titleHTML} />
      <meta name="twitter:description" property="twitter:description" content={translations.descHTML} />
      <meta name="twitter:image" property="twitter:image" content="/img/logo.jpeg" />

      {/* ------------------------------ JSON-LD ---------------------------------- */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd  }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd  }}
      />
    </Head>
  );
};

export default Seo;