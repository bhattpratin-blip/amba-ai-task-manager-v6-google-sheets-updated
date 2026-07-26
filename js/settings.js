// ==========================================
// SETTINGS & SYSTEM CONTROL - V8.2 PRO
// ==========================================

/**
 * 1. Professional Navigation Controller
 * Handles view switching and UI state
 */
function navigateTo(viewName) {
    // Update State
    state.view = viewName;
    
    // Auto-run background engines when navigating to dashboard
    if (viewName === 'dashboard') {
        if (typeof scanForIncompleteTasks === 'function') scanForIncompleteTasks();
        if (typeof runRecurringEngine === 'function') runRecurringEngine();
    }

    // Save state to remember current view on refresh
    save(); 
    
    // Re-render the entire app
    render(); 
    
    console.log(`System: Switched to ${viewName} view.`);
}

/**
 * 2. Theme Management
 * Handles Dark/Light mode persistence
 */
function toggleTheme() {
    state.settings.darkMode = !state.settings.darkMode;
    
    // Apply class to body for CSS variables
    document.body.classList.toggle('dark', state.settings.darkMode);
    
    save();
    toast(`Theme: ${state.settings.darkMode ? 'Dark' : 'Light'} Mode enabled`);
}

/**
 * 3. Cloud Sync Management
 * Connects Local Data to Google Sheets API
 */
async function triggerCloudSync() {
    if (!state.settings.sync) {
        toast("Sync is disabled in settings.");
        return;
    }

    toast("☁️ Syncing with Google Sheets...");
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({
                action: 'syncDatabase',
                database: state
            })
        });

        const result = await response.json();
        
        if (result.success) {
            toast("✅ Sync Complete");
            console.log("Cloud API:", result.message);
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error("Sync Error:", error);
        toast("❌ Sync Failed: Check API URL");
    }
}

/**
 * 4. Data Export Engine (Excel)
 * Requires SheetJS (xlsx.full.min.js)
 */
function exportSystemData() {
    try {
        // Prepare Data for Export
        const taskData = state.tasks.map(t => ({
            Title: t.title,
            Priority: t.priority,
            Status: t.status,
            DueDate: t.date || 'N/A',
            Assignee: (state.employees.find(e => e.id === t.assignedTo) || {}).name || 'Unassigned',
            Created: t.createdAt || 'N/A'
        }));

        const ws = XLSX.utils.json_to_sheet(taskData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Task Report");

        // Download File
        const fileName = `Amba_V8_Report_${new Date().toISOString().slice(0,10)}.xlsx`;
        XLSX.writeFile(wb, fileName);
        
        toast("📊 Excel Report Downloaded");
    } catch (err) {
        toast("❌ Export Failed");
        console.error(err);
    }
}

/**
 * 5. Security & Session
 */
function logoutUser() {
    if (confirm("Are you sure you want to logout? This will clear your current local session.")) {
        // Clear local storage but keep Google Sheets safe
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.clear();
        location.reload(); // Returns to login screen
    }
}

function factoryReset() {
    const confirmation = prompt("Type 'RESET' to delete all local data, tasks, and employees. This cannot be undone.");
    if (confirmation === 'RESET') {
        localStorage.clear();
        location.reload();
    }
}

/**
 * 6. Toast Notification Helper
 */
function toast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    
    t.textContent = msg;
    t.style.display = 'block';
    
    setTimeout(() => {
        t.style.display = 'none';
    }, 3000);
}
