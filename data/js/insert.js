var loadPatterns = function(pts, els) {
  var patterns = [];

  var parseRule = function(string) {
    // console.log('before: ' + string);
    string = string.replace(/([.+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    string = string.replace(/[*]/g, '.*');
    string = string.replace(/^\|\|(.*)$/, '^$1$');
    string = string.replace(/^\|(.*)$/, '^$1');
    string = string.replace(/^(.*)\|$/, '$1$');

    // console.log('after: ' + string);

    return new RegExp(string, 'i');
  }

  pts.forEach(function(val) {
    patterns.push(parseRule(val));
  });

  // console.log(pts);
  // console.log(patterns);

  var remove = function(elm) {
    var el = $(elm);
    var parents = el.parents();
    el.remove();

    parents.each(function() {
      remove(this);
    });
  }

  // Handle per ad type

  // Images, iframes, scripts
  $('img, iframe, script, embed').each(function() {
    var el = $(this);
    // console.log(this.src);

    patterns.forEach(function(rx) {
      if (rx.exec(el.prop('src'))) {
        // console.log('Found one: ' + rx.exec(el.prop('src')) );
        remove(el);
      }
    });
  });

  // Background images
  $('html, body, div, section, article, nav, header, footer').each(function() {
    var el = $(this);

    patterns.forEach(function(rx) {
      if (el.css('background-image').match(rx)) {
        el.css('background-image', 'none');
      }
    }, el);
  });

  els.forEach(function(val) {
    remove($(val));
  });
};

loadPatterns(self.options.patterns, self.options.elementFilters);