import Head from "next/head"
import React from "react"

export default function PageHead({ title, description, content }) {
  return (
    <Head>
      <title>{title}</title>
      <meta name={description} content={content} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
    </Head>
  )
}
