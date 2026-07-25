// Settings Module for Amba AI Task Manager V6
function openSettings(){
    const u = user();
    const settingsHTML = `
    <section class="panel" style="margin-bottom:18px">
        <h2>⚙️ Settings</h2>
        <div style="padding: 15px;">
            <p><strong>Current User:</strong> ${esc(u.name)} (${u.role})</p>
            <p><strong>Email:</strong> ${esc(u.email)}</p>
            
            <div style="margin-top: 20px;">
                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                    <input type="checkbox" id="darkModeToggle" ${localStorage.getItem("dark") === "true" ? "checked" : ""}>
                    <span>🌙 Dark Mode</span>
                </label>
            </div>
            
            <div style="margin-top: 20px;">
                <h3>Danger Zone</h3>
                <button class="danger" id="resetData" style="width: 100%;">🗑️ Clear All Local Data</button>
            </div>
        </div>
    </section>`;
    
    let content = document.querySelector('.content');
    if (content) {
        content.innerHTML = settingsHTML;
    }
    
    // Dark mode toggle
    const darkToggle = document.getElementById("darkModeToggle");
    if (darkToggle) {
        darkToggle.addEventListener("change", () => {
            if (darkToggle.checked) {
                document.body.classList.add("dark");
                localStorage.setItem("dark", "true");
            } else {
                document.body.classList.remove("dark");
                localStorage.setItem("dark", "false");
            }
        });
    }
    
    // Reset data
    const resetBtn = document.getElementById("resetData");
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            if (confirm("⚠️ This will delete all local data. Are you sure?")) {
                localStorage.removeItem(DB);
                localStorage.removeItem(SESSION);
                sessionStorage.removeItem(SESSION);
                location.reload();
            }
        });
    }
}
