# freshicon

Drop-in script to bust favicon caches on an as-needed basis.

## This doesn't actually work

I wrote this whole library under the impression that this is what it took to refresh favicons in Google Chrome. However, it turns out that this only works for the first five minutes or so, until the icon gets [irretrievably lost in Chrome's history synchronization](https://code.google.com/p/chromium/issues/detail?id=440322#c6).

So, basically, this script does nothing. However, the live demo is still a useful test of your browser's favicon refreshing ability, as it cycles to a new favicon at the same URL every minute.

[Live demo](http://tilde.works/~spb/freshicon/index.html)

## Background

Browsers don't cache icons the way they cache other resources. Instead of
actually requesting a page's icon, they check if the URL has changed, and if
it hasn't, they don't bother checking to see if there's a new version.

In some ways, this is a useful behavior (in that it reduces the number of
unnecessary requests to your server), but in others, it's pretty lousy. It
makes it so, if you change your site's favicon, you have to change the icon's
URL if you want old visitors to see the new icon without having to clear their
cache and restart their browser. That means you have to have ugly query strings
unnecessarily cluttering up your HTML for no particularly good reason.

What browsers *should* do is make a lightweight HEAD request to determine if
the icon has changed (using existing caching mechanisms like ETag), and update
if so.

That is what this script does.

## Dependencies

The only hard dependency this script has is that your server can handle a query
string parameter like '?_now=1433441550731' at the end of requests for your
icon files (the way pretty much every file server ever written will).

To avoid busting the cache when the page's icon has *not* changed, this script
has a few additional conditions that shouldn't be a problem for 95% of use
cases:

- The server must serve ETag or Last-Modified headers for files in response to
  HEAD requests for the checked icon.
- If the server is on a different domain, the server must also respond to HEAD
  requests with a matching [`Access-Control-Allow-Origin` CORS header][cors]
  (as well as an `Access-Control-Expose-Headers` exposing `ETag`, if the
  server does not respond with a usable `Last-Modified` header.)
- localStorage and XMLHttpRequest must be available on `window` (either native
  or [polyfilled][polyfills]).

[polyfills]: https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-Browser-Polyfills#web-storage-localstorage-and-sessionstorage
[cors]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS#Access-Control-Allow-Origin

## Configuring

By default, freshicon will check the first-listed `href` for a `link` with
`"icon"`, `"shortcut icon"`, or `"apple-touch-icon"` (in that order of
precedence) as its `rel` in the `<head>` (or `/favicon.ico`, if no icons are
listed) for changes every time the page is loaded. To override this, you may
add a `data-freshicon-check` attribute to a `<link>` element specifying the
file you wish to use for checking in your document's `<head>`, optionally
giving it a minimum duration in seconds to wait between checks.

For example, this HTML will set freshicon to check "/favicon-16x16px.png" for
changes at most once a day:

```html
<!DOCTYPE html>
<html>
  <head>
    <!-- ...snip... -->
    <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32">
    <link rel="icon" type="image/png" href="/android-chrome-192x192.png" sizes="192x192">
    <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96">
    <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16" data-freshicon-check="86400">
    <!-- ...snip... -->
  </head>
  <body>
    <!-- ...snip... -->
    <script src="/freshicon.js"></script>
  </body>
</html>
```

## Caveats

freshicon forces a refresh by changing the URL of all icon links in the event
that the icon has changed. This means that, the next time the page is loaded
and the icon hasn't changed, the icon will be requested *again* with the
original URL. If you need to avoid this double-request, you're better off
using actual URL changes hard-coded into the HTML.

# [License in Three Lines ![(LITL)](https://litl-license.org/logo.svg)][LITL]

[LITL]: https://litl-license.org

Copyright 2015 Stuart P. Bentley.<br>
This work may be used freely as long as this notice is included.<br>
The work is provided "as is" without warranty, express or implied.
