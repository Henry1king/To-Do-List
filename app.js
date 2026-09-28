const API_URL = 'http://localhost:3000/tasks';

// show all tasks on the page
async function loadTasks() {
  const res = await fetch(API_URL);
  const tasks = await res.json();

  let html = '';
  for (const task of tasks) {
    html += '<li>' + task.title + ' <button onclick="deleteTask(\'' + task._id + '\')">Delete</button></li>';
  }

  document.getElementById('taskList').innerHTML = html;
}

// add a new task
async function addTask() {
  const input = document.getElementById('taskInput');

  if (input.value === '') return;

  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: input.value })
  });

  input.value = '';
  loadTasks();
}

// delete a task
async function deleteTask(id) {
  await fetch(API_URL + '/' + id, { method: 'DELETE' });
  loadTasks();
}

loadTasks();