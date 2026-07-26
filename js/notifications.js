/* Notification Item Styling */
.notif-item {
    padding: 12px 15px;
    border-bottom: 1px solid var(--line);
    cursor: pointer;
    transition: 0.2s;
}
.notif-item:hover { background: var(--bg); }
.notif-item.unread { background: rgba(79, 70, 229, 0.04); border-left: 3px solid var(--primary); }

/* The "Danger" Overdue Notification */
.notif-item.notif-overdue {
    border-left: 3px solid var(--danger) !important;
}
.dark .notif-item.notif-overdue { background: rgba(239, 68, 68, 0.1); }
