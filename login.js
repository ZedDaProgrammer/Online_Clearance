const defaultClearanceRecords = [
  { studentId: "202410351", section: "BSIT 2-1", code: "DCIT50", name: "OBJECT ORIENTED PROGRAMMING", professor: "Prof. Arthur Pendragon", status: "Signed" },
  { studentId: "202410351", section: "BSIT 2-1", code: "DCIT24", name: "INFORMATION MANAGEMENT", professor: "Dr. Evelyn Martinez", status: "Available to be Signed" },
  { studentId: "202410351", section: "BSIT 2-1", code: "ITEC55A", name: "PLATFORM TECHNOLOGIES", professor: "Dr. Sophia Carter", status: "Available to be Signed" },
  
  { studentId: "202410402", section: "BSIT 2-1", code: "DCIT50", name: "OBJECT ORIENTED PROGRAMMING", professor: "Prof. Arthur Pendragon", status: "Signed" },
  { studentId: "202410402", section: "BSIT 2-1", code: "DCIT24", name: "INFORMATION MANAGEMENT", professor: "Dr. Evelyn Martinez", status: "Signed" },
  { studentId: "202410402", section: "BSIT 2-1", code: "ITEC55A", name: "PLATFORM TECHNOLOGIES", professor: "Dr. Sophia Carter", status: "Available to be Signed" },

  { studentId: "202410501", section: "BSIT 2-2", code: "DCIT50", name: "OBJECT ORIENTED PROGRAMMING", professor: "Prof. Arthur Pendragon", status: "Available to be Signed" },
  { studentId: "202410501", section: "BSIT 2-2", code: "DCIT24", name: "INFORMATION MANAGEMENT", professor: "Dr. Evelyn Martinez", status: "Signed" },
  { studentId: "202410501", section: "BSIT 2-2", code: "ITEC55A", name: "PLATFORM TECHNOLOGIES", professor: "Dr. Sophia Carter", status: "Available to be Signed" },

  { studentId: "202410602", section: "BSIT 2-2", code: "DCIT50", name: "OBJECT ORIENTED PROGRAMMING", professor: "Prof. Arthur Pendragon", status: "Signed" },
  { studentId: "202410602", section: "BSIT 2-2", code: "DCIT24", name: "INFORMATION MANAGEMENT", professor: "Dr. Evelyn Martinez", status: "Available to be Signed" },
  { studentId: "202410602", section: "BSIT 2-2", code: "ITEC55A", name: "PLATFORM TECHNOLOGIES", professor: "Dr. Sophia Carter", status: "Signed" },

  { studentId: "202410703", section: "BSIT 2-3", code: "DCIT50", name: "OBJECT ORIENTED PROGRAMMING", professor: "Prof. Arthur Pendragon", status: "Available to be Signed" },
  { studentId: "202410703", section: "BSIT 2-3", code: "DCIT24", name: "INFORMATION MANAGEMENT", professor: "Dr. Evelyn Martinez", status: "Available to be Signed" },
  { studentId: "202410703", section: "BSIT 2-3", code: "ITEC55A", name: "PLATFORM TECHNOLOGIES", professor: "Dr. Sophia Carter", status: "Signed" }
];

const existingRecords = localStorage.getItem("clearanceRecords");
let needsReseed = false;
if (existingRecords) {
  try {
    const parsed = JSON.parse(existingRecords);
    const hasInvalid = parsed.some(r => r.code !== "DCIT50" && r.code !== "DCIT24" && r.code !== "ITEC55A");
    if (parsed.length === 0 || !parsed[0].hasOwnProperty("section") || parsed[0].section === "CS-3A" || hasInvalid) {
      needsReseed = true;
    }
  } catch (e) {
    needsReseed = true;
  }
} else {
  needsReseed = true;
}

if (needsReseed) {
  localStorage.setItem("clearanceRecords", JSON.stringify(defaultClearanceRecords));
}

const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const errorDisplay = document.getElementById("errorMessage");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  errorDisplay.textContent = "";

  if (username === "admin" && password === "admin") {
    localStorage.setItem("userRole", "admin");
    window.location.href = "admin.html";
    return;
  }

  if (password.length === 0) {
    errorDisplay.textContent = "Password cannot be empty.";
    return;
  }

  localStorage.setItem("studentId", username);
  localStorage.setItem("userRole", "student");

  let records = [];
  try {
    records = JSON.parse(localStorage.getItem("clearanceRecords")) || [];
  } catch (e) {
    records = [];
  }

  const hasRecords = records.some(r => r.studentId === username);
  if (!hasRecords) {
    const newStudentRecords = [
      { studentId: username, section: "BSIT 2-1", code: "DCIT50", name: "OBJECT ORIENTED PROGRAMMING", professor: "Prof. Arthur Pendragon", status: "Available to be Signed" },
      { studentId: username, section: "BSIT 2-1", code: "DCIT24", name: "INFORMATION MANAGEMENT", professor: "Dr. Evelyn Martinez", status: "Available to be Signed" },
      { studentId: username, section: "BSIT 2-1", code: "ITEC55A", name: "PLATFORM TECHNOLOGIES", professor: "Dr. Sophia Carter", status: "Available to be Signed" }
    ];

    records = records.concat(newStudentRecords);
    localStorage.setItem("clearanceRecords", JSON.stringify(records));
  }

  window.location.href = "dashboard.html";
});

const togglePassword = document.getElementById("togglePassword");
togglePassword.addEventListener("click", () => {
  const isPassword = passwordInput.getAttribute("type") === "password";
  passwordInput.setAttribute("type", isPassword ? "text" : "password");
  togglePassword.textContent = isPassword ? "Hide" : "Show";
});
