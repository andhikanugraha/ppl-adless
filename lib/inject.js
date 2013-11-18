var pageMod = require('sdk/page-mod'),
    self = require('sdk/self'),
    ss = require("sdk/simple-storage"),
    events = require("sdk/system/events");

var { Ci, components } = require("chrome");

var mods = [];
var parsedRules = [];

var parseRule = function(string) {
  string = string.replace(/([.+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  string = string.replace(/[*]/g, '.*');
  string = string.replace(/^\|\|(.*)$/, '^$1$');
  string = string.replace(/^\|(.*)$/, '^$1');
  string = string.replace(/^(.*)\|$/, '$1$');

  return new RegExp(string, 'i');
}

var parseRules = function(rules) {
  var parsed = [];
  rules.forEach(function(val) {
    parsed.push(parseRule(val));
  });

  return parsed;
}

// Call this function to inject our script to the pages
var injectBlocker = exports.injectBlocker = function(url) {
  var mod = pageMod.PageMod({
    include: url || '*',
    contentScriptFile: [self.data.url('js/jquery.js'), self.data.url('js/insert.js')],
    contentScriptOptions: {
      patterns: ss.storage.arrayFilter,
      elementFilters: ss.storage.elementFilters
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
  // Parse rules
  parsedRules = parseRules(ss.storage.arrayFilter);

  // Load list of sites to mod from storage
  var sites = ss.storage.arraySites;

  sites.forEach(function(val) {
    if (val.match('://') || val.match(/^\*\./))
      injectBlocker(val);
    else
      injectBlocker('*.' + val);
  });

  // Use http filtering?
  // var httpListener = function(event) {
  //   var channel = event.subject.QueryInterface(Ci.nsIHttpChannel);
  //   var url = event.subject.URI.spec;
  //   console.log('http listening ' + url);

  //   parsedRules.forEach(function(rx) {
  //     if (rx.test(url)) {
  //       console.log('caught');
  //       event.subject.cancel(components.results.NS_BINDING_ABORTED);
  //     }
  //   });
  // }

  // if (ss.storage.httpFiltering)
  //   events.on('http-on-modify-request', httpListener);
  // else
  //   events.off('http-on-modify-request', httpListener);

  // console.log(components.results.NS_BINDING_ABORTED);
}

var resetBlockers = exports.resetBlockers = function() {
  destroyBlockers();
  injectBlockers();
}