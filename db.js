/**
 * Prism Study Planner & Assistant - Database & Cloud Sync Module
 * Connects to Firebase Firestore for Real-Time Sync & Supabase for Document Storage.
 * Full CRUD for Courses, Subjects, Chapters, Flashcards, and Documents.
 */

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  where, 
  serverTimestamp, 
  deleteDoc, 
  updateDoc,
  doc 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { firebaseConfig, isFirebaseConfigured } from "./firebase-config.js";
import { supabaseConfig, isSupabaseConfigured } from "./supabase-config.js";
import { getCurrentUser } from "./auth.js";

let db = null;
let storage = null;
let supabase = null;

export const isLiveFirebase = isFirebaseConfigured();
export const isLiveSupabase = isSupabaseConfigured();

if (isLiveFirebase) {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);
    storage = getStorage(app);
    console.log("[Firebase] Prism connected to live Firebase Firestore!");
  } catch (err) {
    console.warn("Firebase initialization failed, falling back to local sync:", err);
  }
}

if (isLiveSupabase) {
  try {
    supabase = createClient(supabaseConfig.supabaseUrl, supabaseConfig.supabaseAnonKey);
    console.log("[Supabase] Prism connected to Supabase Storage!");
  } catch (err) {
    console.warn("Supabase Storage initialization failed:", err);
  }
}

export { supabase };

/* ==========================================================================
   STARTER DATA FOR DEMO / OFFLINE
   ========================================================================== */

