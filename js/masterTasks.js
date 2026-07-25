// ===== MASTER TASKS MODULE =====
function openMasterTasks(){
    currentPage="master";
    const u = user();
    app.innerHTML = `<div class="layout">
        <div class="sidebar">
            <h2>🏥 Amba AI</h2>
            <a href="#" id="masterDashboard">📊 Dashboard</a>
            <a href="#" id="masterBack">📚 Master Tasks</a>
            <a href="#" id="masterLogout">🚪 Logout</a>
        </div>
        <div class="content">
            <header class="top">
                <div>
                    <h1>📚 Master Task Repository</h1>
                    <div class="muted">Create and manage reusable task templates</div>
                </div>
                ${u.role === 'ADMIN' ? `<div class="actions">
                    <button class="primary" id="createMasterBtn">➕ New Master Task</button>
                </div>` : ''}
            </header>

            <section class="panel" style="margin-bottom:18px">
                <div class="toolbar">
                    <input id="masterSearch" placeholder="🔍 Search master tasks...">
                    <select id="masterFilter">
                        <option value="ALL">All Categories</option>
                        <option value="OPERATIONS">Operations</option>
                        <option value="COMPLIANCE">Compliance</option>
                        <option value="MAINTENANCE">Maintenance</option>
                        <option value="ADMINISTRATION">Administration</option>
                    </select>
                    <select id="masterSort">
                        <option value="RECENT">Recently Added</option>
                        <option value="NAME">Name (A-Z)</option>
                        <option value="USAGE">Most Used</option>
                    </select>
                </div>
            </section>

            <section class="panel">
                <div id="masterTasksList" style="display:grid;gap:14px"></div>
            </section>

            <!-- Master Task Modal -->
            <div id="masterModal" class="modal-bg">
                <div class="modal">
                    <h2 id="masterModalTitle">Create Master Task</h2>
                    <form id="masterForm" style="display:grid;gap:12px">
                        <div>
                            <label style="font-weight:600;display:block;margin-bottom:6px">Task Title</label>
                            <input id="masterTitle" placeholder="e.g., Daily OPD Checkout" required>
                        </div>
                        <div>
                            <label style="font-weight:600;display:block;margin-bottom:6px">Description</label>
                            <textarea id="masterDesc" placeholder="Detailed task description..."></textarea>
                        </div>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
                            <div>
                                <label style="font-weight:600;display:block;margin-bottom:6px">Category</label>
                                <select id="masterCategory" required>
                                    <option value="OPERATIONS">Operations</option>
                                    <option value="COMPLIANCE">Compliance</option>
                                    <option value="MAINTENANCE">Maintenance</option>
                                    <option value="ADMINISTRATION">Administration</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-weight:600;display:block;margin-bottom:6px">Default Priority</label>
                                <select id="masterPriority" required>
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                </select>
                            </div>
                        </div>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
                            <button type="button" class="secondary" onclick="document.getElementById('masterModal').classList.remove('open')">Cancel</button>
                            <button type="submit" class="primary">Save Master Task</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>`;

    // Initialize master tasks list
    if(!db.masterTasks) db.masterTasks = [];
    
    function renderMasterTasks(){
        const search = (document.getElementById("masterSearch")?.value || "").toLowerCase();
        const filter = document.getElementById("masterFilter")?.value || "ALL";
        const sort = document.getElementById("masterSort")?.value || "RECENT";
        
        let tasks = db.masterTasks.filter(t => 
            (filter === "ALL" || t.category === filter) &&
            (t.title.toLowerCase().includes(search) || t.description.toLowerCase().includes(search))
        );

        if(sort === "NAME") tasks.sort((a,b) => a.title.localeCompare(b.title));
        if(sort === "USAGE") tasks.sort((a,b) => (b.usageCount || 0) - (a.usageCount || 0));
        
        const list = document.getElementById("masterTasksList");
        if(list){
            list.innerHTML = tasks.length ? tasks.map(t => `
                <div style="background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px;display:grid;gap:8px">
                    <div style="display:flex;justify-content:space-between;align-items:start">
                        <div style="flex:1">
                            <h3 style="margin:0;color:var(--text)">${esc(t.title)}</h3>
                            <p style="margin:6px 0 0;color:var(--muted);font-size:13px">${esc(t.description)}</p>
                        </div>
                        <div style="display:flex;gap:6px;align-items:center">
                            <span style="background:#e0e7ff;color:#4f46e5;padding:4px 8px;border-radius:6px;font-size:12px;font-weight:600">${t.category}</span>
                            <span style="background:#fef3c7;color:#d97706;padding:4px 8px;border-radius:6px;font-size:12px;font-weight:600">${t.priority}</span>
                        </div>
                    </div>
                    <div style="display:flex;gap:8px;font-size:12px;color:var(--muted)">
                        <span>📊 Used ${t.usageCount || 0} times</span>
                        <span>📅 Added ${new Date(t.createdAt).toLocaleDateString()}</span>
                    </div>
                    ${u.role === 'ADMIN' ? `
                    <div style="display:flex;gap:8px;margin-top:8px">
                        <button onclick="editMasterTask('${t.id}')" class="secondary" style="flex:1;padding:8px">Edit</button>
                        <button onclick="useMasterTask('${t.id}')" class="primary" style="flex:1;padding:8px">Use Task</button>
                        <button onclick="deleteMasterTask('${t.id}')" class="danger" style="flex:1;padding:8px">Delete</button>
                    </div>
                    ` : `
                    <div style="display:flex;gap:8px;margin-top:8px">
                        <button onclick="useMasterTask('${t.id}')" class="primary" style="flex:1;padding:8px">Use Task</button>
                    </div>
                    `}
                </div>
            `).join('') : '<div style="text-align:center;color:var(--muted);padding:40px">No master tasks found</div>';
        }
    }

    function saveMasterTask(e){
        e.preventDefault();
        if(u.role !== 'ADMIN') return toast("❌ Only admins can create master tasks");
        
        const task = {
            id: "mt" + Date.now(),
            title: document.getElementById("masterTitle").value,
            description: document.getElementById("masterDesc").value,
            category: document.getElementById("masterCategory").value,
            priority: document.getElementById("masterPriority").value,
            usageCount: 0,
            createdAt: new Date().toISOString()
        };
        
        db.masterTasks.push(task);
        save();
        document.getElementById("masterModal").classList.remove("open");
        renderMasterTasks();
        toast("✅ Master task created");
    }

    function useMasterTask(id){
        const mt = db.masterTasks.find(x => x.id === id);
        if(!mt) return;
        
        // Switch to dashboard and pre-fill task form
        showDashboard();
        setTimeout(() => {
            document.getElementById("title").value = mt.title;
            document.getElementById("desc").value = mt.description;
            document.getElementById("pri").value = mt.priority;
            taskModal.classList.add("open");
            mt.usageCount = (mt.usageCount || 0) + 1;
            save();
            toast("📌 Master task loaded");
        }, 100);
    }

    function deleteMasterTask(id){
        if(u.role !== 'ADMIN') return;
        if(!confirm("Delete this master task?")) return;
        db.masterTasks = db.masterTasks.filter(x => x.id !== id);
        save();
        renderMasterTasks();
        toast("✅ Master task deleted");
    }

    // Event binding
    document.getElementById("masterDashboard")?.addEventListener("click", e => {
        e.preventDefault();
        showDashboard();
    });

    document.getElementById("masterLogout")?.addEventListener("click", e => {
        e.preventDefault();
        localStorage.removeItem(SESSION);
        renderLogin();
    });

    document.getElementById("createMasterBtn")?.addEventListener("click", () => {
        document.getElementById("masterForm").reset();
        document.getElementById("masterModalTitle").textContent = "Create Master Task";
        document.getElementById("masterModal").classList.add("open");
    });

    document.getElementById("masterForm")?.addEventListener("submit", saveMasterTask);
    document.getElementById("masterSearch")?.addEventListener("input", renderMasterTasks);
    document.getElementById("masterFilter")?.addEventListener("change", renderMasterTasks);
    document.getElementById("masterSort")?.addEventListener("change", renderMasterTasks);

    // Expose functions globally
    window.useMasterTask = useMasterTask;
    window.deleteMasterTask = deleteMasterTask;
    window.editMasterTask = () => toast("✏️ Edit coming soon");

    renderMasterTasks();
}
