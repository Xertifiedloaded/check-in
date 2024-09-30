
import { Head, Html, NextScript, Main } from "next/document";


export default function RootLayout() {
  return (
    <Html lang="en">
      <Head />
      <body className="font-poppins">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
