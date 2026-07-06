// Pat Leomi — Test Your Knowledge page: career strategy reflection + dissect an AI prompt.
// All state lives in this file; nothing is stored or transmitted anywhere.
document.addEventListener('DOMContentLoaded', function () {

    var EMAIL = 'pat@leomi.boston';

    function buildMailto(subject, bodyLines) {
        return 'mailto:' + EMAIL +
            '?subject=' + encodeURIComponent(subject) +
            '&body=' + encodeURIComponent(bodyLines.join('\r\n'));
    }

    // Little "Copied!" bubble that rises above the button and fades out on
    // its own. role="status" so screen readers still hear the result.
    function showCopyPop(anchorEl, message, ok) {
        var pop = document.createElement('div');
        pop.className = 'copy-pop' + (ok ? '' : ' copy-pop--warn');
        pop.setAttribute('role', 'status');
        pop.textContent = message;
        document.body.appendChild(pop);
        var rect = anchorEl.getBoundingClientRect();
        pop.style.left = (rect.right + 10) + 'px';
        pop.style.top = (rect.bottom + 10) + 'px';
        pop.addEventListener('animationend', function () { pop.remove(); });
        // Safety net in case animationend never fires.
        setTimeout(function () { if (pop.parentNode) { pop.remove(); } }, 2200);
    }

    // Fallback for visitors whose browser has no mail app registered for
    // mailto: links — copies the same message as plain text instead.
    function copyMailto(anchorEl, subject, bodyLines) {
        var text = 'To: ' + EMAIL + '\r\n' +
            'Subject: ' + subject + '\r\n\r\n' +
            bodyLines.join('\r\n');
        function done(ok) {
            showCopyPop(anchorEl, ok ? 'Copied!' : 'Couldn’t copy. Email ' + EMAIL, ok);
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
        } else {
            done(false);
        }
    }

   /* ------------------------------------------------------------
       Doors: one experience visible at a time.
       ------------------------------------------------------------ */
    var chooser = document.getElementById('doors');
    var sections = {
        stress: document.getElementById('xp-stress'),
        dissect: document.getElementById('xp-dissect'),
    };

    function updateBreadcrumbs(doorName) {
        var container = document.getElementById('site-breadcrumbs') || document.querySelector('.breadcrumbs');
        if (!container) return;
        var ol = container.querySelector('ol');
        if (!ol) return;

        if (doorName === 'stress') {
            ol.innerHTML = '<li><a href="index.html">Home</a></li><li><a href="test.html">Test Your Knowledge</a></li><li><span aria-current="page">Career Strategy Reflection</span></li>';
        } else if (doorName === 'dissect') {
            ol.innerHTML = '<li><a href="index.html">Home</a></li><li><a href="test.html">Test Your Knowledge</a></li><li><span aria-current="page">Dissect an AI Prompt</span></li>';
        } else {
            ol.innerHTML = '<li><a href="index.html">Home</a></li><li><span aria-current="page">Test Your Knowledge</span></li>';
        }
    }

    function showDoor(name) {
   	var hero = document.getElementById('quiz-hero');
   	if (hero) { hero.hidden = (name !== null); }
   	chooser.hidden = (name !== null);
        Object.keys(sections).forEach(function (key) {
            sections[key].hidden = (key !== name);
        });
        // The quiz card can't be measured while its door is hidden
        // (display:none reports zero height), so re-lock the question height
        // once it becomes visible.
        if (name === 'stress') {
            document.dispatchEvent(new CustomEvent('stress-door-open'));
        }
        var target = name === null ? chooser : sections[name];
        var heading = target.querySelector('h2, h3');
        window.scrollTo({ top: 0, behavior: 'instant' });
        if (heading) {
            heading.setAttribute('tabindex', '-1');
            heading.focus({ preventScroll: true });
        }
        updateBreadcrumbs(name);
    }

    // Opening a door pushes a history entry, so the browser back button
    // returns to this chooser instead of leaving test.html entirely.
    function goToDoor(name) {
        history.pushState({ door: name }, '', location.pathname + location.search);
        showDoor(name);
    }

    window.addEventListener('popstate', function (e) {
        showDoor((e.state && e.state.door) || null);
    });

    history.replaceState({ door: null }, '', location.pathname + location.search);

    document.querySelectorAll('[data-door]').forEach(function (btn) {
        btn.addEventListener('click', function () { goToDoor(btn.getAttribute('data-door')); });
    });
    document.querySelectorAll('[data-door-back]').forEach(function (btn) {
        btn.addEventListener('click', function () { history.back(); });
    });


    /* ------------------------------------------------------------
       Experience 1: the career strategy stress test.
       Edit question/note copy here — the logic below doesn't care.
       Use double quotes ("...") for the copy strings below so typing
       a normal apostrophe (it's, don't, I'd) doesn't break the page.
       Avoid a literal " in the copy; escape as \" if ever needed.
       ------------------------------------------------------------ */
    var STRESS_QUESTIONS = [
        {
            area: "Best Self",
            question: "When I imagine feeling like my best self in a job, I know how I wish coworkers would describe the expertise, approach, or style I bring.",
            note: "Imagining your best self can reveal what already energizes you and explain where you have and haven't thrived."
        },
        {
            area: "Drive",
            question: "I know what that future me would be getting out of that workplace that I don’t in my current work.",
            note: "Naming the difference can explain why even a great workplace might not feel like the right fit."
        },
        {
            area: "Self-Knowledge",
            question: "If an opportunity to take that future role opened tomorrow, I could explain in under a minute why I'm the best fit for it.",
            note: "Having a well-organized self-understanding ahead of time prepares you to communicate your fit on a moments notice."
        },
        {
            area: "Red Flags",
            question: "I could convince a skeptical hiring manager that gaps or missing experiences aren't red flags.",
            note: "Reframing perceived obstacles confidently allows you to transform potential concerns into evidence of growth."
        },
        {
            area: "Expectations",
            question: "I'm clear on what's nice-to-have vs. what's necessary for my future career.",
            note: "Knowing what you need and want can help you make decisions when you're not sure if you've come across the 'right' next step."
        },
        {
            area: "Connections",
            question: "I know how to find someone and ask questions to learn about the career I want to have.",
            note: "Focusing only on job search tools like Indeed focuses your energy where less than a third of jobs come from."
        },
        {
            area: "Next Steps",
            question: "I know what my next concrete step is, how to measure if I'm doing it right, and when it's happening.",
            note: "Dreaming is easy, but creating the future you want requires breaking those dreams into measurable subgoals."
        }
    ];

    var STRESS_RATINGS = {
        Confident: { label: "I can explain this confidently", short: "Confident", tile: "map-tile--clear" },
        Unclear: { label: "I’d give a vague or unclear response", short: "Unclear", tile: "map-tile--fuzzy" },
        "No clue": { label: "I honestly don’t know", short: "No clue", tile: "map-tile--noclue" }
    };

    var quizShell = document.getElementById('quiz-shell');
    var quizResults = document.getElementById('quiz-results');

    if (quizShell) {
        var quizCount = quizShell.querySelector('.quiz-count');
        var quizFill = quizShell.querySelector('.quiz-fill');
        var quizArea = quizShell.querySelector('.quiz-area');
        var quizQuestion = quizShell.querySelector('.quiz-question');
        var quizCopyBtn = document.getElementById('quiz-copy');
        var quizBackBtn = document.getElementById('quiz-back');
        var stressAnswers = [];
        var quizBodyLines = [];

        // Reserve enough height for the longest question so the answer
        // buttons never shift between questions. Measured live (not a fixed
        // value) because wrapping — and therefore the tallest question —
        // changes with the viewport width.
        function lockQuestionHeight() {
            // Nothing meaningful to measure until the card has a real width;
            // measuring at zero width would wrap every word and lock a
            // wildly tall height.
            if (!quizQuestion.clientWidth) { return; }
            var current = quizQuestion.textContent;
            quizQuestion.style.minHeight = '';
            var tallest = 0;
            STRESS_QUESTIONS.forEach(function (q) {
                quizQuestion.textContent = q.question;
                if (quizQuestion.offsetHeight > tallest) {
                    tallest = quizQuestion.offsetHeight;
                }
            });
            quizQuestion.textContent = current;
            quizQuestion.style.minHeight = tallest + 'px';
        }

        function renderQuestion() {
            var i = stressAnswers.length;
            var q = STRESS_QUESTIONS[i];
            quizCount.textContent = 'Question ' + (i + 1) + ' of ' + STRESS_QUESTIONS.length;
            quizFill.style.width = (i / STRESS_QUESTIONS.length * 100) + '%';
            quizArea.textContent = q.area;
            quizQuestion.textContent = q.question;
            if (quizBackBtn) {
                var onFirstQuestion = (i === 0);
                // Kept in the layout (not display:none) so question 1's card
                // is the same height as the rest; visibility:hidden just
                // makes it invisible and unreachable by click or keyboard.
                quizBackBtn.classList.toggle('quiz-back--placeholder', onFirstQuestion);
                quizBackBtn.setAttribute('aria-hidden', String(onFirstQuestion));
                quizBackBtn.tabIndex = onFirstQuestion ? -1 : 0;
            }
        }

        function renderResults() {
            var mapGrid = quizResults.querySelector('.map-grid');
            var summary = document.getElementById('quiz-summary');
            mapGrid.innerHTML = '';

            var UnclearCount = 0;
            STRESS_QUESTIONS.forEach(function (q, i) {
                var rating = STRESS_RATINGS[stressAnswers[i]];
                var tile = document.createElement('div');
                tile.className = 'map-tile ' + rating.tile;
                var name = document.createElement('strong');
                name.textContent = q.area;
                var state = document.createElement('span');
                state.textContent = rating.short;
                tile.appendChild(name);
                tile.appendChild(state);

                if (stressAnswers[i] !== 'Confident') {
                    UnclearCount += 1;
                }
                var note = document.createElement('p');
                note.className = 'map-note';
                note.textContent = q.note;
                tile.appendChild(note);
                mapGrid.appendChild(tile);
            });

            summary.textContent = UnclearCount === 0
                ? "Your responses suggest you're confident across your entire strategy. Either you've done a lot of deep thinking about your career or your confidence might not match your delivery. Want to hop on a call to talk about it?"
                : "You said you're not confident in " + UnclearCount + " of 7 of these areas. Either you have an accurate self-understanding and need work or there's an opportunity to build your confidence where you're already fantastic. Want to hop on a call to talk about it?";

            var bodyLines = [
                "Hi Pat,",
                "",
                "I took the career strategy stress test on your site. Here’s my map:",
                ""
            ];
            STRESS_QUESTIONS.forEach(function (q, i) {
                bodyLines.push("- " + q.area + ": " + STRESS_RATINGS[stressAnswers[i]].short);
            });
            bodyLines.push("");
            bodyLines.push("The unclear ones are why I’m reaching out. Could we set up a free 15-minute consult?");
            bodyLines.push("");
            bodyLines.push("[Anything else you want me to know goes here, like your general availability or specific problems you want to explore.]");
            quizBodyLines = bodyLines;
            document.getElementById('quiz-mailto').href =
                buildMailto('Consult request: career strategy stress test', bodyLines);

            quizShell.hidden = true;
            var stressFallback = document.getElementById('stress-fallback');
            if (stressFallback) { stressFallback.hidden = true; }
            quizResults.hidden = false;
            var heading = quizResults.querySelector('h3');
            heading.setAttribute('tabindex', '-1');
            heading.focus();
        }

        quizShell.querySelectorAll('.quiz-option').forEach(function (btn) {
            btn.addEventListener('click', function () {
                stressAnswers.push(btn.getAttribute('data-rating'));
                if (stressAnswers.length < STRESS_QUESTIONS.length) {
                    renderQuestion();
                } else {
                    quizFill.style.width = '100%';
                    renderResults();
                }
            });
        });

        if (quizCopyBtn) {
            quizCopyBtn.addEventListener('click', function () {
                copyMailto(quizCopyBtn, 'Consult request: career strategy stress test', quizBodyLines);
            });
        }

        if (quizBackBtn) {
            quizBackBtn.addEventListener('click', function () {
                if (stressAnswers.length > 0) {
                    stressAnswers.pop();
                    renderQuestion();
                }
            });
        }

        document.getElementById('quiz-retake').addEventListener('click', function () {
            stressAnswers = [];
            quizResults.hidden = true;
            quizShell.hidden = false;
            var stressFallback = document.getElementById('stress-fallback');
            if (stressFallback) { stressFallback.hidden = false; }
            renderQuestion();
        });

        var lockTimer;
        window.addEventListener('resize', function () {
            clearTimeout(lockTimer);
            lockTimer = setTimeout(lockQuestionHeight, 150);
        });
        document.addEventListener('stress-door-open', lockQuestionHeight);

        renderQuestion();
    }

    /* ------------------------------------------------------------
       Experience 2: dissect an AI prompt.
       ------------------------------------------------------------ */
    var issueGrid = document.getElementById('issue-grid');
    var revealBtn = document.getElementById('dissect-reveal');

    if (issueGrid && revealBtn) {
        var issueCards = Array.prototype.slice.call(issueGrid.querySelectorAll('.issue-card'));

        issueCards.forEach(function (card) {
            card.addEventListener('click', function () {
                if (issueGrid.classList.contains('revealed')) { return; }
                var pressed = card.getAttribute('aria-pressed') === 'true';
                card.setAttribute('aria-pressed', String(!pressed));
            });
        });

        revealBtn.addEventListener('click', function () {
            // Short status label per card; the teaching copy lives in the
            // .issue-explain placeholders authored inline in test.html.
            var hits = 0;
            var gaps = 0;
            issueCards.forEach(function (card) {
                var role = card.getAttribute('data-real'); // "true" | "false" | "neutral"
                var picked = card.getAttribute('aria-pressed') === 'true';
                var verdict = card.querySelector('.issue-verdict');
                if (role === 'neutral') {
                    card.classList.add('issue-card--neutral');
                    verdict.textContent = picked ? "It depends." : "Worth a closer look.";
                } else if (role === 'true') {
                    gaps += 1;
                    if (picked) {
                        hits += 1;
                        card.classList.add('issue-card--hit');
                        verdict.textContent = "Caught it.";
                    } else {
                        card.classList.add('issue-card--missed');
                        verdict.textContent = "Missed it.";
                    }
                } else {
                    if (picked) {
                        card.classList.add('issue-card--missed');
                        verdict.textContent = "Not the problem here.";
                    } else {
                        card.classList.add('issue-card--hit');
                        verdict.textContent = "Correctly ignored.";
                    }
                }
            });
            issueGrid.classList.add('revealed');

            var scoreLine = document.getElementById('dissect-score');
            scoreLine.textContent = "You caught " + hits + " of " + gaps + " limitations. " + (hits === gaps
                ? "Now the question is whether your own prompts pass the same test. Connect with me below if you have any questions."
                : "Read the explanations for the ones you missed. Connect with me below if you have any questions.");
            scoreLine.hidden = false;

            // The reveal is one-shot: retire the button and swap the skip-the-test
            // fallback for the full consult CTA now that they've earned the payoff.
            revealBtn.hidden = true;
            var fallback = document.getElementById('dissect-fallback');
            if (fallback) { fallback.hidden = true; }
            var cta = document.getElementById('dissect-cta');
            if (cta) { cta.hidden = false; }
        });

        // Dissection → pre-filled consult email. Worded around intent, not
        // the score, so it never reads like a report card.
        var dissectMailto = document.getElementById('dissect-mailto');
        var dissectCopyBtn = document.getElementById('dissect-copy');
        var dissectSubject = 'Consult request: dissecting AI prompts';
        var dissectBodyLines = [
            "Hi Pat,",
            "",
            "I dissected an AI prompt on your site and want to sharpen how I use AI in my job search.",
            "",
            "Could we set up a free 15-minute consult?",
            "",
            "[If one limitation surprised you, mention it here, or add anything else you'd like me to know, like your general availability.]"
        ];

        if (dissectMailto) {
            dissectMailto.href = buildMailto(dissectSubject, dissectBodyLines);
        }
        if (dissectCopyBtn) {
            dissectCopyBtn.addEventListener('click', function () {
                copyMailto(dissectCopyBtn, dissectSubject, dissectBodyLines);
            });
        }
    }

});