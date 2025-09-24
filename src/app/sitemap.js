export default function sitemap() {
  const baseUrl = 'https://collabriss.com'; // IMPORTANT: Replace with your domain

  // Add your static routes here
  const staticRoutes = [
    '/',
    '/#features',
    '/#pricing',
    '/#faq',
    // '/about', 
    // '/contact'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  // If you have dynamic routes (e.g., blog posts), you would fetch them and add them here

  return [
    ...staticRoutes,
  ];
}