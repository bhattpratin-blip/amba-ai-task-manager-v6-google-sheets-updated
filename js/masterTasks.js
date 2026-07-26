// ==============================
// Master Tasks - V8.3 Update
// ==============================

function applyMasterTemplate(templateId) {
    const template = state.masterTasks.find(m => m.id === templateId);
    if (!template) return;

    const newTask = {
        id: 't' + Date.now(),
        title: template.title,
        priority: template.priority || 'MEDIUM',
        status: 'TODO',
        // New: Default assignment to the first employee if exists
        assignedTo: state.employees.length > 0 ? state.employees[0].id : 'e1',
        date: new Date().toISOString().split('T')[0]
    };

    state.tasks.unshift(newTask);
    save();
    alert(`Template Applied: ${template.title}`);
    nav('tasks');
}
