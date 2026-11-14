/* D-frames — home page. Requires site.js and media.js. */
(function () {
  'use strict';

  var text = DF.text;

  function setLine(id, value) {
    var node = document.getElementById(id);
    value = text(value);
    node.textContent = value;
    node.hidden = !value;
  }

  /* Opening frame: the bundled stock photo until an image is uploaded in the CMS. */
  DF.loadJSON('/content/home.json').then(function (home) {
    setLine('heroRole', home.roleLine);
    setLine('heroTagline', home.tagline);

    var image = text(home.heroImage);
    if (!image) return;                       // keep the stock photo and its note

    var title = text(home.heroTitle);
    var img = document.getElementById('heroImg');
    img.src = image;
    img.alt = text(home.heroAlt) || title;
    setLine('heroNote', title);               // the title replaces "Stock photo"
  }).catch(function () {
    /* Leave the stock opening as it is. */
  });

  /* Fill a section with the first `count` items, or a quiet message. */
  function fill(container, items, count, build, wrap) {
    items = (Array.isArray(items) ? items : []).slice(0, count);
    if (!items.length) { DF.showMessage(container, DF.EMPTY); return; }
    container.replaceChildren();
    wrap(container, items.map(build));
  }

  var stills = document.getElementById('homeStills');
  DF.loadJSON('/content/photos.json').then(function (data) {
    fill(stills, data.projects, 3, DFMedia.projectCard, function (box, cards) {
      box.appendChild(cards[0]);              // first project runs full width
      if (cards.length > 1) {
        var row = DF.el('div', { className: 'stills two' });
        cards.slice(1).forEach(function (card) { row.appendChild(card); });
        box.appendChild(row);
      }
    });
  }).catch(function () { DF.showMessage(stills, DF.LOAD_ERROR); });

  var films = document.getElementById('homeFilms');
  DF.loadJSON('/content/film.json').then(function (data) {
    fill(films, data.items, 2, DFMedia.filmCard, function (box, cards) {
      cards.forEach(function (card) { box.appendChild(card); });
    });
  }).catch(function () { DF.showMessage(films, DF.LOAD_ERROR); });
})();
