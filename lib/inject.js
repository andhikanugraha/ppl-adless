var pageMod = require('sdk/page-mod'),
    self = require('sdk/self'),
    ss = require("sdk/simple-storage");

// Call this function to inject our script to the pages
function injectBlocker(url) {
  pageMod.PageMod({
    include: url || '*',
    contentScriptFile: [self.data.url('js/jquery.js'), self.data.url('js/insert.js')],
    contentScriptOptions: {
      patterns: ss.storage.arrayFilter
    },
    contentScriptWhen: 'ready'
  });
}

injectBlocker('*');