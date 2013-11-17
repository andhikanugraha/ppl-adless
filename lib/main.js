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
var patterns = [];

// Call this function to inject our script to the pages
function injectBlocker(include) {
  pageMod.PageMod({
    include: include || '*',
    contentScript: [self.data.url('js/jquery.js'), self.data.url('js/insert.js')],
    onAttach: function(worker) {
      worker.port.on('ready', function() {
        worker.port.emit('loadPatterns', patterns);
      });
    }
  });
}



var data = require("sdk/self").data;
 
// Construct a panel, loading its content from the "text-entry.html"
// file in the "data" directory, and loading the "get-text.js" script
// into it.
var text_entry = require("sdk/panel").Panel({
  width: 212,
  height: 200,
  contentURL: data.url("html/text-entry.html"),
  contentScriptFile: data.url("js/get-text.js")
});
 
// Create a widget, and attach the panel to it, so the panel is
// shown when the user clicks the widget.
require("sdk/widget").Widget({
  label: "Text entry",
  id: "text-entry",
  contentURL: "http://www.mozilla.org/favicon.ico",
  panel: text_entry
});
 
// When the panel is displayed it generated an event called
// "show": we will listen for that event and when it happens,
// send our own "show" event to the panel's script, so the
// script can prepare the panel for display.
text_entry.on("show", function() {
  text_entry.port.emit("show");
});
 
// Listen for messages called "text-entered" coming from
// the content script. The message payload is the text the user
// entered.
// In this implementation we'll just log the text to the console.
text_entry.port.on("text-entered", function (text) {
  console.log(text);
  text_entry.hide();
});
