/* D-frames — shared helpers, navigation highlight and footer */
(function () {
  'use strict';

  var DF = {
    LOAD_ERROR: "Couldn't load this right now.",
    EMPTY: 'New work coming soon.',

    /* Fetch a JSON file; rejects when the file is missing or malformed. */
    loadJSON: function (path) {
      return fetch(path, { cache: 'no-cache' }).then(function (res) {
        if (!res.ok) throw new Error(path + ' responded ' + res.status);
        return res.json();
      });
    },

    /* Build an element. CMS text only ever enters the page through here,
       as DOM properties or text nodes — never as HTML. */
    el: function (tag, props) {
      var node = document.createElement(tag);
      var key;
      for (key in (props || {})) {
        if (props[key] === undefined || props[key] === null) continue;
        if (key === 'role' || key.indexOf('data-') === 0 || key.indexOf('aria-') === 0) node.setAttribute(key, props[key]);
        else node[key] = props[key];
      }
      for (var i = 2; i < arguments.length; i++) {
        var child = arguments[i];
        if (child === null || child === undefined) continue;
        node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
      }
      return node;
    },

    /* "a\n\nb" -> ["a", "b"] */
    paragraphs: function (text) {
      if (typeof text !== 'string') return [];
      return text.split(/\r?\n\s*\r?\n/).map(function (p) { return p.trim(); }).filter(Boolean);
    },

    /* Join the non-empty parts with a middle dot. */
    metaLine: function () {
      return Array.prototype.slice.call(arguments)
        .map(function (p) { return typeof p === 'string' ? p.trim() : ''; })
        .filter(Boolean)
        .join(' · ');
    },

    isYouTubeId: function (id) {
      return typeof id === 'string' && /^[\w-]{11}$/.test(id);
    },

    showMessage: function (container, text) {
      container.replaceChildren(DF.el('p', { className: 'empty-note', textContent: text }));
    },

    /* Trimmed string, or '' for anything that is not a string. */
    text: function (value) {
      return typeof value === 'string' ? value.trim() : '';
    },

    /* A web link, or '' unless it starts with http:// or https://. */
    link: function (value) {
      value = DF.text(value);
      return /^https?:\/\//i.test(value) ? value : '';
    }
  };

  function highlightNav() {
    var page = document.body.dataset.page;
    document.querySelectorAll('.site-nav [data-nav]').forEach(function (link) {
      if (link.dataset.nav === page) {
        link.classList.add('on');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  function credit(label, content) {
    return DF.el('div', { className: 'credit' },
      DF.el('div', { className: 'meta', textContent: label }),
      content);
  }

  function external(label, url) {
    return DF.el('a', { href: url, target: '_blank', rel: 'noopener', textContent: label });
  }

  function renderFooter(site) {
    var footer = document.getElementById('credits');
    if (!footer) return;
    site = site || {};

    var blocks = [credit('Photographed & filmed by', DF.el('div', { textContent: 'Amal Davis' }))];

    var email = DF.text(site.email);
    if (email) {
      blocks.push(credit('Say hello',
        DF.el('div', null, DF.el('a', { href: 'mailto:' + email, textContent: email }))));
    }

    var instagram = DF.link(site.instagram);
    var youtube = DF.link(site.youtube);
    if (instagram || youtube) {
      var links = DF.el('div');
      if (instagram) links.appendChild(external('Instagram', instagram));
      if (instagram && youtube) links.appendChild(document.createTextNode(' · '));
      if (youtube) links.appendChild(external('YouTube', youtube));
      blocks.push(credit('Elsewhere', links));
    }

    blocks.push(DF.el('p', { className: 'meta copyright', textContent: '© ' + new Date().getFullYear() + ' D-frames' }));
    footer.replaceChildren.apply(footer, blocks);
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = DF;

  if (typeof document !== 'undefined') {
    window.DF = DF;
    /* Shared so the About page can reuse the same request. */
    DF.site = DF.loadJSON('/content/site.json').catch(function () { return null; });

    var start = function () {
      highlightNav();
      DF.site.then(renderFooter);
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();
  }
})();
