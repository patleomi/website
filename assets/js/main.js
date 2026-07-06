// Pat Leomi — shared site behavior: mobile nav, accordions, reveal-all, scroll reveal.

// Restore scroll position on back/forward navigation. Uses sessionStorage only (no cookies).
if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; }
(function () {
    var KEY = 'scroll:' + location.pathname + location.search;
    window.addEventListener('pagehide', function () {
        try { sessionStorage.setItem(KEY, String(window.scrollY)); } catch (e) {}
    });
    window.addEventListener('pageshow', function (e) {
        if (e.persisted) { return; }
        try {
            var nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
            if (!nav || nav.type !== 'back_forward') { return; }
            var y = sessionStorage.getItem(KEY);
            if (y !== null) { window.scrollTo(0, parseInt(y, 10)); }
        } catch (err) {}
    });
})();

document.addEventListener('DOMContentLoaded', function () {

    // Scroll reveal (skipped for reduced-motion users)
    var revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length) {
        var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!reduceMotion && 'IntersectionObserver' in window) {
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in');
                        io.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12 });
            revealEls.forEach(function (el) { io.observe(el); });
        } else {
            revealEls.forEach(function (el) { el.classList.add('in'); });
        }
    }

    // Mobile navigation — event delegation so it works no matter when the nav
    // markup is injected, and auto-closes when a link is tapped.
    document.addEventListener('click', function (e) {
        var menuBtn = e.target.closest ? e.target.closest('#menu-toggle') : null;
        if (menuBtn) {
            var mobileNav = document.getElementById('nav-mobile');
            if (!mobileNav) { return; }
            var expanded = menuBtn.getAttribute('aria-expanded') === 'true';
            menuBtn.setAttribute('aria-expanded', String(!expanded));
            mobileNav.classList.toggle('open');
            menuBtn.textContent = expanded ? 'Menu' : 'Close';
            menuBtn.setAttribute('aria-label', expanded ? 'Open navigation menu' : 'Close navigation menu');
            return;
        }
        var navLink = e.target.closest ? e.target.closest('#nav-mobile a') : null;
        if (navLink) {
            var nav = document.getElementById('nav-mobile');
            var btn = document.getElementById('menu-toggle');
            if (nav) { nav.classList.remove('open'); }
            if (btn) { btn.setAttribute('aria-expanded', 'false'); btn.textContent = 'Menu'; }
        }
    });

    // Generic accordions (journey arcs)
    document.querySelectorAll('.acc-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var expanded = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', String(!expanded));
            var panel = btn.nextElementSibling;
            if (panel) { panel.classList.toggle('open'); }
        });
    });

    // Annotation toggles + reveal-all (project pages)
    var toggles = Array.prototype.slice.call(document.querySelectorAll('.annot-toggle'));
    var revealBtn = document.getElementById('reveal-all');

    function syncRevealAll() {
        if (!revealBtn) { return; }
        var anyClosed = toggles.some(function (b) { return b.getAttribute('aria-expanded') !== 'true'; });
        revealBtn.textContent = anyClosed ? 'Reveal all the thinking' : 'Hide all the thinking';
    }

    toggles.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var expanded = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', String(!expanded));
            var panel = btn.parentElement.querySelector('.annot-panel');
            if (panel) { panel.classList.toggle('open', expanded === false); }
            syncRevealAll();
        });
    });

    if (revealBtn) {
        revealBtn.addEventListener('click', function () {
            var anyClosed = toggles.some(function (b) { return b.getAttribute('aria-expanded') !== 'true'; });
            toggles.forEach(function (btn) {
                btn.setAttribute('aria-expanded', String(anyClosed));
                var panel = btn.parentElement.querySelector('.annot-panel');
                if (panel) { panel.classList.toggle('open', anyClosed); }
            });
            syncRevealAll();
        });
    }

    // Pillars carousel (approach.html). Progressive enhancement over the four
    // .pillars__panel articles using the WAI-ARIA Tabs pattern: numbered tabs,
    // Prev/Next, and a "Pillar N of 4" counter. Controls are built here (never
    // in the HTML) so they can't be dead when JS is off — no-JS leaves all
    // panels visible and stacked. Early-returns on every other page.
    (function () {
        var root = document.querySelector('[data-pillars]');
        if (!root) { return; }
        var panels = Array.prototype.slice.call(root.querySelectorAll('.pillars__panel'));
        if (panels.length < 2) { return; }

        var total = panels.length;
        var current = 0;
        var tabs = [];
        // The carousel is reused beyond the Four Pillars (e.g. project_recipe's
        // trigger examples). The item noun and group label are configurable via
        // data attributes; both default to the pillars wording.
        var noun = root.getAttribute('data-item-noun') || 'Pillar';
        var groupLabel = root.getAttribute('data-carousel-label') || 'The Four Pillars';

        var tablist = document.createElement('div');
        tablist.className = 'pillars__tablist';
        tablist.setAttribute('role', 'tablist');
        // Prefer the visible section heading as the label; fall back to a
        // literal label if the heading isn't present.
        if (document.getElementById('pillars-heading')) {
            tablist.setAttribute('aria-labelledby', 'pillars-heading');
        } else {
            tablist.setAttribute('aria-label', groupLabel);
        }

        panels.forEach(function (panel, i) {
            if (!panel.id) { panel.id = 'pillar-' + (i + 1); }
            panel.setAttribute('tabindex', '-1');
            var title = panel.getAttribute('data-title') || (noun + ' ' + (i + 1));

            var tab = document.createElement('button');
            tab.type = 'button';
            tab.className = 'pillars__tab';
            tab.id = panel.id + '-tab';
            tab.setAttribute('role', 'tab');
            tab.setAttribute('aria-controls', panel.id);
            tab.innerHTML = '<span class="pillars__tab-num" aria-hidden="true">' + (i + 1) + '</span>' +
                            '<span class="pillars__tab-label">' + title + '</span>';
            tab.addEventListener('click', function () { activate(i, true); });
            tablist.appendChild(tab);
            tabs.push(tab);
        });

        var nav = document.createElement('div');
        nav.className = 'pillars__nav';
        var prev = document.createElement('button');
        prev.type = 'button';
        prev.className = 'pillars__btn pillars__btn--prev';
        prev.innerHTML = '← Prev';
        prev.setAttribute('aria-label', 'Previous ' + noun.toLowerCase());
        var next = document.createElement('button');
        next.type = 'button';
        next.className = 'pillars__btn pillars__btn--next';
        next.innerHTML = 'Next →';
        next.setAttribute('aria-label', 'Next ' + noun.toLowerCase());
        var status = document.createElement('span');
        status.className = 'pillars__status';
        prev.addEventListener('click', function () { activate(current - 1, true); });
        next.addEventListener('click', function () { activate(current + 1, true); });
        nav.appendChild(prev);
        nav.appendChild(next);
        nav.appendChild(status);

        // Roving focus with automatic activation (show/hide is cheap).
        tablist.addEventListener('keydown', function (e) {
            var i = current;
            switch (e.key) {
                case 'ArrowLeft': case 'ArrowUp': i = current - 1; break;
                case 'ArrowRight': case 'ArrowDown': i = current + 1; break;
                case 'Home': i = 0; break;
                case 'End': i = total - 1; break;
                default: return;
            }
            e.preventDefault();
            if (i < 0) { i = total - 1; }
            if (i >= total) { i = 0; }
            activate(i, true);
        });

        function activate(i, focusTab) {
            if (i < 0) { i = 0; }
            if (i >= total) { i = total - 1; }
            current = i;
            panels.forEach(function (panel, n) {
                var on = n === i;
                panel.hidden = !on;
                tabs[n].setAttribute('aria-selected', String(on));
                tabs[n].setAttribute('tabindex', on ? '0' : '-1');
            });
            prev.disabled = i === 0;
            next.disabled = i === total - 1;
            status.textContent = noun + ' ' + (i + 1) + ' of ' + total;
            if (focusTab) { tabs[i].focus(); }
        }

        var viewport = root.querySelector('.pillars__viewport') || panels[0].parentNode;
        root.insertBefore(tablist, viewport);
        root.appendChild(nav);
        root.classList.add('is-enhanced');

        // Reserve the height of the tallest panel so clicking through slides
        // never shifts the content below the carousel. Hidden panels are laid
        // out off-screen at full width just long enough to measure them.
        function syncHeight() {
            var max = 0;
            panels.forEach(function (panel) {
                var wasHidden = panel.hidden;
                var prev = panel.style.cssText;
                if (wasHidden) {
                    panel.hidden = false;
                    panel.style.position = 'absolute';
                    panel.style.visibility = 'hidden';
                    panel.style.left = '0';
                    panel.style.right = '0';
                    panel.style.top = '0';
                }
                max = Math.max(max, panel.offsetHeight);
                if (wasHidden) {
                    panel.style.cssText = prev;
                    panel.hidden = true;
                }
            });
            viewport.style.minHeight = max + 'px';
        }

        // Recompute whenever layout can change: on resize, and as lazy-loaded
        // example images arrive (their height isn't known up front).
        var resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(syncHeight, 150);
        });
        root.querySelectorAll('.pillars__panel img').forEach(function (img) {
            if (!img.complete) { img.addEventListener('load', syncHeight); }
        });
        syncHeight();

        // Deep links (#pillar-N) from the hero chip and elsewhere land on the
        // right slide without stealing focus/scroll on first load.
        function indexFromHash() {
            var id = (location.hash || '').replace('#', '');
            for (var i = 0; i < panels.length; i++) {
                if (panels[i].id === id) { return i; }
            }
            return -1;
        }
        var start = indexFromHash();
        activate(start >= 0 ? start : 0, false);
        window.addEventListener('hashchange', function () {
            var idx = indexFromHash();
            if (idx >= 0) { activate(idx, true); }
        });
    })();
});
