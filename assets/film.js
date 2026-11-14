/* D-frames — film page. Requires site.js and media.js. */
(function () {
  'use strict';

  var grid = document.getElementById('filmGrid');

  DF.loadJSON('/content/film.json').then(function (data) {
    var items = Array.isArray(data.items) ? data.items : [];
    if (!items.length) { DF.showMessage(grid, DF.EMPTY); return; }
    grid.replaceChildren.apply(grid, items.map(DFMedia.filmCard));
  }).catch(function () { DF.showMessage(grid, DF.LOAD_ERROR); });
})();
