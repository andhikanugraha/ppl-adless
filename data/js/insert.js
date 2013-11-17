$.noConflict();
jQuery( document ).ready(function( $ ) {
// Code that uses jQuery's $ can follow here.

function loadPatterns(pts) {
  var patterns = [];

  pts.forEach(function(val) {
    patterns.push(new RegExp(val));
  });

  // Handle per ad type

  // Images
  $('img, iframe').each(function() {
    el = $(this);

    patterns.forEach(function(rx) {
      if (this.attr('src').match(rx)) {
        this.css('visibility', 'hidden');
      }
    }, el);
  });

  // Background images
  $('html, body, div, section, article, nav, header, footer').each(function() {
    el = $(this);

    patterns.forEach(function(rx) {
      if (this.css('background-image').match(rx)) {
        this.css('background-image', 'none');
      }
    }, el);
  })
}

});
// Code that uses other library's $ can follow here.