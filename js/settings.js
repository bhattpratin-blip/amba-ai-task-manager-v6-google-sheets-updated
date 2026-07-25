// ===== SETTINGS MODULE =====
function openSettings(){
    currentPage="settings";
    const u = user();
    app.innerHTML = `<div class="layout">
        <div class="sidebar">
            <h2>🏥 Amba AI</h2>
            <a href="#" id="settingsDashboard">📊 Dashboard</a>
            <a href="#" id="settingsEmployee" style="${u.role !== 'ADMIN' ? 'display:none' : ''}">👥 Manage Employees</a>
            <a href="#" id="settingsAPI" style="${u.role !== 'ADMIN' ? 'display:none' : ''}">🔌 API Config</a>
            <a href="#" id="settingsTheme">🎨 Theme</a>
            <hr>
            <a href="#" id="settingsLogout">🚪 Logout</a>
        </div>
        <div class="content">
            <header class="top">
                <div>
                    <h1>⚙️ Settings</h1>
                    <div class="muted">Manage your preferences and configuration</div>
                </div>
            </header>
            
            <section class="panel" style="margin-bottom:18px">
                <h2>🎨 Theme Settings</h2>
                <div style="display:grid;gap:12px">
                    <div>
                        <label style="display:flex;align-items:center;gap:10px;cursor:pointer">
                            <input type="checkbox" id="darkModeToggle" ${document.body.classList.contains('dark') ? 'checked' : ''}>
                            <span>Dark Mode</span>
                        </label>
                    </div>
                </div>
            </section>

            ${u.role === 'ADMIN' ? `
            <section class="panel" style="margin-bottom:18px">
                <h2>🔌 API Configuration</h2>
                <p class="muted">Google Apps Script Webhook URL</p>
                <div style="display:grid;gap:10px">
                    <div style="background:#f3f4f6;padding:12px;border-radius:10px;word-break:break-all;font-family:monospace;font-size:12px">
                        ${API_URL.includes("PASTE_YOUR") ? '<span style="color:#dc2626">❌ Not configured</span>' : `<span style="color:#16a34a">✅ Configured</span><br>${API_URL.substring(0, 50)}...`}
                    </div>
                    <p class="muted" style="font-size:12px">Current Status: ${cloudReady ? '🟢 Cloud Connected' : '🔴 Local Mode'}</p>
                </div>
            </section>
            ` : ''}

            <section class="panel" style="margin-bottom:18px">
                <h2>ℹ️ About</h2>
                <div style="display:grid;gap:10px">
                    <div><strong>Application:</strong> Amba AI Task Manager V6</div>
                    <div><strong>Version:</strong> 6.1 (Google Sheets Updated)</div>
                    <div><strong>Your Role:</strong> ${u.role}</div>
                    <div><strong>User:</strong> ${esc(u.name)} (${esc(u.email)})</div>
                </div>
            </section>

            ${u.role === 'ADMIN' ? `
            <section class="panel" style="margin-bottom:18px">
                <h2>👥 User Management</h2>
                <p class="muted">Total Employees: ${db.users.filter(x => x.role === 'EMPLOYEE').length}</p>
                <table style="width:100%;border-collapse:collapse;margin-top:12px">
                    <thead>
                        <tr style="border-bottom:2px solid var(--line)">
                            <th style="text-align:left;padding:10px">Name</th>
                            <th style="text-align:left;padding:10px">Email</th>
                            <th style="text-align:left;padding:10px">Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${db.users.map(user => `
                            <tr style="border-bottom:1px solid var(--line)">
                                <td style="padding:10px">${esc(user.name)}</td>
                                <td style="padding:10px">${esc(user.email)}</td>
                                <td style="padding:10px">${user.role}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </section>
            ` : ''}
        </div>
    </div>`;
    
    // Event binding
    document.getElementById("settingsDashboard")?.addEventListener("click", e => {
        e.preventDefault();
        showDashboard();
    });

    document.getElementById("settingsLogout")?.addEventListener("click", e => {
        e.preventDefault();
        localStorage.removeItem(SESSION);
        sessionStorage.removeItem(SESSION);
        localStorage.removeItem(REMEMBER);
        session = null;
        renderLogin();
    });

    document.getElementById("darkModeToggle")?.addEventListener("change", e => {
        if(e.target.checked){
            document.body.classList.add("dark");
            localStorage.setItem("dark", "true");
        } else {
            document.body.classList.remove("dark");
            localStorage.setItem("dark", "false");
        }
        toast("🎨 Theme updated");
    });
}
