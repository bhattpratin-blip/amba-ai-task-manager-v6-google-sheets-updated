# 🤖 Amba AI Task Manager V6

A smart task management system with Excel work allocation, AI assistance, and Google Sheets sync.

## 🚀 Live Demo

**[View Live at GitHub Pages](https://bhattpratin-blip.github.io/amba-ai-task-manager-v6-google-sheets-updated/)**

## ✨ Features

- 📊 **Dashboard** - Real-time task statistics and overview
- 👥 **Employee Management** - Create and manage team members
- 📅 **Task Management** - Create, edit, delete, and assign tasks
- 📈 **Reports & Analytics** - Generate detailed reports by employee/date/status
- 🤖 **AI Assistant** - Natural language task parsing
- 📤 **Excel Upload** - Bulk task creation and allocation
- 🌙 **Dark Mode** - Built-in dark theme support
- ☁️ **Cloud Sync** - Optional Google Sheets integration
- 📱 **Responsive** - Mobile-friendly design

## 🔐 Default Credentials

```
Admin Account:
- Email: admin@amba.local
- Password: Admin@123

Employee Account:
- Email: rahul@amba.local
- Password: Employee@123
```

## 📋 File Structure

```
.
├── index.html              # Main application
├── css/
│   └── style.css          # External CSS (optional)
├── js/
│   ├── settings.js        # Settings module
│   ├── masterTasks.js     # Master tasks templates
│   ├── notifications.js   # Notification system
│   └── recurringTasks.js  # Recurring task automation
└── README.md              # This file
```

## 🔧 Setup

### Option 1: GitHub Pages (No setup needed!)
The app is already deployed and accessible at:
👉 https://bhattpratin-blip.github.io/amba-ai-task-manager-v6-google-sheets-updated/

### Option 2: Local Development
1. Clone the repository
2. Open `index.html` in your browser
3. Login with default credentials above

### Option 3: Integrate Google Sheets
1. Create a Google Apps Script project
2. Get your deployment URL
3. Update `API_URL` in `index.html` (line 77)

## 📊 Modules

### Settings Module (`js/settings.js`)
- Dark mode toggle
- User profile view
- Clear local data option

### Master Tasks (`js/masterTasks.js`)
- Create reusable task templates
- Quick task creation from templates
- Template management (CRUD)

### Notifications (`js/notifications.js`)
- Task notifications system
- Mark as read functionality
- Notification history

### Recurring Tasks (`js/recurringTasks.js`)
- Daily/Weekly/Monthly automation
- Auto-generate task instances
- Offset due dates for recurring items

## 💾 Data Storage

All data is stored in **browser's Local Storage** by default:
- No server required
- Data persists across sessions
- Optional cloud sync with Google Sheets

## 🌐 Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 License

MIT License - Feel free to use and modify!

## 🤝 Support

For issues or feature requests, visit:
https://github.com/bhattpratin-blip/amba-ai-task-manager-v6-google-sheets-updated

---

**Built with ❤️ using Vanilla JavaScript**
