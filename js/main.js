import Student from "./student.js";

//работа с сервером
const SERVER_URL = "http://localhost:3000";

//добавление студента через сервер
async function serverAddStudent(obj) {
  let response = await fetch(SERVER_URL + "/api/students", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  });

  let data = await response.json();
  return data;
}

//получение студентов с сервера 
async function serverGetStudent() {
  let response = await fetch(SERVER_URL + "/api/students", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });

  let data = await response.json();
  return data;
}

let serverData = await serverGetStudent();

//удаление студента через с сервера
async function serverDeleteStudent(id) {
  let response = await fetch(SERVER_URL + "/api/students/" + id, {
    method: "DELETE",
  });

  let data = await response.json();
  return data;
}

let students = [];

if (serverData) {
  students = serverData;
};

const $studentsList = document.getElementById("students-list"),
  tableHeaderCells = document.querySelectorAll(".studentsTable th"),
  formEl = document.querySelector("#addStudent"),
  inputsEl = formEl.querySelectorAll("input"),
  btnShowFilterl = document.querySelector("#show-filter"),
  formFilterEl = document.querySelector("#filter-form"),
  filterBoxBtn = document.querySelector("#filter-box_btn");

let column = "fio",
  columnDir = true;

//получить строку студента
function newStudentItem(student) {
  const $studentTR = document.createElement("tr"),
    $fioTD = document.createElement("td"),
    $birthDateTD = document.createElement("td"),
    $studyStartTD = document.createElement("td"),
    $facultyTD = document.createElement("td"),
    $tdDelete = document.createElement("td"),
    $btnDeleteStudent = document.createElement("button");

  $fioTD.textContent = student.fio;
  $birthDateTD.textContent =
    student.getBirthDateString() + " (" + student.getAge() + "лет)";
  $studyStartTD.textContent = student.getLearnPeriod();
  $facultyTD.textContent = student.faculty;
  $btnDeleteStudent.textContent = "Удалить";
  $btnDeleteStudent.classList.add("btn", "btn-danger", "btn-sm", "w-100");
  Object.assign($btnDeleteStudent, { type: "button", id: "btn-delete" });

  $tdDelete.append($btnDeleteStudent);

  // Событие удаления студента
  $btnDeleteStudent.addEventListener('click', async function () {
      await serverDeleteStudent(student.id)
      $studentTR.remove()
  })

  $studentTR.append($fioTD, $birthDateTD, $studyStartTD, $facultyTD, $tdDelete);
  return $studentTR;
}

//сортировка массива по параметрам
function getSortStudents(prop, dir) {
  let studentCopy = [...students];

  return studentCopy.sort((studentA, studentB) =>
    !dir
      ? studentA[prop] < studentB[prop]
      : studentA[prop] > studentB[prop]
        ? -1
        : 1
  );
}

//фильтр студентов по параметрам
function filterStudents(arr, prop, value) {
  const sortedArr = [];
  const copyArr = [...arr];
  for (const item of copyArr) {
    if (String(item[prop]).match(new RegExp(value, "i"))) sortedArr.push(item);
  }
  return sortedArr;
}

function renderStudentsTable() {
  let studentCopy = [...students];
  studentCopy = getSortStudents(column, columnDir);

  $studentsList.innerHTML = "";

  //полчаем значение из input фильтрации
  const fioVal = document.querySelector("#filter-fioVal").value,
    birthDateVal = document.querySelector("#filter-birthDateVal").value,
    yearLearnVal = document.querySelector("#filter-yearLearnVal").value,
    facultyVal = document.querySelector("#filter-facultyVal").value;

  if (fioVal !== "") studentCopy = filterStudents(studentCopy, "fio", fioVal);
  if (birthDateVal !== "")
    studentCopy = filterStudents(studentCopy, "birthday", birthDateVal);
  if (yearLearnVal !== "")
    studentCopy = filterStudents(studentCopy, "studyStart", yearLearnVal);
  if (facultyVal !== "")
    studentCopy = filterStudents(studentCopy, "faculty", facultyVal);

  for (const student of studentCopy) {
    $studentsList.append(
      newStudentItem(
        new Student(
          student.name,
          student.surname,
          student.lastname,
          student.studyStart,
          new Date(student.birthday),
          student.faculty,
          student.id
        )
      )
    );
  }
}

renderStudentsTable(students);

//событие на фильт студентов
formFilterEl.addEventListener("submit", function (event) {
  event.preventDefault();
  renderStudentsTable(students);
});

//событие на сортировку
tableHeaderCells.forEach((element) => {
  element.addEventListener("click", function () {
    column = this.dataset.column;
    columnDir = !columnDir;
    renderStudentsTable(students);
  });
});

//события кнопок фильтра
filterBoxBtn.addEventListener("click", function (event) {
  if (event.target.id === "clearAll") {
    event.preventDefault();
    formFilterEl.reset();
  }

  if (event.target.id === "undoAll") {
    event.preventDefault();
    formFilterEl.reset();
    renderStudentsTable(students);
  }
});

//скрывает или показывает filter и меняет надпись кнопки
btnShowFilterl.addEventListener("click", function () {
  document.getElementById("filter-form").classList.toggle("visible");
  this.innerText = this.innerText == "спрятать" ? "показать" : "спрятать";
});

//добавление студента
formEl.addEventListener("submit", async function (event) {
  event.preventDefault();

  let newStudentObj = {
    name: document.getElementById("input-name").value,
    surname: document.getElementById("input-surname").value,
    lastname: document.getElementById("input-lastname").value,
    studyStart: Number(document.getElementById("input-studyStart").value),
    birthday: new Date(document.getElementById("input-birthDay").value),
    faculty: document.getElementById("input-faculty").value,
  };

  let serverDataObj = await serverAddStudent(newStudentObj);
  serverDataObj.birthday = new Date(serverDataObj.birthday);

  students.push(serverDataObj);

  renderStudentsTable(students);
});


