var loadPatterns = function(pts) {
  var patterns = [];

  pts.forEach(function(val) {
    patterns.push(new RegExp(val));
  });

  console.log(pts);
  console.log(patterns);

  // Handle per ad type

  // Images, iframes, scripts
  $('img, iframe, script, embed').each(function() {
    var el = $(this);
    var parent = $(el.parent());
    console.log(this.src);

    patterns.forEach(function(rx) {
      if (rx.exec(el.prop('src'))) {
        console.log('Found one: ' + rx.exec(el.prop('src')) );
        el.remove();
        if (parent.children().length == 0)
          parent.remove();
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

  // Links
  // $('a').each(function() {
  //   var el = $(this);
  //   var parent = $(el.parent());

  //   patterns.forEach(function(rx) {
  //     if (rx.exec(el.prop('href'))) {
  //       console.log('Found one: ' + rx.exec(el.prop('href')) );
  //       el.remove();
  //       if (parent.children().length == 0)
  //         parent.remove();
  //     }
  //   });
  // });

  $('.banner_reg, #skinad, #otp_banner').remove();
};

loadPatterns(self.options.patterns);