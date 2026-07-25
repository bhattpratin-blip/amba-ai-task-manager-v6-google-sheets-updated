// Recurring Tasks Module for Amba AI Task Manager V6

function setupRecurringTasks(){
    if (!db.recurringTasks) db.recurringTasks = [];
    if (!db.lastRecurringRun) db.lastRecurringRun = new Date().toISOString();
    
    // Check every hour if we need to generate new recurring tasks
    setInterval(checkRecurringTasks, 3600000);
}

function checkRecurringTasks(){
    if (!db.recurringTasks) return;
    
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    
    db.recurringTasks.forEach(rt => {
        if (!rt.enabled) return;
        if (!rt.lastRun) rt.lastRun = today;
        
        const lastRunDate = new Date(rt.lastRun);
        const shouldRun = 
            (rt.frequency === "DAILY" && today !== rt.lastRun) ||
            (rt.frequency === "WEEKLY" && (now.getTime() - lastRunDate.getTime()) >= 7 * 24 * 3600000) ||
            (rt.frequency === "MONTHLY" && (now.getTime() - lastRunDate.getTime()) >= 30 * 24 * 3600000);
        
        if (shouldRun) {
            createRecurringInstance(rt);
            rt.lastRun = today;
        }
    });
    
    save();
}

function createRecurringInstance(template){
    const now = new Date();
    let dueDate = new Date(now);
    
    if (template.offsetDays) {
        dueDate.setDate(dueDate.getDate() + parseInt(template.offsetDays));
    }
    
    db.tasks.push({
        id: "t" + Date.now() + Math.random(),
        title: template.title,
        description: template.description,
        dueDate: dueDate.toISOString().slice(0, 10),
        priority: template.priority,
        status: "TODO",
        assignedTo: template.assignedTo,
        createdBy: template.createdBy,
        isRecurringInstance: true,
        recurringTaskId: template.id,
        createdAt: new Date().toISOString()
    });
    
    notify(template.assignedTo, `📅 Recurring task: ${template.title}`);
}

function createRecurringTask(taskData){
    if (!db.recurringTasks) db.recurringTasks = [];
    
    db.recurringTasks.push({
        id: "r" + Date.now(),
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        assignedTo: taskData.assignedTo,
        createdBy: taskData.createdBy,
        frequency: taskData.frequency || "WEEKLY",
        offsetDays: taskData.offsetDays || 0,
        enabled: true,
        lastRun: null,
        createdAt: new Date().toISOString()
    });
    
    save();
    toast(`✅ Recurring task created (${taskData.frequency})`);
}

// Initialize on app load
setupRecurringTasks();
