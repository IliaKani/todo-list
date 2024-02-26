const form = document.querySelector('#form');
const toDoInput = document.querySelector('.todo-input');
const toDoList = document.querySelector('.todo-list');
const standardTheme = document.querySelector('.standard-theme');
const lightTheme = document.querySelector('.light-theme');

let todos = [];

// event listeners
form.addEventListener('submit', addToDo);
toDoList.addEventListener('click', deleteToDo);
toDoList.addEventListener('click', checkedToDo);
document.addEventListener("DOMContentLoaded", getTodos);
standardTheme.addEventListener('click', () => changeTheme('standard'));
lightTheme.addEventListener('click', () => changeTheme('light'));

// Check if one theme has been set previously and apply it (or std theme if not found):
let savedTheme = localStorage.getItem('savedTheme');
savedTheme === null ?
    changeTheme('standard')
    : changeTheme(localStorage.getItem('savedTheme'));

function addToDo(event) {
    // cancel the form submit
    event.preventDefault();

    //create Div
    const toDoDiv = document.createElement("div");
    toDoDiv.classList.add('todo', `${savedTheme}-todo`);
    // Create LI
    const toDoLi = document.createElement('li');
    toDoLi.innerText = toDoInput.value;
    toDoLi.classList.add('todo-item');
    toDoDiv.appendChild(toDoLi);
    // Adding to local storage;
    saveToLocalStorage(toDoInput.value);
    // Checked button
    const checked = document.createElement('button',);
    checked.innerHTML = '<i class="fas fa-check"></i>';
    checked.classList.add('check-btn', `${savedTheme}-button`);
    toDoDiv.appendChild(checked);
    // Delete button
    const deleted = document.createElement('button');
    deleted.innerHTML = '<i class="fas fa-trash"></i>';
    deleted.classList.add('delete-btn', `${savedTheme}-button`);
    toDoDiv.appendChild(deleted);

    // Append to list;
    toDoList.appendChild(toDoDiv);

    // CLearing the input;
    toDoInput.value = '';
    // return focus to input;
    toDoInput.focus();
}

function deleteToDo (event) {
    const item = event.target;
    if(item.classList[0] === 'delete-btn') {
        // animation
        item.parentElement.classList.add("fall");
        //removing local todos;
        removeLocalTodos(item.parentElement);
        // remove item
        item.parentElement.addEventListener('transitionend', function(){
            item.parentElement.remove();
        })
    }
};

function checkedToDo (event) {
    const item = event.target;
    if(item.classList[0] === 'check-btn') {
        item.parentElement.classList.toggle("completed");
    }
};

// Saving to local storage:
function saveToLocalStorage(todo){
    //Check: if item/s are there;
    if(localStorage.getItem('todos') === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos() {
    if(localStorage.getItem('todos') === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    todos.forEach(function(todo) {
        // create Div
        const toDoDiv = document.createElement("div");
        toDoDiv.classList.add("todo", `${savedTheme}-todo`);

        // Create LI
        const newToDo = document.createElement('li');
        
        newToDo.innerText = todo;
        newToDo.classList.add('todo-item');
        toDoDiv.appendChild(newToDo);

        // check btn;
        const checked = document.createElement('button');
        checked.innerHTML = '<i class="fas fa-check"></i>';
        checked.classList.add("check-btn", `${savedTheme}-button`);
        toDoDiv.appendChild(checked);
        // delete btn;
        const deleted = document.createElement('button');
        deleted.innerHTML = '<i class="fas fa-trash"></i>';
        deleted.classList.add("delete-btn", `${savedTheme}-button`);
        toDoDiv.appendChild(deleted);

        // Append to list;
        toDoList.appendChild(toDoDiv);
    });
}

function removeLocalTodos(todo){
    //Check: if item/s are there;
    if(localStorage.getItem('todos') === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    const todoIndex =  todos.indexOf(todo.children[0].innerText);
    // console.log(todoIndex);
    todos.splice(todoIndex, 1);
    // console.log(todos);
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Change theme function:
function changeTheme(color) {
    localStorage.setItem('savedTheme', color);
    savedTheme = localStorage.getItem('savedTheme');
    document.body.className = color;
    document.querySelector('input').className = `${color}-input`;
    // Change todo color without changing their status (completed or not):
    document.querySelectorAll('.todo').forEach(todo => {
        Array.from(todo.classList).some(item => item === 'completed') ? 
            todo.className = `todo ${color}-todo completed`
            : todo.className = `todo ${color}-todo`;
    });
    // Change buttons color according to their type (todo, check or delete):
    document.querySelectorAll('button').forEach(button => {
        Array.from(button.classList).some(item => {
            if (item === 'check-btn') {
                button.className = `check-btn ${color}-button`;  
            } else if (item === 'delete-btn') {
                button.className = `delete-btn ${color}-button`; 
            } else if (item === 'todo-btn') {
                button.className = `todo-btn ${color}-button`;
            }
        });
    });
}