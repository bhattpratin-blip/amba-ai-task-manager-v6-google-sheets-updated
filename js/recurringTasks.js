// ======================================
// Recurring Task Scheduler
// ======================================

// Format today's date (YYYY-MM-DD)
function getTodayDate() {
    return new Date().toISOString().split("T")[0];
}

// Check whether a master task should be generated today
function shouldGenerateTask(task) {

    const now = new Date();

    switch (task.frequency) {

        case "DAILY":
            return true;

        case "WEEKLY":

            // Monday
            return now.getDay() === 1;

        case "MONTHLY":

            // First day of month
            return now.getDate() === 1;

        default:
            return false;
    }
}

// Generate recurring tasks
function generateRecurringTasks() {

    if (!db.masterTasks) return;

    const today = getTodayDate();

    db.masterTasks.forEach(task => {

        if (!shouldGenerateTask(task)) return;

        const exists = db.tasks.find(t =>
            t.masterId === task.id &&
            t.generatedDate === today
        );

        if (exists) return;

        db.tasks.push({

            id: "TASK" + Date.now() + Math.random(),

            masterId: task.id,

            generatedDate: today,

            title: task.title,

            description: task.description || "",

            department: task.department,

            assignedTo: task.employee,

            priority: task.priority,

            dueDate: today,

            status: "TODO",

            createdBy: "SYSTEM",

            createdAt: new Date().toISOString()

        });

        if (typeof addNotification === "function") {

            addNotification(
                task.employee,
                "New Task Assigned",
                task.title,
                "info"
            );

        }

    });

    save();
}

// Manual Run
function runRecurringTasks() {

    generateRecurringTasks();

    alert("Recurring tasks generated successfully.");

}

// Auto Run Once Per Day
function startRecurringScheduler() {

    generateRecurringTasks();

    const oneHour = 60 * 60 * 1000;

    setInterval(() => {

        generateRecurringTasks();

    }, oneHour);

}
