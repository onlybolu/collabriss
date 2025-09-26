import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Collabriss",
    template: `%s | Collabriss`,
  },
  description: "The all in one commerce and business management tool for entrepreneurs. Sell online, manage inventory, and grow your customer base with ease.",
  keywords: ["small business", "ecommerce", "inventory management", "online store", "business tools", "entrepreneur"],
  authors: [{ name: 'Inovareun Team', url: 'https://collabriss.com' }], 
  creator: 'Collabriss Team',
  publisher: 'Collabriss',
  metadataBase: new URL('https://collabriss.com'), 
  openGraph: {
    title: 'Collabriss',
    description: 'The all in one commerce and business management tool for entrepreneurs.',
    url: 'https://collabriss.com', 
    siteName: 'Collabriss',
    images: [
      {
        url: '/logo.png', 
        width: 1200,
        height: 630,
        alt: 'Collabriss - Your business toolkit in your pocket.',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Collabriss',
    description: 'The all in one commerce and business management tool for entrepreneurs.',
    // creator: '@YourTwitterHandle',
    images: ['/twitter-image.png'], 
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Collabriss',
    url: 'https://collabriss.com', 
    logo: 'https://collabriss.com/logo.png', 
  };

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}
