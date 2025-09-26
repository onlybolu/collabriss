export default function robots() {
  const baseUrl = 'https://collabriss.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // disallow: '/user/', 
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}