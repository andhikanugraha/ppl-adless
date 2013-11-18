var self = require('sdk/self'),
    widget = require('sdk/widget'),
    ss = require("sdk/simple-storage");

var inject = require('./inject');

var data = self.data;

var setDefaults = function() {
  ss.storage.arrayFilter = [
    'ad.doubleclick.net',
    'adclick.g.doubleclick.net',
    'googleads.g.doubleclick.net',
    'googleadservices.com',
    'a.tribalfusion.com',
    'cdnx.tribalfusion.com/media',
    'go.game321.com',
    'mgid.com',
    'the3dgame.com',
    'funnymama.com',
    'cdn.fastclick.net',
    'media.fastclick.net',
    '//ad.',
    '/ad/',
    '/banner/',
    '/banners/',
    '//newopenx.',
    '//openx.'
  ];

  ss.storage.arraySites = [
    'mangafox.com',
    'mangareader.net',
    'youtube.com',
    'ebook3000.com',
    'tripadvisor.com',
    'kulinerbdg.com',
    'sourceforge.net',
    'beemp3s.org',
    'gamasutra.com',
    'zamzar.com'
  ];
}

//list filter
if (!ss.storage.inited) {
  setDefaults();
  ss.storage.inited = true;
}
else if (!ss.storage.arrayFilter) {
  ss.storage.arrayFilter = [];
}
 
// Panel
var text_entry = require("sdk/panel").Panel({
  width: 600,
  height: 375,
  contentURL: data.url("html/text-entry.html"),
  contentScriptFile: [data.url("js/jquery.js"), data.url("js/get-text.js")]
});

var loadIntoPanel = function() {
  text_entry.port.emit("show", {
    filters: ss.storage.arrayFilter.join('\n'),
    sites: ss.storage.arraySites.join('\n')
  });
}

// Load data into panel
text_entry.on("show", loadIntoPanel);

// Listen for updates from panel
text_entry.port.on("text-entered", function (text) {
  console.log(text.split('\n'));
  var split = text.split('\n');
  ss.storage.arrayFilter = [];
  split.forEach(function(val) {
    var trimmed = val.trim();
    if (trimmed != '')
      ss.storage.arrayFilter.push(trimmed);
  });

  // Refresh panel contents
  loadIntoPanel();
  text_entry.hide();
  inject.resetBlockers();
});

// For default settings
text_entry.port.on('load-defaults', function() {
  setDefaults();
  loadIntoPanel();
})
 
// Create widget and attach panel
widget.Widget({
  label: "SusBlocker",
  id: "susblocker",
  contentURL: "http://www.mozilla.org/favicon.ico",
  panel: text_entry
});