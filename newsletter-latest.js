/* PeteSake newsletter latest links.
   LinkedIn does not provide a reliable public newsletter RSS/API for static websites.
   Add VERIFIED article URLs below when available. Empty lists show a direct link
   to the publication instead of claiming an automated feed. */
(() => {
  const feeds = {
    five: { publication: 'https://www.linkedin.com/newsletters/5-things-worth-knowing-today-7505185005187366912/', articles: [] },
    pete: { publication: 'https://www.linkedin.com/newsletters/oh-for-pete-s-sake-7141066293750804481/', articles: [] }
  };
  document.querySelectorAll('.newsletter-latest[data-feed]').forEach(box => {
    const feed = feeds[box.dataset.feed];
    if (!feed) return;
    const heading = document.createElement('div');
    heading.className = 'newsletter-latest-heading';
    heading.textContent = 'LATEST EDITIONS';
    box.append(heading);
    if (!feed.articles.length) {
      const link = document.createElement('a');
      link.href = feed.publication;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = 'Browse the latest on LinkedIn ↗';
      box.append(link);
      return;
    }
    feed.articles.slice(0, 3).forEach(article => {
      if (!/^https:\/\/www\.linkedin\.com\//.test(article.url || '')) return;
      const link = document.createElement('a');
      link.href = article.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = (article.date ? article.date + ' // ' : '') + article.title + ' ↗';
      box.append(link);
    });
  });
})();
