// DOM elements
const form = document.querySelector('#form');
const toDoInput = document.querySelector('.todo-input');
const toDoList = document.querySelector('.todo-list');
const standardTheme = document.querySelector('.standard-theme');
const lightTheme = document.querySelector('.light-theme');

// Initial setup
let todos = getTodosFromLocalStorage();
let savedTheme = localStorage.getItem('savedTheme') || 'standard';
changeTheme(savedTheme);

// Event listeners
form.addEventListener('submit', addToDo);
toDoList.addEventListener('click', handleToDoListClick);
document.addEventListener("DOMContentLoaded", renderTodos);
standardTheme.addEventListener('click', () => changeTheme('standard'));
lightTheme.addEventListener('click', () => changeTheme('light'));

// Todo functions
function addToDo(event) {
    event.preventDefault();
    const todo = { text: toDoInput.value, checked: false };
    saveToLocalStorage(todo);
    renderTodo(todo);
    toDoInput.value = '';
    toDoInput.focus();
}

function handleToDoListClick(event) {
    const item = event.target;
    if(item.classList.contains('delete-btn')) {
        deleteToDo(item);
    } else if(item.classList.contains('check-btn')) {
        checkedToDo(item);
    }
}

function deleteToDo (item) {
    item.parentElement.classList.add("fall");
    removeLocalTodos(item.parentElement);
    item.parentElement.addEventListener('transitionend', function(){
        item.parentElement.remove();
    });
}

function checkedToDo (item) {
    const todoDiv = item.parentElement;
    todoDiv.classList.toggle("completed");
    const index = todos.findIndex(todo => todo.text === todoDiv.children[0].innerText);
    todos[index].checked = todoDiv.classList.contains("completed");
    localStorage.setItem('todos', JSON.stringify(todos));
}

function saveToLocalStorage(todo){
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodosFromLocalStorage() {
    let storedTodos = localStorage.getItem('todos');
    return storedTodos ? JSON.parse(storedTodos) : [];
}

function renderTodos() {
    todos.forEach(renderTodo);
}

function renderTodo(todo) {
    const toDoDiv = createToDoDiv(todo);
    toDoList.appendChild(toDoDiv);
}

function createToDoDiv(todo) {
    const toDoDiv = document.createElement("div");
    toDoDiv.classList.add("todo", `${savedTheme}-todo`);
    if (todo.checked) {
        toDoDiv.classList.add('completed');
    }

    const newToDo = document.createElement('li');
    newToDo.innerText = todo.text;
    newToDo.classList.add('todo-item');
    toDoDiv.appendChild(newToDo);

    const checked = createButton('check-btn', '<i class="fas fa-check"></i>');
    toDoDiv.appendChild(checked);

    const deleted = createButton('delete-btn', '<i class="fas fa-trash"></i>');
    toDoDiv.appendChild(deleted);

    return toDoDiv;
}

function removeLocalTodos(todoDiv){
    const index = todos.findIndex(todo => todo.text === todoDiv.children[0].innerText);
    todos.splice(index, 1);
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Theme functions
function changeTheme(color) {
    localStorage.setItem('savedTheme', color);
    savedTheme = color;
    document.body.className = color;
    document.querySelector('input').className = `${color}-input`;
    Array.from(document.querySelectorAll('.todo')).forEach(element => changeElementTheme(element, 'todo'));
    Array.from(document.querySelectorAll('button')).forEach(element => changeElementTheme(element, 'button'));
}

function changeElementTheme(element, baseClass) {
    const isCompleted = element.classList.contains('completed');
    const isButton = baseClass === 'button';
    const buttonType = isButton ? element.classList[0] : '';
    element.className = `${isButton ? buttonType : baseClass} ${savedTheme}-${baseClass} ${isCompleted ? 'completed' : ''}`;
}

// Button function
function createButton(className, innerHTML) {
    const button = document.createElement('button');
    button.innerHTML = innerHTML;
    button.classList.add(className, `${savedTheme}-button`);
    return button;
}