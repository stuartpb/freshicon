// freshicon.js Copyright 2015 Stuart P. Bentley.
// This work may be used freely as long as this notice is included.
// The work is provided "as is" without warranty, express or implied.

(function(){

var headLinks = (document.head || document.getElementsByTagName('head')[0])
  .getElementsByTagName('link');
var isIconRel = /^(shortcut |apple-touch-)?icon$/;

var now = new Date();

var cacheBusterParam = '_now=' + now.getTime();
function cacheBustedUrl(url) {
  return url + (~url.indexOf('?') ? '&' : '?') + cacheBusterParam;
}

function cacheBustAllIcons() {
  var iconLinkCount = 0;

  // Update href attributes for all icon link elements
  for (var i = 0; i < headLinks.length; i++) {
    var link = headLinks[i];
    if (isIconRel.test(link.rel)) {
      iconLinkCount++;
      link.href = cacheBustedUrl(link.href);
    }
  }

  // if this page has no icon link elements
  if (iconLinkCount == 0) {
    // add a cache-busting link to /favicon.ico
    var faviconIcoLink = document.createElement('link');
    faviconIcoLink.rel = 'shortcut icon';
    faviconIcoLink.href = cacheBustedUrl('/favicon.ico');
  }
}

// If we're going to be making an icon check later,
// determine our parameters for checking
if (window.XMLHttpRequest) {
  var checkLink = null;

  // For all icon link elements from the bottom of <head> to the top
  for (var i = headLinks.length-1; i>=0; i--) {
    var link = headLinks[i];
    if (isIconRel.test(link.rel)) {

      // if this is the last <link> in <head> with our sentinel attribute
      if (link.getAttribute('data-freshicon-check') !== null) {

        // we got a winner, stop searching
        checkLink = link;
        break;

      // otherwise we prefer the earliest link with the shortest rel
      } else if (!checkLink || link.rel.length <= checkLink.rel.length) {
        checkLink = link;
      }
    }
  }

  var checkUrl;
  var checkLimit = null, lastCheck = null, nextCheck = null;

  // If we have a link to check, use it, otherwise fall back to /favicon.ico
  if (checkLink) {
    checkUrl = checkLink.href;
    checkLimit = parseInt(
      checkLink.getAttribute('data-freshicon-check'), 10) * 1000;
  } else {
    checkUrl = '/favicon.ico';
  }

  // If we have local storage support, get request restrictions
  if (window.localStorage) {
    var lastCheckKey = 'freshicon last check ' + checkUrl;
    lastCheck = localStorage.getItem(lastCheckKey);
    lastCheck = lastCheck && new Date(lastCheck);
    var nextCheckKey = 'freshicon next check ' + checkUrl;
    nextCheck = localStorage.getItem(nextCheckKey);
    nextCheck = nextCheck && new Date(nextCheck);
  }
}

function checkIcon() {
  var xhr = new XMLHttpRequest();
  function updateFaviconState() {
    var lastETag = null, lastMod = null;

    // If we have local storage support, get previously-noted cache vars
    if (window.localStorage) {
      var lastETagKey = 'freshicon last etag ' + checkUrl;
      lastETag = localStorage.getItem(lastETagKey);
      var lastModKey = 'freshicon last modified ' + checkUrl;
      lastMod = localStorage.getItem(lastModKey);
    }

    var thisETag = xhr.getResponseHeader('ETag');
    var thisLastMod = xhr.getResponseHeader('Last-Modified');
    var shouldNextCheck = xhr.getResponseHeader('Expires');

    // If the data we have doesn't suggest the icon is unchanged
    if (!(lastETag && thisETag ? lastETag == thisETag :
      lastMod && thisLastMod == lastMod)) {

      // Ensure we have the newest icon
      cacheBustAllIcons();
    }

    if (window.localStorage) {
      // Save results of this check for next check
      if (thisETag) localStorage.setItem(lastETagKey, thisETag);
      else localStorage.removeItem(lastETagKey);
      if (thisLastMod) localStorage.setItem(lastModKey, thisLastMod);
      else localStorage.removeItem(lastModKey);
      if (shouldNextCheck) localStorage.setItem(nextCheckKey, shouldNextCheck);
      else localStorage.removeItem(shouldNextCheck);
      localStorage.setItem(lastCheckKey, new Date());
    }
  }
  xhr.open('HEAD', cacheBustedUrl(checkUrl), true);
  xhr.onreadystatechange = function(evt) {
    if (xhr.readyState == 4) return updateFaviconState();
  };
  xhr.send();
}

// If we're capable of checking icons
if (window.XMLHttpRequest) {
  // If we're past the locally-set or remotely-requested cache check limit
  if (checkLimit ? (lastCheck ? lastCheck + checkLimit <= now : true)
    : nextCheck ? nextCheck <= now : true) {

    // Check to see if the icon has updated
    checkIcon();
  }

// If we don't have XHR
} else {
  // Cache bust every time
  cacheBustAllIcons();
}

})();
