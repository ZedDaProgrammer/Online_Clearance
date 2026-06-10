# Online Academic Clearance Portal

A lightweight, fully responsive, and connected prototype of an **Academic Clearance Portal** built using only vanilla HTML5, CSS3, and plain JavaScript. This portal utilizes the browser's `localStorage` to simulate a shared database, allowing actions performed by admins to instantly update the student dashboards in real-time.

---

## 🚀 Live Demo & How to Run

Since this project uses no external libraries, frameworks, or build tools, it requires zero setup:

1. Clone or download this repository.
2. Locate the **`index.html`** file in the root folder.
3. Double-click **`index.html`** to launch it in any modern web browser.

---

## 🔑 Login Credentials

You can log in to the portal using the following test credentials:

### 1. Administrator Account
* **Username:** `admin`
* **Password:** `admin`
* **Features:** Access to the clearance desk. Select student sections (`BSIT 2-1` to `BSIT 2-3`), view student lists with pending signature counts, and sign off on clearances.

### 2. Student Accounts
* **Username:** Any numeric Student ID (e.g. `202410351`, `202410402`, or any new numeric ID of your choice).
* **Password:** Any password.
* **Features:** Access to the personal clearance dashboard showing completion percentages, active metrics (Pending/Signed/Total), and status badges.
* *Note: Logging in with a new numeric ID automatically initializes a new mock clearance profile under section `BSIT 2-1`!*

---

## 🛠️ Key Features

* **Connected Multi-page Flow:** Includes a dedicated Login Page, Student Dashboard, and Admin clearance workspace.
* **Simulated Shared State:** Clearance data is saved in a JSON array inside `localStorage`. Modifications made by admins immediately persist and update the student views.
* **Completion Progress Bar:** Displays a dynamic, emerald-green completion bar on the student dashboard that calculates progress percentages in real-time.
* **Password Visibility Toggle:** Includes a "Show/Hide" toggle next to the password input for better login usability.
* **Two-Level Selection in Admin Workspace:** Admins select academic sections first, dynamically filtering the student list sidebar. Clicking a student ID loads their specific subjects.
* **Monochrome Slate Aesthetics:** Built with a high-density, modern slate design focusing on clean typography and compact grid spaces.

---

## 📂 File Structure

```bash
├── index.html         # Login page layout
├── login.css          # Login card and toggle stylings
├── login.js           # Credentials routing and dynamic database seeding
├── dashboard.html     # Student dashboard interface
├── dashboard.css      # Student status badges and progress bar layouts
├── dashboard.js       # Student calculations, search, and filters logic
├── admin.html         # Administrative split-screen workspace
├── admin.css          # Admin grid layouts and signature action buttons
├── admin.js           # Admin selection groups, listing, and approvals logic
├── LICENSE            # Project license file
└── README.md          # Project documentation
```

---

## 🧑‍🎓 Student Code Quality
This project is designed as an educational reference for students. It:
* Decouples data states from DOM operations.
* Avoids framework complexities in favor of native API standard code (`document.getElementById`, `.addEventListener`, etc.).
* Uses minimal, clean logic comments for key workflows (such as authentication regex checks and state storage bindings).