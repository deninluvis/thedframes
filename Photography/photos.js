/* frame/film — photos.js */

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

document.querySelectorAll('.photo-item').forEach(item => {
  item.addEventListener('click', () => {
    const img   = item.querySelector('img');
    const label = item.dataset.label;
    // Load a larger version for lightbox
    const seed  = img.src.match(/seed\/(\w+)\//)?.[1] || 'photo';
    openLightbox(`https://picsum.photos/seed/${seed}/1200/800`, label);
  });
});

lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
