# writespace

A distraction-free writing platform built with React, Vite, and Tailwind CSS. Write, share, and manage your ideas with a clean, minimal interface.

---

## 🚀 Tech Stack

- **React** (JSX)
- **Vite** (blazing fast dev/build)
- **Tailwind CSS** (utility-first styling)
- **React Router** (SPA navigation)
- **LocalStorage** (demo data persistence)
- **ESLint** (linting)
- **PropTypes** (runtime prop validation)

---

## 📁 Folder Structure

```
.
├── public/
├── src/
│   ├── components/      # Reusable UI components (Navbar, BlogCard, etc.)
│   ├── pages/           # Route/page components (Home, Login, Dashboard, etc.)
│   ├── utils/           # Utility functions (auth, storage)
│   ├── App.jsx          # Main app component (routing)
│   ├── main.jsx         # Entry point
│   └── index.css        # Tailwind base styles
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── package.json
```

---

## 🛠️ Setup & Development

1. **Clone the repo**

   ```
   git clone <repo-url>
   cd writespace
   ```

2. **Install dependencies**

   ```
   npm install
   ```

3. **Start the development server**

   ```
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for production**

   ```
   npm run build
   ```

5. **Preview production build**

   ```
   npm run preview
   ```

---

## 📝 Usage

- **Demo Admin Login:**  
  Username: `admin`  
  Password: `admin123`

- **Register as a new user** or use the demo admin to access all features.

- **Data is stored in your browser's LocalStorage** (for demo purposes).  
  To reset, clear your browser storage.

---

## ✨ Features

- Distraction-free writing interface
- User authentication (demo, LocalStorage)
- Admin dashboard & user management
- Create, edit, delete blog posts
- Responsive design
- Role-based access (admin, user, editor)
- No backend required (demo only)

---

## 📄 License

This project is **private** and not licensed for public or commercial use.

---

**© {YEAR} writespace. All rights reserved.**