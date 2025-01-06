import Head from "next/head";
import React from "react";

export default function PageHead({ title, description, ogImage }) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
      />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />
      <meta
        property="og:url"
        content={typeof window !== "undefined" ? window.location.href : ""}
      />
      <link rel="icon" href="/check.svg" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
    </Head>
  );
}