export const INITIAL_DEMO_COURSES = [
  {
    id: "course-cse",
    name: "Computer Science & Engineering",
    code: "CSE",
    description: "Algorithms, Data Structures, Operating Systems, AI, and Software Engineering.",
    icon: "code",
    createdAt: new Date().toISOString()
  },
  {
    id: "course-applied-sci",
    name: "Applied Sciences & Mathematics",
    code: "SCI",
    description: "Engineering Mathematics, Differential Equations, Wave Optics, and Quantum Physics.",
    icon: "math",
    createdAt: new Date().toISOString()
  },
  {
    id: "course-mech",
    name: "Mechanical Engineering",
    code: "MECH",
    description: "Thermodynamics, Fluid Mechanics, Kinematics, and Solid Mechanics.",
    icon: "gear",
    createdAt: new Date().toISOString()
  },
  {
    id: "course-ece",
    name: "Electronics & Communication",
    code: "ECE",
    description: "Digital Signals, Embedded Systems, VLSI, and Circuit Theory.",
    icon: "zap",
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_DEMO_SUBJECTS = [
  {
    id: "sub-math",
    courseId: "course-applied-sci",
    name: "Engineering Mathematics",
    code: "MATH101",
    description: "Calculus, Differential Equations, Linear Algebra and Complex Analysis.",
    icon: "math",
    color: "amber",
    creatorName: "Prof. Euler",
    createdAt: new Date().toISOString()
  },
  {
    id: "sub-physics",
    courseId: "course-applied-sci",
    name: "Applied Physics",
    code: "PHY201",
    description: "Wave optics, Quantum mechanics, Semiconductor physics, and Lasers.",
    icon: "zap",
    color: "yellow",
    creatorName: "Dr. Feynman",
    createdAt: new Date().toISOString()
  },
  {
    id: "sub-cs",
    courseId: "course-cse",
    name: "Data Structures & Algorithms",
    code: "CS202",
    description: "Trees, Graphs, Dynamic Programming, and Algorithmic Complexity.",
    icon: "code",
    color: "gold",
    creatorName: "Ada Lovelace",
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_DEMO_CHAPTERS = [
  {
    id: "chap-diff-eq",
    subjectId: "sub-math",
    unitNumber: "Unit 1",
    title: "First & Second Order Differential Equations",
    description: "Linear differential equations, complementary functions, particular integrals, and Euler-Cauchy equations.",
    creatorName: "Prof. Euler",
    createdAt: new Date().toISOString()
  },
  {
    id: "chap-laplace",
    subjectId: "sub-math",
    unitNumber: "Unit 2",
    title: "Laplace Transforms & Fourier Series",
    description: "Properties of Laplace transform, inverse transforms, convolution theorem, and periodic functions.",
    creatorName: "Prof. Euler",
    createdAt: new Date().toISOString()
  },
  {
    id: "chap-optics",
    subjectId: "sub-physics",
    unitNumber: "Unit 1",
    title: "Wave Optics & Interference",
    description: "Young's double slit experiment, thin films, Newton's rings, and Michelson interferometer.",
    creatorName: "Dr. Feynman",
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_DEMO_FLASHCARDS = [
  {
    id: "fc-1",
    chapterId: "chap-diff-eq",
    subjectId: "sub-math",
    question: "What is an Integrating Factor (I.F.) for $\\frac{dy}{dx} + P(x)y = Q(x)$?",
    answer: "The Integrating Factor is given by:$$\\text{I.F.} = e^{\\int P(x)\\,dx}$$The general solution is:$$y \\cdot (\\text{I.F.}) = \\int \\left(Q(x) \\cdot \\text{I.F.}\\right) dx + C$$",
    hint: "Recall exponential integral of coefficient $P(x)$: $e^{\\int P(x)\\,dx}$.",
    creatorName: "Prof. Euler",
    createdAt: new Date().toISOString()
  },
  {
    id: "fc-2",
    chapterId: "chap-diff-eq",
    subjectId: "sub-math",
    question: "For characteristic roots $m = \\alpha \\pm i\\beta$, what is the Complementary Function (C.F.)?",
    answer: "$$\\text{C.F.} = e^{\\alpha x} \\left[ C_1 \\cos(\\beta x) + C_2 \\sin(\\beta x) \\right]$$",
    hint: "Euler's formula: $e^{i\\theta} = \\cos\\theta + i\\sin\\theta$.",
    creatorName: "Prof. Euler",
    createdAt: new Date().toISOString()
  },
  {
    id: "fc-3",
    chapterId: "chap-diff-eq",
    subjectId: "sub-math",
    question: "What is the condition for an ODE $M(x,y)\\,dx + N(x,y)\\,dy = 0$ to be exact?",
    answer: "The necessary and sufficient condition is:$$\\frac{\\partial M}{\\partial y} = \\frac{\\partial N}{\\partial x}$$",
    hint: "Mixed second-order partial derivatives of a potential function $\\phi(x,y)$.",
    creatorName: "Student Leader",
    createdAt: new Date().toISOString()
  },
  {
    id: "fc-4",
    chapterId: "chap-diff-eq",
    subjectId: "sub-math",
    question: "What is the Quadratic Formula for finding the roots of $ax^2 + bx + c = 0$?",
    answer: "The roots are given by:$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$Where the discriminant is $\\Delta = b^2 - 4ac$.",
    hint: "If $\\Delta > 0$, roots are real & distinct. If $\\Delta < 0$, roots are complex conjugates.",
    creatorName: "Gauss Scholar",
    createdAt: new Date().toISOString()
  },
  {
    id: "fc-5",
    chapterId: "chap-diff-eq",
    subjectId: "sub-math",
    question: "What is Euler's Identity and the Taylor series for $e^x$?",
    answer: "Euler's celebrated identity:$$e^{i\\pi} + 1 = 0$$Maclaurin series for exponential:$$e^x = \\sum_{n=0}^{\\infty} \\frac{x^n}{n!} = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\cdots$$",
    hint: "Set $x = i\\pi$ in $e^{ix} = \\cos x + i\\sin x$.",
    creatorName: "Prof. Euler",
    createdAt: new Date().toISOString()
  },
  {
    id: "fc-6",
    chapterId: "chap-diff-eq",
    subjectId: "sub-math",
    question: "How do you find the Particular Integral (P.I.) using Variation of Parameters for $y'' + P y' + Q y = R(x)$?",
    answer: "Given independent complementary solutions $y_1, y_2$ with non-zero Wronskian:$$W(y_1, y_2) = \\begin{vmatrix} y_1 & y_2 \\\\ y_1' & y_2' \\end{vmatrix} = y_1 y_2' - y_2 y_1' \\neq 0$$\n\nStep 1: Assume particular solution $y_p = u(x)y_1(x) + v(x)y_2(x)$.\nStep 2: Solve the system of parameter equations:\n$$u' = -\\frac{y_2 \\cdot R(x)}{W(y_1, y_2)}, \\qquad v' = \\frac{y_1 \\cdot R(x)}{W(y_1, y_2)}$$\n\nStep 3: Integrate to find parameters $u(x)$ and $v(x)$:\n$$y_p(x) = -y_1 \\int \\frac{y_2 R}{W}\\,dx + y_2 \\int \\frac{y_1 R}{W}\\,dx$$\n\nComplete general solution: $y = c_1 y_1 + c_2 y_2 + y_p$.",
    hint: "Calculate the Wronskian determinant $W(y_1, y_2)$ first to verify linear independence.",
    creatorName: "Prof. Lagrange",
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_DEMO_RESOURCES = [
  {
    id: "res-sample-notes",
    chapterId: "chap-diff-eq",
    subjectId: "sub-math",
    category: "notes",
    title: "Comprehensive Lecture Notes - Differential Equations",
    description: "Handwritten class notes with 25 step-by-step solved university questions.",
    fileName: "Differential_Equations_Complete_Notes.pdf",
    fileType: "application/pdf",
    fileSize: 1845000,
    fileUrl: "data:application/pdf;base64,JVBERi0xLjQKJcTl8uXrp/Og0MTGCjEgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDIgMCBSCj4+CmVuZG9iagoyIDAgb2JqCjw8Ci9UeXBlIC9QYWdlcwovS2lkcyBbMyAwIFJdCi9Db3VudCAxCj4+CmVuZG9iagozIDAgb2JqCjw8Ci9UeXBlIC9QYWdlCi9QYXJlbnQgMiAwIFIKL01lZGlhQm94IFswIDAgNjEyIDc5Ml0KL0NvbnRlbnRzIDQgMCBSCj4+CmVuZG9iago0IDAgb2JqCjw8Ci9MZW5ndGggMTI4Cj4+CnN0cmVhbQpCVAovRiAxOCBUZgoxMDAgNzAwIFRkCihQcmlzbSBTdHVkeSBQbGFubmVyIC0gU2hhcmVkIE5vdGVzKSBUagowIC00MCBUZgovRiAxMiBUZgooVGhpcyBpcyBhIHZlcmlmaWVkIHNoYXJlZCBzdHVkeSBkb2N1bWVudCBzeW5jZWQgYWNyb3NzIGFsbCB1c2Vycy4pIFRqCkUNCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDUKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDE5IDAwMDAwIG4gCjAwMDAwMDAwNjggMDAwMDAgbiAKMDAwMDAwMDEyNSAwMDAwMCBuIAowMDAwMDAwMjE5IDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgNQovUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKMzk2CiUlRU9GCg==",
    creatorName: "Alex Rivera",
    creatorPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    createdAt: new Date().toISOString()
  },
  {
    id: "res-sample-short-notes",
    chapterId: "chap-diff-eq",
    subjectId: "sub-math",
    category: "short_notes",
    title: "Quick Formula Sheet & Integrating Factor Cheat Sheet",
    description: "Two-page mind map and formula list for quick glance before exams.",
    fileName: "Diff_Eq_Formula_Sheet.pdf",
    fileType: "application/pdf",
    fileSize: 520000,
    fileUrl: "data:application/pdf;base64,JVBERi0xLjQKJcTl8uXrp/Og0MTGCjEgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDIgMCBSCj4+CmVuZG9iagoyIDAgb2JqCjw8Ci9UeXBlIC9QYWdlcwovS2lkcyBbMyAwIFJdCi9Db3VudCAxCj4+CmVuZG9iagozIDAgb2JqCjw8Ci9UeXBlIC9QYWdlCi9QYXJlbnQgMiAwIFIKL01lZGlhQm94IFswIDAgNjEyIDc5Ml0KL0NvbnRlbnRzIDQgMCBSCj4+CmVuZG9iago0IDAgb2JqCjw8Ci9MZW5ndGggMTI4Cj4+CnN0cmVhbQpCVAovRiAxOCBUZgoxMDAgNzAwIFRkCihQcmlzbSBTdHVkeSBQbGFubmVyIC0gU2hvcnQgTm90ZXMgJiBDaGVhdCBTaGVldCkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTkgMDAwMDAgbiAKMDAwMDAwMDA2OCAwMDAwMCBuIAowMDAwMDAwMTI1IDAwMDAwIG4gCjAwMDAwMDAyMTkgMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSA1Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgozOTYKKSVFT0YK",
    creatorName: "Priya Sharma",
    creatorPhoto: "https://api.dicebear.com/7.x/bottts/svg?seed=priya",
    createdAt: new Date().toISOString()
  }
];

// Helper to get local data safely
export function getLocalArray(key, defaults = []) {
  const raw = localStorage.getItem(key);
  if (!raw) {
    localStorage.setItem(key, JSON.stringify(defaults));
    return defaults;
  }
  try {
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return defaults;

    // Refresh default flashcards with LaTeX equations if older plain text is present
    if (key === "prism_flashcards") {
      defaults.forEach(defCard => {
        const existing = list.find(c => c.id === defCard.id);
        if (existing && (!existing.question.includes('$') || !existing.answer.includes('$'))) {
          Object.assign(existing, defCard);
        } else if (!existing) {
          list.push(defCard);
        }
      });
      localStorage.setItem(key, JSON.stringify(list));
    }

    return list;
  } catch (e) {
    return defaults;
  }
}

export function saveLocalArray(key, arr) {
  localStorage.setItem(key, JSON.stringify(arr));
}

function parseDocTimestamp(doc) {
  if (!doc) return 0;
  if (doc.createdAt?.toMillis) return doc.createdAt.toMillis();
  if (doc.createdAt?.seconds) return doc.createdAt.seconds * 1000;
  if (doc.createdAt) {
    const t = new Date(doc.createdAt).getTime();
    if (!isNaN(t)) return t;
  }
  return 0;
}

/* ==========================================================================
   COURSES / BRANCHES CRUD & REAL-TIME SYNC
   ========================================================================== */

/**
 * Listen for all courses/branches in real-time
 */
export function subscribeCourses(callback) {
  if (isLiveFirebase && db) {
    const q = query(collection(db, "courses"));
    const unsub = onSnapshot(q, (snapshot) => {
      const courses = [];
      snapshot.forEach(docSnap => {
        courses.push({ id: docSnap.id, ...docSnap.data() });
      });

      // Merge local cache courses
      const localCourses = getLocalArray("prism_courses", INITIAL_DEMO_COURSES);
      const existingIds = new Set(courses.map(c => c.id));
      localCourses.forEach(lc => {
        if (!existingIds.has(lc.id)) {
          courses.push(lc);
        }
      });

      // Sort by createdAt ascending
      courses.sort((a, b) => parseDocTimestamp(a) - parseDocTimestamp(b));
      callback(courses);
    }, (err) => {
      console.warn("Firestore courses error, using fallback:", err);
      callback(getLocalArray("prism_courses", INITIAL_DEMO_COURSES));
    });

    const onLocalChange = () => {
      callback(getLocalArray("prism_courses", INITIAL_DEMO_COURSES));
    };
    window.addEventListener("prism_db_change", onLocalChange);

    return () => {
      unsub();
      window.removeEventListener("prism_db_change", onLocalChange);
    };
  } else {
    const emit = () => callback(getLocalArray("prism_courses", INITIAL_DEMO_COURSES));
    emit();
    window.addEventListener("prism_db_change", emit);
    return () => window.removeEventListener("prism_db_change", emit);
  }
}

/**
 * Add a new course / branch
 */
export async function addCourse({ name, code, description, icon }) {
  const user = getCurrentUser();
  const newCourse = {
    name: name.trim(),
    code: (code || "COURSE").trim().toUpperCase(),
    description: (description || "").trim(),
    icon: icon || "cap",
    creatorUid: user ? user.uid : "anonymous",
    creatorName: user ? (user.displayName || "Community Student") : "Community Student",
    createdAt: new Date().toISOString()
  };

  let firestoreSuccess = false;
  let firestoreId = null;

  if (isLiveFirebase && db) {
    try {
      const docRef = await addDoc(collection(db, "courses"), {
        ...newCourse,
        createdAt: serverTimestamp()
      });
      firestoreSuccess = true;
      firestoreId = docRef.id;
    } catch (err) {
      console.error("Firestore addCourse error:", err);
    }
  }

  const list = getLocalArray("prism_courses", INITIAL_DEMO_COURSES);
  const id = firestoreId || ("course-" + Date.now());
  const courseRecord = { id, ...newCourse };
  if (!list.some(c => c.id === id)) {
    list.push(courseRecord);
    saveLocalArray("prism_courses", list);
  }
  window.dispatchEvent(new Event("prism_db_change"));
  return { success: true, id, course: courseRecord };
}

/**
 * Update an existing course / branch
 */
export async function updateCourse(courseId, { name, code, description, icon }) {
  const updates = {
    name: name.trim(),
    code: (code || "COURSE").trim().toUpperCase(),
    description: (description || "").trim(),
    icon: icon || "cap",
    updatedAt: new Date().toISOString()
  };

  if (isLiveFirebase && db) {
    try {
      await updateDoc(doc(db, "courses", courseId), updates);
    } catch (err) {
      console.warn("Firestore updateCourse error:", err);
    }
  }

  const list = getLocalArray("prism_courses", INITIAL_DEMO_COURSES);
  const idx = list.findIndex(c => c.id === courseId);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...updates };
    saveLocalArray("prism_courses", list);
  }
  window.dispatchEvent(new Event("prism_db_change"));
  return { success: true };
}

/**
 * Delete a course / branch
 */
export async function deleteCourse(courseId) {
  if (isLiveFirebase && db) {
    try {
      await deleteDoc(doc(db, "courses", courseId));
    } catch (err) {
      console.warn("Firestore deleteCourse error:", err);
    }
  }

  const list = getLocalArray("prism_courses", INITIAL_DEMO_COURSES);
  const filtered = list.filter(c => c.id !== courseId);
  saveLocalArray("prism_courses", filtered);
  window.dispatchEvent(new Event("prism_db_change"));
  return { success: true };
}

/* ==========================================================================
   SUBJECTS CRUD & REAL-TIME SYNC
   ========================================================================== */

/**
 * Listen for all subjects in real-time
 */
export function subscribeSubjects(callback) {
  if (isLiveFirebase && db) {
    const q = query(collection(db, "subjects"));
    const unsub = onSnapshot(q, (snapshot) => {
      const subjects = [];
      snapshot.forEach(docSnap => {
        subjects.push({ id: docSnap.id, ...docSnap.data() });
      });

      // Merge local cache subjects
      const localList = getLocalArray("prism_subjects", INITIAL_DEMO_SUBJECTS);
      const existingIds = new Set(subjects.map(s => s.id));
      localList.forEach(ls => {
        if (!existingIds.has(ls.id)) {
          subjects.push(ls);
        }
      });

      // Sort by createdAt descending (newest first)
      subjects.sort((a, b) => parseDocTimestamp(b) - parseDocTimestamp(a));
      callback(subjects);
    }, (err) => {
      console.warn("Firestore subjects error, using fallback:", err);
      callback(getLocalArray("prism_subjects", INITIAL_DEMO_SUBJECTS));
    });

    const onLocalChange = () => {
      callback(getLocalArray("prism_subjects", INITIAL_DEMO_SUBJECTS));
    };
    window.addEventListener("prism_db_change", onLocalChange);

    return () => {
      unsub();
      window.removeEventListener("prism_db_change", onLocalChange);
    };
  } else {
    const emit = () => callback(getLocalArray("prism_subjects", INITIAL_DEMO_SUBJECTS));
    emit();
    window.addEventListener("prism_db_change", emit);
    return () => window.removeEventListener("prism_db_change", emit);
  }
}

/**
 * Add a new subject
 */
export async function addSubject({ courseId, name, code, description, icon, color }) {
  const user = getCurrentUser();
  const newSubject = {
    courseId: courseId || "course-cse",
    name: name.trim(),
    code: (code || "SUB").trim().toUpperCase(),
    description: (description || "").trim(),
    icon: icon || "book",
    color: color || "amber",
    creatorUid: user ? user.uid : "anonymous",
    creatorName: user ? (user.displayName || "Community Student") : "Community Student",
    createdAt: new Date().toISOString()
  };

  let firestoreSuccess = false;
  let firestoreId = null;

  if (isLiveFirebase && db) {
    try {
      const docRef = await addDoc(collection(db, "subjects"), {
        ...newSubject,
        createdAt: serverTimestamp()
      });
      firestoreSuccess = true;
      firestoreId = docRef.id;
    } catch (err) {
      console.error("Firestore addSubject error:", err);
    }
  }

  const list = getLocalArray("prism_subjects", INITIAL_DEMO_SUBJECTS);
  const id = firestoreId || ("sub-" + Date.now());
  const subjectRecord = { id, ...newSubject };
  if (!list.some(s => s.id === id)) {
    list.unshift(subjectRecord);
    saveLocalArray("prism_subjects", list);
  }
  window.dispatchEvent(new Event("prism_db_change"));
  return { success: true, id, subject: subjectRecord };
}

/**
 * Update an existing subject
 */
export async function updateSubject(subjectId, { courseId, name, code, description, icon, color }) {
  const updates = {
    courseId: courseId || "course-cse",
    name: name.trim(),
    code: (code || "SUB").trim().toUpperCase(),
    description: (description || "").trim(),
    icon: icon || "book",
    color: color || "amber",
    updatedAt: new Date().toISOString()
  };

  if (isLiveFirebase && db) {
    try {
      await updateDoc(doc(db, "subjects", subjectId), updates);
    } catch (err) {
      console.warn("Firestore updateSubject error:", err);
    }
  }

  const list = getLocalArray("prism_subjects", INITIAL_DEMO_SUBJECTS);
  const idx = list.findIndex(s => s.id === subjectId);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...updates };
    saveLocalArray("prism_subjects", list);
  }
  window.dispatchEvent(new Event("prism_db_change"));
  return { success: true };
}

/**
 * Delete a subject
 */
export async function deleteSubject(subjectId) {
  if (isLiveFirebase && db) {
    try {
      await deleteDoc(doc(db, "subjects", subjectId));
    } catch (err) {
      console.warn("Firestore deleteSubject error:", err);
    }
  }

  const list = getLocalArray("prism_subjects", INITIAL_DEMO_SUBJECTS);
  const filtered = list.filter(s => s.id !== subjectId);
  saveLocalArray("prism_subjects", filtered);
  window.dispatchEvent(new Event("prism_db_change"));
  return { success: true };
}

/* ==========================================================================
   CHAPTERS / UNITS CRUD & REAL-TIME SYNC
   ========================================================================== */

/**
 * Listen for chapters belonging to a subject in real-time
 */
export function subscribeChapters(subjectId, callback) {
  if (!subjectId) return () => {};

  if (isLiveFirebase && db) {
    const q = query(
      collection(db, "chapters"),
      where("subjectId", "==", subjectId)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const chapters = [];
      snapshot.forEach(docSnap => {
        chapters.push({ id: docSnap.id, ...docSnap.data() });
      });

      const localChapters = getLocalArray("prism_chapters", INITIAL_DEMO_CHAPTERS)
        .filter(c => c.subjectId === subjectId);
      const existingIds = new Set(chapters.map(c => c.id));
      localChapters.forEach(lc => {
        if (!existingIds.has(lc.id)) {
          chapters.push(lc);
        }
      });

      chapters.sort((a, b) => parseDocTimestamp(a) - parseDocTimestamp(b));
      callback(chapters);
    }, (err) => {
      console.warn("Firestore chapters error, fallback:", err);
      const all = getLocalArray("prism_chapters", INITIAL_DEMO_CHAPTERS);
      callback(all.filter(c => c.subjectId === subjectId));
    });

    const onLocalChange = () => {
      const all = getLocalArray("prism_chapters", INITIAL_DEMO_CHAPTERS);
      callback(all.filter(c => c.subjectId === subjectId));
    };
    window.addEventListener("prism_db_change", onLocalChange);

    return () => {
      unsub();
      window.removeEventListener("prism_db_change", onLocalChange);
    };
  } else {
    const emit = () => {
      const all = getLocalArray("prism_chapters", INITIAL_DEMO_CHAPTERS);
      callback(all.filter(c => c.subjectId === subjectId));
    };
    emit();
    window.addEventListener("prism_db_change", emit);
    return () => window.removeEventListener("prism_db_change", emit);
  }
}

/**
 * Add a new chapter / unit
 */
export async function addChapter({ subjectId, title, unitNumber, description }) {
  const user = getCurrentUser();
  const newChapter = {
    subjectId,
    unitNumber: (unitNumber || "Unit").trim(),
    title: title.trim(),
    description: (description || "").trim(),
    creatorUid: user ? user.uid : "anonymous",
    creatorName: user ? (user.displayName || "Community Student") : "Community Student",
    createdAt: new Date().toISOString()
  };

  let firestoreSuccess = false;
  let firestoreId = null;

  if (isLiveFirebase && db) {
    try {
      const docRef = await addDoc(collection(db, "chapters"), {
        ...newChapter,
        createdAt: serverTimestamp()
      });
      firestoreSuccess = true;
      firestoreId = docRef.id;
    } catch (err) {
      console.error("Firestore addChapter error:", err);
    }
  }

  const list = getLocalArray("prism_chapters", INITIAL_DEMO_CHAPTERS);
  const id = firestoreId || ("chap-" + Date.now());
  if (!list.some(c => c.id === id)) {
    list.push({ id, ...newChapter });
    saveLocalArray("prism_chapters", list);
  }
  window.dispatchEvent(new Event("prism_db_change"));
  return { success: true, id };
}

/**
 * Update an existing chapter / unit
 */
export async function updateChapter(chapterId, { subjectId, title, unitNumber, description }) {
  const updates = {
    title: title.trim(),
    unitNumber: (unitNumber || "Unit").trim(),
    description: (description || "").trim(),
    updatedAt: new Date().toISOString()
  };
  if (subjectId) updates.subjectId = subjectId;

  if (isLiveFirebase && db) {
    try {
      await updateDoc(doc(db, "chapters", chapterId), updates);
    } catch (err) {
      console.warn("Firestore updateChapter error:", err);
    }
  }

  const list = getLocalArray("prism_chapters", INITIAL_DEMO_CHAPTERS);
  const idx = list.findIndex(c => c.id === chapterId);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...updates };
    saveLocalArray("prism_chapters", list);
  }
  window.dispatchEvent(new Event("prism_db_change"));
  return { success: true };
}

/**
 * Delete a chapter / unit
 */
export async function deleteChapter(chapterId) {
  if (isLiveFirebase && db) {
    try {
      await deleteDoc(doc(db, "chapters", chapterId));
    } catch (err) {
      console.warn("Firestore deleteChapter error:", err);
    }
  }

  const list = getLocalArray("prism_chapters", INITIAL_DEMO_CHAPTERS);
  const filtered = list.filter(c => c.id !== chapterId);
  saveLocalArray("prism_chapters", filtered);
  window.dispatchEvent(new Event("prism_db_change"));
  return { success: true };
}

/* ==========================================================================
   FLASHCARDS CRUD & REAL-TIME SYNC
   ========================================================================== */

/**
 * Listen for flashcards for a chapter in real-time
 */
export function subscribeFlashcards(chapterId, callback) {
  if (!chapterId) return () => {};

  if (isLiveFirebase && db) {
    const q = query(
      collection(db, "flashcards"),
      where("chapterId", "==", chapterId)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const cards = [];
      snapshot.forEach(docSnap => {
        cards.push({ id: docSnap.id, ...docSnap.data() });
      });

      const localCards = getLocalArray("prism_flashcards", INITIAL_DEMO_FLASHCARDS)
        .filter(fc => fc.chapterId === chapterId);
      const existingIds = new Set(cards.map(c => c.id));
      localCards.forEach(lc => {
        if (!existingIds.has(lc.id)) {
          cards.push(lc);
        }
      });

      cards.sort((a, b) => parseDocTimestamp(a) - parseDocTimestamp(b));
      callback(cards);
    }, (err) => {
      console.warn("Firestore flashcards error, fallback:", err);
      const all = getLocalArray("prism_flashcards", INITIAL_DEMO_FLASHCARDS);
      callback(all.filter(fc => fc.chapterId === chapterId));
    });

    const onLocalChange = () => {
      const all = getLocalArray("prism_flashcards", INITIAL_DEMO_FLASHCARDS);
      callback(all.filter(fc => fc.chapterId === chapterId));
    };
    window.addEventListener("prism_db_change", onLocalChange);

    return () => {
      unsub();
      window.removeEventListener("prism_db_change", onLocalChange);
    };
  } else {
    const emit = () => {
      const all = getLocalArray("prism_flashcards", INITIAL_DEMO_FLASHCARDS);
      callback(all.filter(fc => fc.chapterId === chapterId));
    };
    emit();
    window.addEventListener("prism_db_change", emit);
    return () => window.removeEventListener("prism_db_change", emit);
  }
}

