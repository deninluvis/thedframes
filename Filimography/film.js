/* frame/film — film.js */

const modal      = document.getElementById('videoModal');
const vmEmbed    = document.getElementById('vmEmbed');
const vmClose    = document.getElementById('vmClose');
const vmBackdrop = document.getElementById('vmBackdrop');

function openVideo(videoId) {
  vmEmbed.innerHTML = `
    <iframe
      src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0"
      allow="autoplay; encrypted-media"
      allowfullscreen>
    </iframe>`;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeVideo() {
  modal.classList.remove('open');
  vmEmbed.innerHTML = '';
  document.body.style.overflow = '';
}

document.querySelectorAll('.film-card').forEach(card => {
  card.addEventListener('click', () => {
    const id = card.dataset.videoId;
    if (id) openVideo(id);
  });

  // Subtle tilt on hover
  card.addEventListener('mousemove', e => {
    const rect  = card.getBoundingClientRect();
    const x     = (e.clientX - rect.left) / rect.width  - 0.5;
    const y     = (e.clientY - rect.top)  / rect.height - 0.5;
    const thumb = card.querySelector('.film-thumb');
    thumb.style.transform   = `perspective(700px) rotateY(${x * 3}deg) rotateX(${-y * 3}deg)`;
    thumb.style.transition  = 'transform 0.1s ease';
  });

  card.addEventListener('mouseleave', () => {
    const thumb = card.querySelector('.film-thumb');
    thumb.style.transform  = 'perspective(700px) rotateY(0deg) rotateX(0deg)';
    thumb.style.transition = 'transform 0.6s ease';
  });
});

vmClose.addEventListener('click', closeVideo);
vmBackdrop.addEventListener('click', closeVideo);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeVideo(); });
