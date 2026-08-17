/* frame/film — film.js */

const layout     = document.getElementById('filmLayout');
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

function attachCardInteractions(card) {
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
    thumb.style.transform  = `perspective(700px) rotateY(${x * 3}deg) rotateX(${-y * 3}deg)`;
    thumb.style.transition = 'transform 0.1s ease';
  });

  card.addEventListener('mouseleave', () => {
    const thumb = card.querySelector('.film-thumb');
    thumb.style.transform  = 'perspective(700px) rotateY(0deg) rotateX(0deg)';
    thumb.style.transition = 'transform 0.6s ease';
  });
}

function renderEmpty() {
  layout.innerHTML = '<p class="grid-empty">No films yet — check back soon.</p>';
}

fetch('/content/film.json')
  .then(res => res.json())
  .then(data => {
    const items = data.items || [];

    if (!items.length) { renderEmpty(); return; }

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'film-card';
      card.dataset.videoId = item.videoId || '';
      card.dataset.title   = item.title || '';

      card.innerHTML = `
        <div class="film-thumb">
          <img src="${item.thumbnail || ''}" alt="${item.alt || item.title || ''}" loading="lazy" />
          <div class="film-thumb-overlay"></div>
          <div class="play-ring"></div>
          <span class="film-ts">${item.timestamp || ''}</span>
        </div>
        <p class="film-label">${item.category || ''}</p>
        <h3 class="film-title">${item.title || ''}</h3>
        <p class="film-desc">${item.description || ''}</p>
      `;

      layout.appendChild(card);
      attachCardInteractions(card);
    });
  })
  .catch(renderEmpty);

vmClose.addEventListener('click', closeVideo);
vmBackdrop.addEventListener('click', closeVideo);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeVideo(); });