/**
 * Add a flashcard to a chapter
 */
export async function addFlashcard({ chapterId, subjectId, question, answer, hint }) {
  const user = getCurrentUser();
  const cardData = {
    chapterId,
    subjectId,
    question: question.trim(),
    answer: answer.trim(),
    hint: (hint || "").trim(),
    creatorUid: user ? user.uid : "anonymous",
    creatorName: user ? (user.displayName || "Fellow Student") : "Fellow Student",
    createdAt: new Date().toISOString()
  };

  let firestoreSuccess = false;
  let firestoreId = null;

  if (isLiveFirebase && db) {
    try {
      const docRef = await addDoc(collection(db, "flashcards"), {
        ...cardData,
        createdAt: serverTimestamp()
      });
      firestoreSuccess = true;
      firestoreId = docRef.id;
    } catch (err) {
      console.error("Firestore addFlashcard error:", err);
    }
  }

  const list = getLocalArray("prism_flashcards", INITIAL_DEMO_FLASHCARDS);
  const id = firestoreId || ("fc-" + Date.now());
  if (!list.some(c => c.id === id)) {
    list.push({ id, ...cardData });
    saveLocalArray("prism_flashcards", list);
  }
  window.dispatchEvent(new Event("prism_db_change"));
  return { success: true, id };
}

