/**
 * Prism Study Planner & Assistant - Main Application Controller
 * Orchestrates Authentication, Real-Time Cloud Firestore Sync, Supabase Storage, and Liquid Glass UI.
 */

import { loginWithGoogle, logoutUser, onAuthChange, getCurrentUser } from "./auth.js";
import { 
  subscribeCourses,
  addCourse,
  updateCourse,
  deleteCourse,
  subscribeSubjects, 
  addSubject, 
  updateSubject,
  deleteSubject,
  subscribeChapters, 
  addChapter, 
  updateChapter,
  deleteChapter,
  subscribeFlashcards, 
  addFlashcard, 
  deleteFlashcard, 
  subscribeResources, 
  uploadResource 
} from "./db.js";
import { ui, getIcon, CATEGORY_INFO } from "./ui.js";
import { isFirebaseConfigured } from "./firebase-config.js";
import { isSupabaseConfigured } from "./supabase-config.js";

class PrismApp {
  constructor() {
    this.currentCourses = [];
    this.selectedCourse = "all"; // 'all' or course object

    this.currentSubjects = [];
    this.currentChapters = [];
    this.currentFlashcards = [];
    this.currentResources = [];

    // Real-time listener unsubscribers
    this.unsubCourses = null;
    this.unsubSubjects = null;
    this.unsubChapters = null;
    this.unsubFlashcards = null;
    this.unsubResources = null;

    // File selection state
    this.selectedUploadFile = null;
  }

  init() {
    this.initAuth();
    this.initEventListeners();
    this.initKeyboardControls();
    this.initDragDrop();
    this.checkConfigBanner();

    // Expose app instance globally for inline click handlers
    window.prismApp = this;
  }

  /* ==========================================================================
     Auth & Session Handling
     ========================================================================== */

  initAuth() {
    onAuthChange((user) => {
      this.handleAuthState(user);
    });
  }

  handleAuthState(user) {
    const loginSection = document.getElementById('login-section');
    const mainSection = document.getElementById('main-app-content');
    const userChip = document.getElementById('user-profile-chip');
    const userName = document.getElementById('user-display-name');
    const userAvatar = document.getElementById('user-avatar-img');

    if (user) {
      // User is authenticated
      if (loginSection) loginSection.style.display = 'none';
      if (mainSection) mainSection.style.display = 'block';
      if (userChip) userChip.style.display = 'flex';
      if (userName) userName.textContent = user.displayName;
      if (userAvatar) {
        userAvatar.src = user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`;
      }

      // Start real-time sync for courses & subjects
      this.startCoursesSync();
      this.startSubjectsSync();
    } else {
      // User is signed out
      if (loginSection) loginSection.style.display = 'flex';
      if (mainSection) mainSection.style.display = 'none';
      if (userChip) userChip.style.display = 'none';

      // Clean up active listeners
      this.cleanupListeners();
    }
  }

  checkConfigBanner() {
    const banner = document.getElementById('config-status-badge');
    if (banner) {
      const fbLive = isFirebaseConfigured();
      const supaLive = isSupabaseConfigured();

      if (fbLive && supaLive) {
        banner.innerHTML = `<span class="sync-dot"></span> Firebase + Supabase Live`;
        banner.title = "Connected to Firebase Firestore & Supabase Storage! Documents and real-time sync are active across all students.";
        banner.className = "sync-indicator";
      } else if (fbLive) {
        banner.innerHTML = `<span class="sync-dot"></span> Firebase Live • Supabase Storage Ready`;
        banner.title = "Connected to Firebase Firestore! Add Supabase credentials in js/supabase-config.js for free cloud CDN document hosting.";
        banner.className = "sync-indicator";
        banner.style.cursor = "pointer";
        banner.onclick = () => ui.openModal('modal-firebase-setup');
      } else {
        banner.innerHTML = `<span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#F59E0B; margin-right:4px;"></span> Demo Mode (Config Pending)`;
        banner.className = "glass-badge";
        banner.title = "Add your Firebase and Supabase credentials to enable live cloud synchronization.";
        banner.style.cursor = "pointer";
        banner.onclick = () => ui.openModal('modal-firebase-setup');
      }
    }
  }

  /* ==========================================================================
     Real-Time Data Sync Listeners
     ========================================================================== */

