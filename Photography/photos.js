/* frame/film — photos.js */

const grid     = document.getElementById('photoGrid');
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lb-img');
const lbLabel  = document.getElementById('lb-label');
const lbClose  = document.getElementById('lb-close');

function openLightbox(src, label) {
  lbImg.src = src;
  lbLabel.textContent = label;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function renderEmpty() {
  grid.innerHTML = '<p class="grid-empty">No photos yet — check back soon.</p>';
}

fetch('/content/photos.json')
  .then(res => res.json())
  .then(data => {
    const items = data.items || [];

    if (!items.length) { renderEmpty(); return; }

    items.forEach((item, i) => {
      const el = document.createElement('div');
      el.className = 'photo-item';
      el.dataset.label = item.label || '';

      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.alt || item.label || '';
      img.loading = 'lazy';

      const overlay = document.createElement('div');
      overlay.className = 'photo-overlay';
      overlay.innerHTML = `
        <div class="po-title">${item.label || ''}</div>
        <div class="po-num">${String(i + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}</div>
      `;

      el.append(img, overlay);
      el.addEventListener('click', () => openLightbox(item.image, item.label || ''));
      grid.appendChild(el);
    });
  })
  .catch(renderEmpty);

lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
