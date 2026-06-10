
const userRole = localStorage.getItem("userRole");
if (userRole !== "admin") {
  
  window.location.href = "index.html";
}


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


logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("userRole");
  window.location.href = "index.html";
});



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

let currentFilter = "all"; 

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


function loadRecords() {
  const existing = localStorage.getItem("clearanceRecords");
  let needsReseed = false;
  
  if (existing) {
    try {
      const parsed = JSON.parse(existing);
      const hasInvalid = parsed.some(r => r.code !== "DCIT50" && r.code !== "DCIT24" && r.code !== "ITEC55A");
      if (parsed.length === 0 || !parsed[0].hasOwnProperty("section") || parsed[0].section === "CS-3A" || hasInvalid) {
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


function saveRecords() {
  localStorage.setItem("clearanceRecords", JSON.stringify(records));
}


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


function populateSections() {
  
  sectionSelect.innerHTML = `<option value="">Choose Section</option>`;
  
  
  const sections = [...new Set(records.map(r => r.section).filter(Boolean))];
  
  sections.sort().forEach((sec) => {
    const opt = document.createElement("option");
    opt.value = sec;
    opt.textContent = sec;
    sectionSelect.appendChild(opt);
  });
}


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

  
  const sectionRecords = records.filter(r => r.section === selectedSection);
  
  
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
    
    const studentRecords = sectionRecords.filter(r => r.studentId === id);
    const pendingCount = studentRecords.filter(r => r.status !== "Signed").length;

    
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


function selectStudent(studentId) {
  selectedStudentId = studentId;
  
  
  renderStudentList();

  
  noStudentPlaceholder.style.display = "none";
  studentWorkspace.style.display = "block";
  selectedStudentTitle.textContent = `Clearance Details for Student: ${studentId} (${selectedSection})`;

  
  searchInput.value = "";
  currentFilter = "all";
  filterButtons.forEach(btn => {
    if (btn.getAttribute("data-filter") === "all") {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  
  filterAndRender();
}


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


function filterAndRender() {
  if (!selectedStudentId) return;

  const query = searchInput.value.toLowerCase().trim();

  
  const studentRecords = records.filter(r => r.studentId === selectedStudentId);

  const filtered = studentRecords.filter((record) => {
    
    const matchesSearch = 
      record.code.toLowerCase().includes(query) ||
      record.name.toLowerCase().includes(query) ||
      record.status.toLowerCase().includes(query);

    
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


window.signClearance = function(studentId, subjectCode) {
  const index = records.findIndex(r => r.studentId === studentId && r.code === subjectCode);
  if (index !== -1) {
    records[index].status = "Signed";
    saveRecords();
    updateStats();
    renderStudentList(); 
    filterAndRender();   
  }
};



searchInput.addEventListener("input", filterAndRender);

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.getAttribute("data-filter");
    filterAndRender();
  });
});


sectionSelect.addEventListener("change", function() {
  selectedSection = this.value;
  selectedStudentId = null;
  
  
  studentWorkspace.style.display = "none";
  noStudentPlaceholder.style.display = "block";
  selectedStudentTitle.textContent = "Select a student";

  renderStudentList();
});



loadRecords();
updateStats();
populateSections();
renderStudentList();

