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
    'googlesyndication.com',
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
    'zamzar.com',
    'detik.com'
  ];

  ss.storage.elementFilters = [
    '.banner_reg',
    '#skinad',
    '#otp_banner'
  ];

  ss.storage.httpFiltering = true;
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
  height: 435,
  contentURL: data.url("html/text-entry.html"),
  contentScriptFile: [data.url("js/jquery.js"), data.url("js/get-text.js")]
});

var loadIntoPanel = function() {
  text_entry.port.emit("show", {
    filters: ss.storage.arrayFilter.join('\n'),
    sites: ss.storage.arraySites.join(','),
    elementFilters: ss.storage.elementFilters.join('\n '),
    http: ss.storage.httpFiltering ? true : false
  });
}

// Load data into panel
text_entry.on("show", loadIntoPanel);

// Listen for updates from panel
text_entry.port.on("text-entered", function (data) {

  var filters = data.filters.split('\n');
  var elementFilters = data.elementFilters.split('\n');
  var sites = data.sites.split(',');

  ss.storage.arrayFilter = [];
  ss.storage.elementFilters = [];
  ss.storage.arraySites = [];

  filters.forEach(function(val) {
    var trimmed = val.trim();
    if (trimmed)
      ss.storage.arrayFilter.push(trimmed);
  });
  elementFilters.forEach(function(val) {
    var trimmed = val.trim();
    if (trimmed)
      ss.storage.elementFilters.push(trimmed);
  });
  sites.forEach(function(val) {
    var trimmed = val.trim();
    if (trimmed)
      ss.storage.arraySites.push(trimmed);
  });

  ss.storage.httpFiltering = data.http;

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
  contentURL: data.url('img/icon.ico'),
  panel: text_entry
});