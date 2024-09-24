import Head from "next/head";
import React from "react";
import Landing from "./Landing";
import Heading from "@/components/Heading";
import CheckIn from "@/components/CheckIn";
export default function Home() {
  return (
    <>
      <Head>
        <title>DailyCheck-In</title>
        <meta
          name="description"
          content="Department Of Animal Breeding And Genetics"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </Head>
      <main>
        <Landing />
        <Heading/>
        <CheckIn/>
      </main>
    </>
  );
}