  startCoursesSync() {
    if (this.unsubCourses) this.unsubCourses();

    this.unsubCourses = subscribeCourses((courses) => {
      this.currentCourses = courses;

      // Update selectedCourse reference if it was edited
      if (this.selectedCourse && this.selectedCourse !== 'all') {
        const updatedCourse = courses.find(c => c.id === this.selectedCourse.id);
        if (updatedCourse) {
          this.selectedCourse = updatedCourse;
          ui.selectedCourse = updatedCourse;
        }
      }

      ui.renderCourses(this.currentCourses, (selected) => {
        this.handleCourseSelected(selected);
      });

      // Update dropdowns in Add/Edit Subject modals
      ui.populateCourseDropdowns(this.currentCourses, this.selectedCourse !== 'all' ? this.selectedCourse.id : null);
    });
  }

  handleCourseSelected(selected) {
    this.selectedCourse = selected;
    ui.selectedCourse = selected;

    ui.renderCourses(this.currentCourses, (c) => this.handleCourseSelected(c));
    this.renderSubjectsList();
    ui.populateCourseDropdowns(this.currentCourses, this.selectedCourse !== 'all' ? this.selectedCourse.id : null);
  }

  startSubjectsSync() {
    if (this.unsubSubjects) this.unsubSubjects();

    this.unsubSubjects = subscribeSubjects((subjects) => {
      this.currentSubjects = subjects;
      this.renderSubjectsList();
      ui.populateTargetSubjectDropdown();
    });
  }

  renderSubjectsList() {
    ui.renderSubjects(
      this.currentSubjects, 
      (subject) => this.selectSubject(subject),
      (subject) => this.openEditSubject(subject),
      (subject) => this.confirmDeleteSubject(subject)
    );
  }

  selectSubject(subject) {
    ui.selectedSubject = subject;
    ui.navigateTo('chapters-view');

    if (this.unsubChapters) this.unsubChapters();

    this.unsubChapters = subscribeChapters(subject.id, (chapters) => {
      this.currentChapters = chapters;
      ui.renderChapters(
        subject, 
        chapters, 
        (chapter) => this.selectChapter(chapter),
        (chapter) => this.openEditChapter(chapter),
        (chapter) => this.confirmDeleteChapter(chapter)
      );
    });
  }

  selectChapter(chapter) {
    ui.selectedChapter = chapter;
    ui.navigateTo('tiles-view');

    ui.renderTiles(chapter, (category) => {
      this.selectCategory(category);
    });
  }

  selectCategory(category) {
    ui.selectedCategory = category;

    if (category === 'flashcards') {
      ui.navigateTo('flashcards-view');
      this.startFlashcardsSync(ui.selectedChapter.id);
    } else {
      ui.navigateTo('documents-view');
      this.startResourcesSync(ui.selectedChapter.id, category);
    }
  }

  startFlashcardsSync(chapterId) {
    if (this.unsubFlashcards) this.unsubFlashcards();

    this.unsubFlashcards = subscribeFlashcards(chapterId, (cards) => {
      this.currentFlashcards = cards;
      ui.renderFlashcardsDeck(cards, ui.selectedChapter);
    });
  }

  startResourcesSync(chapterId, category) {
    if (this.unsubResources) this.unsubResources();

    this.unsubResources = subscribeResources(chapterId, category, (resources) => {
      this.currentResources = resources;
      ui.renderDocuments(category, resources, ui.selectedChapter);
    });
  }

  cleanupListeners() {
    if (this.unsubCourses) this.unsubCourses();
    if (this.unsubSubjects) this.unsubSubjects();
    if (this.unsubChapters) this.unsubChapters();
    if (this.unsubFlashcards) this.unsubFlashcards();
    if (this.unsubResources) this.unsubResources();
  }

  /* ==========================================================================
     CRUD Action Openers & Confirmations
     ========================================================================== */

  openAddCourse() {
    ui.openAddCourseModal();
  }

  openAddSubjectForCourse(courseId = null) {
    const targetCourseId = courseId || (this.selectedCourse && this.selectedCourse !== 'all' ? this.selectedCourse.id : null);
    ui.populateCourseDropdowns(this.currentCourses, targetCourseId);
    ui.openModal('modal-add-subject');
  }