/**
 * Delete a flashcard
 */
export async function deleteFlashcard(cardId) {
  if (isLiveFirebase && db) {
    try {
      await deleteDoc(doc(db, "flashcards", cardId));
    } catch (err) {
      console.error("Delete flashcard error:", err);
    }
  }
  const list = getLocalArray("prism_flashcards", INITIAL_DEMO_FLASHCARDS);
  const filtered = list.filter(c => c.id !== cardId);
  saveLocalArray("prism_flashcards", filtered);
  window.dispatchEvent(new Event("prism_db_change"));
  return { success: true };
}

/* ==========================================================================
   DOCUMENT RESOURCES (Notes, Short Notes, PYQs, Revision Notes)
   ========================================================================== */

/**
 * Listen for documents for a chapter and category in real-time
 */
export function subscribeResources(chapterId, category, callback) {
  if (!chapterId || !category) return () => {};

  if (isLiveFirebase && db) {
    const q = query(
      collection(db, "resources"),
      where("chapterId", "==", chapterId)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      let resources = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        if (data.category === category) {
          resources.push({ id: docSnap.id, ...data });
        }
      });

      const localRes = getLocalArray("prism_resources", INITIAL_DEMO_RESOURCES)
        .filter(r => r.chapterId === chapterId && r.category === category);
      const existingIds = new Set(resources.map(r => r.id));
      localRes.forEach(lr => {
        if (!existingIds.has(lr.id)) {
          resources.push(lr);
        }
      });

      resources.sort((a, b) => parseDocTimestamp(b) - parseDocTimestamp(a));
      callback(resources);
    }, (err) => {
      console.warn("Firestore resources error, fallback:", err);
      const all = getLocalArray("prism_resources", INITIAL_DEMO_RESOURCES);
      callback(all.filter(r => r.chapterId === chapterId && r.category === category));
    });

    const onLocalChange = () => {
      const all = getLocalArray("prism_resources", INITIAL_DEMO_RESOURCES);
      callback(all.filter(r => r.chapterId === chapterId && r.category === category));
    };
    window.addEventListener("prism_db_change", onLocalChange);

    return () => {
      unsub();
      window.removeEventListener("prism_db_change", onLocalChange);
    };
  } else {
    const emit = () => {
      const all = getLocalArray("prism_resources", INITIAL_DEMO_RESOURCES);
      callback(all.filter(r => r.chapterId === chapterId && r.category === category));
    };
    emit();
    window.addEventListener("prism_db_change", emit);
    return () => window.removeEventListener("prism_db_change", emit);
  }
}

