document.addEventListener('DOMContentLoaded', function () {
    loadSavedRoutines();
    restoreCheckboxStates();
    type();
});

// ✅ Checkbox state save aur restore karne ka function
function saveCheckboxStates() {
    let tasks = document.querySelectorAll('input[type="checkbox"]');
    let states = {};
    tasks.forEach(task => {
        states[task.id] = task.checked;
    });
    localStorage.setItem('checkboxStates', JSON.stringify(states));
}

function restoreCheckboxStates() {
    let states = JSON.parse(localStorage.getItem('checkboxStates'));
    if (states) {
        for (let id in states) {
            let checkbox = document.getElementById(id);
            if (checkbox) checkbox.checked = states[id];
        }
    }
}

// Har dafa checkbox change hone par state save karega
document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', saveCheckboxStates);
});

// ✅ Popups control functions
function openConfirmationPopup() {
    document.getElementById('confirmationPopup').style.display = 'block';
}

function closePopup() {
    document.getElementById('confirmationPopup').style.display = 'none';
}

// ✅ Routine save karne ka function
function saveRoutine() {
    let tasks = document.querySelectorAll('input[type="checkbox"]');
    let checkedTasks = [];

    tasks.forEach(task => {
        if (task.checked) {
            checkedTasks.push(task.id);
        }
    });

    if (checkedTasks.length === 0) {
        alert("No task selected. Please select at least one task.");
        return;
    }

    let currentDate = new Date().toLocaleDateString();
    let savedRoutines = JSON.parse(localStorage.getItem('savedRoutines')) || [];
    let newRoutine = { id: Date.now(), date: currentDate, tasks: checkedTasks };

    savedRoutines.push(newRoutine);
    localStorage.setItem('savedRoutines', JSON.stringify(savedRoutines));

    showSavedRoutines();
}

// ✅ Saved tasks load karne ka function
function loadSavedRoutines() {
    let savedRoutines = JSON.parse(localStorage.getItem('savedRoutines')) || [];
    let savedTasksContainer = document.getElementById('savedTasksList');
    savedTasksContainer.innerHTML = '';

    savedRoutines.forEach(routine => createRoutineElement(routine));
}

// ✅ Routine display karne ka function
function createRoutineElement(routine) {
    let savedTasksContainer = document.getElementById('savedTasksList');
    let div = document.createElement('div');
    div.classList.add('saved-routine-item');
    div.dataset.id = routine.id;

    let datePara = document.createElement('p');
    datePara.innerText = `Date: ${routine.date}`;

    let expandBtn = document.createElement('span');
    expandBtn.innerHTML = "&#x25B2;";
    expandBtn.classList.add('expand-btn');
    expandBtn.onclick = function () {
        taskList.style.display = taskList.style.display === 'none' ? 'block' : 'none';
    };

    let taskList = document.createElement('ul');
    taskList.style.display = 'none';

    routine.tasks.forEach(taskId => {
        let task = document.querySelector(`label[for="${taskId}"]`);
        let li = document.createElement('li');
        li.innerText = task ? task.innerText : "Unknown Task";
        taskList.appendChild(li);
    });

    let menu = document.createElement('span');
    menu.innerHTML = "&#x22EE;";
    menu.classList.add('task-menu');
    menu.onclick = function () {
        deleteBtn.style.display = deleteBtn.style.display === 'none' ? 'inline' : 'none';
    };

    let deleteBtn = document.createElement('button');
    deleteBtn.innerText = "Delete";
    deleteBtn.classList.add('delete-btn');
    deleteBtn.style.display = 'none';
    deleteBtn.onclick = function () {
        let userPin = prompt("Enter PIN to delete:");
        if (userPin === "123456") {
            deleteRoutine(routine.id);
        } else {
            alert("Incorrect PIN!");
        }
    };

    div.appendChild(datePara);
    div.appendChild(expandBtn);
    div.appendChild(taskList);
    div.appendChild(menu);
    div.appendChild(deleteBtn);
    savedTasksContainer.prepend(div);
}

