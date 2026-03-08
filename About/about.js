/* frame/film — about.js */

const contactLink = document.querySelector('.contact-link');

contactLink.addEventListener('click', e => {
  e.preventDefault();
  const email = contactLink.getAttribute('href').replace('mailto:', '');

  navigator.clipboard.writeText(email).then(() => {
    const original = contactLink.textContent;
    contactLink.textContent = 'copied!';
    setTimeout(() => { contactLink.textContent = original; }, 2000);
  }).catch(() => {
    window.location.href = contactLink.getAttribute('href');
  });
});