/**
 * Upload a document (supports PDF, DOC, DOCX, ODT, TXT, images)
 */
export async function uploadResource({ chapterId, subjectId, category, title, description, file }) {
  const user = getCurrentUser();
  let fileUrl = "";
  let storagePath = "";
  let storageProvider = "local";

  // 1. Upload to Supabase Storage (Primary document host)
  if (isLiveSupabase && supabase && file) {
    try {
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      storagePath = `${chapterId}/${category}/${timestamp}_${sanitizedName}`;
      const bucket = supabaseConfig.bucketName || "study-materials";

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.warn("Supabase Storage upload warning:", error.message);
      } else {
        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(storagePath);

        if (urlData && urlData.publicUrl) {
          fileUrl = urlData.publicUrl;
          storageProvider = "supabase";
          console.log("[Supabase] File uploaded to Supabase Storage CDN:", fileUrl);
        }
      }
    } catch (supaErr) {
      console.warn("Supabase Storage upload exception, falling back:", supaErr);
    }
  }

  // 2. Fallback to Firebase Storage if Supabase is not configured
  if (!fileUrl && isLiveFirebase && storage && file) {
    try {
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      storagePath = `study_materials/${chapterId}/${category}/${timestamp}_${sanitizedName}`;
      const fileRef = ref(storage, storagePath);
      
      const snapshot = await uploadBytes(fileRef, file);
      fileUrl = await getDownloadURL(snapshot.ref);
      storageProvider = "firebase";
    } catch (uploadErr) {
      console.warn("Firebase Storage upload issue, using Base64 fallback:", uploadErr);
    }
  }

  // 3. Fallback to data URL (Base64) if storage upload didn't yield a URL
  if (!fileUrl && file) {
    fileUrl = await readFileAsDataURL(file);
    storageProvider = "local";
  }

  // Determine clean file type label
  let fileType = file ? file.type : "application/pdf";
  if (file && file.name.toLowerCase().endsWith(".odt")) {
    fileType = "application/vnd.oasis.opendocument.text";
  }

  const resourceData = {
    chapterId,
    subjectId,
    category,
    title: title.trim(),
    description: (description || "").trim(),
    fileName: file ? file.name : "Document.pdf",
    fileType: fileType,
    fileSize: file ? file.size : 0,
    fileUrl: fileUrl,
    storagePath: storagePath,
    storageProvider: storageProvider,
    creatorUid: user ? user.uid : "anonymous",
    creatorName: user ? (user.displayName || "Community Contributor") : "Community Contributor",
    creatorPhoto: user ? (user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=prism`) : `https://api.dicebear.com/7.x/bottts/svg?seed=prism`,
    createdAt: new Date().toISOString()
  };

  let firestoreSuccess = false;
  let firestoreId = null;

  if (isLiveFirebase && db) {
    try {
      const docRef = await addDoc(collection(db, "resources"), {
        ...resourceData,
        createdAt: serverTimestamp()
      });
      firestoreSuccess = true;
      firestoreId = docRef.id;
    } catch (err) {
      console.error("Firestore resource addDoc error:", err);
    }
  }

  const list = getLocalArray("prism_resources", INITIAL_DEMO_RESOURCES);
  const id = firestoreId || ("res-" + Date.now());
  list.unshift({ id, ...resourceData });
  saveLocalArray("prism_resources", list);
  window.dispatchEvent(new Event("prism_db_change"));
  return { success: true, id };
}