  openEditSubject(subject) {
    ui.openEditSubjectModal(subject, this.currentCourses);
  }

  confirmDeleteSubject(subject) {
    ui.openConfirmDeleteModal({
      title: "Remove Subject",
      message: `Are you sure you want to remove "${subject.name}"? This subject and its units will be removed across all connected students.`,
      onConfirm: async () => {
        ui.showToast(`Removing "${subject.name}"...`, "info");
        const res = await deleteSubject(subject.id);
        if (res.success) {
          ui.showToast(`Subject "${subject.name}" removed successfully.`, "success");
          if (ui.selectedSubject && ui.selectedSubject.id === subject.id) {
            ui.navigateTo('subjects-view');
          }
        } else {
          ui.showToast("Could not remove subject: " + (res.error || "Unknown error"), "error");
        }
      }
    });
  }

  openEditChapter(chapter) {
    ui.openEditChapterModal(chapter, this.currentSubjects);
  }

  confirmDeleteChapter(chapter) {
    ui.openConfirmDeleteModal({
      title: "Remove Chapter / Unit",
      message: `Are you sure you want to remove "${chapter.title}" (${chapter.unitNumber || 'Unit'})? All shared flashcards and documents in this unit will also be removed.`,
      onConfirm: async () => {
        ui.showToast(`Removing "${chapter.title}"...`, "info");
        const res = await deleteChapter(chapter.id);
        if (res.success) {
          ui.showToast(`Chapter "${chapter.title}" removed successfully.`, "success");
          if (ui.selectedChapter && ui.selectedChapter.id === chapter.id) {
            ui.navigateTo('chapters-view');
          }
        } else {
          ui.showToast("Could not remove chapter: " + (res.error || "Unknown error"), "error");
        }
      }
    });
  }

  /* ==========================================================================
     Event Listeners & Form Submissions
     ========================================================================== */

