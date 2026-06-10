// --- Authentication Security Check ---
const studentId = localStorage.getItem("studentId");
if (!studentId) {
  // Direct unauthorized users back to the login page
  window.location.href = "index.html";
}

// Display Student Information
document.getElementById("profileTrigger").textContent = studentId;
document.getElementById("studentIdDisplay").textContent = studentId;

// --- Dropdown Navigation Logic ---
const profileTrigger = document.getElementById("profileTrigger");
const profileDropdown = document.getElementById("profileDropdown");
const logoutBtn = document.getElementById("logoutBtn");

profileTrigger.addEventListener("click", (event) => {
  event.stopPropagation();
  profileDropdown.classList.toggle("show");
  profileTrigger.classList.toggle("active");
});

window.addEventListener("click", () => {
  if (profileDropdown.classList.contains("show")) {
    profileDropdown.classList.remove("show");
    profileTrigger.classList.remove("active");
  }
});

// Logs out the user by clearing the session from localStorage
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("studentId");
  localStorage.removeItem("userRole");
  window.location.href = "index.html";
});


// --- State Management ---
const defaultClearanceRecords = [
  // Section BSIT 2-1
  { studentId: "202410351", section: "BSIT 2-1", code: "DCIT50", name: "OBJECT ORIENTED PROGRAMMING", professor: "Prof. Arthur Pendragon", status: "Signed" },
  { studentId: "202410351", section: "BSIT 2-1", code: "DCIT24", name: "INFORMATION MANAGEMENT", professor: "Dr. Evelyn Martinez", status: "Available to be Signed" },
  { studentId: "202410351", section: "BSIT 2-1", code: "ITEC55A", name: "PLATFORM TECHNOLOGIES", professor: "Dr. Sophia Carter", status: "Available to be Signed" },
  
  { studentId: "202410402", section: "BSIT 2-1", code: "DCIT50", name: "OBJECT ORIENTED PROGRAMMING", professor: "Prof. Arthur Pendragon", status: "Signed" },
  { studentId: "202410402", section: "BSIT 2-1", code: "DCIT24", name: "INFORMATION MANAGEMENT", professor: "Dr. Evelyn Martinez", status: "Signed" },
  { studentId: "202410402", section: "BSIT 2-1", code: "ITEC55A", name: "PLATFORM TECHNOLOGIES", professor: "Dr. Sophia Carter", status: "Available to be Signed" },

  // Section BSIT 2-2
  { studentId: "202410501", section: "BSIT 2-2", code: "DCIT50", name: "OBJECT ORIENTED PROGRAMMING", professor: "Prof. Arthur Pendragon", status: "Available to be Signed" },
  { studentId: "202410501", section: "BSIT 2-2", code: "DCIT24", name: "INFORMATION MANAGEMENT", professor: "Dr. Evelyn Martinez", status: "Signed" },
  { studentId: "202410501", section: "BSIT 2-2", code: "ITEC55A", name: "PLATFORM TECHNOLOGIES", professor: "Dr. Sophia Carter", status: "Available to be Signed" },

  { studentId: "202410602", section: "BSIT 2-2", code: "DCIT50", name: "OBJECT ORIENTED PROGRAMMING", professor: "Prof. Arthur Pendragon", status: "Signed" },
  { studentId: "202410602", section: "BSIT 2-2", code: "DCIT24", name: "INFORMATION MANAGEMENT", professor: "Dr. Evelyn Martinez", status: "Available to be Signed" },
  { studentId: "202410602", section: "BSIT 2-2", code: "ITEC55A", name: "PLATFORM TECHNOLOGIES", professor: "Dr. Sophia Carter", status: "Signed" },

  // Section BSIT 2-3
  { studentId: "202410703", section: "BSIT 2-3", code: "DCIT50", name: "OBJECT ORIENTED PROGRAMMING", professor: "Prof. Arthur Pendragon", status: "Available to be Signed" },
  { studentId: "202410703", section: "BSIT 2-3", code: "DCIT24", name: "INFORMATION MANAGEMENT", professor: "Dr. Evelyn Martinez", status: "Available to be Signed" },
  { studentId: "202410703", section: "BSIT 2-3", code: "ITEC55A", name: "PLATFORM TECHNOLOGIES", professor: "Dr. Sophia Carter", status: "Signed" }
];

