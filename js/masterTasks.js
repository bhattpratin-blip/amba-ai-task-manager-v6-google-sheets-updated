// ==========================================
// MASTER TASKS MODULE - V8.2 UPDATED
// ==========================================

// 1. Logic to Apply a Template (Enhanced with Checklists)
function applyTemplate(id) {
    const m = state.masterTasks.find(x => x.id === id);
    if (!m) return;

    const newTask = {
        id: 't' + Date.now(),
        title: m.title,
        description: m.description || "",
        assignedTo: 'e1', // Default to Admin
        priority: m.priority || 'MEDIUM',
        status: 'TODO',
        date: new Date().toISOString().split('T')[0], // Today
        checklist: m.checklist ? [...m.checklist] : [], // Copy checklist
        templateId: m.id,
        createdAt: new Date().toISOString()
    };

    state.tasks.unshift(newTask);
    
    // Update Usage Count for Analytics
    m.usageCount = (m.usageCount || 0) + 1;

    state.notifications.unshift({
        text: `📚 Applied Template: "${m.title}"`,
        type: 'info',
        read: false,
        date: new Date().toISOString()
    });

    save(); 
    nav('tasks'); // Redirect to task list to see the new task
    toast("Template applied successfully!");
}

// 2. Updated Render View for Master Tasks
function renderMasterView() {
    const mount = document.getElementById('view-mount');
    
    mount.innerHTML = `
        <div class="panel">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <div>
                    <h3 style="margin:0;">📚 Master Task Library</h3>
                    <p class="muted" style="font-size:0.8rem;">Standardized templates for recurring workflows.</p>
                </div>
                <button class="btn btn-primary" onclick="openMasterModal()">+ Create Template</button>
            </div>

            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Template Name</th>
                            <th>Complexity/Steps</th>
                            <th>Default Priority</th>
                            <th>Popularity</th>
                            <th style="text-align:right;">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${state.masterTasks.length ? state.masterTasks.map(m => `
                            <tr>
                                <td>
                                    <div style="font-weight:700;">${esc(m.title)}</div>
                                    <div class="muted" style="font-size:0.75rem;">${esc(m.description || 'No description provided')}</div>
                                </td>
                                <td>
                                    <span class="badge bg-done">
                                        <i class="fas fa-list-check"></i> ${m.checklist ? m.checklist.length : 0} Steps
                                    </span>
                                </td>
                                <td>
                                    <span class="badge ${m.priority ===
