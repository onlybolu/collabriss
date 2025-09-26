export default function sitemap() {
  const baseUrl = 'https://collabriss.com'; 

  
  const staticRoutes = [
    '/',
    '/#features',
    '/#pricing',
    '/#faq',
    '/about', 
    '/contact'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  // If you have dynamic routes (e.g., blog posts), you would fetch them and add them here

  return [
    ...staticRoutes,
  ];
}