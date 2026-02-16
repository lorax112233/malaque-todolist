const input = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('task-list');
const STORAGE_KEY = 'shadrach-todo-tasks-v1';

let tasks = [];

function saveTasks(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(raw){
    try{ tasks = JSON.parse(raw) }catch(e){ tasks = [] }
  }
}

function render(){
  list.innerHTML = '';
  tasks.forEach(t => {
    const li = document.createElement('li');
    li.className = 'task-item';

    const left = document.createElement('div');
    left.className = 'task-left';

    const text = document.createElement('span');
    text.className = 'task-text';
    text.textContent = t.text;
    if(t.completed) text.classList.add('completed');
    text.addEventListener('click', () => toggleComplete(t.id));

    // create status badge showing Done / Pending
    const status = document.createElement('span');
    status.className = 'status-badge' + (t.completed ? ' done' : '');
    status.textContent = t.completed ? 'Done' : 'Pending';
    // clicking the badge toggles completion too
    status.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleComplete(t.id);
    });

    left.appendChild(text);
    left.appendChild(status);

    const actions = document.createElement('div');
    actions.className = 'actions';

    const del = document.createElement('button');
    del.className = 'delete-btn';
    del.textContent = 'Delete';
    del.addEventListener('click', () => deleteTask(t.id));

    actions.appendChild(del);

    li.appendChild(left);
    li.appendChild(actions);

    list.appendChild(li);
  });
}

function addTask(text){
  const trimmed = text.trim();
  if(!trimmed) return;
  const task = { id: Date.now().toString(36), text: trimmed, completed: false };
  tasks.unshift(task);
  saveTasks();
  render();
}

function toggleComplete(id){
  tasks = tasks.map(t => t.id === id ? {...t, completed: !t.completed} : t);
  saveTasks();
  render();
}

function deleteTask(id){
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  render();
}

addBtn.addEventListener('click', () => {
  addTask(input.value);
  input.value = '';
  input.focus();
});

input.addEventListener('keydown', (e) => {
  if(e.key === 'Enter'){
    addTask(input.value);
    input.value = '';
  }
});

// initialize
loadTasks();
render();
