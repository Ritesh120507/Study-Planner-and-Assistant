# 💎 Prism Study Planner and Assistant

A collaborative study planner and assistant web application built with **HTML, CSS (Liquid Glass UI in light yellow theme)**, and **JavaScript (ES Modules)**, fully powered by **Firebase** for Google Authentication, Realtime Cloud Firestore synchronization, and Cloud Document Storage.

---

## 🌟 Key Features

1. **Google Account Authentication**:
   - Secure sign-in with Google via Firebase Authentication.
   - User profile chip with photo and name in header.
   - Session state persistence.

2. **Hierarchical Academic Structure**:
   - **Level 1: Subjects Hub**: Add courses/subjects (e.g., Mathematics, Physics, Computer Science) with custom icons, codes, and descriptions.
   - **Level 2: Chapters / Units Hub**: Click any subject to explore syllabus units, chapter summaries, and resource counts.
   - **Level 3: The 5 Study Tiles Hub**: Each chapter features 5 interactive liquid glass resource tiles:
     - 📇 **Flashcards**: Interactive 3D flip card viewer (Question & Answer), card maker, shuffle, and deck navigator.
     - 📝 **Notes**: Comprehensive class notes, slides, and reference PDFs.
     - ⚡ **Short Notes**: Formula cheat sheets, mind maps, and quick summaries.
     - 🎯 **PYQs (Previous Year Questions)**: University exam question papers with answer keys.
     - 🔄 **Revision Notes**: High-yield 1-hour pre-exam review packets.

3. **Community Sync & Collaboration (Public Shared Cloud)**:
   - **Multi-user sync**: Every subject, chapter, flashcard, and document uploaded by any student is synced in real-time.
   - Every logged-in user sees the exact same shared library instantly.
   - **Direct Download**: Any student can download shared PDFs/documents directly to their local device.
   - **In-App Preview**: Preview PDFs directly in the responsive liquid-glass modal before downloading.

4. **Liquid Glass UI with Light Yellow Theme**:
   - Soft buttery yellow canvas (`#FFFDF5`, `#FEF7CD`, `#FFF0BA`).
   - Glowing amber accents (`#F59E0B`, `#D97706`).
   - Frosted backdrop blur (`backdrop-filter: blur(20px)`), glossy borders, and ambient floating fluid blobs.
   - 3D CSS flip animations for flashcard recall practice.

---

## 🚀 Quick Start (Running Locally)

Since modern browsers enforce CORS security policies on ES modules loaded via `file://`, run the application with any simple local HTTP server:

### Option A: Using Python (Pre-installed on Linux/Mac)
```bash
# Navigate to the project directory
cd "Prism Study Planner and Assistant"

# Start the local server
python3 -m http.server 8000
```
Then open: **`http://localhost:8000`** in your browser.

### Option B: Using Node.js / npx
```bash
npx serve .
```

---

## ⚙️ Firebase Setup & Configuration

### 1. Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** and give it a name (e.g. `prism-study-planner`).
3. Under **Project Settings** &rarr; **General**, scroll to **Your apps** and click the **Web icon (`</>`)**.
4. Register the app and copy the `firebaseConfig` object.

### 2. Add Credentials to `js/firebase-config.js`
Open `js/firebase-config.js` and paste your project values:
```javascript
export const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789...",
  appId: "1:123456789:web:..."
};
```

### 3. Enable Google Sign-In
1. In Firebase Console, go to **Build &rarr; Authentication**.
2. Click **Get Started**, then select the **Sign-in method** tab.
3. Choose **Google**, click **Enable**, select your support email, and click **Save**.
4. In the **Authorized domains** list, ensure `localhost` is listed.

---

## 📦 Supabase Storage Setup (For Free Document Hosting)

Prism uses **Supabase Storage** for document/PDF hosting (giving you 1 GB of free storage without requiring a credit card) and stores the resulting public CDN link in Firestore for real-time synchronization.

