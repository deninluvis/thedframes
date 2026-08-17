/* frame/film — photos.js */

const grid     = document.getElementById('photoGrid');
const meta     = document.getElementById('galleryMeta');
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

function renderMessage(text) {
  grid.innerHTML = `<p class="grid-empty">${text}</p>`;
}

function renderProjectIndex(projects) {
  meta.hidden = true;
  meta.innerHTML = '';

  if (!projects.length) {
    renderMessage('No projects yet — check back soon.');
    return;
  }

  grid.innerHTML = '';

  projects.forEach(project => {
    const count = (project.photos || []).length;
    const card = document.createElement('a');
    card.className = 'project-card';
    card.href = `?project=${encodeURIComponent(project.slug || '')}`;

    const img = document.createElement('img');
    img.src = project.coverImage || '';
    img.alt = project.coverAlt || project.title || '';
    img.loading = 'lazy';

    const overlay = document.createElement('div');
    overlay.className = 'photo-overlay';
    overlay.innerHTML = `
      <div class="po-title">${project.title || ''}</div>
      <div class="po-num">${count} photo${count === 1 ? '' : 's'}</div>
    `;

    card.append(img, overlay);
    grid.appendChild(card);
  });
}

function renderProjectDetail(project) {
  meta.hidden = false;
  meta.innerHTML = `
    <a class="gm-back" href="/Photography/photos.html">&larr; All Projects</a>
    <h2 class="gm-title">${project.title || ''}</h2>
    ${project.description ? `<p class="gm-desc">${project.description}</p>` : ''}
  `;

  const photos = project.photos || [];

  if (!photos.length) {
    renderMessage('No photos in this project yet — check back soon.');
    return;
  }

  grid.innerHTML = '';

  photos.forEach((item, i) => {
    const el = document.createElement('div');
    el.className = 'photo-item';

    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.alt || item.label || '';
    img.loading = 'lazy';

    const overlay = document.createElement('div');
    overlay.className = 'photo-overlay';
    overlay.innerHTML = `
      <div class="po-title">${item.label || ''}</div>
      <div class="po-num">${String(i + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}</div>
    `;

    el.append(img, overlay);
    el.addEventListener('click', () => openLightbox(item.image, item.label || project.title || ''));
    grid.appendChild(el);
  });
}

function renderProjectNotFound() {
  meta.hidden = false;
  meta.innerHTML = `<a class="gm-back" href="/Photography/photos.html">&larr; All Projects</a>`;
  renderMessage('Project not found.');
}

const slug = new URLSearchParams(location.search).get('project');

fetch('/content/photos.json')
  .then(res => res.json())
  .then(data => {
    const projects = data.projects || [];

    if (!slug) {
      renderProjectIndex(projects);
      return;
    }

    const project = projects.find(p => p.slug === slug);
    if (!project) {
      renderProjectNotFound();
      return;
    }

    renderProjectDetail(project);
  })
  .catch(() => renderMessage('No photos yet — check back soon.'));

lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
