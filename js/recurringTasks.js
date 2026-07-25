// ===== RECURRING TASKS MODULE =====
// This module handles recurring/repeating task generation

const RECURRENCE_TYPES = {
    ONCE: "ONCE",
    DAILY: "DAILY",
    WEEKLY: "WEEKLY",
    BIWEEKLY: "BIWEEKLY",
    MONTHLY: "MONTHLY",
    QUARTERLY: "QUARTERLY",
    YEARLY: "YEARLY"
};

function createRecurringTask(baseTask, recurrenceType, endDate = null, maxOccurrences = null){
    if(!db.recurringTasks) db.recurringTasks = [];
    
    const recurring = {
        id: "r" + Date.now(),
        baseTaskId: baseTask.id,
        title: baseTask.title,
        description: baseTask.description,
        priority: baseTask.priority,
        assignedTo: baseTask.assignedTo,
        recurrenceType: recurrenceType,
        endDate: endDate,
        maxOccurrences: maxOccurrences,
        occurrencesCreated: 0,
        lastGenerated: null,
        active: true,
        createdAt: new Date().toISOString()
    };
    
    db.recurringTasks.push(recurring);
    save();
    return recurring;
}

function generateNextOccurrence(recurringTaskId){
    if(!db.recurringTasks) return null;
    
    const recurring = db.recurringTasks.find(x => x.id === recurringTaskId);
    if(!recurring || !recurring.active) return null;
    
    // Check limits
    if(recurring.maxOccurrences && recurring.occurrencesCreated >= recurring.maxOccurrences){
        recurring.active = false;
        save();
        return null;
    }
    
    // Check end date
    if(recurring.endDate && new Date(recurring.endDate) < new Date()){
        recurring.active = false;
        save();
        return null;
    }
    
    // Calculate next due date
    let lastDueDate = recurring.lastGenerated ? new Date(recurring.lastGenerated) : new Date();
    let nextDueDate = new Date(lastDueDate);
    
    switch(recurring.recurrenceType){
        case RECURRENCE_TYPES.DAILY:
            nextDueDate.setDate(nextDueDate.getDate() + 1);
            break;
        case RECURRENCE_TYPES.WEEKLY:
            nextDueDate.setDate(nextDueDate.getDate() + 7);
            break;
        case RECURRENCE_TYPES.BIWEEKLY:
            nextDueDate.setDate(nextDueDate.getDate() + 14);
            break;
        case RECURRENCE_TYPES.MONTHLY:
            nextDueDate.setMonth(nextDueDate.getMonth() + 1);
            break;
        case RECURRENCE_TYPES.QUARTERLY:
            nextDueDate.setMonth(nextDueDate.getMonth() + 3);
            break;
        case RECURRENCE_TYPES.YEARLY:
            nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
            break;
        default:
            return null;
    }
    
    // Create new task instance
    const newTask = {
        id: "t" + Date.now() + Math.random(),
        title: recurring.title,
        description: recurring.description,
        dueDate: nextDueDate.toISOString().slice(0,10),
        priority: recurring.priority,
        status: "TODO",
        assignedTo: recurring.assignedTo,
        createdBy: user()?.id || recurring.assignedTo,
        createdAt: new Date().toISOString(),
        recurringTaskId: recurringTaskId,
        isRecurrenceInstance: true
    };
    
    db.tasks.push(newTask);
    
    // Update recurring task
    recurring.lastGenerated = new Date().toISOString();
    recurring.occurrencesCreated++;
    
    save();
    return newTask;
}

function processRecurringTasks(){
    if(!db.recurringTasks) return;
    
    const now = new Date();
    
    db.recurringTasks.forEach(recurring => {
        if(!recurring.active) return;
        
        // Check if we should generate next occurrence
        if(!recurring.lastGenerated){
            // First time - generate immediately
            generateNextOccurrence(recurring.id);
        } else {
            const lastGen = new Date(recurring.lastGenerated);
            let shouldGenerate = false;
            
            switch(recurring.recurrenceType){
                case RECURRENCE_TYPES.DAILY:
                    shouldGenerate = (now - lastGen) >= (24 * 60 * 60 * 1000);
                    break;
                case RECURRENCE_TYPES.WEEKLY:
                    shouldGenerate = (now - lastGen) >= (7 * 24 * 60 * 60 * 1000);
                    break;
                case RECURRENCE_TYPES.BIWEEKLY:
                    shouldGenerate = (now - lastGen) >= (14 * 24 * 60 * 60 * 1000);
                    break;
                case RECURRENCE_TYPES.MONTHLY:
                    shouldGenerate = (now - lastGen) >= (30 * 24 * 60 * 60 * 1000);
                    break;
            }
            
            if(shouldGenerate){
                generateNextOccurrence(recurring.id);
            }
        }
    });
}

function disableRecurringTask(recurringTaskId){
    if(!db.recurringTasks) return;
    const recurring = db.recurringTasks.find(x => x.id === recurringTaskId);
    if(recurring){
        recurring.active = false;
        save();
    }
}

function deleteRecurringTask(recurringTaskId){
    if(!db.recurringTasks) return;
    db.recurringTasks = db.recurringTasks.filter(x => x.id !== recurringTaskId);
    save();
}

// Run background recurring task processor
if(typeof setInterval !== 'undefined'){
    // Check every 5 minutes
    setInterval(processRecurringTasks, 5 * 60 * 1000);
}

// Initial process
processRecurringTasks();
