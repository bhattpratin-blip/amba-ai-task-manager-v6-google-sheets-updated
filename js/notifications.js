// ======================================
// Amba Pharmacy Notification Manager
// ======================================

if (!db.notifications) {
    db.notifications = [];
}

// Add Notification
function addNotification(userId, title, message, type = "info") {

    db.notifications.unshift({
        id: "N" + Date.now() + Math.random(),
        userId,
        title,
        message,
        type,
        read: false,
        date: new Date().toISOString()
    });

    save();

    renderNotifications();
}

// Browser Notification
function browserNotification(title, body) {

    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {

        new Notification(title, {
            body: body,
            icon: "icon-192.png"
        });

    }

}

// Ask Notification Permission
function requestNotificationPermission() {

    if (!("Notification" in window)) return;

    if (Notification.permission !== "granted") {

        Notification.requestPermission();

    }

}

// Due Today Check
function checkDueTodayTasks() {

    if (!db.settings?.notifications) return;

    let today = new Date().toISOString().slice(0,10);

    db.tasks.forEach(task => {

        if (
            task.assignedTo === user().id &&
            task.status !== "DONE" &&
            task.dueDate === today
        ) {

            addNotification(
                user().id,
                "Today's Task",
                task.title + " is due today.",
                "warning"
            );

            browserNotification(
                "Today's Task",
                task.title + " is due today."
            );

        }

    });

}

// Overdue Check
function checkOverdueTasks() {

    if (!db.settings?.notifications) return;

    let today = new Date().toISOString().slice(0,10);

    db.tasks.forEach(task => {

        if (
            task.assignedTo === user().id &&
            task.status !== "DONE" &&
            task.dueDate &&
            task.dueDate < today
        ) {

            addNotification(
                user().id,
                "Overdue Task",
                task.title + " is overdue.",
                "danger"
            );

            browserNotification(
                "Overdue Task",
                task.title + " is overdue."
            );

        }

    });

}

// Weekly Reminder
function checkWeeklyTasks() {

    let day = new Date().getDay();

    if (day !== 1) return;

    addNotification(
        user().id,
        "Weekly Reminder",
        "Please complete all weekly tasks.",
        "info"
    );

}

// Monthly Reminder
function checkMonthlyTasks() {

    let date = new Date().getDate();

    if (date !== 1) return;

    addNotification(
        user().id,
        "Monthly Reminder",
        "Please complete monthly pharmacy tasks.",
        "info"
    );

}

// Render Notifications
function renderNotifications() {

    let list = document.getElementById("notificationList");

    if (!list) return;

    let notes = db.notifications.filter(
        n => n.userId === user().id
    );

    list.innerHTML = "";

    if (notes.length === 0) {

        list.innerHTML = `
            <div class="notification">
                No Notifications
            </div>
        `;

        return;

    }

    notes.forEach(note => {

        list.innerHTML += `

        <div class="notification">

            <strong>${note.title}</strong>

            <br>

            ${note.message}

            <br>

            <small>

            ${new Date(note.date).toLocaleString()}

            </small>

        </div>

        `;

    });

}

// Mark All Read
function markAllNotificationsRead() {

    db.notifications.forEach(n => {

        if (n.userId === user().id) {

            n.read = true;

        }

    });

    save();

    renderNotifications();

}

// Clear Notifications
function clearNotifications() {

    if (!confirm("Clear all notifications?")) return;

    db.notifications = db.notifications.filter(
        n => n.userId !== user().id
    );

    save();

    renderNotifications();

}

// Start Notification Service
function startNotificationService() {

    requestNotificationPermission();

    checkDueTodayTasks();

    checkOverdueTasks();

    checkWeeklyTasks();

    checkMonthlyTasks();

    setInterval(() => {

        checkDueTodayTasks();

        checkOverdueTasks();

    }, 300000);

}
