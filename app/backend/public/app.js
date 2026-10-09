const API = '/api/todos';
const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');

async function loadTodos() {
  const res = await fetch(API);
  const todos = await res.json();
  list.innerHTML = '';
  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = todo.completed ? 'completed' : '';
    li.innerHTML = `
      <span onclick="toggleTodo(${todo.id})">${todo.title}</span>
      <button onclick="deleteTodo(${todo.id})">✕</button>
    `;
    list.appendChild(li);
  });
}

async function toggleTodo(id) {
  await fetch(`${API}/${id}`, { method: 'PATCH' });
  loadTodos();
}

async function deleteTodo(id) {
  await fetch(`${API}/${id}`, { method: 'DELETE' });
  loadTodos();
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: input.value })
  });
  input.value = '';
  loadTodos();
});

loadTodos();
