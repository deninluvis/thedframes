/* D-frames — about page. Requires site.js. */
(function () {
  'use strict';

  var el = DF.el, text = DF.text;
  var grid = document.getElementById('aboutGrid');
  var bio = document.getElementById('aboutBio');

  DF.loadJSON('/content/about.json').then(function (about) {
    var portrait = text(about.portrait);
    var slot = document.getElementById('aboutPortrait');
    if (portrait) {
      slot.appendChild(el('img', { src: portrait, alt: text(about.portraitAlt) || 'Amal Davis' }));
      slot.hidden = false;
      grid.classList.remove('no-portrait');   // the page starts text-only so nothing jumps
    }

    /* The first sentence of the headline takes the accent colour. */
    var headline = text(about.headline);
    var heading = document.getElementById('aboutHeadline');
    var split = headline.indexOf('. ');
    if (split === -1) {
      heading.textContent = headline;
    } else {
      heading.replaceChildren(
        el('em', { textContent: headline.slice(0, split + 1) }),
        document.createTextNode(headline.slice(split + 1)));
    }
    heading.hidden = !headline;

    bio.replaceChildren.apply(bio, DF.paragraphs(about.bio).map(function (p) {
      return el('p', { textContent: p });
    }));
  }).catch(function () {
    document.getElementById('aboutHeadline').hidden = true;
    DF.showMessage(bio, DF.LOAD_ERROR);
  });

  DF.site.then(function (site) {
    if (!site) return;
    var hello = document.getElementById('aboutHello');
    var email = text(site.email), instagram = DF.link(site.instagram), youtube = DF.link(site.youtube);
    if (email) hello.appendChild(el('a', { className: 'mail', href: 'mailto:' + email, textContent: email }));
    if (instagram) hello.appendChild(el('a', { className: 'link', href: instagram, target: '_blank', rel: 'noopener', textContent: 'Instagram ↗' }));
    if (youtube) hello.appendChild(el('a', { className: 'link', href: youtube, target: '_blank', rel: 'noopener', textContent: 'YouTube ↗' }));
  });
})();
