/* D-frames — photos page: the project list, one project's gallery,
   and the full-screen photo viewer. Requires site.js and media.js. */
(function () {
  'use strict';

  var el = DF.el, text = DF.text;
  var head = document.getElementById('photosHead');
  var body = document.getElementById('photosBody');

  var params = new URLSearchParams(location.search);
  var galleryMode = params.has('project');   // "?project=" (empty) is still a gallery request
  var slug = params.get('project') || '';

  function backLink() {
    return el('p', { className: 'back' }, el('a', { className: 'link', href: '/photos.html', textContent: '← All projects' }));
  }

  function listHead() {
    head.replaceChildren(el('div', { className: 'sec-head' },
      el('div', null,
        el('p', { className: 'meta', textContent: 'Photography' }),
        el('h1', { textContent: 'Stills' }))));
  }

  /* ── Project list ── */
  function renderList(projects) {
    listHead();
    if (!projects.length) { DF.showMessage(body, DF.EMPTY); return; }
    var grid = el('div', { className: 'stills two' });
    projects.forEach(function (project, i) {
      grid.appendChild(DFMedia.projectCard(project, DFMedia.projectHref(projects, i)));
    });
    body.replaceChildren(grid);
  }

  /* ── One project ── */
  function renderNotFound() {
    document.title = 'Project not found — D-frames';
    head.replaceChildren(
      backLink(),
      el('div', { className: 'gallery-head' }, el('h1', { className: 'page-title', textContent: 'Project not found' })));
    DF.showMessage(body, 'This project may have been renamed or removed.');
  }

  function renderGallery(project) {
    var title = text(project.title) || 'Untitled project';
    var meta = DF.metaLine(project.place, project.date);
    var description = text(project.description);
    document.title = title + ' — D-frames';

    head.replaceChildren(
      backLink(),
      el('div', { className: 'gallery-head' },
        el('h1', { className: 'page-title', textContent: title }),
        meta ? el('p', { className: 'meta', textContent: meta }) : null,
        description ? el('p', { className: 'page-desc', textContent: description }) : null));

    var photos = DF.list(project.photos).filter(function (p) { return text(p.image); });
    if (!photos.length) { DF.showMessage(body, 'No photos in this project yet.'); return; }

    var gallery = el('div', { className: 'gallery' });
    photos.forEach(function (photo, i) {
      var label = text(photo.label);
      var img = el('img', { alt: text(photo.alt) || label, loading: 'lazy' });
      /* "pending" reserves room until the photo arrives, so photos further
         down the page are not all fetched at once. */
      var shot = el('button', { type: 'button', className: 'shot pending', 'aria-label': 'Open photo ' + (i + 1) + ' of ' + photos.length + (label ? ': ' + label : '') }, img);
      var settle = function () { shot.classList.remove('pending'); };
      img.addEventListener('load', settle);
      img.addEventListener('error', settle);
      img.src = text(photo.image);
      if (img.complete) settle();
      shot.addEventListener('click', function () { openViewer(photos, i, shot); });
      gallery.appendChild(shot);
    });
    body.replaceChildren(gallery);
  }

  /* ── Viewer ── */
  var viewer, viewImg, viewLabel, viewCount, prevBtn, nextBtn;
  var current = [], index = 0, opener = null;

  function reveal() { viewImg.style.visibility = 'visible'; }

  function show(i) {
    index = (i + current.length) % current.length;
    var photo = current[index];
    var label = text(photo.label);
    var src = text(photo.image);
    if (viewImg.getAttribute('src') !== src) {
      viewImg.style.visibility = 'hidden';   // never show the last photo under the new caption
      viewImg.src = src;
      if (viewImg.complete && viewImg.naturalWidth) reveal();
    }
    viewImg.alt = text(photo.alt) || label;
    viewLabel.textContent = label;
    viewCount.textContent = (index + 1) + ' / ' + current.length;
  }

  function closeViewer() {
    if (!viewer || !viewer.classList.contains('open')) return;
    viewer.classList.remove('open');
    document.body.classList.remove('locked');
    DFMedia.setBackgroundInert(false);
    viewImg.removeAttribute('src');
    if (opener && opener.focus) opener.focus();
    opener = null;
  }

  function buildViewer() {
    var close = el('button', { type: 'button', className: 'btn-close', 'aria-label': 'Close', textContent: 'Close ✕' });
    prevBtn = el('button', { type: 'button', className: 'btn-step prev', 'aria-label': 'Previous photo', textContent: '←' });
    nextBtn = el('button', { type: 'button', className: 'btn-step next', 'aria-label': 'Next photo', textContent: '→' });
    viewImg = el('img', { alt: '' });
    viewImg.addEventListener('load', reveal);
    viewImg.addEventListener('error', reveal);
    viewLabel = el('span');
    viewCount = el('span', { className: 'meta', 'aria-live': 'polite' });

    viewer = el('div', { className: 'overlay viewer', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Photo viewer' },
      close, prevBtn,
      el('figure', null, viewImg, el('figcaption', null, viewLabel, viewCount)),
      nextBtn);

    close.addEventListener('click', closeViewer);
    prevBtn.addEventListener('click', function () { show(index - 1); });
    nextBtn.addEventListener('click', function () { show(index + 1); });
    viewer.addEventListener('click', function (e) { if (e.target === viewer) closeViewer(); });
    document.addEventListener('keydown', function (e) {
      if (!viewer.classList.contains('open')) return;
      if (e.key === 'Escape') closeViewer();
      else if (e.key === 'ArrowLeft' && current.length > 1) show(index - 1);
      else if (e.key === 'ArrowRight' && current.length > 1) show(index + 1);
      else if (e.key === 'Tab') {
        /* Keep focus inside the viewer while it is open. */
        var stops = [close, prevBtn, nextBtn].filter(function (b) { return !b.hidden; });
        var at = stops.indexOf(document.activeElement);
        e.preventDefault();
        stops[(at + (e.shiftKey ? -1 : 1) + stops.length) % stops.length].focus();
      }
    });
    document.body.appendChild(viewer);
  }

  function openViewer(photos, i, from) {
    if (!viewer) buildViewer();
    current = photos;
    opener = from;
    prevBtn.hidden = nextBtn.hidden = photos.length < 2;
    show(i);
    viewer.classList.add('open');
    document.body.classList.add('locked');
    DFMedia.setBackgroundInert(true);
    viewer.querySelector('.btn-close').focus();
  }

  /* ── Load ── */
  function findProject(projects) {
    /* Links to projects that share a web address name (or have none) carry
       the project's position as "n" so each card opens its own gallery. */
    if (params.has('n')) {
      var byIndex = projects[parseInt(params.get('n'), 10)];
      if (byIndex && text(byIndex.slug) === slug) return byIndex;
    }
    if (!slug) return null;
    return projects.find(function (p) { return text(p.slug) === slug; }) || null;
  }

  DF.loadJSON('/content/photos.json').then(function (data) {
    var projects = DF.list(data.projects);
    if (!galleryMode) { renderList(projects); return; }

    var project = findProject(projects);
    if (project) renderGallery(project);
    else renderNotFound();
  }).catch(function () {
    if (galleryMode) {
      head.replaceChildren(backLink(), el('div', { className: 'gallery-head' }, el('h1', { className: 'page-title', textContent: 'Stills' })));
    } else {
      listHead();
    }
    DF.showMessage(body, DF.LOAD_ERROR);
  });
})();
