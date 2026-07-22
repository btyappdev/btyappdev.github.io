document.addEventListener('DOMContentLoaded', () => {
    const { translations, languages } = window.PH_DATA;

    // State
    let currentLang = 'en';

    // Elements
    const els = {
        langBtn: document.getElementById('lang-menu-btn'),
        langDropdown: document.getElementById('lang-dropdown'),
        currentFlag: document.getElementById('current-lang-flag'),
        currentName: document.getElementById('current-lang-name'),

        contentsBox: document.getElementById('contents-box'),
        contentsToggle: document.getElementById('contents-toggle'),
        contentsList: document.getElementById('contents-list'),

        pageTitle: document.getElementById('page-title'),
        pageSubtitle: document.getElementById('page-subtitle'),
        sectionsContainer: document.getElementById('policy-sections-container'),
        footerText: document.getElementById('footer-text'),

        // Metadata Labels
        appNameLabel: document.getElementById('app-name-label'),
        contactLabel: document.getElementById('contact-label'),
        appLinkLabel: document.getElementById('app-link-label'),

        backToTopBtn: document.getElementById('back-to-top'),
    };

    // Initialize
    function init() {
        renderLanguageOptions();
        setupEventListeners();
        setLanguage(currentLang);
        setupScrollSpy(); // Might need adjustment if sections are dynamic
    }

    // Render Dropdown Options
    function renderLanguageOptions() {
        els.langDropdown.innerHTML = languages.map(lang => `
            <div class="lang-option" data-lang="${lang.code}">
                <span style="font-size: 1.2em;">${lang.flag}</span>
                <span>${lang.name}</span>
            </div>
        `).join('');
    }

    // Set Language Logic
    function setLanguage(langCode) {
        currentLang = langCode;
        const t = translations[langCode];
        const langObj = languages.find(l => l.code === langCode);

        // Update Header/Meta
        if (t["meta.title"]) document.title = t["meta.title"];

        els.currentFlag.textContent = langObj.flag;
        els.currentName.textContent = langObj.name;
        els.pageTitle.textContent = t["header.title"];

        // Update Subtitle and Date
        let subtitleHtml = "";
        if (t["header.subtitle"]) subtitleHtml += t["header.subtitle"];
        if (t["header.date"]) subtitleHtml += `<br><span style="font-size: 0.9em; opacity: 0.8">${t["header.date"]}</span>`;
        els.pageSubtitle.innerHTML = subtitleHtml;

        els.footerText.textContent = t["footer.text"];

        // Update Metadata link labels if they exist
        if (els.appNameLabel) els.appNameLabel.textContent = t["app.name_label"] || "App Name:";
        if (els.contactLabel) els.contactLabel.textContent = t["app.contact_label"] || "Contact:";
        if (els.appLinkLabel) els.appLinkLabel.textContent = t["app.link_label"] || "App Link:";

        const appLinkEl = document.querySelector("#app-link-label + a");
        if (appLinkEl && t["app.link_url"]) {
            appLinkEl.href = t["app.link_url"];
            appLinkEl.textContent = t["app.link_url"];
        }

        // Render Sections
        renderContent(t);

        // Close dropdown
        els.langDropdown.classList.remove('show');

        // Refresh TOC links
        generateTOC(t);
    }

    function renderContent(t) {
        let html = '';

        // Intro
        if (t["intro.content"]) {
            html += `<div class="policy-section intro" style="margin-bottom: 2rem;"><p>${t["intro.content"]}</p></div>`;
        }

        // Sections Loop (Array Based)
        if (t.sections && Array.isArray(t.sections)) {
            html += t.sections.map(section => `
                <section id="section-${section.id}" class="policy-section">
                    <h3>${section.title}</h3>
                    <p>${section.content}</p>
                </section>
            `).join('');
        }

        // Closing
        if (t["closing.content"] || t["closing.declarations"]) {
            html += `<div class="policy-section closing" style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--glass-border);">`;

            if (t["closing.content"]) {
                html += `<p style="font-weight: bold; margin-bottom: 1.5rem;">${t["closing.content"]}</p>`;
            }

            if (t["closing.declarations"] && Array.isArray(t["closing.declarations"])) {
                html += `<div class="closing-declarations" style="margin-top: 1.5rem;">`;
                html += t["closing.declarations"].map(decl => `
                    <details class="declaration-item" style="margin-bottom: 0; border-bottom: 1px solid rgba(255,255,255,0.08); background: transparent;">
                        <summary style="padding: 0.8rem 0; cursor: pointer; font-weight: 500; user-select: none; outline: none; list-style: none; display: flex; align-items: center; justify-content: space-between; transition: color 0.2s;">
                           <span style="font-size: 0.95rem; letter-spacing: 0.01em;">${decl.title}</span>
                           <span class="decl-toggle" style="opacity: 0.5; font-weight: 300;">+</span>
                        </summary>
                        <div style="padding: 0 0 1rem 0; color: var(--text-secondary); font-size: 0.9em; line-height: 1.6; opacity: 0.9;">
                            ${decl.content}
                        </div>
                    </details>
                `).join('');
                html += `</div>`;
            }

            html += `</div>`;
        }

        els.sectionsContainer.innerHTML = html;

        // Add event listeners for declaration items toggle symbol
        setTimeout(() => {
            const details = els.sectionsContainer.querySelectorAll('.declaration-item');
            details.forEach(det => {
                det.addEventListener('toggle', (e) => {
                    const toggle = det.querySelector('.decl-toggle');
                    if (det.open) toggle.textContent = '-';
                    else toggle.textContent = '+';
                });
            });
        }, 100);
    }

    function generateTOC(t) {
        if (!t.sections || !Array.isArray(t.sections)) {
            els.contentsList.innerHTML = '';
            return;
        }

        els.contentsList.innerHTML = t.sections.map(section => `
            <a href="#section-${section.id}" class="toc-link" data-target="section-${section.id}">
                ${section.title}
            </a>
        `).join('');
    }

    function setupEventListeners() {
        // Toggle Language Menu
        els.langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            els.langDropdown.classList.toggle('show');
        });

        // Close menus when clicking outside
        document.addEventListener('click', () => {
            els.langDropdown.classList.remove('show');
        });

        // Language Selection
        els.langDropdown.addEventListener('click', (e) => {
            const option = e.target.closest('.lang-option');
            if (option) {
                setLanguage(option.dataset.lang);
            }
        });

        // Mobile Contents Toggle
        els.contentsToggle.addEventListener('click', () => {
            els.contentsBox.classList.toggle('open');
        });

        // Back to Top
        els.backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // TOC Link Click - Smooth Scroll & Mobile Close
        els.contentsList.addEventListener('click', (e) => {
            if (e.target.classList.contains('toc-link')) {
                e.preventDefault();
                const targetId = e.target.getAttribute('href').substring(1);
                const targetEl = document.getElementById(targetId);

                // Close mobile menu if open
                els.contentsBox.classList.remove('open');

                if (targetEl) {
                    const headerOffset = 100;
                    const elementPosition = targetEl.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            }
        });
    }

    function setupScrollSpy() {
        window.addEventListener('scroll', () => {
            // Back to top visibility
            if (window.scrollY > 500) {
                els.backToTopBtn.classList.add('visible');
            } else {
                els.backToTopBtn.classList.remove('visible');
            }

            // Highlighting TOC items
            const sections = document.querySelectorAll('.policy-section');
            let current = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (scrollY >= sectionTop - 150) {
                    current = section.getAttribute('id');
                }
            });

            document.querySelectorAll('.toc-link').forEach(link => {
                link.classList.remove('active');
                if (link.dataset.target === current) {
                    link.classList.add('active');
                }
            });
        });
    }

    init();
});
