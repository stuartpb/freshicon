# freshicon

Drop-in script to bust favicon caches on an as-needed basis.

[Live demo](http://tilde.works/~spb/freshicon/index.html)

## Dependencies

- A server that serves ETag or Last-Modified headers for files in response to
  HEAD requests.
- A server that can handle a query string like '?_now=1433441550731' at the end
  of a request for a static file.
- localStorage and XMLHttpRequest support in-browser (either native or
  [polyfilled][1]).

[1]: https://github.com/inexorabletash/polyfill/blob/master/obsolete/storage.js

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
