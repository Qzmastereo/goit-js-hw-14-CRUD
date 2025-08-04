const API_URL = 'http://localhost:3000/students';
const getBtn = document.getElementById('get-students-btn');
const tableBody = document.querySelector('#students-table tbody');
const form = document.getElementById('add-student-form');


function getStudents() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => renderStudents(data))
    .catch(err => console.error('Помилка при отриманні студентів:', err));
}

function renderStudents(students) {
  tableBody.innerHTML = '';
  students.forEach(student => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${student.id}</td>
      <td>${student.name}</td>
      <td>${student.age}</td>
      <td>${student.course}</td>
      <td>${student.skills.join(', ')}</td>
      <td>${student.email}</td>
      <td>${student.isEnrolled ? 'Так' : 'Ні'}</td>
      <td>
        <button onclick="updateStudent(${student.id})">Оновити</button>
        <button onclick="deleteStudent(${student.id})">Видалити</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

function addStudent(e) {
  e.preventDefault();

  const newStudent = {
    name: document.getElementById('name').value.trim(),
    age: Number(document.getElementById('age').value),
    course: document.getElementById('course').value.trim(),
    skills: document.getElementById('skills').value.split(',').map(skill => skill.trim()),
    email: document.getElementById('email').value.trim(),
    isEnrolled: document.getElementById('isEnrolled').checked
  };

  fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newStudent)
  })
    .then(res => res.json())
    .then(() => {
      form.reset();
      getStudents();
    })
    .catch(err => console.error('Помилка при додаванні студента:', err));
}


function updateStudent(id) {
  const newName = prompt('Введіть нове імʼя студента:');
  if (!newName) return;

  fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: newName })
  })
    .then(res => res.json())
    .then(() => getStudents())
    .catch(err => console.error('Помилка при оновленні студента:', err));
}


function deleteStudent(id) {
  if (!confirm('Ви впевнені, що хочете видалити цього студента?')) return;

  fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  })
    .then(() => getStudents())
    .catch(err => console.error('Помилка при видаленні студента:', err));
}


getBtn.addEventListener('click', getStudents);
form.addEventListener('submit', addStudent);
