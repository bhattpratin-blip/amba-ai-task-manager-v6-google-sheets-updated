// ==============================
// Pharmacy Notifications - V8.5
// ==============================

function checkPendingTasks() {
    state.tasks.forEach(task => {
        if (task.status !== 'DONE') {
            const emp = state.employees.find(e => e.id === task.empId);
            if (emp && emp.phone) {
                // Logic to flag this task as "WhatsApp Ready"
                console.log(`Reminder available for ${emp.name} regarding ${task.title}`);
            }
        }
    });
}

/**
 * WhatsApp Trigger Function
 * @param {string} phone - Format: 919876543210
 * @param {string} taskTitle - The task name
 */
function sendWhatsAppReminder(phone, taskTitle) {
    if (!phone) {
        alert("No phone number saved for this employee!");
        return;
    }
    
    // Clean the phone number (remove +, spaces, or dashes)
    const cleanPhone = phone.replace(/\D/g, '');
    
    const message = `🚨 *Task Reminder* 🚨\n\nHello, the following task is still *Incomplete*:\n📌 *${taskTitle}*\n\nPlease update the status as soon as possible.`;
    
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}