  initEventListeners() {
    // Google Sign-In button
    const loginBtn = document.getElementById('btn-google-login');
    if (loginBtn) {
      loginBtn.addEventListener('click', async () => {
        loginBtn.innerHTML = `<span>Signing in...</span>`;
        const res = await loginWithGoogle();
        if (res.success) {
          if (res.isDemo) {
            ui.showToast("Signed in with Demo Scholar account! Add Firebase keys in js/firebase-config.js for live Google Auth.", "info");
          } else {
            ui.showToast(`Welcome back, ${res.user.displayName}!`, "success");
          }
        } else {
          ui.showToast(`Sign in error: ${res.error}`, "error");
          loginBtn.innerHTML = `
            <svg class="google-icon-svg" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            Sign in with Google Account
          `;
        }
      });
    }

    // Logout button
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        await logoutUser();
        ui.showToast("Signed out successfully.", "info");
      });
    }

    // Aura Yellow Dark Mode Toggle Button
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        ui.toggleTheme();
      });
    }

    // Course / Academic Branch Action Buttons
    const openAddCourseBtn = document.getElementById('btn-open-add-course');
    if (openAddCourseBtn) {
      openAddCourseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openAddCourse();
      });
    }

    const addSubToCourseBtn = document.getElementById('btn-add-subject-to-course');
    if (addSubToCourseBtn) {
      addSubToCourseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const activeCourseId = (this.selectedCourse && this.selectedCourse !== 'all') ? this.selectedCourse.id : null;
        this.openAddSubjectForCourse(activeCourseId);
      });
    }

    const editActiveCourseBtn = document.getElementById('btn-edit-active-course');
    if (editActiveCourseBtn) {
      editActiveCourseBtn.addEventListener('click', () => {
        if (this.selectedCourse && this.selectedCourse !== 'all') {
          ui.openEditCourseModal(this.selectedCourse);
        }
      });
    }

    const deleteActiveCourseBtn = document.getElementById('btn-delete-active-course');
    if (deleteActiveCourseBtn) {
      deleteActiveCourseBtn.addEventListener('click', () => {
        if (this.selectedCourse && this.selectedCourse !== 'all') {
          const course = this.selectedCourse;
          ui.openConfirmDeleteModal({
            title: "Remove Course / Branch",
            message: `Are you sure you want to remove "${course.name}"? All associated subjects will remain accessible under "All Courses".`,
            onConfirm: async () => {
              ui.showToast(`Removing "${course.name}"...`, "info");
              const res = await deleteCourse(course.id);
              if (res.success) {
                this.handleCourseSelected('all');
                ui.showToast(`Branch "${course.name}" removed successfully.`, "success");
              } else {
                ui.showToast("Could not remove branch: " + (res.error || "Unknown error"), "error");
              }
            }
          });
        }
      });
    }

    // Form Add Course Submit
    const formAddCourse = document.getElementById('form-add-course');
    if (formAddCourse) {
      formAddCourse.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('course-input-name');
        const codeInput = document.getElementById('course-input-code');
        const iconInput = document.getElementById('course-input-icon');
        const descInput = document.getElementById('course-input-desc');

        const name = nameInput ? nameInput.value.trim() : "";
        const code = codeInput ? codeInput.value.trim() : "";
        const icon = iconInput ? (iconInput.value || "code") : "code";
        const desc = descInput ? descInput.value.trim() : "";

        if (!name || !code) {
          ui.showToast("Please provide both a branch name and code.", "error");
          return;
        }

        const submitBtn = document.getElementById('btn-submit-add-course') || formAddCourse.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `<span>Adding...</span>`;
        }

        ui.showToast(`Creating branch "${name}"...`, "info");
        try {
          const res = await addCourse({ name, code, icon, description: desc });
          if (res && res.success) {
            ui.showToast(`Academic branch "${name}" created! You can now add subjects into it.`, "success");
            formAddCourse.reset();
            ui.closeModal('modal-add-course');

            const createdCourse = res.course || this.currentCourses.find(c => c.id === res.id) || {
              id: res.id,
              name,
              code,
              icon,
              description: desc
            };

            // Immediately switch to the newly created course!
            this.handleCourseSelected(createdCourse);
          } else {
            ui.showToast("Could not create branch: " + (res?.error || "Error"), "error");
          }
        } catch (err) {
          console.error("Error creating course:", err);
          ui.showToast("Error creating branch: " + err.message, "error");
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<span>${getIcon('plus', 'prism-icon-sm')}</span> Add Course`;
          }
        }
      });
    }

    // Form Edit Course Submit
    const formEditCourse = document.getElementById('form-edit-course');
    if (formEditCourse) {
      formEditCourse.addEventListener('submit', async (e) => {
        e.preventDefault();
        const courseId = document.getElementById('edit-course-id').value;
        const name = document.getElementById('edit-course-name').value.trim();
        const code = document.getElementById('edit-course-code').value.trim();
        const icon = document.getElementById('edit-course-icon').value || "code";
        const desc = document.getElementById('edit-course-desc').value.trim();

        if (!courseId || !name || !code) return;

        ui.showToast("Saving changes to branch...", "info");
        const res = await updateCourse(courseId, { name, code, icon, description: desc });
        if (res.success) {
          ui.showToast(`Branch "${name}" updated successfully!`, "success");
          ui.closeModal('modal-edit-course');
          if (this.selectedCourse && this.selectedCourse.id === courseId) {
            this.selectedCourse = { ...this.selectedCourse, name, code, icon, description: desc };
            ui.selectedCourse = this.selectedCourse;
            ui.renderCourses(this.currentCourses, (c) => this.handleCourseSelected(c));
          }
        } else {
          ui.showToast("Could not update branch: " + (res.error || "Error"), "error");
        }
      });
    }

    // Modal Trigger Buttons
    const openAddSubjectBtn = document.getElementById('btn-open-add-subject');
    if (openAddSubjectBtn) {
      openAddSubjectBtn.addEventListener('click', () => {
        ui.populateCourseDropdowns(this.currentCourses, this.selectedCourse !== 'all' ? this.selectedCourse.id : null);
        ui.openModal('modal-add-subject');
      });
    }

    const openAddChapterBtn = document.getElementById('btn-open-add-chapter');
    if (openAddChapterBtn) {
      openAddChapterBtn.addEventListener('click', () => ui.openAddChapterModal(ui.selectedSubject?.id));
    }

    const openAddFlashcardBtn = document.getElementById('btn-open-add-flashcard');
    if (openAddFlashcardBtn) {
      openAddFlashcardBtn.addEventListener('click', () => ui.openAddFlashcardModal());
    }

    const openUploadDocBtn = document.getElementById('btn-open-upload-doc');
    if (openUploadDocBtn) {
      openUploadDocBtn.addEventListener('click', () => ui.openUploadModal(ui.selectedCategory || 'notes'));
    }

    // Back Buttons
    const backToSubjectsBtn = document.getElementById('btn-back-to-subjects');
    if (backToSubjectsBtn) {
      backToSubjectsBtn.addEventListener('click', () => ui.navigateTo('subjects-view'));
    }

    const backToChaptersBtn = document.getElementById('btn-back-to-chapters');
    if (backToChaptersBtn) {
      backToChaptersBtn.addEventListener('click', () => ui.navigateTo('chapters-view'));
    }

    const backToTilesFromFcBtn = document.getElementById('btn-back-to-tiles-from-fc');
    if (backToTilesFromFcBtn) {
      backToTilesFromFcBtn.addEventListener('click', () => ui.navigateTo('tiles-view'));
    }

    const backToTilesFromDocsBtn = document.getElementById('btn-back-to-tiles-from-docs');
    if (backToTilesFromDocsBtn) {
      backToTilesFromDocsBtn.addEventListener('click', () => ui.navigateTo('tiles-view'));
    }

    // Modal Close buttons
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-close-modal');
        ui.closeModal(modalId);
      });
    });

    // Close on backdrop click
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          ui.closeModal(modal.id);
        }
      });
    });

    // Add Subject Form Submit
    const formAddSubject = document.getElementById('form-add-subject');
    if (formAddSubject) {
      formAddSubject.addEventListener('submit', async (e) => {
        e.preventDefault();
        const courseId = document.getElementById('sub-input-course').value;
        const name = document.getElementById('sub-input-name').value.trim();
        const code = document.getElementById('sub-input-code').value.trim();
        const desc = document.getElementById('sub-input-desc').value.trim();
        const icon = document.getElementById('sub-input-icon').value || "book";

        if (!name) return;

        ui.showToast("Adding subject to cloud...", "info");
        const res = await addSubject({ courseId, name, code, description: desc, icon });
        if (res.success) {
          ui.showToast(`Subject "${name}" added and shared with all students!`, "success");
          formAddSubject.reset();
          ui.closeModal('modal-add-subject');

          // Switch to this course if not already viewing it so the student immediately sees their new subject
          if (courseId && (!this.selectedCourse || this.selectedCourse === 'all' || this.selectedCourse.id !== courseId)) {
            const targetCourse = this.currentCourses.find(c => c.id === courseId);
            if (targetCourse) {
              this.handleCourseSelected(targetCourse);
            }
          }
        } else {
          ui.showToast("Could not add subject: " + (res.error || "Error"), "error");
        }
      });
    }

    // Edit Subject Form Submit
    const formEditSubject = document.getElementById('form-edit-subject');
    if (formEditSubject) {
      formEditSubject.addEventListener('submit', async (e) => {
        e.preventDefault();
        const subjectId = document.getElementById('edit-sub-id').value;
        const courseId = document.getElementById('edit-sub-course').value;
        const name = document.getElementById('edit-sub-name').value.trim();
        const code = document.getElementById('edit-sub-code').value.trim();
        const desc = document.getElementById('edit-sub-desc').value.trim();
        const icon = document.getElementById('edit-sub-icon').value || "book";

        if (!subjectId || !name) return;

        ui.showToast("Saving changes to subject...", "info");
        const res = await updateSubject(subjectId, { courseId, name, code, description: desc, icon });
        if (res.success) {
          ui.showToast(`Subject "${name}" updated successfully!`, "success");
          ui.closeModal('modal-edit-subject');
          if (ui.selectedSubject && ui.selectedSubject.id === subjectId) {
            ui.selectedSubject = { ...ui.selectedSubject, courseId, name, code, description: desc, icon };
            const nameEl = document.getElementById('chapter-view-subject-title');
            const codeEl = document.getElementById('chapter-view-subject-code');
            const descEl = document.getElementById('chapter-view-subject-desc');
            if (nameEl) nameEl.textContent = name;
            if (codeEl) codeEl.textContent = code || 'COURSE';
            if (descEl) descEl.textContent = desc || '';
          }
        } else {
          ui.showToast("Could not update subject: " + (res.error || "Error"), "error");
        }
      });
    }

    // Add Chapter Form Submit
    const formAddChapter = document.getElementById('form-add-chapter');
    if (formAddChapter) {
      formAddChapter.addEventListener('submit', async (e) => {
        e.preventDefault();

        const subjectSelect = document.getElementById('chap-input-subject');
        let subjectId = subjectSelect ? subjectSelect.value : null;
        if (!subjectId && ui.selectedSubject) {
          subjectId = ui.selectedSubject.id;
        }

        if (!subjectId) {
          ui.showToast("Please add or select a subject first!", "error");
          return;
        }

        const titleInput = document.getElementById('chap-input-title');
        const unitInput = document.getElementById('chap-input-unit');
        const descInput = document.getElementById('chap-input-desc');

        const title = titleInput.value.trim();
        const unitNumber = unitInput.value.trim() || "Unit 1";
        const desc = descInput.value.trim();

        if (!title) {
          ui.showToast("Please enter a chapter or unit title.", "error");
          titleInput.focus();
          return;
        }

        const submitBtn = document.getElementById('btn-submit-add-chapter') || formAddChapter.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = "Creating...";
        }

        ui.showToast("Creating chapter/unit...", "info");
        try {
          const res = await addChapter({
            subjectId,
            title,
            unitNumber,
            description: desc
          });

          if (res && res.success) {
            if (res.warning) {
              ui.showToast(res.warning, "info");
            } else {
              ui.showToast(`Chapter "${title}" created successfully!`, "success");
            }
            formAddChapter.reset();
            unitInput.value = "Unit 1";
            ui.closeModal('modal-add-chapter');

            // Switch to the target subject if different
            if (this.currentSubjects) {
              const matchedSub = this.currentSubjects.find(s => s.id === subjectId);
              if (matchedSub && (!ui.selectedSubject || ui.selectedSubject.id !== subjectId)) {
                this.selectSubject(matchedSub);
              }
            }
          } else {
            ui.showToast("Could not create chapter: " + (res?.error || "Unknown error"), "error");
          }
        } catch (err) {
          console.error("Error creating chapter:", err);
          ui.showToast("Error creating chapter: " + err.message, "error");
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Create Chapter";
          }
        }
      });
    }

    // Edit Chapter Form Submit
    const formEditChapter = document.getElementById('form-edit-chapter');
    if (formEditChapter) {
      formEditChapter.addEventListener('submit', async (e) => {
        e.preventDefault();
        const chapterId = document.getElementById('edit-chap-id').value;
        const subjectId = document.getElementById('edit-chap-subject').value;
        const unitNumber = document.getElementById('edit-chap-unit').value.trim() || "Unit 1";
        const title = document.getElementById('edit-chap-title').value.trim();
        const desc = document.getElementById('edit-chap-desc').value.trim();

        if (!chapterId || !title) return;

        ui.showToast("Saving changes to chapter...", "info");
        const res = await updateChapter(chapterId, { subjectId, unitNumber, title, description: desc });
        if (res.success) {
          ui.showToast(`Chapter "${title}" updated successfully!`, "success");
          ui.closeModal('modal-edit-chapter');
          if (ui.selectedChapter && ui.selectedChapter.id === chapterId) {
            ui.selectedChapter = { ...ui.selectedChapter, subjectId, unitNumber, title, description: desc };
            const titleEl = document.getElementById('tiles-view-chapter-title');
            const badgeEl = document.getElementById('tiles-view-chapter-badge');
            const descEl = document.getElementById('tiles-view-chapter-desc');
            if (titleEl) titleEl.textContent = title;
            if (badgeEl) badgeEl.textContent = `${ui.selectedSubject?.name || 'Subject'} • ${unitNumber}`;
            if (descEl) descEl.textContent = desc || '';
          }
        } else {
          ui.showToast("Could not update chapter: " + (res.error || "Error"), "error");
        }
      });
    }

    // Add Flashcard Form Submit
    const formAddFlashcard = document.getElementById('form-add-flashcard');
    if (formAddFlashcard) {
      formAddFlashcard.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!ui.selectedChapter) {
          ui.showToast("Please open a chapter first to add flashcards to it.", "error");
          return;
        }

        const question = document.getElementById('fc-input-question').value.trim();
        const answer = document.getElementById('fc-input-answer').value.trim();
        const hint = document.getElementById('fc-input-hint').value.trim();

        if (!question || !answer) {
          ui.showToast("Please provide both a question and an answer.", "error");
          return;
        }

        ui.showToast("Adding flashcard to deck...", "info");
        try {
          const res = await addFlashcard({
            chapterId: ui.selectedChapter.id,
            subjectId: ui.selectedSubject ? ui.selectedSubject.id : "default",
            question,
            answer,
            hint
          });

          if (res && res.success) {
            if (res.warning) {
              ui.showToast(res.warning, "info");
            } else {
              ui.showToast("Flashcard added and synced!", "success");
            }
            formAddFlashcard.reset();
            ui.closeModal('modal-add-flashcard');
          } else {
            ui.showToast("Could not add flashcard: " + (res?.error || "Error"), "error");
          }
        } catch (err) {
          ui.showToast("Flashcard error: " + err.message, "error");
        }
      });
    }

    // Upload Document Form Submit (with ODT support)
    const formUploadDoc = document.getElementById('form-upload-document');
    if (formUploadDoc) {
      formUploadDoc.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!ui.selectedChapter) {
          ui.showToast("Please open a chapter first to upload documents.", "error");
          return;
        }

        const category = document.getElementById('upload-doc-category').value;
        const title = document.getElementById('upload-doc-title').value;
        const desc = document.getElementById('upload-doc-desc').value;
        const file = this.selectedUploadFile;

        if (!file) {
          ui.showToast("Please choose or drop a PDF, ODT or document to upload.", "error");
          return;
        }

        const submitBtn = document.getElementById('btn-submit-upload-doc');
        if (submitBtn) submitBtn.innerHTML = `<span>Uploading...</span>`;

        try {
          ui.showToast(`Uploading "${file.name}" to cloud storage...`, "info");
          const res = await uploadResource({
            chapterId: ui.selectedChapter.id,
            subjectId: ui.selectedSubject ? ui.selectedSubject.id : "default",
            category,
            title: title || file.name,
            description: desc,
            file
          });

          if (res && res.success) {
            if (res.warning) {
              ui.showToast(res.warning, "info");
            } else {
              ui.showToast("Document uploaded! All students can now view & download it.", "success");
            }
            formUploadDoc.reset();
            this.clearFileSelection();
            ui.closeModal('modal-upload-document');
          } else {
            ui.showToast("Upload could not complete: " + (res?.error || "Error"), "error");
          }
        } catch (err) {
          ui.showToast("Upload failed: " + err.message, "error");
        } finally {
          if (submitBtn) submitBtn.innerHTML = `<span>${getIcon('upload', 'prism-icon-sm')}</span> Upload & Share with All`;
        }
      });
    }

    // Flashcard Deck Interactions (Desktop Click & Mobile Touch Gestures)
    const stage = document.getElementById('flashcard-stage');
    if (stage) {
      let touchStartX = 0;
      let touchStartY = 0;
      let touchStartTime = 0;
      let isSwiping = false;

      stage.addEventListener('touchstart', (e) => {
        if (!e.changedTouches || e.changedTouches.length === 0) return;
        touchStartX = e.changedTouches[0].clientX;
        touchStartY = e.changedTouches[0].clientY;
        touchStartTime = Date.now();
        isSwiping = false;
      }, { passive: true });

      stage.addEventListener('touchmove', (e) => {
        if (!e.changedTouches || e.changedTouches.length === 0) return;
        const deltaX = e.changedTouches[0].clientX - touchStartX;
        const deltaY = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(deltaX) > 25 && Math.abs(deltaX) > Math.abs(deltaY)) {
          isSwiping = true;
        }
      }, { passive: true });

      stage.addEventListener('touchend', (e) => {
        if (!e.changedTouches || e.changedTouches.length === 0) return;
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const elapsed = Date.now() - touchStartTime;

        // Check if horizontal swipe gesture occurred (deltaX > 40px within 600ms)
        if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) && elapsed < 600) {
          if (deltaX < 0) {
            // Swipe left -> advance to next card
            ui.nextFlashcard();
          } else {
            // Swipe right -> return to previous card
            ui.prevFlashcard();
          }
          isSwiping = true;
        } else if (!isSwiping && Math.abs(deltaX) < 15 && Math.abs(deltaY) < 15) {
          // Clean tap without drag -> flip card
          ui.flipCurrentCard();
        }
      });

      // Desktop click event (ignore if synthetic touch event)
      stage.addEventListener('click', (e) => {
        if (e.pointerType === 'touch') return;
        ui.flipCurrentCard();
      });
    }

    const nextCardBtn = document.getElementById('btn-next-card');
    if (nextCardBtn) {
      nextCardBtn.addEventListener('click', () => ui.nextFlashcard());
    }

    const prevCardBtn = document.getElementById('btn-prev-card');
    if (prevCardBtn) {
      prevCardBtn.addEventListener('click', () => ui.prevFlashcard());
    }

    const shuffleBtn = document.getElementById('btn-shuffle-cards');
    if (shuffleBtn) {
      shuffleBtn.addEventListener('click', () => ui.shuffleFlashcards());
    }

    // Search bar for subjects
    const searchSubjectsInput = document.getElementById('search-subjects-input');
    if (searchSubjectsInput) {
      searchSubjectsInput.addEventListener('input', () => {
        this.renderSubjectsList();
      });
    }
  }

  /* ==========================================================================
     Drag & Drop File Upload Handler
     ========================================================================== */

  initDragDrop() {
    const dropzone = document.getElementById('file-dropzone');
    const fileInput = document.getElementById('doc-file-input');

    if (!dropzone || !fileInput) return;

    dropzone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        this.handleFileSelected(e.target.files[0]);
      }
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add('dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('dragover');
      }, false);
    });

    dropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      if (dt.files && dt.files[0]) {
        this.handleFileSelected(dt.files[0]);
      }
    });
  }

  handleFileSelected(file) {
    this.selectedUploadFile = file;

    const preview = document.getElementById('selected-file-preview');
    const nameEl = document.getElementById('selected-file-name');
    const sizeEl = document.getElementById('selected-file-size');
    const titleInput = document.getElementById('upload-doc-title');

    if (preview && nameEl && sizeEl) {
      nameEl.textContent = file.name;
      sizeEl.textContent = ui.formatFileSize(file.size);
      preview.style.display = 'flex';
    }

    if (titleInput && !titleInput.value) {
      // Auto-populate title without extension
      titleInput.value = file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
    }
  }

  clearFileSelection() {
    this.selectedUploadFile = null;
    const fileInput = document.getElementById('doc-file-input');
    if (fileInput) fileInput.value = "";
    const preview = document.getElementById('selected-file-preview');
    if (preview) preview.style.display = 'none';
  }

  /* ==========================================================================
     Keyboard Controls (For Flashcards)
     ========================================================================== */

  initKeyboardControls() {
    window.addEventListener('keydown', (e) => {
      if (ui.currentView === 'flashcards-view') {
        // Prevent if user is typing in an input
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

        if (e.code === 'Space') {
          e.preventDefault();
          ui.flipCurrentCard();
        } else if (e.code === 'ArrowRight') {
          ui.nextFlashcard();
        } else if (e.code === 'ArrowLeft') {
          ui.prevFlashcard();
        }
      }
    });
  }

  jumpToCard(index) {
    ui.currentCardIndex = index;
    ui.updateFlashcardDisplay();
    const stage = document.getElementById('flashcard-stage');
    if (stage) {
      stage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  }

  /**
   * Get all available subjects across Firestore, local storage, and starter demo
   */
  getAllSubjects() {
    const map = new Map();
    const demoSubs = [
      { id: "sub-math", name: "Engineering Mathematics", code: "MATH101", icon: "math" },
      { id: "sub-physics", name: "Applied Physics", code: "PHY201", icon: "zap" },
      { id: "sub-cs", name: "Data Structures & Algorithms", code: "CS202", icon: "code" }
    ];
    demoSubs.forEach(s => map.set(s.id, s));

    try {
      const local = JSON.parse(localStorage.getItem('prism_subjects') || '[]');
      if (Array.isArray(local)) {
        local.forEach(s => { if (s && s.id) map.set(s.id, s); });
      }
    } catch (e) {}

    if (Array.isArray(this.currentSubjects)) {
      this.currentSubjects.forEach(s => { if (s && s.id) map.set(s.id, s); });
    }

    return Array.from(map.values());
  }
}

// Bootstrap application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new PrismApp();
  app.init();
});