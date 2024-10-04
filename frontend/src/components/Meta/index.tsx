// Importing Next
import Head from 'next/head';
// Importing Const
import { metadata } from '@/lib/constants';

export default function Meta() {
  return (
    <Head>
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />

      <link rel="manifest" href="/site.webmanifest" />
      <meta name="msapplication-TileColor" content="#f2f2f7" />
      <meta name="theme-color" content="#f2f2f7" />

      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={metadata.title} />
      <meta property="og:description" content={metadata.description} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metadata.title} />
      <meta name="twitter:description" content={metadata.description} />
    </Head>
  );
}
