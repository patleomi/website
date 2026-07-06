(function () {
    'use strict';

    var page = (document.body && document.body.getAttribute('data-page')) || '';

    // --- Page registry -----------------------------------------------------
    // parent = used to light up the active "trail" in the nav.
    // short  = optional shorter label for breadcrumbs.
    var PAGES = {
        home:           { href: 'index.html',          label: 'Home' },
        test:           { href: 'test.html',          label: 'Test Your Knowledge' },
	connect:        { href: 'connect.html',          label: 'Connect' },
        about:          { href: 'about.html',          label: 'Who I Am' },
        journey:        { href: 'journey.html',        label: 'How I Got Here', parent: 'about' },
        services:       { href: 'services.html',       label: 'What I Offer' },
        philosophy:     { href: 'philosophy.html',     label: 'How I Coach', parent: 'services' },
        approach:       { href: 'approach.html',       label: 'How I Teach AI (With Examples)', short: 'How I Teach AI', parent: 'services' },
        project_recipe: { href: 'project_recipe.html', label: 'Project Instructions', parent: 'approach' },
        prompt_resumes: { href: 'prompt_resumes.html', label: 'Prompt Design', parent: 'approach' },
        blog:           { href: 'blog.html',           label: 'What I\'m Thinking About' },
        privacy:        { href: 'privacy.html',        label: 'Privacy' }
    };

    // Breadcrumb chains. Default is Home -> this page; deep pages get two levels.
    var CRUMBS = {
	journey: ['home', 'about', 'journey'],
	philosophy: ['home', 'services', 'philosophy'],
	approach: ['home', 'services', 'approach'],
        project_recipe: ['home', 'services', 'approach', 'project_recipe'],
        prompt_resumes: ['home', 'services', 'approach', 'prompt_resumes'],
    };

    // Full ancestor chain (for highlighting the active trail in the nav).
    function trailKeys(key) {
        var chain = [], k = key;
        while (k && PAGES[k]) { chain.unshift(k); k = PAGES[k].parent; }
        return chain;
    }
    var activeTrail = trailKeys(page); // e.g. ['services','approach','project_recipe']

    function fileOf(href) { return href.split('#')[0]; }

    // --- Header / nav ------------------------------------------------------
    var navHTML =
    '<header class="site-header">' +
      '<div class="container nav-row">' +
        '<a class="brand" href="index.html"><img src="assets/images/site-icon-green.png" alt="" width="28" height="28"/><span>Pat <em>Leomi</em></span></a>' +
        '<nav class="site-nav" aria-label="Primary">' +
          '<ul>' +
            '<li><a href="index.html">Home</a></li>' +
            '<li><a href="test.html">Test Your Knowledge</a></li>' +
	    '<li class="has-sub">' +
  		'<a href="about.html" aria-haspopup="true" aria-expanded="false">Who I Am<span class="caret" aria-hidden="true"></span></a>' +
  		'<ul class="sub">' +
    			'<li><a href="about.html">Who I Am</a></li>' +
   			'<li><a href="journey.html">How I Got Here</a></li>' +
  		'</ul>' +
	    '</li>' +
            '<li class="has-sub">' +
              '<a href="services.html" aria-haspopup="true" aria-expanded="false">What I Offer<span class="caret" aria-hidden="true"></span></a>' +
              '<ul class="sub">' +
                '<li><a href="services.html">What I Offer</a></li>' +
                '<li><a href="philosophy.html">How I Coach</a></li>' +
                '<li><a class="sub-parent" href="approach.html">How I Teach AI (With Examples)</a></li>' +
                '<li class="sub-nested"><a href="project_recipe.html">Project Instructions</a></li>' +
                '<li class="sub-nested"><a href="prompt_resumes.html">Prompt Design</a></li>' +
              '</ul>' +
            '</li>' +
            '<li><a href="blog.html">What I\'m Thinking About</a></li>' +
          '</ul>' +
        '</nav>' +
        '<button id="menu-toggle" class="menu-toggle" aria-expanded="false" aria-controls="nav-mobile" aria-label="Open navigation menu">Menu</button>' +
      '</div>' +
      '<nav id="nav-mobile" class="nav-mobile" aria-label="Primary mobile">' +
        '<ul>' +
          '<li><a href="index.html">Home</a></li>' +
          '<li><a href="test.html">Test Your Knowledge</a></li>' +
          '<li><a href="about.html">Who I Am</a></li>' +
          '<li class="sub-item"><a href="journey.html">How I Got Here</a></li>' +
          '<li><a href="services.html">What I Offer</a></li>' +
          '<li class="sub-item"><a href="philosophy.html">How I Coach</a></li>' +
          '<li class="sub-item"><a href="approach.html">How I Teach AI (With Examples)</a></li>' +
          '<li class="sub-item sub-item--deep"><a href="project_recipe.html">Project Instructions</a></li>' +
          '<li class="sub-item sub-item--deep"><a href="prompt_resumes.html">Prompt Design</a></li>' +
          '<li><a href="blog.html">What I\'m Thinking About</a></li>' +
        '</ul>' +
      '</nav>' +
    '</header>';

    // --- Footer ------------------------------------------------------------
    var footerHTML =
    '<footer class="site-footer">' +
      '<div class="container">' +
        '<div class="footer-grid">' +
          '<div><p class="footer-brand"><img src="assets/images/site-icon-white.png" alt="" width="28" height="28"/><span>Pat <em>Leomi</em></span></p></div>' +
          '<nav aria-label="Footer">' +
            '<h2>Directory</h2>' +
            '<ul class="footer-dir">' +
              '<li><a href="index.html">Home</a></li>' +
              '<li><a href="test.html">Test Your Knowledge</a></li>' +
	      '<li><a href="about.html">Who I Am</a></li>' +
	      '<li class="dir-l2"><a href="journey.html">How I Got Here</a></li>' +
              '<li><a href="services.html">What I Offer</a></li>' +
              '<li class="dir-l2"><a href="philosophy.html">How I Coach</a></li>' +
              '<li class="dir-l2"><a href="approach.html">How I Teach AI (With Examples)</a></li>' +
              '<li class="dir-l3"><a href="project_recipe.html">Project Instructions</a></li>' +
              '<li class="dir-l3"><a href="prompt_resumes.html">Prompt Design</a></li>' +
 	      '<li><a href="blog.html">What I\'m Thinking About</a></li>' +
	      '<li><a href="connect.html">Connect</a></li>' +
            '</ul>' +
          '</nav>' +
          '<div>' +
            '<h2>Contact</h2>' +
            '<ul>' +
              '<li><a href="mailto:pat@leomi.boston">pat@leomi.boston</a></li>' +
              '<li><a href="https://linkedin.com/in/patleomi" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>' +
            '</ul>' +
          '</div>' +
        '</div>' +
        '<p class="footer-note">© 2026 Pat Leomi · <a href="privacy.html">Privacy</a> · Last updated July 2026</p>' +
      '</div>' +
    '</footer>';

    // --- Breadcrumbs -------------------------------------------------------
    function breadcrumbHTML() {
        if (!page || page === 'home') { return ''; }
        var chain = CRUMBS[page] || ['home', page];
        var items = chain.map(function (k, i) {
            var p = PAGES[k];
            if (!p) { return ''; }
            var label = (k !== page && p.short) ? p.short : p.label;
            if (i === chain.length - 1) {
                return '<li><span aria-current="page">' + label + '</span></li>';
            }
            return '<li><a href="' + p.href + '">' + label + '</a></li>';
        }).join('');
        return '<nav class="breadcrumbs" aria-label="Breadcrumb"><div class="container"><ol>' + items + '</ol></div></nav>';
    }

    // BreadcrumbList structured data — mirrors the visual breadcrumb above so
    // search engines can show the trail in results. Built from the same chain.
    function injectBreadcrumbJsonLd() {
        if (!page || page === 'home') { return; }
        var chain = CRUMBS[page] || ['home', page];
        var BASE = 'https://leomi.boston/';
        var items = [];
        chain.forEach(function (k) {
            var p = PAGES[k];
            if (!p) { return; }
            var label = (k !== page && p.short) ? p.short : p.label;
            items.push({
                '@type': 'ListItem',
                'position': items.length + 1,
                'name': label,
                'item': k === 'home' ? BASE : BASE + p.href
            });
        });
        var s = document.createElement('script');
        s.type = 'application/ld+json';
        s.textContent = JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': items
        });
        document.head.appendChild(s);
    }

    // --- Inject ------------------------------------------------------------
    function fill(id, html) {
        var el = document.getElementById(id);
        if (el) { el.outerHTML = html; }
    }
    fill('site-nav', navHTML);
    fill('site-breadcrumbs', breadcrumbHTML());
    fill('site-footer', footerHTML);
    injectBreadcrumbJsonLd();

    // Floating "Connect" tab — on every page except Connect itself.
   if (page && page !== 'connect') {
        var tab = document.createElement('a');
        tab.className = 'side-cta';
        tab.href = 'connect.html';
        tab.textContent = 'Connect';
        document.body.appendChild(tab);
    }

    // --- Active states -----------------------------------------------------
    var currentFile = page && PAGES[page] ? PAGES[page].href : '';
    var trailFiles = activeTrail.map(function (k) { return PAGES[k].href; });

    function markActive(scope) {
        var links = scope.querySelectorAll('a[href]');
        Array.prototype.forEach.call(links, function (a) {
            var f = fileOf(a.getAttribute('href'));
            if (f && f === currentFile) {
                a.setAttribute('aria-current', 'page');
            } else if (f && trailFiles.indexOf(f) !== -1) {
                a.classList.add('nav-trail');
            }
        });
    }
    var header = document.querySelector('.site-header');
    if (header) { markActive(header); }
    var footer = document.querySelector('.site-footer');
    if (footer) { markActive(footer); }
    var subs = document.querySelectorAll('.site-nav .has-sub');
	Array.prototype.forEach.call(subs, function (hasSub) {
    		var subLink = hasSub.querySelector('a[aria-haspopup]');
    		var setExp = function (v) { subLink.setAttribute('aria-expanded', String(v)); };
    		hasSub.addEventListener('mouseenter', function () { setExp(true); });
    		hasSub.addEventListener('mouseleave', function () { setExp(false); });
    		hasSub.addEventListener('focusin', function () { setExp(true); });
    		hasSub.addEventListener('focusout', function () { setExp(false); });
});
    
})();
