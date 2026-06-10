
const studentId = localStorage.getItem("studentId");
if (!studentId) {
  
  window.location.href = "index.html";
}


document.getElementById("profileTrigger").textContent = studentId;
document.getElementById("studentIdDisplay").textContent = studentId;


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
  localStorage.removeItem("studentId");
  localStorage.removeItem("userRole");
  window.location.href = "index.html";
});



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

let records = [];
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


const studentRecords = records.filter(r => r.studentId === studentId);


const studentSection = studentRecords.length > 0 ? studentRecords[0].section : "N/A";
document.getElementById("studentSectionDisplay").textContent = studentSection;

const tableBody = document.getElementById("subjectsTableBody");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".btn-filter");

let currentFilter = "all"; 


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

  
  const total = studentRecords.length;
  const percentage = total > 0 ? Math.round((signedCount / total) * 100) : 0;
  document.getElementById("progressPercent").textContent = `${percentage}%`;
  document.getElementById("progressBarFill").style.width = `${percentage}%`;
}


function renderTable(dataList) {
  tableBody.innerHTML = "";

  if (dataList.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="3" class="empty-state">
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
      <td>
        <div class="subject-info">
          <span class="subject-code">${record.code}</span>
          <span class="subject-name">${record.name}</span>
        </div>
      </td>
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


function filterAndRender() {
  const query = searchInput.value.toLowerCase().trim();

  const filtered = studentRecords.filter((record) => {
    
    const matchesSearch = 
      record.code.toLowerCase().includes(query) ||
      record.name.toLowerCase().includes(query) ||
      record.professor.toLowerCase().includes(query);

    
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



searchInput.addEventListener("input", filterAndRender);

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.getAttribute("data-filter");
    filterAndRender();
  });
});



updateStats();
renderTable(studentRecords);
