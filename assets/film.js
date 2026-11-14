/* D-frames — film page. Requires site.js and media.js. */
(function () {
  'use strict';

  var grid = document.getElementById('filmGrid');

  DF.loadJSON('/content/film.json').then(function (data) {
    var items = DF.list(data.items);
    if (!items.length) { DF.showMessage(grid, DF.EMPTY); return; }
    grid.replaceChildren.apply(grid, items.map(function (item) { return DFMedia.filmCard(item); }));
  }).catch(function () { DF.showMessage(grid, DF.LOAD_ERROR); });
})();
