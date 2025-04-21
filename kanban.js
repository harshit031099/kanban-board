let tasks = [];
let columns = ["TODO", "IN PROGRESS", "DONE"];
let editingTask = null;

const board = document.getElementById('kanban-board');
const searchInput = document.getElementById('search');

const modal = document.getElementById('task-modal');
const closeModalBtn = document.querySelector('.close-modal');
const taskForm = document.getElementById('task-form');
const modalTitle = document.getElementById('modal-title');

document.getElementById('add-task-btn').onclick = () => {
  editingTask = null;
  modalTitle.textContent = "Add Task";
  taskForm.reset();
  modal.classList.remove('hidden');
};

closeModalBtn.onclick = () => modal.classList.add('hidden');

taskForm.onsubmit = e => {
  e.preventDefault();
  const task = {
    id: editingTask ? editingTask.id : Date.now(),
    title: taskForm['task-title'].value,
    type: taskForm['task-type'].value,
    effort: taskForm['task-estimation'].value,
    priority: taskForm['task-priority'].value,
    description: taskForm['task-desc'].value,
    assignee: taskForm['task-assignee'].value,
    tags: taskForm['task-tags'].value.split(',').map(t => t.trim()),
    column: "TODO"
  };
  if(editingTask) {
    tasks = tasks.map(t => t.id === editingTask.id ? task : t);
  } else tasks.push(task);
  modal.classList.add('hidden');
  renderTasks();
};

function renderTasks(filter='') {
  board.innerHTML = '';
  columns.forEach(column => {
    const columnEl = document.createElement('div');
    columnEl.classList.add('column');
    columnEl.innerHTML = `<h4>${column}</h4>`;
    
    tasks.filter(task => task.column === column && 
      (task.title+task.type+task.description+task.assignee+task.tags.join('')).toLowerCase().includes(filter))
    .forEach(task => {
      const taskEl = document.createElement('div');
      taskEl.classList.add('task-card');
      taskEl.draggable = true;
      taskEl.innerHTML = `
        <strong>${task.title}</strong>
        <p>Type: ${task.type}, Priority: ${task.priority}</p>
        <small>Assignee: ${task.assignee}</small>
      `;
      taskEl.onclick = () => {
        editingTask = task;
        modalTitle.textContent = "Edit Task";
        taskForm['task-title'].value = task.title;
        taskForm['task-type'].value = task.type;
        taskForm['task-estimation'].value = task.effort;
        taskForm['task-priority'].value = task.priority;
        taskForm['task-desc'].value = task.description;
        taskForm['task-assignee'].value = task.assignee;
        taskForm['task-tags'].value = task.tags.join(', ');
        modal.classList.remove('hidden');
      };
      taskEl.addEventListener('dragstart', () => taskEl.draggedTask = task);
      columnEl.appendChild(taskEl);
    });

    columnEl.ondragover = e => e.preventDefault();
    columnEl.ondrop = () => {
      const draggedTask = document.querySelector('.task-card').draggedTask;
      draggedTask.column = column;
      renderTasks(searchInput.value.toLowerCase());
    };
    
    board.appendChild(columnEl);
  });
}

searchInput.oninput = e => renderTasks(e.target.value.toLowerCase());

renderTasks();
