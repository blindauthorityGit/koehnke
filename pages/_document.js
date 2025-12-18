import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="de">
            <Head>
                <link rel="stylesheet" href="https://use.typekit.net/xpr5jiz.css"></link>
            </Head>
            <body className="antialiased">
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
