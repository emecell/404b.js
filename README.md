404b Bookmarklet
=======
404b is a bookmarklet that attempts to request all links on a given page to verify that they load correctly.

It uses `document.links` to obtain the list of links on a page and either issues a `XMLHttpRequest` for same domain links or creates a `link` element to verify that the link works.

This bookmarklet is only tested on *Chrome* right now.

Initial design is based off of (WTFramework)[http://oskarkrawczyk.github.com/wtframework/) bookmarklet.


Installation:
-------------
Drag [404b](javascript:(function(){s=document.createElement('script');s.type='text/javascript';s.src='https://raw.github.com/rlaw/404b.js/master/dist/404b.min.js?v='+parseInt(Math.random()*99999999);document.body.appendChild(s);})();) to your bookmarks bar.


Authors
-------
+ [Robert Law](http://www.github.com/rlaw)


Copyright and License
---------------------
Copyright (c) 2013 Robert Law

See `LICENSE` file.