### 1. Create a Supabase Project & Bucket
1. Go to **[supabase.com](https://supabase.com/)** and sign in or create a free account.
2. Click **New Project** (e.g. `prism-study`).
3. In the left navigation, click **Storage**.
4. Click **New bucket**:
   - Bucket name: **`study-materials`**
   - Toggle **"Public bucket"** to **ON** (Required: this allows direct PDF previewing and downloading for all students).
   - Click **Save bucket**.

### 2. Add Credentials to `js/supabase-config.js`
In the Supabase dashboard:
1. Go to **Project Settings** (gear icon) &rarr; **API**.
2. Copy your **Project URL** and **Project API Key** (`anon` / `public`).
3. Open `js/supabase-config.js` and paste them:
```javascript
export const supabaseConfig = {
  supabaseUrl: "https://your-project-id.supabase.co",
  supabaseAnonKey: "eyJhbGciOi...",
  bucketName: "study-materials"
};
```

---

## 🔒 Security Rules

### 1. Cloud Firestore Rules (`firestore.rules`)
Copy and paste this into **Firebase Console &rarr; Firestore Database &rarr; Rules**:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAuthenticated() {
      return request.auth != null;
    }

    // Subjects collection (Shared across all logged-in students)
    match /subjects/{subjectId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && request.resource.data.name is string;
      allow update, delete: if isAuthenticated();
      
      match /chapters/{chapterId} {
        allow read: if isAuthenticated();
        allow create: if isAuthenticated() && request.resource.data.title is string;
        allow update, delete: if isAuthenticated();
      }
    }

    // Chapters collection
    match /chapters/{chapterId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update, delete: if isAuthenticated();
    }

    // Flashcards collection
    match /flashcards/{cardId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() 
        && request.resource.data.question is string 
        && request.resource.data.answer is string;
      allow update, delete: if isAuthenticated();
    }

    // Study Documents (Notes, Short Notes, PYQs, Revision Notes)
    match /resources/{resourceId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated()
        && request.resource.data.title is string
        && request.resource.data.category in ['notes', 'short_notes', 'pyqs', 'revision_notes'];
      allow update, delete: if isAuthenticated();
    }

    // User profiles
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && request.auth.uid == userId;
    }
  }
}
```

### 2. Realtime Database Rules (`database.rules.json`)
If you use Firebase Realtime Database, copy and paste this into **Firebase Console &rarr; Realtime Database &rarr; Rules**:

```json
{
  "rules": {
    "subjects": {
      ".read": "auth != null",
      ".write": "auth != null",
      ".indexOn": ["createdAt", "code"]
    },
    "chapters": {
      ".read": "auth != null",
      ".write": "auth != null",
      ".indexOn": ["subjectId", "order"]
    },
    "flashcards": {
      ".read": "auth != null",
      ".write": "auth != null",
      ".indexOn": ["chapterId", "createdAt"]
    },
    "resources": {
      ".read": "auth != null",
      ".write": "auth != null",
      ".indexOn": ["chapterId", "category", "createdAt"]
    },
    "users": {
      "$uid": {
        ".read": "auth != null",
        ".write": "auth != null && auth.uid === $uid"
      }
    }
  }
}
```

### 3. Firebase Cloud Storage Rules (`storage.rules`)
Copy and paste this into **Firebase Console &rarr; Storage &rarr; Rules**:

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    match /study_materials/{allPaths=**} {
      allow read: if request.auth != null;
      // Allow authenticated users to upload documents up to 25MB
      allow write: if request.auth != null 
        && request.resource.size < 25 * 1024 * 1024;
    }
    
    match /{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.resource.size < 25 * 1024 * 1024;
    }
  }
}
```

---

## 📁 Project File Structure

```
Prism Study Planner and Assistant/
├── index.html                 # Single page application entry point
├── css/
│   └── style.css              # Liquid Glass UI & Light Yellow color styling
├── js/
│   ├── firebase-config.js     # Firebase credentials configuration
│   ├── auth.js                # Google Auth & session management
│   ├── db.js                  # Firestore & Storage real-time CRUD operations
│   ├── ui.js                  # View router, breadcrumbs, 3D flip card, downloads
│   └── app.js                 # App coordinator & event listeners
├── firestore.rules            # Firestore security rules
├── database.rules.json        # Realtime Database security rules
├── storage.rules              # Firebase Cloud Storage rules
└── README.md                  # Complete documentation and setup guide
```

---

## 🧪 Testing and Demo Mode

Even before you create a Firebase project, Prism includes a built-in **Demo Mode** with starter subjects (Engineering Mathematics, Physics, Computer Science), sample units, interactive 3D flashcards, and downloadable sample PDFs! When you are ready to enable multi-device sync, simply insert your `firebaseConfig` keys into `js/firebase-config.js`.
