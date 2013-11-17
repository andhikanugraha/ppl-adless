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
 
// Fill this array with regex strings of patterns to remove ads.
var patterns = ['googlesyndication.com', 'doubleclick.net', '//ad.', '/ad/', '/banner/', '/banners/'];

// Call this function to inject our script to the pages
function injectBlocker(url) {
  pageMod.PageMod({
    include: url || '*',
    contentScriptFile: [self.data.url('js/jquery.js'), self.data.url('js/insert.js')],
    contentScriptOptions: {
      patterns: patterns
    },
    contentScriptWhen: 'ready'
  });
}

injectBlocker('*');