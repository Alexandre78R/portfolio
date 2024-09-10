import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

const Document = (): React.ReactElement => {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MT75FPT5"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <NextScript />
        <Script id="gtm-init" strategy="afterInteractive">
          {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-MT75FPT5');
            `}
        </Script>
      </body>
    </Html>
  );
};

export default Document;
function useEffect(arg0: () => () => void, arg1: any[]) {
  throw new Error("Function not implemented.");
}
