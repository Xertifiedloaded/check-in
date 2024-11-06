import { Head, Html, NextScript, Main } from "next/document";

export default function RootLayout() {
  return (
    <Html lang="en">
      <Head />
      <body className="font-poppins bg-white dark:bg-black text-gray-900 dark:text-gray-100">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