// ✅ Routine delete karne ka function
function deleteRoutine(routineId) {
    let savedRoutines = JSON.parse(localStorage.getItem('savedRoutines')) || [];
    let updatedRoutines = savedRoutines.filter(routine => routine.id !== routineId);
    localStorage.setItem('savedRoutines', JSON.stringify(updatedRoutines));
    showSavedRoutines();
    alert("Routine deleted successfully!");
}

// ✅ Show Saved Tasks ka function (Error Fix)
function toggleSavedTasks() {
    let savedTasksContainer = document.getElementById('savedTasksContainer');
    if (savedTasksContainer.style.display === 'none') {
        savedTasksContainer.style.display = 'block';
    } else {
        savedTasksContainer.style.display = 'none';
    }
}

// ✅ Auto-typing effect ka function
const texts = [
    'Daily Routine Tracker',
    'Work/Study Routine',
    'by the way Sigma male never sites🖕',
    'Ah NVM Just kidding😆',
    'NTH_NOTHING',
    'NTH_MUBEEN',
    'Subcribe 👉 (comming soon )'
];

let count = 0;
let index = 0;
let currentText = '';
let letter = '';

function type() {
    if (count === texts.length) {
        count = 0;
    }
    currentText = texts[count];
    letter = currentText.slice(0, ++index);

    document.getElementById('auto-text').textContent = letter;
    if (letter.length === currentText.length) {
        setTimeout(erase, 2000);
    } else {
        setTimeout(type, 100);
    }
}

function erase() {
    letter = currentText.slice(0, --index);
    document.getElementById('auto-text').textContent = letter;
    if (letter.length === 0) {
        count++;
        setTimeout(type, 500);
    } else {
        setTimeout(erase, 50);
    }
}

// ✅ Show saved routines function
function showSavedRoutines() {
    let savedTasksContainer = document.getElementById('savedTasksList');
    savedTasksContainer.innerHTML = '';
    loadSavedRoutines();
}


// ✅ Stylish PIN Confirmation Functions
let routineToDelete = null;

function openPinPopup(routineId) {
    routineToDelete = routineId;
    document.getElementById('pinPopup').style.display = 'block';
}

function closePinPopup() {
    document.getElementById('pinPopup').style.display = 'none';
    document.getElementById('pinInput').value = ''; // Reset input field
}

function confirmDelete() {
    let userPin = document.getElementById('pinInput').value;
    if (userPin === "123456") {
        deleteRoutine(routineToDelete);
        closePinPopup();
        alert("Routine deleted successfully!");
    } else {
        alert("Incorrect PIN!");
    }
}

// ✅ Update delete button to use new popup
function createRoutineElement(routine) {
    let savedTasksContainer = document.getElementById('savedTasksList');
    let div = document.createElement('div');
    div.classList.add('saved-routine-item');
    div.dataset.id = routine.id;

    let datePara = document.createElement('p');
    datePara.innerText = `Date: ${routine.date}`;

    let expandBtn = document.createElement('span');
    expandBtn.innerHTML = "&#x25B2;";
    expandBtn.classList.add('expand-btn');
    expandBtn.onclick = function () {
        taskList.style.display = taskList.style.display === 'none' ? 'block' : 'none';
    };

    let taskList = document.createElement('ul');
    taskList.style.display = 'none';

    routine.tasks.forEach(taskId => {
        let task = document.querySelector(`label[for="${taskId}"]`);
        let li = document.createElement('li');
        li.innerText = task ? task.innerText : "Unknown Task";
        taskList.appendChild(li);
    });

    let menu = document.createElement('span');
    menu.innerHTML = "&#x22EE;";
    menu.classList.add('task-menu');
    menu.onclick = function () {
        deleteBtn.style.display = deleteBtn.style.display === 'none' ? 'inline' : 'none';
    };

    let deleteBtn = document.createElement('button');
    deleteBtn.innerText = "Delete";
    deleteBtn.classList.add('delete-btn');
    deleteBtn.onclick = function () {
        openPinPopup(routine.id); // ✅ New Stylish PIN Popup
    };

    div.appendChild(datePara);
    div.appendChild(expandBtn);
    div.appendChild(taskList);
    div.appendChild(menu);
    div.appendChild(deleteBtn);
    savedTasksContainer.prepend(div);
}

