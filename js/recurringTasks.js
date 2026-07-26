// ==========================================
// RECURRING TASKS ENGINE - V8.2 PRO
// ==========================================

/**
 * 1. The Core Engine
 * Runs on App Initialization
 */
function runRecurringEngine() {
    console.log("Automation Engine: Checking schedules...");
    
    const now = new Date();
    const todayStr = now.toDateString(); // e.g., "Mon Oct 23 2023"
    let tasksCreated = 0;

    state.recurring.forEach(template => {
        if (!template.enabled) return;

        if (shouldRecurringRun(template, now)) {
            spawnTaskFromTemplate(template);
            template.lastRun = todayStr; // Mark as handled for today
            tasksCreated++;
        }
    });

    if (tasksCreated > 0) {
        save();
        render(); // Refresh UI to show new tasks
        console.log(`Automation Engine: Created ${tasksCreated} scheduled tasks.`);
    }
}

/**
 * 2. Frequency Logic
 * Determines if a task is due based on interval
 */
function shouldRecurringRun(template, now) {
    const todayStr = now.toDateString();
    
    // Safety: If already run today, stop.
    if (template.lastRun === todayStr) return false;

    switch (template.frequency) {
        case 'DAILY':
            return true; // Any new day triggers this

        case 'WEEKLY':
            // Check if today is the preferred day (default to Monday/Day 1)
            const targetDay = template.dayOfWeek || 1; 
            return now.getDay() === targetDay;

        case 'MONTHLY':
            // Check if today is the preferred date (default to 1st of month)
            const targetDate = template.dayOfMonth || 1;
            return now.getDate() === targetDate;

        default:
            return false;
    }
}

/**
 * 3. Task Factory
 * Generates a live task from a recurring template
 */
function spawnTaskFromTemplate(template) {
    const newTask = {
        id: 'rt' + Date.now() + Math.random().toString(36).substr(2, 5),
        title: `[AUTO] ${template.title}`,
        description: template.description || "Automated recurring task.",
        priority: template.priority || "MEDIUM",
        status: "TODO",
        assignedTo: template.assignedTo || "e1", // Default to Admin if unassigned
        date: new Date().toISOString().split('T')[0], // Today's date
        isRecurringInstance: true,
        parentTemplateId: template.id
    };

    state.tasks.unshift(newTask);

    // Trigger Notification
    const emp = state.employees.find(e => e.id === newTask.assignedTo);
    pushNotification(
        `📅 Scheduled Task: "${template.title}" has been assigned to ${emp ? emp.name : 'Team'}.`,
        'info',
        newTask.id
    );
}

/**
 * 4. Create New Recurring Template
 */
function addRecurringTemplate(data) {
    const newTemplate = {
        id: 'rec' + Date.now(),
        title: data.title,
        description: data.description || "",
        frequency: data.frequency || 'DAILY', // DAILY, WEEKLY, MONTHLY
        priority: data.priority || 'MEDIUM',
        assignedTo: data.assignedTo || 'e1',
        dayOfWeek: data.dayOfWeek || 1, // 0-6 (Sun-Sat)
        dayOfMonth: data.dayOfMonth || 1,
        enabled: true,
        lastRun: null,
        createdAt: new Date().toISOString()
    };

    state.recurring.push(newTemplate);
    save();
    pushNotification(`✅ Automation Created: "${data.title}"`, 'success');
}

/**
 * 5. Delete/Disable Template
 */
function deleteRecurring(id) {
    if (confirm("Delete this automation schedule?")) {
        state.recurring = state.recurring.filter(r => r.id !== id);
        save();
        render();
    }
}
