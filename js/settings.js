// ==============================
// Pharmacy Settings - V8.5
// ==============================

function toggleGoogleSync() {
    state.settings.syncEnabled = !state.settings.syncEnabled;
    save();
    const status = state.settings.syncEnabled ? "ENABLED" : "DISABLED";
    alert(`Google Sheets Sync is now ${status}`);
    render();
}

// Manual Sync Button Logic
async function forceSync() {
    const syncBtn = document.querySelector('.btn-sync');
    if (syncBtn) syncBtn.innerText = "Syncing...";
    
    try {
        await syncCloud(); // Calls the fetch function
        alert("✅ Data successfully pushed to Google Sheets");
    } catch (e) {
        alert("❌ Sync Error: Check your API URL or Internet Connection");
    } finally {
        if (syncBtn) syncBtn.innerText = "Sync Now";
    }
}
