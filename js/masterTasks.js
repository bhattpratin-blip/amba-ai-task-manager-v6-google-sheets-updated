// ===== Master Tasks Module =====
// Manages reusable task templates for recurring work patterns

function showMasterTasks() {
  currentPage = "master";
  let u = user();
  let masterTasks = db.masterTasks || [];
  
  let html = `<div class="content">
    <header class="top">
      <div>
        <h1>📚 Master Tasks</h1>
        <div class="muted">Create reusable task templates for recurring work patterns</div>
      </div>
      <div class="actions">
        <button class="primary" id="createMasterBtn">+ New Master Task</button>
      </div>
    </header>

    <section class="panel" style="margin-bottom:20px">
      <h2>Master Task Templates</h2>
      <p class="muted">These templates can be quickly applied to create new tasks with predefined details</p>
      <table style="width:100%;border-collapse:collapse;margin-top:14px" id="masterTable">
        <thead>
          <tr style="border-bottom:2px solid var(--line)">
            <th style="padding:12px;text-align:left">Template Name</th>
            <th style="padding:12px;text-align:left">Description</th>
            <th style="padding:12px;text-align:left">Default Priority</th>
            <th style="padding:12px;text-align:left">Uses</th>
            <th style="padding:12px;text-align:center">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${masterTasks.length ? masterTasks.map(t => `
            <tr style="border-bottom:1px solid var(--line);hover-effect">
              <td style="padding:12px"><strong>${esc(t.name)}</strong></td>
              <td style="padding:12px">${esc(t.description || '-')}</td>
              <td style="padding:12px"><span class="badge" style="background:${t.priority==="HIGH"?"#dc2626":t.priority==="LOW"?"#059669":"#0ea5e9"};color:#fff;padding:4px 8px;border-radius:4px">${t.priority}</span></td>
              <td style="padding:12px"><strong>${(db.tasks.filter(x => x.templateId === t.id).length)}</strong></td>
              <td style="padding:12px;text-align:center">
                <button class="secondary" style="padding:6px 12px;font-size:12px" onclick="applyMasterTask('${t.id}')">Use</button>
                <button class="secondary" style="padding:6px 12px;font-size:12px" onclick="editMasterTask('${t.id}')">Edit</button>
                <button class="secondary" style="padding:6px 12px;font-size:12px;background:#dc2626;color:#fff" onclick="deleteMasterTask('${t.id}')">Delete</button>
              </td>
            </tr>
          `).join('') : '<tr><td colspan="5" style="padding:20px;text-align:center;color:var(--muted)">No master tasks yet. Create one to get started!</td></tr>'}
        </tbody>
      </table>
    </section>
  </div>

  <div id="masterModal" class="modal-bg">
    <div class="modal">
      <h2 id="masterModalTitle">Create Master Task</h2>
      <form id="masterForm" style="display:grid;gap:14px">
        <input id="masterName" placeholder="Template name (e.g., Weekly Report)" required>
        <textarea id="masterDesc" placeholder="Description and instructions"></textarea>
        <select id="masterPriority">
          <option value="LOW">Low Priority</option>
          <option value="MEDIUM" selected>Medium Priority</option>
          <option value="HIGH">High Priority</option>
        </select>
        <textarea id="masterInstructions" placeholder="Step-by-step instructions for using this template"></textarea>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px">
          <button type="button" class="secondary" onclick="document.getElementById('masterModal').classList.remove('open')">Cancel</button>
          <button type="submit" class="primary">Save Template</button>
        </div>
      </form>
    </div>
  </div>`;

  app.innerHTML = `<div class="layout"><div class="sidebar">
    <h2>🏥 Amba AI</h2>
    <a href="#" onclick="showDashboard();return false">📊 Dashboard</a>
    <a href="#" onclick="showMasterTasks();return false" style="background:#4f46e5">📚 Master Tasks</a>
    <a href="#" onclick="showDailyTasks();return false">📅 Daily Tasks</a>
    <a href="#" onclick="showWeeklyTasks();return false">📆 Weekly Tasks</a>
    <a href="#" onclick="showMonthlyTasks();return false">🗓 Monthly Tasks</a>
    <a href="#" onclick="showEmployees();return false">👥 Employees</a>
    <a href="#" onclick="showReports();return false">📈 Reports</a>
    <a href="#" onclick="showSettings();return false">⚙️ Settings</a>
    <hr style="border:none;border-top:1px solid #334155;margin:20px 0">
    <a href="#" id="logoutSide2">🚪 Logout</a>
  </div>${html}</div>`;

  // Event listeners
  document.getElementById("createMasterBtn").onclick = () => {
    document.getElementById("masterName").value = "";
    document.getElementById("masterDesc").value = "";
    document.getElementById("masterPriority").value = "MEDIUM";
    document.getElementById("masterInstructions").value = "";
    document.getElementById("masterModalTitle").textContent = "Create Master Task";
    document.getElementById("masterModal").classList.add("open");
    editing = null;
  };

  document.getElementById("masterForm").onsubmit = (e) => {
    e.preventDefault();
    if (!db.masterTasks) db.masterTasks = [];
    
    if (editing) {
      let t = db.masterTasks.find(x => x.id === editing);
      if (t) {
        t.name = document.getElementById("masterName").value.trim();
        t.description = document.getElementById("masterDesc").value;
        t.priority = document.getElementById("masterPriority").value;
        t.instructions = document.getElementById("masterInstructions").value;
      }
    } else {
      db.masterTasks.push({
        id: "m" + Date.now(),
        name: document.getElementById("masterName").value.trim(),
        description: document.getElementById("masterDesc").value,
        priority: document.getElementById("masterPriority").value,
        instructions: document.getElementById("masterInstructions").value,
        createdBy: u.id,
        createdAt: new Date().toISOString()
      });
    }
    
    save();
    toast("Master task saved!");
    document.getElementById("masterModal").classList.remove("open");
    showMasterTasks();
  };

  document.getElementById("logoutSide2").onclick = (e) => {
    e.preventDefault();
    localStorage.removeItem(SESSION);
    sessionStorage.removeItem(SESSION);
    localStorage.removeItem(REMEMBER);
    session = null;
    renderLogin();
  };
}

function editMasterTask(id) {
  editing = id;
  let t = db.masterTasks.find(x => x.id === id);
  if (!t) return;
  
  document.getElementById("masterName").value = t.name;
  document.getElementById("masterDesc").value = t.description || "";
  document.getElementById("masterPriority").value = t.priority || "MEDIUM";
  document.getElementById("masterInstructions").value = t.instructions || "";
  document.getElementById("masterModalTitle").textContent = "Edit Master Task";
  document.getElementById("masterModal").classList.add("open");
}

function applyMasterTask(id) {
  let t = db.masterTasks.find(x => x.id === id);
  if (!t) return;
  
  // Pre-fill the main task form with master task data
  editing = null;
  openTask(null);
  setTimeout(() => {
    document.getElementById("title").value = t.name;
    document.getElementById("desc").value = t.instructions || t.description;
    document.getElementById("pri").value = t.priority;
    toast(`Master task template loaded: ${t.name}`);
  }, 100);
}

function deleteMasterTask(id) {
  if (confirm("Delete this master task template?")) {
    db.masterTasks = db.masterTasks.filter(x => x.id !== id);
    save();
    toast("Master task deleted");
    showMasterTasks();
  }
}
