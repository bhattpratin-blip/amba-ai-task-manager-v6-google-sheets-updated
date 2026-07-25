// ===== NOTIFICATIONS MODULE =====
// This module provides enhanced notification management functionality

// Notification types
const NOTIFICATION_TYPES = {
    TASK_ASSIGNED: "TASK_ASSIGNED",
    TASK_COMPLETED: "TASK_COMPLETED",
    TASK_OVERDUE: "TASK_OVERDUE",
    TASK_REASSIGNED: "TASK_REASSIGNED",
    DEADLINE_APPROACHING: "DEADLINE_APPROACHING",
    SYSTEM_MESSAGE: "SYSTEM_MESSAGE"
};

function createNotification(userId, message, type = "SYSTEM_MESSAGE", data = {}){
    if(!userId) return;
    
    const notification = {
        id: "n" + Date.now() + Math.random(),
        userId: userId,
        message: message,
        type: type,
        read: false,
        date: new Date().toISOString(),
        data: data
    };
    
    db.notifications.unshift(notification);
    save();
    return notification;
}

function markNotificationRead(notificationId){
    const notif = db.notifications.find(x => x.id === notificationId);
    if(notif){
        notif.read = true;
        save();
    }
}

function markAllNotificationsRead(userId){
    db.notifications.filter(x => x.userId === userId && !x.read).forEach(x => {
        x.read = true;
    });
    save();
}

function deleteNotification(notificationId){
    db.notifications = db.notifications.filter(x => x.id !== notificationId);
    save();
}

function clearAllNotifications(userId){
    db.notifications = db.notifications.filter(x => x.userId !== userId);
    save();
}

function getUnreadCount(userId){
    return db.notifications.filter(x => x.userId === userId && !x.read).length;
}

function getUserNotifications(userId, limit = 30){
    return db.notifications.filter(x => x.userId === userId).slice(0, limit);
}

// Auto-generate notifications for overdue tasks
function checkOverdueTasks(){
    const today = new Date().toISOString().slice(0,10);
    
    db.tasks.forEach(task => {
        if(task.dueDate && task.dueDate < today && task.status !== "DONE"){
            // Check if we already notified
            const alreadyNotified = db.notifications.find(n => 
                n.userId === task.assignedTo && 
                n.data?.taskId === task.id && 
                n.type === NOTIFICATION_TYPES.TASK_OVERDUE
            );
            
            if(!alreadyNotified){
                createNotification(
                    task.assignedTo,
                    `⚠️ Task overdue: ${task.title}`,
                    NOTIFICATION_TYPES.TASK_OVERDUE,
                    { taskId: task.id, taskTitle: task.title }
                );
            }
        }
    });
}

// Auto-generate notifications for approaching deadlines
function checkApproachingDeadlines(){
    const today = new Date();
    const tomorrowPlus3 = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0,10);
    const todayStr = today.toISOString().slice(0,10);
    
    db.tasks.forEach(task => {
        if(task.dueDate && task.dueDate <= tomorrowPlus3 && task.dueDate >= todayStr && task.status !== "DONE"){
            const alreadyNotified = db.notifications.find(n => 
                n.userId === task.assignedTo && 
                n.data?.taskId === task.id && 
                n.type === NOTIFICATION_TYPES.DEADLINE_APPROACHING
            );
            
            if(!alreadyNotified){
                const daysLeft = Math.ceil((new Date(task.dueDate) - today) / (1000 * 60 * 60 * 24));
                createNotification(
                    task.assignedTo,
                    `📅 Deadline in ${daysLeft} day(s): ${task.title}`,
                    NOTIFICATION_TYPES.DEADLINE_APPROACHING,
                    { taskId: task.id, taskTitle: task.title, daysLeft: daysLeft }
                );
            }
        }
    });
}

// Run background checks periodically
if(typeof setInterval !== 'undefined'){
    // Check every 60 seconds
    setInterval(() => {
        if(session && user()){
            checkOverdueTasks();
            checkApproachingDeadlines();
        }
    }, 60000);
}

// Initialize background checks on load
checkOverdueTasks();
checkApproachingDeadlines();
