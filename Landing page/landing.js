/* frame/film — landing.js */
// Active nav
document.querySelectorAll('.nav-links a').forEach(link => {
  if (link.getAttribute('href') === 'index.html') link.classList.add('active');
});

// Hero mosaic — populated from CMS content
fetch('/content/home.json')
  .then(res => res.json())
  .then(data => {
    const slots = document.querySelectorAll('#heroMosaic .mc');
    (data.mosaic || []).slice(0, slots.length).forEach((item, i) => {
      if (!item.image) return;
      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.alt || '';
      img.loading = 'eager';
      slots[i].appendChild(img);
    });
  })
  .catch(() => {});
