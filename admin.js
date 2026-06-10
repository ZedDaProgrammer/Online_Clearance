// --- Authentication Security Check ---
const userRole = localStorage.getItem("userRole");
if (userRole !== "admin") {
  // Prevent unauthorized student access to admin workspace
  window.location.href = "index.html";
}

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

// Logs out the administrator and returns to login
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("userRole");
  window.location.href = "index.html";
});


// --- State Management ---
let records = [];
let selectedSection = "";
let selectedStudentId = null;

const sectionSelect = document.getElementById("sectionSelect");
const studentsListGroup = document.getElementById("studentsListGroup");
const studentWorkspace = document.getElementById("studentWorkspace");
const noStudentPlaceholder = document.getElementById("noStudentPlaceholder");
const selectedStudentTitle = document.getElementById("selectedStudentTitle");

const tableBody = document.getElementById("requestsTableBody");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".btn-filter");

let currentFilter = "all"; // Options: "all", "signed", "pending"

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

// Loads clearance requests from localStorage
function loadRecords() {
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
}

// Saves clearance requests back to localStorage
function saveRecords() {
  localStorage.setItem("clearanceRecords", JSON.stringify(records));
}

// Recomputes top metrics for all student requests
function updateStats() {
  let pendingCount = 0;
  let signedCount = 0;

  records.forEach((r) => {
    if (r.status === "Signed") {
      signedCount++;
    } else {
      pendingCount++;
    }
  });

  document.getElementById("statsPending").textContent = pendingCount;
  document.getElementById("statsSigned").textContent = signedCount;
  document.getElementById("statsTotal").textContent = records.length;
}

// Extracts unique sections and populates the section dropdown options
function populateSections() {
  // Clear options except first
  sectionSelect.innerHTML = `<option value="">Choose Section</option>`;
  
  // Find all unique sections
  const sections = [...new Set(records.map(r => r.section).filter(Boolean))];
  
  sections.sort().forEach((sec) => {
    const opt = document.createElement("option");
    opt.value = sec;
    opt.textContent = sec;
    sectionSelect.appendChild(opt);
  });
}

// Renders student numbers belonging to selected section on the left sidebar
function renderStudentList() {
  studentsListGroup.innerHTML = "";

  if (!selectedSection) {
    studentsListGroup.innerHTML = `
      <div style="padding: 1rem; color: var(--text-muted); font-size: 0.85rem; text-align: center;">
        Select a section first.
      </div>
    `;
    return;
  }

  // Get records matching the selected section
  const sectionRecords = records.filter(r => r.section === selectedSection);
  
  // Extract unique student numbers in this section
  const studentIds = [...new Set(sectionRecords.map(r => r.studentId))];

  if (studentIds.length === 0) {
    studentsListGroup.innerHTML = `
      <div style="padding: 1rem; color: var(--text-muted); font-size: 0.85rem; text-align: center;">
        No students in this section.
      </div>
    `;
    return;
  }

  studentIds.forEach((id) => {
    // Count pending subjects for this student
    const studentRecords = sectionRecords.filter(r => r.studentId === id);
    const pendingCount = studentRecords.filter(r => r.status !== "Signed").length;

    // Student item container
    const item = document.createElement("div");
    item.className = `student-item ${id === selectedStudentId ? "active" : ""}`;
    item.innerHTML = `
      <span>${id}</span>
      ${pendingCount > 0 ? `<span class="badge-count">${pendingCount}</span>` : ""}
    `;

    item.addEventListener("click", () => selectStudent(id));
    studentsListGroup.appendChild(item);
  });
}

// Handles selecting a student from the sidebar
function selectStudent(studentId) {
  selectedStudentId = studentId;
  
  // Highlight active sidebar item
  renderStudentList();

  // Show table workspace, hide placeholder
  noStudentPlaceholder.style.display = "none";
  studentWorkspace.style.display = "block";
  selectedStudentTitle.textContent = `Clearance Details for Student: ${studentId} (${selectedSection})`;

  // Reset filters
  searchInput.value = "";
  currentFilter = "all";
  filterButtons.forEach(btn => {
    if (btn.getAttribute("data-filter") === "all") {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Render subject list for student
  filterAndRender();
}

// Renders active student's clearances list
function renderTable(dataList) {
  tableBody.innerHTML = "";

  if (dataList.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="3" class="empty-state">
          <div class="empty-title">No clearance requests found</div>
          <p>Try adjusting your search terms or category filters.</p>
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
      <td>
        <div class="subject-info">
          <span class="subject-code">${record.code}</span>
          <span class="subject-name">${record.name}</span>
        </div>
      </td>
      <td>
        <span class="${badgeClass}">
          ${record.status}
        </span>
      </td>
      <td>
        ${isSigned 
          ? `<span style="color: var(--text-muted); font-size: 0.8rem;">Signed</span>` 
          : `<button class="btn-action" onclick="signClearance('${record.studentId}', '${record.code}')">Sign Document</button>`
        }
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Scopes queries/tab categories to the selected student and renders the list
function filterAndRender() {
  if (!selectedStudentId) return;

  const query = searchInput.value.toLowerCase().trim();

  // Filter records belonging only to the selected student
  const studentRecords = records.filter(r => r.studentId === selectedStudentId);

  const filtered = studentRecords.filter((record) => {
    // 1. Text Search matches subject code, subject name, or status
    const matchesSearch = 
      record.code.toLowerCase().includes(query) ||
      record.name.toLowerCase().includes(query) ||
      record.status.toLowerCase().includes(query);

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

// Action helper to sign off on a student clearance item
window.signClearance = function(studentId, subjectCode) {
  const index = records.findIndex(r => r.studentId === studentId && r.code === subjectCode);
  if (index !== -1) {
    records[index].status = "Signed";
    saveRecords();
    updateStats();
    renderStudentList(); // Refresh pending badges in sidebar
    filterAndRender();   // Refresh details table
  }
};


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

// Section Selector Dropdown change listener
sectionSelect.addEventListener("change", function() {
  selectedSection = this.value;
  selectedStudentId = null;
  
  // Reset details workspace
  studentWorkspace.style.display = "none";
  noStudentPlaceholder.style.display = "block";
  selectedStudentTitle.textContent = "Select a student";

  renderStudentList();
});


// --- Initial Run ---
loadRecords();
updateStats();
populateSections();
renderStudentList();

