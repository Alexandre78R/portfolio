import Link from "next/link";
import { useLang } from "@/context/Lang/LangContext";
import Head from "next/head";
import { useEffect } from "react";
import { Router, useRouter } from "next/router";

const Custom404 = (): React.ReactElement => {
  const { translations } = useLang();
  
  const router = useRouter();

  useEffect(() => {
    router.push("/400");
  }, []);
  
  return (
    <>
      <Head>
        <title>{translations.titleHTMLUnauthorizedAccess}</title>
      </Head>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] mt-[64px] px-4 bg-body">
        <div className="flex flex-col items-center">
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
            <text
              x="100"
              y="115"
              textAnchor="middle"
              fontSize="72"
              fontWeight="bold"
              fontFamily="monospace"
              style={{ fill: "var(--primary-color)" }}
            >
              400
            </text>
          </svg>
          <h1 className="text-4xl font-bold text-primary mt-6 text-center">
            {translations.messagePageUnauthorizedH1}
          </h1>
          <p className="text-lg text-text mt-2 text-center">
            {translations.messagePageUnauthorizedP}
          </p>
          <Link href="/" passHref>
            <button className="mt-6 px-6 py-3 rounded bg-primary text-white font-semibold shadow hover:bg-secondary transition">
              {translations.messagePageUnauthorizedButtom}
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Custom404;
