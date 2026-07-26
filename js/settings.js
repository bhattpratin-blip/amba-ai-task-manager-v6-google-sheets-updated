// ==============================
// Settings & Security - V8.3
// ==============================

// Fix for Password Reset
function resetPassword() {
    const oldPass = document.getElementById('reset-old').value;
    const newPass = document.getElementById('reset-new').value;
    
    // Ensure state.users exists
    if (!state.users) {
        state.users = [{email: 'admin@amba.local', password: 'Admin@123'}];
    }

    let admin = state.users[0];
    if (admin.password === oldPass) {
        admin.password = newPass;
        save();
        alert("✅ Password changed successfully!");
        document.getElementById('reset-old').value = "";
        document.getElementById('reset-new').value = "";
    } else {
        alert("❌ Current password incorrect!");
    }
}

// Fix for User Profile Update
function updateUserProfile() {
    const newName = document.getElementById('set-username').value;
    if(newName) {
        state.settings.userName = newName;
        save();
        alert("Profile Updated!");
        render();
    }
}

// Fix for Cloud Sync
async function syncWithSheets() {
    if (!state.settings.sync) return;
    
    const syncBtn = document.querySelector('button[onclick="syncCloud()"]');
    if(syncBtn) syncBtn.innerText = "Syncing...";

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({ action: 'syncDatabase', database: state })
        });
        const result = await response.json();
        if (result.success) {
            alert("✅ Cloud Sync Successful!");
        }
    } catch (err) {
        console.error(err);
        alert("❌ Sync Error. Check API URL.");
    } finally {
        if(syncBtn) syncBtn.innerText = "Sync with Google Sheets";
    }
}
