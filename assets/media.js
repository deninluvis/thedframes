/* D-frames — project cards, film cards and the film player.
   Shared by the Home, Photos and Film pages. Requires site.js. */
(function () {
  'use strict';

  var el = DF.el, text = DF.text;

  /* A photo project: wide thumbnail, title, "place · date". */
  function projectCard(project) {
    project = project || {};
    var title = text(project.title);
    var cover = text(project.coverImage);
    var meta = DF.metaLine(project.place, project.date);

    var pic = el('div', { className: 'pic' });
    if (cover) {
      pic.appendChild(el('img', { src: cover, alt: text(project.coverAlt) || title, loading: 'lazy' }));
    }

    return el('a', { className: 'still', href: '/photos.html?project=' + encodeURIComponent(text(project.slug)) },
      pic,
      el('div', { className: 'cap' },
        el('strong', { textContent: title }),
        meta ? el('span', { className: 'meta', textContent: meta }) : null));
  }

  /* A film: 16:9 thumbnail (a play button when the film can be played),
     then title, "category · year" and description. */
  function filmCard(item) {
    item = item || {};
    var title = text(item.title);
    var thumb = text(item.thumbnail);
    var length = text(item.timestamp);
    var meta = DF.metaLine(item.category, item.year);
    var description = text(item.description);
    var playable = DF.isYouTubeId(item.videoId);

    var pic = playable
      ? el('button', { type: 'button', className: 'pic', 'aria-label': 'Play film: ' + title })
      : el('div', { className: 'pic' });

    if (thumb) pic.appendChild(el('img', { src: thumb, alt: playable ? '' : (text(item.alt) || title), loading: 'lazy' }));
    if (length) pic.appendChild(el('span', { className: 'tc', textContent: length }));
    if (playable) {
      pic.appendChild(el('span', { className: 'play', 'aria-hidden': 'true' }, el('i', null, '▶'), 'Play film'));
      pic.addEventListener('click', function () { openVideo(item.videoId, title, pic); });
    }

    return el('div', { className: 'film' },
      pic,
      el('div', { className: 'cap' },
        el('strong', { textContent: title }),
        meta ? el('span', { className: 'meta', textContent: meta }) : null),
      description ? el('p', { className: 'film-desc', textContent: description }) : null);
  }

  /* ── Film player overlay ── */
  var overlay, player, opener;

  /* While the player is open, the page behind it cannot be clicked or tabbed into. */
  function setBackgroundInert(on) {
    document.querySelectorAll('body > nav, body > main, body > footer').forEach(function (part) { part.inert = on; });
  }

  function closeVideo() {
    if (!overlay || !overlay.classList.contains('open')) return;
    overlay.classList.remove('open');
    player.replaceChildren();               // removing the iframe stops playback
    document.body.classList.remove('locked');
    setBackgroundInert(false);
    if (opener && opener.focus) opener.focus();
    opener = null;
  }

  function buildOverlay() {
    var close = el('button', { type: 'button', className: 'btn-close', 'aria-label': 'Close', textContent: 'Close ✕' });
    player = el('div', { className: 'player' });
    overlay = el('div', { className: 'overlay video', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Film player' }, close, player);
    close.addEventListener('click', closeVideo);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeVideo(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeVideo(); });
    document.body.appendChild(overlay);
  }

  function openVideo(videoId, title, from) {
    if (!DF.isYouTubeId(videoId)) return;
    if (!overlay) buildOverlay();
    opener = from || document.activeElement;

    var frame = el('iframe', {
      src: 'https://www.youtube-nocookie.com/embed/' + videoId + '?autoplay=1&rel=0',
      title: text(title) || 'Film',
      allow: 'autoplay; encrypted-media; fullscreen',
      allowFullscreen: true
    });
    player.replaceChildren(frame);
    overlay.classList.add('open');
    document.body.classList.add('locked');
    setBackgroundInert(true);
    overlay.querySelector('.btn-close').focus();
  }

  window.DFMedia = { projectCard: projectCard, filmCard: filmCard, openVideo: openVideo };
})();
