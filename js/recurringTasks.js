// =====================================
// Recurring Tasks Module - V7
// =====================================

let recurringTimer = null;

function setupRecurringTasks() {

    if (!db.recurringTasks) db.recurringTasks = [];
    if (!db.tasks) db.tasks = [];

    if (recurringTimer) {
        clearInterval(recurringTimer);
    }

    checkRecurringTasks();

    recurringTimer = setInterval(checkRecurringTasks, 3600000);
}

function checkRecurringTasks() {

    if (!db.recurringTasks || !db.recurringTasks.length) return;

    const today = new Date().toISOString().slice(0,10);

    db.recurringTasks.forEach(task => {

        if (!task.enabled) return;

        if (!task.lastRun) {
            task.lastRun = "";
        }

        let shouldCreate = false;

        switch(task.frequency){

            case "DAILY":
                shouldCreate = task.lastRun !== today;
                break;

            case "WEEKLY":
                shouldCreate =
                    daysBetween(task.lastRun,today) >= 7;
                break;

            case "MONTHLY":
                shouldCreate =
                    monthChanged(task.lastRun,today);
                break;
        }

        if(shouldCreate){

            createRecurringInstance(task);

            task.lastRun = today;
        }

    });

    save();
}

function createRecurringInstance(template){

    if(!db.tasks) db.tasks=[];

    const due=new Date();

    due.setDate(
        due.getDate() + Number(template.offsetDays || 0)
    );

    db.tasks.unshift({

        id:"t"+Date.now()+Math.random(),

        title:template.title,

        description:template.description || "",

        dueDate:due.toISOString().slice(0,10),

        priority:template.priority || "MEDIUM",

        status:"TODO",

        assignedTo:template.assignedTo || null,

        createdBy:template.createdBy || null,

        recurringTaskId:template.id,

        isRecurringInstance:true,

        createdAt:new Date().toISOString()

    });

    if(template.assignedTo){

        notify(
            template.assignedTo,
            "📅 New recurring task: " + template.title
        );
    }

}

function createRecurringTask(taskData){

    if(!db.recurringTasks){

        db.recurringTasks=[];
    }

    const recurring={

        id:"r"+Date.now(),

        title:taskData.title,

        description:taskData.description || "",

        priority:taskData.priority || "MEDIUM",

        assignedTo:taskData.assignedTo || null,

        createdBy:taskData.createdBy || null,

        frequency:taskData.frequency || "WEEKLY",

        offsetDays:Number(taskData.offsetDays || 0),

        enabled:true,

        lastRun:"",

        createdAt:new Date().toISOString()

    };

    db.recurringTasks.push(recurring);

    save();

    toast(
        `✅ ${recurring.frequency} recurring task created`
    );

    return recurring;
}

function daysBetween(a,b){

    if(!a) return 9999;

    const d1=new Date(a);
    const d2=new Date(b);

    return Math.floor(
        (d2-d1)/(1000*60*60*24)
    );
}

function monthChanged(a,b){

    if(!a) return true;

    const d1=new Date(a);
    const d2=new Date(b);

    return (
        d1.getMonth()!==d2.getMonth() ||
        d1.getFullYear()!==d2.getFullYear()
    );
}
