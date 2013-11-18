/*
SusBlocker
Main JS file
---

1. Handle add-on settings management
2. Handle add-on execution on-the-page
*/

// Load the widget module. This module handles the widget for the addon.
var widget = require('./widget');

// Load the injection module. This module handles the injection to hide ads on pages.
var inject = require('./inject');

inject.injectBlockers();