let records = [];
const existing = localStorage.getItem("clearanceRecords");
let needsReseed = false;

if (existing) {
  try {
    const parsed = JSON.parse(existing);
    if (parsed.length === 0 || !parsed[0].hasOwnProperty("section") || parsed[0].section === "CS-3A" || parsed[0].code !== "DCIT50") {
      needsReseed = true;
    } else {
      records = parsed;
    }
  } catch (e) {
    needsReseed = true;
  }
} else {
  needsReseed = true;
}

if (needsReseed) {
  localStorage.setItem("clearanceRecords", JSON.stringify(defaultClearanceRecords));
  records = defaultClearanceRecords;
}

// Filter records specifically belonging to the active student ID
const studentRecords = records.filter(r => r.studentId === studentId);

// Display Student Section
const studentSection = studentRecords.length > 0 ? studentRecords[0].section : "N/A";
document.getElementById("studentSectionDisplay").textContent = studentSection;

const tableBody = document.getElementById("subjectsTableBody");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".btn-filter");

let currentFilter = "all"; // Options: "all", "signed", "pending"

// Recomputes statistics based on current student's data and updates the progress bar
function updateStats() {
  let pendingCount = 0;
  let signedCount = 0;

  studentRecords.forEach((r) => {
    if (r.status === "Signed") {
      signedCount++;
    } else {
      pendingCount++;
    }
  });

  document.getElementById("statsPending").textContent = pendingCount;
  document.getElementById("statsSigned").textContent = signedCount;
  document.getElementById("statsTotal").textContent = studentRecords.length;

  // Calculate and update visual completion progress
  const total = studentRecords.length;
  const percentage = total > 0 ? Math.round((signedCount / total) * 100) : 0;
  document.getElementById("progressPercent").textContent = `${percentage}%`;
  document.getElementById("progressBarFill").style.width = `${percentage}%`;
}

// Renders the student's table rows dynamically
function renderTable(dataList) {
  tableBody.innerHTML = "";

  if (dataList.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" class="empty-state">
          <div class="empty-title">No clearances found</div>
          <p>No records match your filters or search terms.</p>
        </td>
      </tr>
    `;
    return;
  }

  dataList.forEach((record) => {
    const isSigned = record.status === "Signed";
    const badgeClass = isSigned ? "badge signed" : "badge pending";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td><strong>${record.code}</strong></td>
      <td>${record.name}</td>
      <td>${record.professor}</td>
      <td>
        <span class="${badgeClass}">
          ${record.status}
        </span>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Logic for combining text search and category toggles
function filterAndRender() {
  const query = searchInput.value.toLowerCase().trim();

  const filtered = studentRecords.filter((record) => {
    // 1. Text Search matches code, name, or professor
    const matchesSearch = 
      record.code.toLowerCase().includes(query) ||
      record.name.toLowerCase().includes(query) ||
      record.professor.toLowerCase().includes(query);

    // 2. Tab Filter Category matches
    let matchesCategory = true;
    if (currentFilter === "signed") {
      matchesCategory = (record.status === "Signed");
    } else if (currentFilter === "pending") {
      matchesCategory = (record.status === "Available to be Signed");
    }

    return matchesSearch && matchesCategory;
  });

  renderTable(filtered);
}


// --- Event Listeners for Filters ---
searchInput.addEventListener("input", filterAndRender);

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.getAttribute("data-filter");
    filterAndRender();
  });
});


// --- Initial Run ---
updateStats();
renderTable(studentRecords);
