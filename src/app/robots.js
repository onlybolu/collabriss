export default function robots() {
  const baseUrl = 'https://collabriss.com'; // IMPORTANT: Replace with your domain

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // disallow: '/private/', // Example for pages you want to hide from search engines
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}