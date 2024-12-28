import { Head, Html, NextScript, Main } from "next/document";

export default function RootLayout() {
  return (
    <Html lang="en">
      <Head>
        {/* Default Meta Tags */}
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="description" content="Daily check-in app to track your personal progress and stay motivated towards your goals." />
        <meta name="author" content="xertifiedloaded" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Daily Check-in" />
        <meta property="og:description" content="Start your day with a quick check-in. Track your tasks, reflect on your progress, and stay motivated!" />
        <meta property="og:image" content="https://res.cloudinary.com/djknvzync/image/upload/v1730909798/checkins/bzuqu8mjjumgfgwd5lia.png" />
        <meta property="og:url" content="https://daily-check-in.com.ng" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="https://res.cloudinary.com/djknvzync/image/upload/v1730909798/checkins/bzuqu8mjjumgfgwd5lia.png" />
        <meta name="twitter:title" content="Daily Check-in" />
        <meta name="twitter:description" content="Track your daily progress and stay on top of your goals with our easy-to-use check-in app." />
        <meta name="twitter:image" content="https://daily-check-in.com.ng" />
        <meta name="twitter:creator" content="@xertifiedloaded" />
      </Head>
      <body className="font-poppins bg-white dark:bg-black text-gray-900 dark:text-gray-100">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}