/**
 * Delete a shared document
 */
export async function deleteResource(resourceId, storagePath = null, storageProvider = null) {
  // Delete from Supabase Storage if applicable
  if (isLiveSupabase && supabase && storagePath && storageProvider === "supabase") {
    try {
      const bucket = supabaseConfig.bucketName || "study-materials";
      await supabase.storage.from(bucket).remove([storagePath]);
    } catch (supaDelErr) {
      console.warn("Could not delete file from Supabase Storage:", supaDelErr);
    }
  }

  if (isLiveFirebase && db) {
    try {
      await deleteDoc(doc(db, "resources", resourceId));
    } catch (err) {
      console.error("Firestore deleteResource error:", err);
    }
  }
  const list = getLocalArray("prism_resources", INITIAL_DEMO_RESOURCES);
  const filtered = list.filter(r => r.id !== resourceId);
  saveLocalArray("prism_resources", filtered);
  window.dispatchEvent(new Event("prism_db_change"));
  return { success: true };
}

/**
 * Convert file to Base64 Data URL
 */
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Get counts summary across resources for a chapter
 */
export function getChapterResourceCounts(chapterId, callback) {
  if (isLiveFirebase && db) {
    const q = query(collection(db, "resources"), where("chapterId", "==", chapterId));
    return onSnapshot(q, (snapshot) => {
      const counts = { notes: 0, short_notes: 0, pyqs: 0, revision_notes: 0 };
      snapshot.forEach(docSnap => {
        const cat = docSnap.data().category;
        if (counts[cat] !== undefined) counts[cat]++;
      });
      callback(counts);
    }, (err) => {
      console.warn("Resource count snapshot error, fallback:", err);
      const all = getLocalArray("prism_resources", INITIAL_DEMO_RESOURCES);
      const filtered = all.filter(r => r.chapterId === chapterId);
      const counts = {
        notes: filtered.filter(r => r.category === "notes").length,
        short_notes: filtered.filter(r => r.category === "short_notes").length,
        pyqs: filtered.filter(r => r.category === "pyqs").length,
        revision_notes: filtered.filter(r => r.category === "revision_notes").length
      };
      callback(counts);
    });
  } else {
    const all = getLocalArray("prism_resources", INITIAL_DEMO_RESOURCES);
    const filtered = all.filter(r => r.chapterId === chapterId);
    const counts = {
      notes: filtered.filter(r => r.category === "notes").length,
      short_notes: filtered.filter(r => r.category === "short_notes").length,
      pyqs: filtered.filter(r => r.category === "pyqs").length,
      revision_notes: filtered.filter(r => r.category === "revision_notes").length
    };
    callback(counts);
    return () => {};
  }
}
