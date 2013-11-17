/*
SusBlocker
Main JS file
---

1. Handle add-on settings management
2. Handle add-on execution on-the-page
*/

// Import the page-mod API
var pageMod = require('sdk/page-mod'),
    self = require('sdk/self');
 
// Call this function to inject our script to the pages
function injectBlocker(include) {
  pageMod.PageMod({
    include: include || '*',
    contentScript: [self.data.url('js/jquery.js'), self.data.url('js/insert.js')]
  });
}
