// Master Tasks Module for Amba AI Task Manager V6
// This module manages task templates and categories

function openMasterTasks(){
    const u = user();
    if (u.role !== "ADMIN") {
        toast("❌ Only admins can access Master Tasks");
        return;
    }
    
    if (!db.masterTasks) db.masterTasks = [];
    
    const masterTasksHTML = `
    <section class="panel" style="margin-bottom:18px">
        <h2>📚 Master Tasks</h2>
        <p class="muted">Create reusable task templates for your team</p>
        
        <div class="toolbar" style="grid-template-columns: 1fr auto;">
            <input id="masterSearch" placeholder="🔍 Search templates...">
            <button class="primary" id="createMasterBtn">+ New Template</button>
        </div>
        
        <div id="masterTasksList" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 15px; margin-top: 15px;">
            <!-- Master tasks will render here -->
        </div>
    </section>`;
    
    let content = document.querySelector('.content');
    if (content) {
        content.innerHTML = masterTasksHTML;
    }
    
    renderMasterTasks();
    
    // Event listeners
    const createBtn = document.getElementById("createMasterBtn");
    if (createBtn) {
        createBtn.addEventListener("click", () => {
            const title = prompt("Template title:");
            if (title) {
                if (!db.masterTasks) db.masterTasks = [];
                db.masterTasks.push({
                    id: "m" + Date.now(),
                    title: title,
                    description: prompt("Description (optional):") || "",
                    priority: "MEDIUM",
                    createdAt: new Date().toISOString()
                });
                save();
                renderMasterTasks();
                toast("✅ Template created!");
            }
        });
    }
    
    const searchBox = document.getElementById("masterSearch");
    if (searchBox) {
        searchBox.addEventListener("input", renderMasterTasks);
    }
}

function renderMasterTasks(){
    if (!db.masterTasks) db.masterTasks = [];
    
    const search = document.getElementById("masterSearch")?.value.toLowerCase() || "";
    const filtered = db.masterTasks.filter(t => 
        t.title.toLowerCase().includes(search) || 
        t.description.toLowerCase().includes(search)
    );
    
    const list = document.getElementById("masterTasksList");
    if (!list) return;
    
    list.innerHTML = filtered.length ? filtered.map(t => `
        <div class="panel" style="padding: 15px;">
            <h3>${esc(t.title)}</h3>
            <p class="muted" style="font-size: 12px;">${esc(t.description)}</p>
            <div style="display: flex; gap: 10px; margin-top: 10px;">
                <button class="primary" style="flex: 1; padding: 8px;" onclick="useTemplate('${t.id}')">📋 Use</button>
                <button class="danger" style="flex: 1; padding: 8px;" onclick="deleteTemplate('${t.id}')">🗑️ Delete</button>
            </div>
        </div>
    `).join("") : "<p class='muted'>No templates yet. Create one to get started!</p>";
}

function useTemplate(templateId){
    const template = db.masterTasks.find(t => t.id === templateId);
    if (!template) return;
    
    // Pre-fill task form with template data
    if (document.getElementById("taskForm")) {
        document.getElementById("title").value = template.title;
        document.getElementById("desc").value = template.description;
        document.getElementById("pri").value = template.priority;
        openTask();
    }
}

function deleteTemplate(templateId){
    if (confirm("Delete this template?")) {
        db.masterTasks = db.masterTasks.filter(t => t.id !== templateId);
        save();
        renderMasterTasks();
        toast("✅ Template deleted!");
    }
}
