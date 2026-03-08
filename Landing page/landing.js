/* frame/film — landing.js */
// Active nav
document.querySelectorAll('.nav-links a').forEach(link => {
  if (link.getAttribute('href') === 'index.html') link.classList.add('active');
});
