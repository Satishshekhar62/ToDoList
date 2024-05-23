document.addEventListener('DOMContentLoaded', () => {
    const newTaskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');
    const emptyMessage = document.getElementById('empty-message');

    loadTasks();

    addTaskButton.addEventListener('click', addTask);

    function addTask() {
        const taskText = newTaskInput.value.trim();
        if (taskText === '') return;

        const taskItem = createTaskItem(taskText);

        taskList.appendChild(taskItem);
        saveTask(taskText);
        newTaskInput.value = '';
        checkEmptyMessage();
    }

    function editTask(taskItem, taskContent) {
        const newText = prompt('Edit task', taskContent.textContent);
        if (newText !== null) {
            taskContent.textContent = newText.trim();
            updateTaskInStorage(taskItem.dataset.id, newText.trim());
        }
    }

    function deleteTask(taskItem) {
        taskList.removeChild(taskItem);
        removeTaskFromStorage(taskItem.dataset.id);
        checkEmptyMessage();
    }

    function createTaskItem(taskText, id = Date.now().toString()) {
        const taskItem = document.createElement('li');
        const taskContent = document.createElement('span');
        taskContent.textContent = taskText;
        taskItem.dataset.id = id;

        const actions = document.createElement('div');
        actions.className = 'actions';

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => editTask(taskItem, taskContent));

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteTask(taskItem));

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);

        taskItem.appendChild(taskContent);
        taskItem.appendChild(actions);

        return taskItem;
    }

    function checkEmptyMessage() {
        if (taskList.children.length > 1) { // More than just the empty message
            emptyMessage.style.display = 'none';
        } else {
            emptyMessage.style.display = 'block';
        }
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const taskItem = createTaskItem(task.text, task.id);
            taskList.appendChild(taskItem);
        });
        checkEmptyMessage();
    }

    function saveTask(taskText) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const task = { id: Date.now().toString(), text: taskText };
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function updateTaskInStorage(id, newText) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const taskIndex = tasks.findIndex(task => task.id === id);
        if (taskIndex !== -1) {
            tasks[taskIndex].text = newText;
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }

    function removeTaskFromStorage(id) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const updatedTasks = tasks.filter(task => task.id !== id);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }
});
