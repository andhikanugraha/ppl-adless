var pageMod = require('sdk/page-mod'),
    self = require('sdk/self'),
    ss = require("sdk/simple-storage");

var mods = [];

// Call this function to inject our script to the pages
var injectBlocker = exports.injectBlocker = function(url) {
  var mod = pageMod.PageMod({
    include: url || '*',
    contentScriptFile: [self.data.url('js/jquery.js'), self.data.url('js/insert.js')],
    contentScriptOptions: {
      patterns: ss.storage.arrayFilter
    },
    contentScriptWhen: 'ready',
    onAttach: function(worker) {
      workers.push(worker);
    }
  });

  mods.push(mod);
}

var destroyBlockers = exports.destroyBlockers = function() {
  mods.forEach(function(mod, i) {
    mod.destroy();
    delete mods[i];
  });
}

var injectBlockers = exports.injectBlockers = function() {
  // TODO load list of sites from storage
  injectBlocker('*');
}

var resetBlockers = exports.resetBlockers = function() {
  destroyBlockers();
  injectBlockers();
}