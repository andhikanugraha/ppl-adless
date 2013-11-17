var self = require('sdk/self'),
    widget = require('sdk/widget'),
    ss = require("sdk/simple-storage");

var data = self.data;

//list filter
if (!ss.storage.inited) {
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

  ss.storage.inited = true;
}
else if (!ss.storage.arrayFilter) {
  ss.storage.arrayFilter = [];
}
 
// Construct a panel, loading its content from the "text-entry.html"
// file in the "data" directory, and loading the "get-text.js" script
// into it.
var text_entry = require("sdk/panel").Panel({
  width: 500,
  height: 430,
  contentURL: data.url("html/text-entry.html"),
  contentScriptFile: [data.url("js/jquery.js"), data.url("js/get-text.js")]
});
 
// Create a widget, and attach the panel to it, so the panel is
// shown when the user clicks the widget.
widget.Widget({
  label: "SusBlocker",
  id: "susblocker",
  contentURL: "http://www.mozilla.org/favicon.ico",
  panel: text_entry
});
 
// When the panel is displayed it generated an event called
// "show": we will listen for that event and when it happens,
// send our own "show" event to the panel's script, so the
// script can prepare the panel for display.
text_entry.on("show", function() {
  text_entry.port.emit("show", ss);
});
 
// Listen for messages called "text-entered" coming from
// the content script. The message payload is the text the user
// entered.
// In this implementation we'll just log the text to the console.
text_entry.port.on("text-entered", function (text) {
  console.log(text);
  ss.storage.arrayFilter = text.split('\n');
  text_entry.hide();
});
