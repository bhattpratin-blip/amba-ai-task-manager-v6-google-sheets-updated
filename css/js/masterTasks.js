// ======================================
// Master Task Library
// ======================================

if (!db.masterTasks) {
    db.masterTasks = [];
    save();
}

// Open Master Task Screen
function openMasterTasks() {

    let html = `
    <div class="main">

        <div class="header">
            <h1>📚 Master Task Library</h1>

            <button class="btn-primary"
                onclick="showMasterTaskForm()">
                + Add Task
            </button>
        </div>

        <table>

        <thead>

        <tr>

        <th>Task</th>
        <th>Department</th>
        <th>Employee</th>
        <th>Frequency</th>
        <th>Priority</th>
        <th>Action</th>

        </tr>

        </thead>

        <tbody>
    `;

    db.masterTasks.forEach(task=>{

        let emp=db.users.find(x=>x.id==task.employee);

        html+=`
        <tr>

        <td>${task.title}</td>

        <td>${task.department}</td>

        <td>${emp ? emp.name : "-"}</td>

        <td>${task.frequency}</td>

        <td>${task.priority}</td>

        <td>

        <button onclick="editMasterTask('${task.id}')">
        ✏
        </button>

        <button onclick="deleteMasterTask('${task.id}')">
        🗑
        </button>

        </td>

        </tr>
        `;

    });

    html+=`
    </tbody>

    </table>

    <br>

    <button class="btn-success"
        onclick="generateTodayTasks()">

        ⚡ Generate Today's Tasks

    </button>

    </div>
    `;

    app.innerHTML=html;

}

function showMasterTaskForm(id=null){

    let task=null;

    if(id){

        task=db.masterTasks.find(x=>x.id==id);

    }

    let empOptions=db.users
    .filter(x=>x.role==="EMPLOYEE")
    .map(e=>`
        <option value="${e.id}"
        ${task && task.employee==e.id?"selected":""}>
        ${e.name}
        </option>
    `).join("");

    app.innerHTML=`

    <div class="main">

    <div class="card">

    <h2>${id?"Edit":"New"} Master Task</h2>

    <label>Task Name</label>

    <input id="mtTitle"
    value="${task?task.title:""}">

    <label>Department</label>

    <select id="mtDepartment">

        <option>Store</option>
        <option>Billing</option>
        <option>Purchase</option>
        <option>Accounts</option>
        <option>Cold Storage</option>

    </select>

    <label>Employee</label>

    <select id="mtEmployee">

        ${empOptions}

    </select>

    <label>Frequency</label>

    <select id="mtFrequency">

        <option ${task?.frequency=="DAILY"?"selected":""}>DAILY</option>
        <option ${task?.frequency=="WEEKLY"?"selected":""}>WEEKLY</option>
        <option ${task?.frequency=="MONTHLY"?"selected":""}>MONTHLY</option>

    </select>

    <label>Priority</label>

    <select id="mtPriority">

        <option>LOW</option>
        <option selected>MEDIUM</option>
        <option>HIGH</option>

    </select>

    <br>

    <button class="btn-primary"

    onclick="saveMasterTask('${id?id:""}')">

    Save

    </button>

    <button

    onclick="openMasterTasks()">

    Cancel

    </button>

    </div>

    </div>
    `;

    if(task){

        mtDepartment.value=task.department;
        mtPriority.value=task.priority;

    }

}

function saveMasterTask(id){

    let task={

        id:id || "MT"+Date.now(),

        title:mtTitle.value,

        department:mtDepartment.value,

        employee:mtEmployee.value,

        frequency:mtFrequency.value,

        priority:mtPriority.value

    };

    if(id){

        let i=db.masterTasks.findIndex(x=>x.id==id);

        db.masterTasks[i]=task;

    }

    else{

        db.masterTasks.push(task);

    }

    save();

    openMasterTasks();

}

function editMasterTask(id){

    showMasterTaskForm(id);

}

function deleteMasterTask(id){

    if(!confirm("Delete this task?")) return;

    db.masterTasks=db.masterTasks.filter(x=>x.id!=id);

    save();

    openMasterTasks();

}

// ======================================
// Generate Daily Tasks
// ======================================

function generateTodayTasks(){

    let today=new Date().toISOString().slice(0,10);

    db.masterTasks.forEach(task=>{

        let create=false;

        if(task.frequency=="DAILY") create=true;

        if(task.frequency=="WEEKLY"
            && new Date().getDay()==1)
            create=true;

        if(task.frequency=="MONTHLY"
            && new Date().getDate()==1)
            create=true;

        if(!create) return;

        let already=db.tasks.find(t=>

            t.masterId==task.id

            &&

            t.generatedDate==today

        );

        if(already) return;

        db.tasks.push({

            id:"T"+Date.now()+Math.random(),

            masterId:task.id,

            generatedDate:today,

            title:task.title,

            description:"",

            dueDate:today,

            priority:task.priority,

            status:"TODO",

            assignedTo:task.employee,

            createdBy:"SYSTEM",

            createdAt:Date.now()

        });

        notify(task.employee,

            "📋 New Daily Task : "+task.title);

    });

    save();

    alert("✅ Today's Tasks Generated");

}
