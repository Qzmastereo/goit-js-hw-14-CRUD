const API_URL = 'http://localhost:3000/students';
const getBtn = document.getElementById('get-students-btn');
const tableBody = document.querySelector('#students-table tbody');
const form = document.getElementById('add-student-form');


async function getStudents() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    renderStudents(data);
  } catch (err) {
    console.error('Помилка при отриманні студентів:', err);
  }
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
        <button onclick="updateStudent('${student.id}')">Оновити</button>
        <button onclick="deleteStudent('${student.id}')">Видалити</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}


async function addStudent(e) {
  e.preventDefault();

  const newStudent = {
    name: document.getElementById('name').value.trim(),
    age: Number(document.getElementById('age').value),
    course: document.getElementById('course').value.trim(),
    skills: document.getElementById('skills').value.split(',').map(skill => skill.trim()),
    email: document.getElementById('email').value.trim(),
    isEnrolled: document.getElementById('isEnrolled').checked
  };

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStudent)
    });
    await res.json();
    form.reset();
    await getStudents();
  } catch (err) {
    console.error('Помилка при додаванні студента:', err);
  }
}

async function updateStudent(id) {
  const newName = prompt('Введіть нове імʼя студента:');
  if (!newName) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName })
    });
    await res.json();
    await getStudents();
  } catch (err) {
    console.error('Помилка при оновленні студента:', err);
  }
}

async function deleteStudent(id) {
  if (!confirm('Ви хочете видалити цього студента?')) return;

  try {
    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    await getStudents();
  } catch (err) {
    console.error('Помилка при видаленні студента:', err);
  }
}

getBtn.addEventListener('click', getStudents);
form.addEventListener('submit', addStudent);
