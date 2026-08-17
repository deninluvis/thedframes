/* frame/film — about.js */

const contactLink = document.querySelector('.contact-link');

// Portraits and hero image — populated from CMS content
fetch('/content/about.json')
  .then(res => res.json())
  .then(data => {
    if (data.heroImage) {
      const img = document.createElement('img');
      img.src = data.heroImage;
      img.alt = data.heroAlt || '';
      img.loading = 'eager';
      document.getElementById('aboutLeft').prepend(img);
    }

    const photographerSlot = document.getElementById('portraitPhotographer');
    if (data.photographerPortrait && photographerSlot) {
      const img = document.createElement('img');
      img.src = data.photographerPortrait;
      img.alt = data.photographerAlt || 'Photographer portrait';
      img.loading = 'lazy';
      photographerSlot.appendChild(img);
    }

    const videographerSlot = document.getElementById('portraitVideographer');
    if (data.videographerPortrait && videographerSlot) {
      const img = document.createElement('img');
      img.src = data.videographerPortrait;
      img.alt = data.videographerAlt || 'Videographer portrait';
      img.loading = 'lazy';
      videographerSlot.appendChild(img);
    }
  })
  .catch(() => {});

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
