// ===============================
// Notifications Module - V7
// ===============================

function renderNotificationsPanel() {

    if (!db.notifications) db.notifications = [];

    const u = user();
    if (!u) {
        return `
        <section class="panel">
            <h2>🔔 Notifications</h2>
            <p class="muted">Please login first.</p>
        </section>`;
    }

    const notifications = db.notifications.filter(n => n.userId === u.id);
    const unread = notifications.filter(n => !n.read).length;

    return `
    <section class="panel" style="margin-bottom:18px">

        <div style="display:flex;justify-content:space-between;align-items:center;">
            <h2>
                🔔 Notifications
                ${unread ? `
                <span style="
                    background:#dc2626;
                    color:white;
                    border-radius:50%;
                    padding:4px 9px;
                    font-size:12px;
                    margin-left:8px;">
                    ${unread}
                </span>` : ""}
            </h2>

            ${notifications.length ? `
            <button class="secondary"
                    onclick="markAllNotificationsRead()">
                ✓ Mark All
            </button>` : ""}
        </div>

        <div id="notificationsList"
             style="max-height:450px;overflow-y:auto;">

            ${
                notifications.length
                ? notifications
                    .sort((a,b)=>new Date(b.date)-new Date(a.date))
                    .map(n=>`

                <div style="
                    padding:12px;
                    margin-bottom:10px;
                    border:1px solid var(--line);
                    border-radius:10px;
                    background:${n.read ? "var(--card)" : "#eef2ff"}">

                    <div style="
                        display:flex;
                        justify-content:space-between;
                        align-items:center;">

                        <strong>${n.read ? "" : "🔵"} ${esc(n.message)}</strong>

                        ${
                            !n.read
                            ? `<button
                                class="primary"
                                style="padding:4px 10px"
                                onclick="markNotificationRead('${n.id}')">
                                ✓
                               </button>`
                            : ""
                        }

                    </div>

                    <div class="muted"
                         style="margin-top:6px;font-size:12px;">
                        ${new Date(n.date).toLocaleString()}
                    </div>

                </div>

                `).join("")
                : `<p class="muted" style="padding:15px;">
                    No notifications available.
                   </p>`
            }

        </div>

    </section>`;
}

function markNotificationRead(notificationId){

    if(!db.notifications) return;

    const notif = db.notifications.find(n=>n.id===notificationId);

    if(!notif) return;

    notif.read = true;

    save();

    if(typeof renderNotifications==="function"){
        renderNotifications();
    }

    const panel=document.getElementById("notificationsPanel");

    if(panel){
        panel.innerHTML=renderNotificationsPanel();
    }

    toast("✅ Notification marked as read");
}

function markAllNotificationsRead(){

    if(!db.notifications) return;

    const u=user();

    if(!u) return;

    db.notifications.forEach(n=>{
        if(n.userId===u.id){
            n.read=true;
        }
    });

    save();

    if(typeof renderNotifications==="function"){
        renderNotifications();
    }

    const panel=document.getElementById("notificationsPanel");

    if(panel){
        panel.innerHTML=renderNotificationsPanel();
    }

    toast("✅ All notifications marked as read");
}
