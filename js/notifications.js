// Notifications Module for Amba AI Task Manager V6

function renderNotificationsPanel(){
    const u = user();
    const notifications = db.notifications.filter(n => n.userId === u.id);
    const unread = notifications.filter(n => !n.read).length;
    
    const notificationsHTML = `
    <section class="panel" style="margin-bottom:18px">
        <h2>🔔 Notifications ${unread > 0 ? `<span style="background: #dc2626; color: white; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px;">${unread}</span>` : ""}</h2>
        
        <div id="notificationsList" style="max-height: 400px; overflow-y: auto;">
            ${notifications.length ? notifications.slice(0, 20).map(n => `
                <div style="padding: 12px; border-bottom: 1px solid var(--line); ${n.read ? '' : 'background: #f3f4f6;'}">
                    <p style="margin: 0; ${n.read ? '' : 'font-weight: bold;'}">${esc(n.message)}</p>
                    <span class="muted" style="font-size: 12px;">${new Date(n.date).toLocaleString()}</span>
                    ${!n.read ? `<button class="primary" style="padding: 4px 8px; font-size: 12px; margin-top: 5px;" onclick="markNotificationRead('${n.id}')">✓ Mark Read</button>` : ""}
                </div>
            `).join("") : "<p class='muted' style='padding: 15px;'>No notifications yet</p>"}
        </div>
    </section>`;
    
    return notificationsHTML;
}

function markNotificationRead(notificationId){
    const notif = db.notifications.find(n => n.id === notificationId);
    if (notif) {
        notif.read = true;
        save();
        renderNotifications();
        toast("✅ Marked as read");
    }
}

function markAllNotificationsRead(){
    const u = user();
    db.notifications.forEach(n => {
        if (n.userId === u.id) n.read = true;
    });
    save();
    renderNotifications();
    toast("✅ All marked as read");
}
