import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";


export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </Head>
      <body className={`antialiased`}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-HN93HGTBLX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HN93HGTBLX');
          `}
        </Script>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
