// =============================
// Amba Pharmacy Settings Module
// =============================

if (!db.settings) {
    db.settings = {
        pharmacyName: "Amba Pharmacy",
        workingHours: "09:00 - 21:00",
        autoGenerate: true,
        notifications: true,
        darkMode: false,
        reminderTime: "09:00"
    };
    save();
}

// Open Settings Screen
function openSettings() {

    app.innerHTML = `
    <div class="main">

        <div class="header">
            <h1>⚙️ Settings</h1>
        </div>

        <div class="card">

            <label>Pharmacy Name</label>
            <input id="pharmacyName"
                   value="${db.settings.pharmacyName}">

            <label>Working Hours</label>
            <input id="workingHours"
                   value="${db.settings.workingHours}">

            <label>Reminder Time</label>
            <input type="time"
                   id="reminderTime"
                   value="${db.settings.reminderTime}">

            <label>
                <input type="checkbox"
                       id="autoGenerate">
                Auto Generate Daily Tasks
            </label>

            <br><br>

            <label>
                <input type="checkbox"
                       id="notifications">
                Enable Notifications
            </label>

            <br><br>

            <label>
                <input type="checkbox"
                       id="darkMode">
                Dark Mode
            </label>

            <br><br>

            <button class="btn-primary"
                    onclick="saveSettings()">
                💾 Save Settings
            </button>

        </div>

    </div>
    `;

    document.getElementById("autoGenerate").checked =
        db.settings.autoGenerate;

    document.getElementById("notifications").checked =
        db.settings.notifications;

    document.getElementById("darkMode").checked =
        db.settings.darkMode;
}


// Save Settings
function saveSettings() {

    db.settings.pharmacyName =
        document.getElementById("pharmacyName").value;

    db.settings.workingHours =
        document.getElementById("workingHours").value;

    db.settings.reminderTime =
        document.getElementById("reminderTime").value;

    db.settings.autoGenerate =
        document.getElementById("autoGenerate").checked;

    db.settings.notifications =
        document.getElementById("notifications").checked;

    db.settings.darkMode =
        document.getElementById("darkMode").checked;

    save();

    if (db.settings.darkMode) {
        document.body.classList.add("dark");
    } else {
        document.body.classList.remove("dark");
    }

    alert("✅ Settings Saved Successfully");
}
