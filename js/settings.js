// ==============================
// Sidebar Navigation - V7
// ==============================

function showDashboard() {

    currentPage = "dashboard";

    renderApp();

}

function showMasterTasks() {

    currentPage = "master";

    openMasterTasks();

}

function showDailyTasks() {

    currentPage = "daily";

    if (typeof openDailyTasks === "function") {
        openDailyTasks();
    } else {
        document.querySelector(".content").innerHTML = `
            <section class="panel">
                <h2>📅 Daily Tasks</h2>
                <p class="muted">Daily task module is under development.</p>
            </section>
        `;
    }

}

function showWeeklyTasks() {

    currentPage = "weekly";

    if (typeof openWeeklyTasks === "function") {
        openWeeklyTasks();
    } else {
        document.querySelector(".content").innerHTML = `
            <section class="panel">
                <h2>📆 Weekly Tasks</h2>
                <p class="muted">Weekly task module is under development.</p>
            </section>
        `;
    }

}

function showMonthlyTasks() {

    currentPage = "monthly";

    if (typeof openMonthlyTasks === "function") {
        openMonthlyTasks();
    } else {
        document.querySelector(".content").innerHTML = `
            <section class="panel">
                <h2>🗓 Monthly Tasks</h2>
                <p class="muted">Monthly task module is under development.</p>
            </section>
        `;
    }

}

function showEmployees() {

    currentPage = "employees";

    renderEmployees();

}

function showReports() {

    currentPage = "reports";

    generateReport();

}

function showSettings() {

    currentPage = "settings";

    openSettings();

}
