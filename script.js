const initialClasses = `[
    {
        "id": 1,
        "name": "Йога",
        "time": "10:00 - 11:00",
        "maxParticipants": 15,
        "currentParticipants": 8
    },
    {
        "id": 2,
        "name": "Пилатес",
        "time": "11:30 - 12:30",
        "maxParticipants": 10,
        "currentParticipants": 5
    },
    {
        "id": 3,
        "name": "Кроссфит",
        "time": "13:00 - 14:00",
        "maxParticipants": 20,
        "currentParticipants": 15
    },
    {
        "id": 4,
        "name": "Танцы",
        "time": "14:30 - 15:30",
        "maxParticipants": 12,
        "currentParticipants": 10
    },
    {
        "id": 5,
        "name": "Бокс",
        "time": "16:00 - 17:00",
        "maxParticipants": 8,
        "currentParticipants": 6
    }
]`;

const initialUser = `[
    
]`;

const userLocalStorageKey = "user";
const classesLocalStorageKey = "classes";
if (!localStorage.getItem(classesLocalStorageKey)) {
    localStorage.setItem(classesLocalStorageKey, initialClasses);
}

if (!localStorage.getItem(userLocalStorageKey)) {
    localStorage.setItem(userLocalStorageKey, initialUser);
}

function savaData(array, userLocalStorageKey) {
    localStorage.setItem(userLocalStorageKey, JSON.stringify(array));
}

function createHtmlElement(classItem) {
    return `<div class="classElement" data-id="${classItem.id}">
    <div class="name">Name: ${classItem.name}</div>
    <div class="time">Time: ${classItem.time}</div>
    <div class="maxParticipants">MaxParticipants:  <span class="maxParticipants-number">${classItem.maxParticipants}</span></div>
    <div class="currentParticipants">CurrentParticipants: <span class="currentParticipants-number">${classItem.currentParticipants}</span></div>
    <button class="participate">Participate</button>
    <button class="cancel">Cancel</button>
    </div>`;
}

const classes = JSON.parse(localStorage.getItem(classesLocalStorageKey));

const user = JSON.parse(localStorage.getItem(userLocalStorageKey));

const classesElements = classes.map((classItem) => createHtmlElement(classItem)).join("");

const classesEl = document.querySelector('.classes-box');
classesEl.innerHTML = classesElements;

const allParticipateBtns = document.querySelectorAll('.participate');
const allCancelBtns = document.querySelectorAll('.cancel');


allParticipateBtns.forEach(button => {
    if (user.some(item => item.field === button.closest('.classElement').firstElementChild.textContent.split(" ")[1])) {
        button.disabled = true;
    }
});

allCancelBtns.forEach(button => {
    if (user.some(item => item.field !== button.closest('.classElement').firstElementChild.textContent.split(" ")[1])) {
        button.disabled = false;
    } else {
        button.disabled = true;
    }
});


classesEl.addEventListener('click', function (e) {
    const classEl = e.target.closest('.classElement');
    const id = +classEl.dataset.id;
    const indexClass = classes.findIndex((classItem) => classItem.id === id);
    const currentParticipantsEl = classEl.querySelector('.currentParticipants-number');;
    const currentParticipants = classes[indexClass].currentParticipants;
    const maxParticipants = classes[indexClass].maxParticipants;
    if (currentParticipants === maxParticipants) {
        allParticipateBtns[indexClass].disabled = true;
    }
    if (e.target.classList.contains('participate')) {
        currentParticipantsEl.textContent = currentParticipants + 1;
        classes[indexClass].currentParticipants += 1;
        const nameEl = classEl.querySelector('.name');
        let field = nameEl.textContent.split(" ")[1];
        user.push({ field });
        savaData(user, userLocalStorageKey);
        savaData(classes, classesLocalStorageKey);
        allParticipateBtns[indexClass].disabled = true;
        allCancelBtns[indexClass].disabled = false;
    }
    if (e.target.classList.contains('cancel')) {
        currentParticipantsEl.textContent = currentParticipants - 1;
        classes[indexClass].currentParticipants -= 1;
        const nameEl = classEl.querySelector('.name');
        let field = nameEl.textContent.split(" ")[1];
        user.splice(user.findIndex(item => item.field === field), 1);
        savaData(user, userLocalStorageKey);
        savaData(classes, classesLocalStorageKey);
        allParticipateBtns[indexClass].disabled = false;
        allCancelBtns[indexClass].disabled = true;
    }
});