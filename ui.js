/**
 * Prism Study Planner & Assistant - UI Rendering & View Controller
 * Handles Liquid Glass UI state, transitions, 3D Flashcards, Document previews & downloads.
 */

/**
 * Prism Study Planner & Assistant - UI Rendering & View Controller
 * Handles Liquid Glass UI state, transitions, 3D Flashcards, Document previews & downloads.
 */

// Professional Yellow/Amber SVG Icon System
export const ICONS = {
  prism: `<svg class="prism-icon" viewBox="0 0 24 24"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon><line x1="12" y1="22" x2="12" y2="15.5"></line><polyline points="22 8.5 12 15.5 2 8.5"></polyline></svg>`,
  course: `<svg class="prism-icon" viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>`,
  cap: `<svg class="prism-icon" viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>`,
  subject: `<svg class="prism-icon" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`,
  book: `<svg class="prism-icon" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`,
  chapter: `<svg class="prism-icon" viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`,
  layers: `<svg class="prism-icon" viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`,
  flashcards: `<svg class="prism-icon" viewBox="0 0 24 24"><rect x="2" y="5" width="14" height="15" rx="3"></rect><path d="M7 2h11a3 3 0 0 1 3 3v11" stroke-dasharray="2 2"></path></svg>`,
  notes: `<svg class="prism-icon" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>`,
  short_notes: `<svg class="prism-icon" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
  pyqs: `<svg class="prism-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
  revision_notes: `<svg class="prism-icon" viewBox="0 0 24 24"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"></path></svg>`,
  plus: `<svg class="prism-icon" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
  edit: `<svg class="prism-icon" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
  trash: `<svg class="prism-icon" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
  shuffle: `<svg class="prism-icon" viewBox="0 0 24 24"><polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="21 16 21 21 16 21"></polyline><line x1="15" y1="15" x2="21" y2="21"></line><line x1="4" y1="4" x2="9" y2="9"></line></svg>`,
  flip: `<svg class="prism-icon" viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>`,
  lightbulb: `<svg class="prism-icon" viewBox="0 0 24 24"><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5"></path></svg>`,
  search: `<svg class="prism-icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  download: `<svg class="prism-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
  eye: `<svg class="prism-icon" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
  user: `<svg class="prism-icon" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
  lock: `<svg class="prism-icon" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
  upload: `<svg class="prism-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>`,
  check: `<svg class="prism-icon" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  alert: `<svg class="prism-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`,
  close: `<svg class="prism-icon" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
  arrow_right: `<svg class="prism-icon" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`,
  arrow_left: `<svg class="prism-icon" viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>`,
  code: `<svg class="prism-icon" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
  math: `<svg class="prism-icon" viewBox="0 0 24 24"><path d="M4 19L9 5h11"></path><line x1="4" y1="12" x2="14" y2="12"></line></svg>`,
  gear: `<svg class="prism-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
  zap: `<svg class="prism-icon" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
  cloud: `<svg class="prism-icon" viewBox="0 0 24 24"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>`,
  file_pdf: `<svg class="prism-icon" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><text x="6.5" y="18" font-size="6" font-weight="800" fill="currentColor">PDF</text></svg>`,
  file_doc: `<svg class="prism-icon" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>`,
  file_odt: `<svg class="prism-icon" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><text x="5.5" y="18" font-size="5.5" font-weight="800" fill="currentColor">ODT</text></svg>`,
  database: `<svg class="prism-icon" viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>`,
  moon: `<svg class="prism-icon" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`,
  sun: `<svg class="prism-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
};

/**
 * Returns clean SVG markup for a semantic icon name or old emoji fallback
 */
export function getIcon(nameOrEmoji, extraClass = "") {
  if (nameOrEmoji && ICONS[nameOrEmoji]) {
    return extraClass ? ICONS[nameOrEmoji].replace('class="prism-icon"', `class="prism-icon ${extraClass}"`) : ICONS[nameOrEmoji];
  }
  const emojiMap = {
    "💻": "code",
    "tech": "code",
    "📐": "math",
    "math": "math",
    "⚙️": "gear",
    "⚙": "gear",
    "mech": "gear",
    "⚡": "zap",
    "ece": "zap",
    "🏗️": "course",
    "🏗": "course",
    "civil": "course",
    "🩺": "notes",
    "medical": "notes",
    "💼": "course",
    "business": "course",
    "⚖️": "course",
    "⚖": "course",
    "law": "course",
    "🎓": "cap",
    "humanities": "cap",
    "general": "book",
    "📚": "subject",
    "📖": "book",
    "📇": "flashcards",
    "📝": "notes",
    "🎯": "pyqs",
    "🔄": "revision_notes",
    "➕": "plus",
    "✏️": "edit",
    "✏": "edit",
    "🗑️": "trash",
    "🗑": "trash",
    "🔍": "search",
    "💡": "lightbulb",
    "🔀": "shuffle",
    "👤": "user",
    "🔒": "lock",
    "📑": "notes",
    "📄": "notes",
    "📁": "book",
    "👁️": "eye",
    "👁": "eye",
    "🌙": "moon",
    "dark": "moon",
    "☀️": "sun",
    "sun": "sun",
    "light": "sun",
    "✨": "prism",
    "💎": "prism",
    "🚀": "upload",
    "✅": "check",
    "❌": "close"
  };
  const mapped = emojiMap[nameOrEmoji];
  if (mapped && ICONS[mapped]) {
    return extraClass ? ICONS[mapped].replace('class="prism-icon"', `class="prism-icon ${extraClass}"`) : ICONS[mapped];
  }
  return extraClass ? ICONS.subject.replace('class="prism-icon"', `class="prism-icon ${extraClass}"`) : ICONS.subject;
}

// Category metadata definitions
export const CATEGORY_INFO = {
  flashcards: {
    title: "Flashcards Studio",
    iconKey: "flashcards",
    badgeClass: "glass-badge",
    description: "Interactive revision cards with flip animations & memory testing."
  },
  notes: {
    title: "Lecture Notes",
    iconKey: "notes",
    badgeClass: "glass-badge-blue",
    description: "In-depth lecture notes, textbook solutions & comprehensive guides."
  },
  short_notes: {
    title: "Short Notes & Formulas",
    iconKey: "short_notes",
    badgeClass: "glass-badge",
    description: "Formula sheets, cheat sheets, mind maps & concise overviews."
  },
  pyqs: {
    title: "Previous Year Questions (PYQs)",
    iconKey: "pyqs",
    badgeClass: "glass-badge-purple",
    description: "Past exam question papers, answer keys & repeated questions."
  },
  revision_notes: {
    title: "Rapid Revision Notes",
    iconKey: "revision_notes",
    badgeClass: "glass-badge-green",
    description: "High-yield summary packets & last-minute review materials."
  }
};

class UIManager {
  constructor() {
    this.currentView = "subjects-view"; // 'subjects-view' | 'chapters-view' | 'tiles-view' | 'flashcards-view' | 'documents-view'
    this.selectedCourse = "all"; // 'all' or course object
    this.selectedSubject = null;
    this.selectedChapter = null;
    this.selectedCategory = null;

    // Flashcard deck state
    this.deckFlashcards = [];
    this.currentCardIndex = 0;
    this.isCardFlipped = false;

    // Active documents state
    this.activeDocuments = [];

    // Theme state (Aura Yellow Dark / Light Mode)
    this.currentTheme = "light";
    this.initTheme();

    // Auto-render math when KaTeX is loaded
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        setTimeout(() => this.renderAllMathOnPage(), 300);
      });

      // Responsive viewport resize listener for smartphone orientation and viewport changes
      let resizeTimer = null;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          if (this.currentView === 'flashcards-view') {
            this.adjustFlashcardHeight();
          }
        }, 150);
      });
    }
  }

  /* ==========================================================================
     Theme Management (Aura Yellow Dark / Light Mode)
     ========================================================================== */

  initTheme() {
    let savedTheme = null;
    try {
      savedTheme = localStorage.getItem('prism_theme');
    } catch (e) {}

    // If no saved preference, check system dark mode preference
    if (!savedTheme && typeof window !== 'undefined' && window.matchMedia) {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        savedTheme = 'dark';
      }
    }

    const theme = savedTheme === 'dark' ? 'dark' : 'light';
    this.applyTheme(theme, false);
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(nextTheme, true);
    return nextTheme;
  }

  applyTheme(theme, showNotification = false) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    if (document.body) {
      document.body.classList.toggle('dark-theme', theme === 'dark');
    }

    try {
      localStorage.setItem('prism_theme', theme);
    } catch (e) {}

    // Update toggle button DOM elements
    const iconSlot = document.getElementById('theme-toggle-icon');
    const textSlot = document.getElementById('theme-toggle-text');
    const toggleBtn = document.getElementById('theme-toggle-btn');

    if (iconSlot) {
      iconSlot.innerHTML = theme === 'dark' ? getIcon('sun', 'prism-icon-sm') : getIcon('moon', 'prism-icon-sm');
    }
    if (textSlot) {
      textSlot.textContent = theme === 'dark' ? 'Light' : 'Dark';
    }
    if (toggleBtn) {
      toggleBtn.title = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Aura Yellow Dark Mode';
      toggleBtn.setAttribute('aria-label', toggleBtn.title);
      toggleBtn.classList.toggle('theme-active-dark', theme === 'dark');
    }

    // Recalibrate flashcard stage height for typography rendering
    if (this.currentView === 'flashcards-view') {
      setTimeout(() => this.adjustFlashcardHeight(), 50);
    }

    if (showNotification) {
      const msg = theme === 'dark' ? 'Switched to Aura Yellow Dark Mode' : 'Switched to Light Mode';
      this.showToast(msg, 'info');
    }
  }

  /* ==========================================================================
     Navigation & Breadcrumbs
     ========================================================================== */

  /**
   * Navigate to a view and update breadcrumbs
   */
  navigateTo(viewId) {
    this.currentView = viewId;
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));

    const target = document.getElementById(viewId);
    if (target) {
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (viewId === 'flashcards-view') {
        setTimeout(() => this.adjustFlashcardHeight(), 80);
      }
    }

    this.renderBreadcrumbs();
  }

  renderBreadcrumbs() {
    const container = document.getElementById('breadcrumbs-list');
    if (!container) return;

    let html = `
      <span class="breadcrumb-item ${this.currentView === 'subjects-view' ? 'breadcrumb-active' : ''}" data-nav="subjects">
        <span>${getIcon('book', 'prism-icon-sm')}</span> Subjects
      </span>
    `;

    if (this.selectedSubject && this.currentView !== 'subjects-view') {
      html += `<span class="breadcrumb-separator">/</span>`;
      html += `
        <span class="breadcrumb-item ${this.currentView === 'chapters-view' ? 'breadcrumb-active' : ''}" data-nav="chapters">
          ${this.escapeHtml(this.selectedSubject.name)}
        </span>
      `;
    }

    if (this.selectedChapter && (this.currentView === 'tiles-view' || this.currentView === 'flashcards-view' || this.currentView === 'documents-view')) {
      html += `<span class="breadcrumb-separator">/</span>`;
      html += `
        <span class="breadcrumb-item ${this.currentView === 'tiles-view' ? 'breadcrumb-active' : ''}" data-nav="tiles">
          ${this.escapeHtml(this.selectedChapter.unitNumber || 'Unit')}: ${this.escapeHtml(this.selectedChapter.title)}
        </span>
      `;
    }

    if (this.selectedCategory && (this.currentView === 'flashcards-view' || this.currentView === 'documents-view')) {
      const info = CATEGORY_INFO[this.selectedCategory] || { title: this.selectedCategory, iconKey: "notes" };
      html += `<span class="breadcrumb-separator">/</span>`;
      html += `
        <span class="breadcrumb-item breadcrumb-active">
          <span>${getIcon(info.iconKey || 'notes', 'prism-icon-sm')}</span> ${info.title}
        </span>
      `;
    }

    container.innerHTML = html;

    // Bind breadcrumb click listeners
    container.querySelectorAll('.breadcrumb-item').forEach(el => {
      el.addEventListener('click', () => {
        const nav = el.getAttribute('data-nav');
        if (nav === 'subjects') {
          this.navigateTo('subjects-view');
        } else if (nav === 'chapters') {
          this.navigateTo('chapters-view');
        } else if (nav === 'tiles') {
          this.navigateTo('tiles-view');
        }
      });
    });
  }

  /* ==========================================================================
     Courses / Branches Bar Rendering
     ========================================================================== */

  renderCourses(courses, onSelectCourse) {
    const container = document.getElementById('course-pills-container');
    const badge = document.getElementById('active-course-name-badge');
    const editBtn = document.getElementById('btn-edit-active-course');
    const deleteBtn = document.getElementById('btn-delete-active-course');
    const addSubToCourseBtn = document.getElementById('btn-add-subject-to-course');
    const totalCountEl = document.getElementById('total-courses-count');

    if (!container) return;

    const allCoursesList = courses || [];
    const isAll = this.selectedCourse === "all" || !this.selectedCourse;

    // Update total count
    if (totalCountEl) totalCountEl.textContent = allCoursesList.length;

    // Update active course badge in header
    if (badge) {
      if (isAll) {
        badge.textContent = "All Courses";
      } else {
        badge.innerHTML = `${getIcon(this.selectedCourse.icon || 'cap', 'prism-icon-sm')} ${this.escapeHtml(this.selectedCourse.name)}`;
      }
    }

    // Toggle edit, delete & add subject to course buttons for active branch
    if (editBtn) editBtn.style.display = isAll ? "none" : "inline-flex";
    if (deleteBtn) deleteBtn.style.display = isAll ? "none" : "inline-flex";
    if (addSubToCourseBtn) {
      if (isAll) {
        addSubToCourseBtn.style.display = "none";
      } else {
        addSubToCourseBtn.style.display = "inline-flex";
        addSubToCourseBtn.innerHTML = `<span>${getIcon('plus', 'prism-icon-sm')}</span> Add Subject to ${this.escapeHtml(this.selectedCourse.code || 'Branch')}`;
      }
    }

    // Build pills HTML: "All Courses" first, individual branches, and "+ Add Course" pill
    let pillsHtml = `
      <button type="button" class="course-pill ${isAll ? 'active' : ''}" data-course-id="all">
        <span>${getIcon('prism', 'prism-icon-sm')}</span>
        <span>All Courses</span>
      </button>
    `;

    pillsHtml += allCoursesList.map(c => {
      const isActive = !isAll && (this.selectedCourse?.id === c.id || this.selectedCourse === c.id);
      return `
        <button type="button" class="course-pill ${isActive ? 'active' : ''}" data-course-id="${c.id}">
          <span>${getIcon(c.icon || 'cap', 'prism-icon-sm')}</span>
          <span>${this.escapeHtml(c.name)}</span>
        </button>
      `;
    }).join('');

    pillsHtml += `
      <button type="button" class="course-pill pill-add-course" id="pill-add-course-btn" title="Add a new Academic Course or Branch">
        <span>${getIcon('plus', 'prism-icon-sm')}</span> Add Course
      </button>
    `;

    container.innerHTML = pillsHtml;

    // Attach click events to pills
    container.querySelectorAll('.course-pill:not(.pill-add-course)').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-course-id');
        if (id === 'all') {
          this.selectedCourse = 'all';
          if (onSelectCourse) onSelectCourse('all');
        } else {
          const course = allCoursesList.find(c => c.id === id);
          if (course) {
            this.selectedCourse = course;
            if (onSelectCourse) onSelectCourse(course);
          }
        }
      });
    });

    // Attach click event to "+ Add Course" pill
    const addPillBtn = document.getElementById('pill-add-course-btn');
    if (addPillBtn) {
      addPillBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openAddCourseModal();
      });
    }
  }

  /* ==========================================================================
     Subjects View Rendering (Filtered by Course/Branch & Search)
     ========================================================================== */

  renderSubjects(subjects, onSelectSubject, onEditSubject, onDeleteSubject) {
    const grid = document.getElementById('subjects-grid');
    const countEl = document.getElementById('total-subjects-count');

    // Filter by selected course / academic branch
    let filtered = subjects || [];
    if (this.selectedCourse && this.selectedCourse !== 'all') {
      const courseId = typeof this.selectedCourse === 'object' ? this.selectedCourse.id : this.selectedCourse;
      filtered = filtered.filter(s => s.courseId === courseId);
    }

    // Filter by search query if active
    const searchInput = document.getElementById('search-subjects-input');
    if (searchInput && searchInput.value.trim()) {
      const q = searchInput.value.trim().toLowerCase();
      filtered = filtered.filter(s => 
        (s.name && s.name.toLowerCase().includes(q)) || 
        (s.code && s.code.toLowerCase().includes(q)) ||
        (s.description && s.description.toLowerCase().includes(q))
      );
    }

    if (countEl) countEl.textContent = filtered.length;
    if (!grid) return;

    if (filtered.length === 0) {
      const isFilteredCourse = this.selectedCourse && this.selectedCourse !== 'all';
      const courseName = isFilteredCourse ? (this.selectedCourse.name || 'this branch') : '';
      const courseIconKey = isFilteredCourse ? (this.selectedCourse.icon || 'cap') : 'book';
      const courseId = isFilteredCourse ? (this.selectedCourse.id || '') : null;
      grid.innerHTML = `
        <div class="glass-empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">${getIcon(courseIconKey, 'prism-icon-xl')}</div>
          <h3>${isFilteredCourse ? `No Subjects in ${this.escapeHtml(courseName)} Yet` : 'No Subjects Found'}</h3>
          <p>${isFilteredCourse ? `Be the first to add a subject under ${this.escapeHtml(courseName)}! Subjects added will be organized under this branch.` : 'Be the first scholar to add a subject for your class or semester!'}</p>
          <button type="button" class="btn-glass btn-primary-glass" id="empty-add-subject-btn">
            <span>${getIcon('plus', 'prism-icon-sm')}</span> ${isFilteredCourse ? `Add First Subject to ${this.escapeHtml(courseName)}` : 'Add First Subject'}
          </button>
        </div>
      `;
      const btn = document.getElementById('empty-add-subject-btn');
      if (btn) btn.addEventListener('click', () => {
        if (isFilteredCourse && window.prismApp) {
          window.prismApp.openAddSubjectForCourse(courseId);
        } else {
          this.populateCourseDropdowns(window.prismApp?.currentCourses, courseId);
          this.openModal('modal-add-subject');
        }
      });
      return;
    }

    grid.innerHTML = filtered.map(sub => `
      <div class="glass-card subject-card" data-subject-id="${sub.id}">
        <div>
          <div class="subject-card-header">
            <div class="subject-icon-box">${getIcon(sub.icon || 'book', 'prism-icon-md')}</div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="glass-badge">${this.escapeHtml(sub.code || 'CORE')}</span>
              <div class="card-actions-group">
                <button type="button" class="card-action-btn edit-btn" title="Edit Subject" data-edit-subject="${sub.id}">${getIcon('edit', 'prism-icon-sm')}</button>
                <button type="button" class="card-action-btn delete-btn" title="Remove Subject" data-delete-subject="${sub.id}">${getIcon('trash', 'prism-icon-sm')}</button>
              </div>
            </div>
          </div>
          <h3 class="subject-card-title">${this.escapeHtml(sub.name)}</h3>
          <p class="subject-card-desc">${this.escapeHtml(sub.description || 'Explore units, flashcards, lecture notes and previous year questions.')}</p>
        </div>
        <div class="subject-card-footer">
          <div class="subject-meta-counts">
            <span class="meta-count-item" title="Created by">
              ${getIcon('user', 'prism-icon-sm')} ${this.escapeHtml(sub.creatorName || 'Community')}
            </span>
          </div>
          <div class="subject-arrow-btn">${getIcon('arrow_right', 'prism-icon-sm')}</div>
        </div>
      </div>
    `).join('');

    // Attach card click events (navigation)
    grid.querySelectorAll('.subject-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-subject-id');
        const subject = filtered.find(s => s.id === id);
        if (subject && onSelectSubject) {
          this.selectedSubject = subject;
          onSelectSubject(subject);
        }
      });
    });

    // Attach edit handlers (stops event bubbling)
    grid.querySelectorAll('[data-edit-subject]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-edit-subject');
        const subject = (subjects || []).find(s => s.id === id);
        if (subject && onEditSubject) onEditSubject(subject);
      });
    });

    // Attach delete handlers (stops event bubbling)
    grid.querySelectorAll('[data-delete-subject]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-delete-subject');
        const subject = (subjects || []).find(s => s.id === id);
        if (subject && onDeleteSubject) onDeleteSubject(subject);
      });
    });

    // Render mathematical equations inside subject cards
    this.renderMath(grid);
  }

  /* ==========================================================================
     Chapters View Rendering (With Edit & Delete Controls)
     ========================================================================== */

  renderChapters(subject, chapters, onSelectChapter, onEditChapter, onDeleteChapter) {
    this.selectedSubject = subject;

    // Header info
    const nameEl = document.getElementById('chapter-view-subject-title');
    const codeEl = document.getElementById('chapter-view-subject-code');
    const descEl = document.getElementById('chapter-view-subject-desc');
    const countEl = document.getElementById('chapter-count-stat');

    if (nameEl) nameEl.textContent = subject.name;
    if (codeEl) codeEl.textContent = subject.code || 'COURSE';
    if (descEl) descEl.textContent = subject.description || 'All chapters and curriculum units for this subject.';
    if (countEl) countEl.textContent = (chapters || []).length;

    const grid = document.getElementById('chapters-grid');
    if (!grid) return;

    if (!chapters || chapters.length === 0) {
      grid.innerHTML = `
        <div class="glass-empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">${getIcon('layers', 'prism-icon-xl')}</div>
          <h3>No Chapters or Units Added Yet</h3>
          <p>Add the first chapter or unit to start sharing flashcards, notes, and past year papers!</p>
          <button class="btn-glass btn-primary-glass" id="empty-add-chapter-btn">
            <span>${getIcon('plus', 'prism-icon-sm')}</span> Add First Chapter
          </button>
        </div>
      `;
      const btn = document.getElementById('empty-add-chapter-btn');
      if (btn) btn.addEventListener('click', () => this.openAddChapterModal(this.selectedSubject?.id));
      return;
    }

    grid.innerHTML = chapters.map(chap => `
      <div class="glass-card chapter-card" data-chapter-id="${chap.id}">
        <div>
          <div class="chapter-top">
            <span class="chapter-number-pill">${this.escapeHtml(chap.unitNumber || 'Unit')}</span>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="glass-badge">5 Resource Hubs</span>
              <div class="card-actions-group">
                <button type="button" class="card-action-btn edit-btn" title="Edit Chapter" data-edit-chapter="${chap.id}">${getIcon('edit', 'prism-icon-sm')}</button>
                <button type="button" class="card-action-btn delete-btn" title="Remove Chapter" data-delete-chapter="${chap.id}">${getIcon('trash', 'prism-icon-sm')}</button>
              </div>
            </div>
          </div>
          <h3 class="chapter-title">${this.escapeHtml(chap.title)}</h3>
          <p class="chapter-desc">${this.escapeHtml(chap.description || 'Click to explore Flashcards, Notes, Short Notes, PYQs and Revision materials.')}</p>
        </div>
        <div>
          <div class="chapter-resource-pills">
            <span class="resource-mini-tag">${getIcon('flashcards', 'prism-icon-sm')} Flashcards</span>
            <span class="resource-mini-tag">${getIcon('notes', 'prism-icon-sm')} Notes</span>
            <span class="resource-mini-tag">${getIcon('short_notes', 'prism-icon-sm')} Short Notes</span>
            <span class="resource-mini-tag">${getIcon('pyqs', 'prism-icon-sm')} PYQs</span>
            <span class="resource-mini-tag">${getIcon('revision_notes', 'prism-icon-sm')} Revision</span>
          </div>
          <div class="chapter-footer">
            <span>By ${this.escapeHtml(chap.creatorName || 'Community')}</span>
            <span style="font-weight:700; color:var(--primary); display:flex; align-items:center; gap:4px;">Open Chapter ${getIcon('arrow_right', 'prism-icon-sm')}</span>
          </div>
        </div>
      </div>
    `).join('');

    // Attach card click events (navigation)
    grid.querySelectorAll('.chapter-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-chapter-id');
        const chapter = chapters.find(c => c.id === id);
        if (chapter && onSelectChapter) {
          this.selectedChapter = chapter;
          onSelectChapter(chapter);
        }
      });
    });

    // Attach edit handlers (stops event bubbling)
    grid.querySelectorAll('[data-edit-chapter]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-edit-chapter');
        const chapter = chapters.find(c => c.id === id);
        if (chapter && onEditChapter) onEditChapter(chapter);
      });
    });

    // Attach delete handlers (stops event bubbling)
    grid.querySelectorAll('[data-delete-chapter]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-delete-chapter');
        const chapter = chapters.find(c => c.id === id);
        if (chapter && onDeleteChapter) onDeleteChapter(chapter);
      });
    });

    // Render mathematical equations inside chapter cards
    this.renderMath(grid);
  }

  /* ==========================================================================
     The 5 Liquid Glass Tiles View (Chapter Resources Hub)
     ========================================================================== */

  renderTiles(chapter, onSelectTile) {
    this.selectedChapter = chapter;

    const titleEl = document.getElementById('tiles-view-chapter-title');
    const badgeEl = document.getElementById('tiles-view-chapter-badge');
    const descEl = document.getElementById('tiles-view-chapter-desc');

    if (titleEl) {
      titleEl.innerHTML = this.formatMathContent(chapter.title);
      this.renderMath(titleEl);
    }
    if (badgeEl) badgeEl.textContent = `${this.selectedSubject?.name || 'Subject'} • ${chapter.unitNumber || 'Unit'}`;
    if (descEl) {
      descEl.innerHTML = this.formatMathContent(chapter.description || 'Access and contribute to community flashcards and study documents.');
      this.renderMath(descEl);
    }

    // Bind click events on the 5 tiles
    const tilesContainer = document.getElementById('chapter-tiles-container');
    if (!tilesContainer) return;

    tilesContainer.querySelectorAll('.resource-tile').forEach(tile => {
      tile.onclick = () => {
        const category = tile.getAttribute('data-category');
        this.selectedCategory = category;
        if (onSelectTile) onSelectTile(category);
      };
    });
  }

  /* ==========================================================================
     Flashcards Studio (3D Flip Deck & Practice Experience)
     ========================================================================== */

  renderFlashcardsDeck(flashcards, chapter) {
    this.deckFlashcards = flashcards || [];
    this.currentCardIndex = 0;
    this.isCardFlipped = false;

    const titleEl = document.getElementById('flashcards-view-title');
    const badgeEl = document.getElementById('flashcards-view-badge');
    if (titleEl) titleEl.textContent = `Flashcards: ${chapter.title}`;
    if (badgeEl) badgeEl.textContent = `${this.deckFlashcards.length} Cards in Deck`;

    this.updateFlashcardDisplay();
    this.renderFlashcardsList();
  }

  updateFlashcardDisplay() {
    const stage = document.getElementById('flashcard-stage');
    const cardInner = document.getElementById('flashcard-inner');
    const questionEl = document.getElementById('flashcard-question-text');
    const answerEl = document.getElementById('flashcard-answer-text');
    const hintEl = document.getElementById('flashcard-hint-text');
    const counterEl = document.getElementById('deck-counter');
    const creatorEl = document.getElementById('flashcard-creator-tag');

    if (!stage || !cardInner) return;

    // Reset flip
    cardInner.classList.remove('flipped');
    this.isCardFlipped = false;

    if (this.deckFlashcards.length === 0) {
      if (questionEl) questionEl.innerHTML = "No flashcards yet in this deck.";
      if (hintEl) hintEl.innerHTML = "Click 'Add Flashcard' above to create the first card!";
      if (answerEl) answerEl.innerHTML = "Cards are synced with all students in real-time.";
      if (counterEl) counterEl.textContent = "0 / 0";
      if (creatorEl) creatorEl.textContent = "PRISM DECK";
      this.adjustFlashcardHeight();
      return;
    }

    const card = this.deckFlashcards[this.currentCardIndex];

    // Helper to adjust typography density for large content so answer fits inside the card
    const applyTextLengthClass = (el, text) => {
      if (!el) return;
      const len = (text || '').length;
      el.classList.remove('text-compact', 'text-dense', 'text-long', 'text-very-long');
      if (len > 340) {
        el.classList.add('text-dense');
      } else if (len > 140) {
        el.classList.add('text-compact');
      }
    };

    if (questionEl) {
      applyTextLengthClass(questionEl, card.question);
      questionEl.innerHTML = this.formatMathContent(card.question);
      this.renderMath(questionEl);
    }

    if (answerEl) {
      applyTextLengthClass(answerEl, card.answer);
      answerEl.innerHTML = this.formatMathContent(card.answer);
      this.renderMath(answerEl);
    }

    if (hintEl) {
      if (card.hint) {
        hintEl.innerHTML = `<span>${getIcon('lightbulb', 'prism-icon-sm')}</span> Hint: ${this.formatMathContent(card.hint)}`;
        this.renderMath(hintEl);
      } else {
        hintEl.innerHTML = "";
      }
    }
    if (counterEl) counterEl.textContent = `${this.currentCardIndex + 1} / ${this.deckFlashcards.length}`;
    if (creatorEl) creatorEl.textContent = `Added by ${card.creatorName || 'Scholar'}`;

    // Dynamically calculate and set stage height based on content, bounded by visible screen area
    this.adjustFlashcardHeight();
  }

  adjustFlashcardHeight() {
    const stage = document.getElementById('flashcard-stage');
    const frontFace = document.querySelector('.flashcard-front');
    const backFace = document.querySelector('.flashcard-back');
    if (!stage || !frontFace || !backFace) return;

    const measureFace = (face) => {
      if (!face) return 330;
      let childrenTotal = 0;
      const children = Array.from(face.children);
      children.forEach(child => {
        const style = window.getComputedStyle(child);
        if (style.display !== 'none') {
          const h = Math.max(child.scrollHeight || 0, child.offsetHeight || 0);
          const mt = parseFloat(style.marginTop) || 0;
          const mb = parseFloat(style.marginBottom) || 0;
          childrenTotal += h + mt + mb;
        }
      });

      const faceStyle = window.getComputedStyle(face);
      const pt = parseFloat(faceStyle.paddingTop) || 30;
      const pb = parseFloat(faceStyle.paddingBottom) || 30;
      return childrenTotal + pt + pb + 16;
    };

    // Use requestAnimationFrame so KaTeX and browser fonts/layout are finalized
    requestAnimationFrame(() => {
      const isSmallMobile = window.innerWidth <= 480;
      const isTablet = window.innerWidth <= 768;
      const minHeight = isSmallMobile ? 260 : (isTablet ? 290 : 330);
      const maxHeightClamp = isSmallMobile ? 410 : (isTablet ? 460 : 520);
      const viewportRatio = isSmallMobile ? 0.58 : 0.65;
      // Maximum size stays within visible screen area
      const viewportMax = Math.round(Math.min(window.innerHeight * viewportRatio, maxHeightClamp));

      const frontH = measureFace(frontFace);
      const backH = measureFace(backFace);
      const neededHeight = Math.max(minHeight, frontH, backH);

      // Clamp so card fits answer and remains 100% visible on screen at once without double scrolling
      const targetHeight = Math.min(viewportMax, neededHeight);
      stage.style.height = `${targetHeight}px`;
    });
  }

  flipCurrentCard() {
    const cardInner = document.getElementById('flashcard-inner');
    if (cardInner && this.deckFlashcards.length > 0) {
      this.isCardFlipped = !this.isCardFlipped;
      cardInner.classList.toggle('flipped', this.isCardFlipped);
      this.adjustFlashcardHeight();
    }
  }

  nextFlashcard() {
    if (this.deckFlashcards.length === 0) return;
    this.currentCardIndex = (this.currentCardIndex + 1) % this.deckFlashcards.length;
    this.updateFlashcardDisplay();
  }

  prevFlashcard() {
    if (this.deckFlashcards.length === 0) return;
    this.currentCardIndex = (this.currentCardIndex - 1 + this.deckFlashcards.length) % this.deckFlashcards.length;
    this.updateFlashcardDisplay();
  }

  shuffleFlashcards() {
    if (this.deckFlashcards.length <= 1) return;
    for (let i = this.deckFlashcards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deckFlashcards[i], this.deckFlashcards[j]] = [this.deckFlashcards[j], this.deckFlashcards[i]];
    }
    this.currentCardIndex = 0;
    this.updateFlashcardDisplay();
    this.renderFlashcardsList();
    this.showToast("Flashcard deck shuffled!", "info");
  }

  renderFlashcardsList() {
    const listGrid = document.getElementById('flashcards-list-grid');
    if (!listGrid) return;

    if (this.deckFlashcards.length === 0) {
      listGrid.innerHTML = `<p style="color:var(--text-muted); font-size:0.9rem;">No cards in deck yet.</p>`;
      return;
    }

    listGrid.innerHTML = this.deckFlashcards.map((card, idx) => `
      <div class="mini-flashcard">
        <div>
          <span class="glass-badge" style="margin-bottom:8px;">Card #${idx + 1}</span>
          <div class="mini-flashcard-q">Q: ${this.formatMathContent(card.question)}</div>
          <div class="mini-flashcard-a">A: ${this.formatMathContent(card.answer)}</div>
        </div>
        <div style="font-size:0.75rem; color:var(--text-muted); display:flex; justify-content:space-between; align-items:center;">
          <span>${getIcon('user', 'prism-icon-sm')} ${this.escapeHtml(card.creatorName || 'Student')}</span>
          <button class="btn-glass" style="padding:4px 8px; font-size:0.75rem;" onclick="window.prismApp.jumpToCard(${idx})">Study Card</button>
        </div>
      </div>
    `).join('');

    this.renderMath(listGrid);
  }

  /* ==========================================================================
     Documents Hub (Notes, Short Notes, PYQs, Revision Notes, with ODT support)
     ========================================================================== */

  renderDocuments(category, documents, chapter) {
    this.activeDocuments = documents || [];
    this.selectedCategory = category;

    const info = CATEGORY_INFO[category] || { title: "Documents", iconKey: "notes", description: "" };
    
    const titleEl = document.getElementById('documents-view-title');
    const badgeEl = document.getElementById('documents-view-badge');
    const descEl = document.getElementById('documents-view-desc');
    const uploadBtnText = document.getElementById('btn-upload-doc-label');

    if (titleEl) titleEl.innerHTML = `<span style="margin-right:6px;">${getIcon(info.iconKey || 'notes', 'prism-icon-md')}</span> ${info.title}: ${this.escapeHtml(chapter.title)}`;
    if (badgeEl) badgeEl.textContent = `${this.activeDocuments.length} Shared Files`;
    if (descEl) descEl.textContent = info.description;
    if (uploadBtnText) uploadBtnText.textContent = `Upload ${info.title}`;

    const grid = document.getElementById('documents-grid');
    if (!grid) return;

    if (!documents || documents.length === 0) {
      grid.innerHTML = `
        <div class="glass-empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">${getIcon(info.iconKey || 'notes', 'prism-icon-xl')}</div>
          <h3>No ${info.title} Shared Yet</h3>
          <p>Upload lecture notes, PDFs, ODT documents or handouts to share with all students in this subject.</p>
          <button class="btn-glass btn-primary-glass" id="empty-upload-doc-btn">
            <span>${getIcon('upload', 'prism-icon-sm')}</span> Upload First ${info.title}
          </button>
        </div>
      `;
      const btn = document.getElementById('empty-upload-doc-btn');
      if (btn) btn.addEventListener('click', () => this.openUploadModal(category));
      return;
    }

    grid.innerHTML = documents.map(doc => {
      const fileNameLower = (doc.fileName || '').toLowerCase();
      const isPdf = fileNameLower.endsWith('.pdf') || doc.fileType === 'application/pdf';
      const isOdt = fileNameLower.endsWith('.odt') || (doc.fileType && doc.fileType.includes('opendocument'));
      
      let fileIconKey = 'file_doc';
      let fileBadge = 'DOC';
      if (isPdf) {
        fileIconKey = 'file_pdf';
        fileBadge = 'PDF';
      } else if (isOdt) {
        fileIconKey = 'file_odt';
        fileBadge = 'ODT';
      }

      const sizeFormatted = this.formatFileSize(doc.fileSize);
      const dateFormatted = doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'Recent';

      return `
        <div class="glass-card document-card" data-doc-id="${doc.id}">
          <div>
            <div class="doc-card-header">
              <div class="doc-type-icon">${getIcon(fileIconKey, 'prism-icon-lg')}</div>
              <span class="glass-badge">${fileBadge}</span>
            </div>
            <h4 class="doc-title">${this.escapeHtml(doc.title)}</h4>
            <p class="doc-desc">${this.escapeHtml(doc.description || 'Shared study resource available to all students.')}</p>
          </div>
          <div>
            <div class="doc-meta-info">
              <span class="doc-uploader">
                <img src="${doc.creatorPhoto || 'https://api.dicebear.com/7.x/bottts/svg?seed=prism'}" 
                     alt="avatar" style="width:20px; height:20px; border-radius:50%; object-fit:cover;">
                ${this.escapeHtml(doc.creatorName || 'Student')}
              </span>
              <span>•</span>
              <span>${sizeFormatted}</span>
              <span>•</span>
              <span>${dateFormatted}</span>
            </div>
            <div class="doc-actions-row">
              <button class="btn-glass btn-doc-download" data-download-id="${doc.id}">
                <span>${getIcon('download', 'prism-icon-sm')}</span> Download
              </button>
              <button class="btn-glass btn-doc-preview" data-preview-id="${doc.id}">
                <span>${getIcon('eye', 'prism-icon-sm')}</span> Preview
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Bind download buttons
    grid.querySelectorAll('[data-download-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-download-id');
        const docItem = documents.find(d => d.id === id);
        if (docItem) this.downloadDocument(docItem);
      });
    });

    // Bind preview buttons
    grid.querySelectorAll('[data-preview-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-preview-id');
        const docItem = documents.find(d => d.id === id);
        if (docItem) this.previewDocument(docItem);
      });
    });

    // Render mathematical equations in document titles & descriptions
    this.renderMath(grid);
  }

  /**
   * Trigger download of a shared document directly to device
   */
  downloadDocument(docItem) {
    if (!docItem || !docItem.fileUrl) {
      this.showToast("Download URL not found.", "error");
      return;
    }

    this.showToast(`Starting download: ${docItem.fileName}...`, "info");

    const a = document.createElement('a');
    a.href = docItem.fileUrl;
    a.download = docItem.fileName || "study_document.pdf";
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  /**
   * Preview PDF or document in in-app modal
   */
  previewDocument(docItem) {
    if (!docItem || !docItem.fileUrl) return;

    const modal = document.getElementById('modal-doc-preview');
    const titleEl = document.getElementById('preview-doc-title');
    const frame = document.getElementById('preview-doc-frame');
    const dlBtn = document.getElementById('preview-doc-download-btn');

    if (titleEl) titleEl.textContent = docItem.title;

    const fileNameLower = (docItem.fileName || '').toLowerCase();
    const isDocOrOdt = fileNameLower.endsWith('.odt') || fileNameLower.endsWith('.doc') || fileNameLower.endsWith('.docx');

    if (frame) {
      if (isDocOrOdt && docItem.fileUrl.startsWith('http')) {
        frame.src = `https://docs.google.com/viewer?url=${encodeURIComponent(docItem.fileUrl)}&embedded=true`;
      } else {
        frame.src = docItem.fileUrl;
      }
    }

    if (dlBtn) dlBtn.onclick = () => this.downloadDocument(docItem);

    this.openModal('modal-doc-preview');
  }

  /* ==========================================================================
     Modal Handling & Form Pre-populators
     ========================================================================== */

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = 'auto';

      // Clear preview frame if closing preview modal
      if (modalId === 'modal-doc-preview') {
        const frame = document.getElementById('preview-doc-frame');
        if (frame) frame.src = 'about:blank';
      }
    }
  }

  populateCourseDropdowns(courses, activeCourseId = null) {
    const addSelect = document.getElementById('sub-input-course');
    const editSelect = document.getElementById('edit-sub-course');

    const courseList = courses || [];
    if (courseList.length === 0) return;

    const optionsHtml = courseList.map(c => `
      <option value="${c.id}" ${c.id === activeCourseId ? 'selected' : ''}>
        ${this.escapeHtml(c.name)} (${this.escapeHtml(c.code || 'BRANCH')})
      </option>
    `).join('');

    if (addSelect) {
      addSelect.innerHTML = optionsHtml;
      if (activeCourseId) addSelect.value = activeCourseId;
    }
    if (editSelect) {
      editSelect.innerHTML = optionsHtml;
      if (activeCourseId) editSelect.value = activeCourseId;
    }
  }

  populateTargetSubjectDropdown(targetSubjectId = null) {
    const subjectSelect = document.getElementById('chap-input-subject');
    const editSubjectSelect = document.getElementById('edit-chap-subject');

    // Collect all subjects currently present from all sources
    const allMap = new Map();

    const demoSubs = [
      { id: "sub-math", name: "Engineering Mathematics", code: "MATH101", icon: "math" },
      { id: "sub-physics", name: "Applied Physics", code: "PHY201", icon: "zap" },
      { id: "sub-cs", name: "Data Structures & Algorithms", code: "CS202", icon: "code" }
    ];
    demoSubs.forEach(s => allMap.set(s.id, s));

    try {
      const localSubs = JSON.parse(localStorage.getItem('prism_subjects') || '[]');
      if (Array.isArray(localSubs)) {
        localSubs.forEach(s => { if (s && s.id) allMap.set(s.id, s); });
      }
    } catch(e) {}

    if (window.prismApp && Array.isArray(window.prismApp.currentSubjects)) {
      window.prismApp.currentSubjects.forEach(s => { if (s && s.id) allMap.set(s.id, s); });
    }

    const allSubjects = Array.from(allMap.values());
    const activeSubjectId = targetSubjectId || 
      (this.selectedSubject ? this.selectedSubject.id : 
      (subjectSelect?.value || (allSubjects[0] ? allSubjects[0].id : "")));

    const optionsHtml = allSubjects.length === 0 
      ? `<option value="">No subjects found - please create a subject first</option>`
      : allSubjects.map(s => `
          <option value="${s.id}" ${s.id === activeSubjectId ? 'selected' : ''}>
            ${this.escapeHtml(s.name)} (${this.escapeHtml(s.code || 'COURSE')})
          </option>
        `).join('');

    if (subjectSelect) subjectSelect.innerHTML = optionsHtml;
    if (editSubjectSelect) editSubjectSelect.innerHTML = optionsHtml;
  }

  openAddCourseModal() {
    const form = document.getElementById('form-add-course');
    if (form) form.reset();
    this.openModal('modal-add-course');
  }

  openEditCourseModal(course) {
    if (!course) return;
    const idEl = document.getElementById('edit-course-id');
    const nameEl = document.getElementById('edit-course-name');
    const codeEl = document.getElementById('edit-course-code');
    const iconEl = document.getElementById('edit-course-icon');
    const descEl = document.getElementById('edit-course-desc');

    if (idEl) idEl.value = course.id;
    if (nameEl) nameEl.value = course.name || '';
    if (codeEl) codeEl.value = course.code || '';
    if (iconEl) iconEl.value = course.icon || 'code';
    if (descEl) descEl.value = course.description || '';

    this.openModal('modal-edit-course');
  }

  openEditSubjectModal(subject, courses) {
    if (!subject) return;
    this.populateCourseDropdowns(courses, subject.courseId);

    const idEl = document.getElementById('edit-sub-id');
    const courseEl = document.getElementById('edit-sub-course');
    const nameEl = document.getElementById('edit-sub-name');
    const codeEl = document.getElementById('edit-sub-code');
    const iconEl = document.getElementById('edit-sub-icon');
    const descEl = document.getElementById('edit-sub-desc');

    if (idEl) idEl.value = subject.id;
    if (courseEl && subject.courseId) courseEl.value = subject.courseId;
    if (nameEl) nameEl.value = subject.name || '';
    if (codeEl) codeEl.value = subject.code || '';
    if (iconEl) iconEl.value = subject.icon || 'book';
    if (descEl) descEl.value = subject.description || '';

    this.openModal('modal-edit-subject');
  }

  openAddChapterModal(targetSubjectId = null) {
    this.populateTargetSubjectDropdown(targetSubjectId);
    this.openModal('modal-add-chapter');
  }

  openEditChapterModal(chapter, subjects) {
    if (!chapter) return;
    this.populateTargetSubjectDropdown(chapter.subjectId);

    const idEl = document.getElementById('edit-chap-id');
    const subEl = document.getElementById('edit-chap-subject');
    const unitEl = document.getElementById('edit-chap-unit');
    const titleEl = document.getElementById('edit-chap-title');
    const descEl = document.getElementById('edit-chap-desc');

    if (idEl) idEl.value = chapter.id;
    if (subEl && chapter.subjectId) subEl.value = chapter.subjectId;
    if (unitEl) unitEl.value = chapter.unitNumber || 'Unit 1';
    if (titleEl) titleEl.value = chapter.title || '';
    if (descEl) descEl.value = chapter.description || '';

    this.openModal('modal-edit-chapter');
  }

  openConfirmDeleteModal({ title, message, onConfirm }) {
    const titleEl = document.getElementById('delete-confirm-title');
    const msgEl = document.getElementById('delete-confirm-msg');
    const confirmBtn = document.getElementById('btn-confirm-delete-action');

    if (titleEl && title) titleEl.textContent = title;
    if (msgEl && message) msgEl.textContent = message;

    if (confirmBtn) {
      confirmBtn.onclick = () => {
        this.closeModal('modal-confirm-delete');
        if (onConfirm) onConfirm();
      };
    }

    this.openModal('modal-confirm-delete');
  }

  openAddFlashcardModal() {
    const tag = document.getElementById('fc-target-chapter-tag');
    if (tag && this.selectedChapter) {
      tag.textContent = `${this.selectedChapter.unitNumber || 'Unit'}: ${this.selectedChapter.title}`;
    }
    this.initMathToolbarAndPreview();
    this.openModal('modal-add-flashcard');
  }

  initMathToolbarAndPreview() {
    let lastActiveInput = document.getElementById('fc-input-question');
    const qInput = document.getElementById('fc-input-question');
    const aInput = document.getElementById('fc-input-answer');
    const previewContainer = document.getElementById('fc-math-preview-container');
    const previewQ = document.getElementById('fc-math-preview-q');
    const previewA = document.getElementById('fc-math-preview-a');

    if (qInput) {
      qInput.onfocus = () => { lastActiveInput = qInput; };
    }
    if (aInput) {
      aInput.onfocus = () => { lastActiveInput = aInput; };
    }

    const updatePreview = () => {
      if (!previewContainer || !previewQ || !previewA) return;
      const qVal = qInput?.value.trim() || '';
      const aVal = aInput?.value.trim() || '';

      if (qVal || aVal) {
        previewContainer.style.display = 'block';
        previewQ.innerHTML = qVal ? `Q: ${this.formatMathContent(qVal)}` : '';
        previewA.innerHTML = aVal ? `A: ${this.formatMathContent(aVal)}` : '';
        this.renderMath(previewContainer);
      } else {
        previewContainer.style.display = 'none';
      }
    };

    if (qInput) qInput.oninput = updatePreview;
    if (aInput) aInput.oninput = updatePreview;

    // Attach click to quick math symbol buttons
    document.querySelectorAll('.math-sym-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        const snippet = btn.getAttribute('data-latex') || '';
        const target = lastActiveInput || qInput;
        if (!target) return;

        const start = target.selectionStart || 0;
        const end = target.selectionEnd || 0;
        const val = target.value;
        target.value = val.substring(0, start) + snippet + val.substring(end);
        target.focus();
        target.selectionStart = target.selectionEnd = start + snippet.length;

        updatePreview();
      };
    });

    updatePreview();
  }

  formatMathContent(text) {
    if (!text) return "";
    return String(text).replace(/\n/g, '<br>');
  }

  renderMath(container) {
    if (!container) return;

    if (window.renderMathInElement) {
      try {
        window.renderMathInElement(container, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '\\[', right: '\\]', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\(', right: '\\)', display: false }
          ],
          throwOnError: false,
          errorColor: '#D97706'
        });
        return;
      } catch (err) {
        console.warn("KaTeX renderMathInElement error:", err);
      }
    }

    if (window.katex) {
      try {
        let html = container.innerHTML;
        html = html.replace(/\$\$([\s\S]+?)\$\$/g, (m, expr) => {
          try {
            return window.katex.renderToString(expr.trim(), { displayMode: true, throwOnError: false });
          } catch(e) { return m; }
        });
        html = html.replace(/\$([^\$\n]+?)\$/g, (m, expr) => {
          try {
            return window.katex.renderToString(expr.trim(), { displayMode: false, throwOnError: false });
          } catch(e) { return m; }
        });
        container.innerHTML = html;
      } catch(e) {}
    }
  }

  renderAllMathOnPage() {
    const stage = document.getElementById('flashcard-stage');
    if (stage) this.renderMath(stage);

    const listGrid = document.getElementById('flashcards-list-grid');
    if (listGrid) this.renderMath(listGrid);

    const chapGrid = document.getElementById('chapters-grid');
    if (chapGrid) this.renderMath(chapGrid);

    const subGrid = document.getElementById('subjects-grid');
    if (subGrid) this.renderMath(subGrid);
  }

  openUploadModal(category) {
    this.selectedCategory = category;
    const catSelect = document.getElementById('upload-doc-category');
    if (catSelect && category) {
      catSelect.value = category;
    }
    const tag = document.getElementById('doc-target-chapter-tag');
    if (tag && this.selectedChapter) {
      tag.textContent = `${this.selectedChapter.unitNumber || 'Unit'}: ${this.selectedChapter.title}`;
    }
    this.openModal('modal-upload-document');
  }

  /* ==========================================================================
     Toast Notifications
     ========================================================================== */

  showToast(message, type = "info") {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconSvg = getIcon('prism', 'prism-icon-sm');
    if (type === "success") iconSvg = getIcon('check', 'prism-icon-sm');
    if (type === "error") iconSvg = getIcon('alert', 'prism-icon-sm');

    toast.innerHTML = `<span style="margin-right:6px;">${iconSvg}</span> <span>${this.escapeHtml(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  /* ==========================================================================
     Utility Helpers
     ========================================================================== */

  escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  formatFileSize(bytes) {
    if (!bytes || bytes === 0) return "0 KB";
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}

export const ui = new UIManager();
if (typeof window !== 'undefined') {
  window.prismUI = ui;
}