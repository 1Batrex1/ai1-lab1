class Task {

    static taskCounter = 0;

    constructor(taskName, dueDate) {
        this.taskId = Task.taskCounter;
        this.taskName = taskName;
        this.dueDate = dueDate;
        this.isDone = false;
        Task.taskCounter++;
    }

}

class ToDo {

    constructor() {
        this.taskList = [];
    }

    addTask() {
        let taskName = document.getElementById("taskName").value;
        let dueDate = document.getElementById("dueDate").value.toString();
        if (taskName.length < 3) {
            alert("Task name must be at least 3 characters long");
            return;
        }
        let task = new Task(taskName, dueDate);
        this.taskList.push(task);
        localStorage.setItem("TaskList", JSON.stringify(this.taskList));
        this.drawTasks();

    }

    loadTasks() {
        this.taskList = JSON.parse(localStorage.getItem("TaskList"));
        if (this.taskList == null) {
            this.taskList = [];
        }
        Task.taskCounter = this.taskList.length;

    }


    drawTasks(taskList = this.taskList) {
        let tasks = document.getElementById("tasks");
        while (tasks.hasChildNodes()) {
            tasks.removeChild(tasks.firstChild);
        }
        if (this.taskList != null) {
            for (const taskListElement of taskList) {
                let tag = document.createElement("li")

                let checkbox = document.createElement("input");
                let deleteButton = document.createElement("button");
                let spanTaskName = document.createElement("span");
                let inputDueDate = document.createElement("input");
                let editButton = document.createElement("button");

                tag.id = taskListElement.taskId;
                checkbox.type = "checkbox";
                checkbox.onclick = function () {
                    toDo.changeStatus(taskListElement.taskId);
                }
                deleteButton.innerHTML = "Delete";
                deleteButton.onclick = function () {
                    toDo.deleteTask(taskListElement.taskId);
                }
                if (taskListElement.isDone) {
                    checkbox.checked = true;
                }

                editButton.innerHTML = "Edit";
                editButton.onclick = function () {
                    toDo.saveEditedTask(taskListElement.taskId);
                }
                editButton.style.display = "none";
                editButton.id = "editButton" + taskListElement.taskId;

                spanTaskName.contentEditable = "true";
                spanTaskName.innerHTML = taskListElement.taskName;
                spanTaskName.id = "task" + taskListElement.taskId;
                spanTaskName.onclick = function () {
                    toDo.editTask(taskListElement.taskId);
                }


                inputDueDate.type = "date";
                inputDueDate.value = taskListElement.dueDate;
                inputDueDate.readOnly = true;
                inputDueDate.id = "dueDate" + taskListElement.taskId;
                inputDueDate.onclick = function () {
                    toDo.editTask(taskListElement.taskId);
                }
                inputDueDate.style.all = "unset";
                tag.appendChild(checkbox);
                tag.appendChild(spanTaskName);
                tag.appendChild(document.createTextNode(" - "));
                tag.appendChild(inputDueDate);

                tag.appendChild(editButton);
                tag.appendChild(deleteButton);
                tasks.appendChild(tag);
            }
        }
    }

    deleteTask(taskId) {
        this.taskList.splice(taskId, 1);
        for (let i = taskId; i < this.taskList.length; i++) {
            this.taskList[i].taskId--;
            document.getElementById(i + 1).id = i;
        }

        Task.taskCounter--;
        localStorage.setItem("TaskList", JSON.stringify(this.taskList));
        this.drawTasks();
    }

    changeStatus(taskId) {
        let task = this.taskList[taskId];
        task.isDone = !task.isDone;
        if (task.isDone) {
            document.getElementById(taskId).style.textDecoration = "line-through";
        } else {
            document.getElementById(taskId).style.textDecoration = "none";
        }
        this.taskList[taskId] = task;
        localStorage.setItem("TaskList", JSON.stringify(this.taskList));
    }

    filterTasks() {
        let filter = document.getElementById("filter").value;
        if (filter === "" || filter.length < 2) {
            this.drawTasks();
            return;
        }
        let filteredTasks = JSON.parse(JSON.stringify(this.taskList.filter(function (task) {
            return task.taskName.includes(filter);
        })));
        let final = [];
        for (let filteredTask of filteredTasks) {

            filteredTask.taskName = filteredTask.taskName.replaceAll(filter, "<mark>" + filter + "</mark>");
            final.push(filteredTask);
        }
        this.drawTasks(final);
    }

    editTask(taskId) {
        document.getElementById("editButton" + taskId).style.display = "inline";
        if (document.getElementById("dueDate" + taskId) !== null) {
            document.getElementById("dueDate" + taskId).readOnly = false;
        }
    }

    saveEditedTask(taskId) {
        document.getElementById("editButton" + taskId).style.display = "none";
        let taskName = document.getElementById("task" + taskId).innerText;
        let task = this.taskList[taskId];
        console.log(taskName);
        if (taskName.length < 3) {
            alert("Task name must be at least 3 characters long");
            return;
        }
        task.taskName = taskName;
        if (document.getElementById("dueDate" + taskId) !== null) {
            document.getElementById("dueDate" + taskId).readOnly = true;
            task.dueDate = document.getElementById("dueDate" + taskId).value;
        }
        this.taskList[taskId] = task;
        localStorage.setItem("TaskList", JSON.stringify(this.taskList));
    }
}

let toDo = new ToDo();

window.onload = function () {
    toDo.loadTasks();
    toDo.drawTasks();
}

function addTask() {
    toDo.addTask();
}

function filterTasks() {
    toDo.filterTasks();
}


