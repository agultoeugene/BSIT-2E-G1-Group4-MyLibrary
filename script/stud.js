let students = [];
let editRow = null;
function addStudent() {
    let name = document.getElementById("studentName").value.trim();
    let number = document.getElementById("studentNumber").value.trim();
    let yearGrade = document.getElementById("yearGrade").value.trim();
    let course = document.getElementById("course").value.trim();
    let college = document.getElementById("college").value.trim();

    let errName = document.getElementById("errStudentName");
    let errNumber = document.getElementById("errStudentNumber");
    let errYear = document.getElementById("errYearGrade");
    let errCourse = document.getElementById("errCourse");
    let errCollege = document.getElementById("errCollege");
    
    let isValid = true;

    errName.innerText = "";
    errNumber.innerText = "";
    errYear.innerText = "";
    errCollege.innerText = "";
    errCourse.innerText = "";

    if (name === "") { errName.innerText = "Student name is required"; isValid = false; }
    if (number === "") { errNumber.innerText = "Student number is required"; isValid = false; }
    if (yearGrade === "") { errYear.innerText = "Year / Grade is required"; isValid = false; }
    if (college === "") { errCollege.innerText = "College is required"; isValid = false; }
    if (course === "") { errCourse.innerText = "Course/Strand is required"; isValid = false; }


    if (!isValid) return; 

    students.push({ name, number, yearGrade, course, college });
    let table = document.getElementById("studentTableBody");

    let row = `
    <tr>
    <td class="text-center">${name}</td>
    <td class="text-center">${number}</td>
    <td class="text-center">${yearGrade}</td>
    <td class="text-center">${course}</td>
    <td class="text-center">${college}</td>
    <td class="text-center">
         <button class="btn btn-success btn-sm" style="width:70px;" onclick="editStudent(this)">
             Edit
        </button>
        <button class="btn btn-danger btn-sm" style="width:70px;" onclick="deleteStudent(this)">
            Delete
        </button>
    </td>
    </tr>
    `;

    table.innerHTML += row;

    clearForm();
    const modalEl = document.getElementById("addStudentModal");
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    modalInstance.hide();
}

function editStudent(button) {

    editRow = button.closest("tr");

    document.getElementById("studentName").value = editRow.cells[0].innerText;
    document.getElementById("studentNumber").value = editRow.cells[1].innerText;
    document.getElementById("yearGrade").value = editRow.cells[2].innerText;
    document.getElementById("course").value = editRow.cells[3].innerText;
    document.getElementById("college").value = editRow.cells[4].innerText;

    const modal = new bootstrap.Modal(document.getElementById("addStudentModal"));
    modal.show();

    document.getElementById("saveBtn").style.display = "block";
    document.getElementById("addBtn").style.display = "none";
}

function saveStudent() {

    let name = document.getElementById("studentName").value.trim();
    let number = document.getElementById("studentNumber").value.trim();
    let yearGrade = document.getElementById("yearGrade").value.trim();
    let course = document.getElementById("course").value.trim();
    let college = document.getElementById("college").value.trim();

    let errName = document.getElementById("errStudentName");
    let errNumber = document.getElementById("errStudentNumber");
    let errYear = document.getElementById("errYearGrade");
    let errCollege = document.getElementById("errCollege");
    let errCourse = document.getElementById("errCourse");

    let isValid = true;

    errName.innerText = "";
    errNumber.innerText = "";
    errYear.innerText = "";
    errCollege.innerText = "";
    errCourse.innerText = "";

    if (name === "") { errName.innerText = "Student name is required"; isValid = false; }
    if (number === "") { errNumber.innerText = "Student number is required"; isValid = false; }
    if (yearGrade === "") { errYear.innerText = "Year / Grade is required"; isValid = false; }
    if (college === "") { errCollege.innerText = "College is required"; isValid = false; }
    if (course === "") { errCourse.innerText = "Course/Strand  is required"; isValid = false; }
    if (!isValid) return;

    editRow.cells[0].innerText = name;
    editRow.cells[1].innerText = number;
    editRow.cells[2].innerText = yearGrade;
    editRow.cells[3].innerText = course;
    editRow.cells[4].innerText = college;

    const modalEl = document.getElementById("addStudentModal");
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    modalInstance.hide();

    clearForm();

    document.getElementById("saveBtn").style.display = "none";
    document.getElementById("addBtn").style.display = "block";
}

function clearForm(){
    document.getElementById("studentName").value = "";
    document.getElementById("studentNumber").value = "";
    document.getElementById("yearGrade").value = "";
    document.getElementById("course").value = "";
    document.getElementById("college").value = "";
    

    document.getElementById("errStudentName").innerText = "";
    document.getElementById("errStudentNumber").innerText = "";
    document.getElementById("errYearGrade").innerText = "";
    document.getElementById("errCollege").innerText = "";
    document.getElementById("errCourse").innerText = "";
}
document.getElementById("studentName").addEventListener("input", () => {
    const err = document.getElementById("errStudentName");
    if (err.innerText !== "") err.innerText = "";
});

document.getElementById("studentNumber").addEventListener("input", () => {
    const err = document.getElementById("errStudentNumber");
    if (err.innerText !== "") err.innerText = "";
});

document.getElementById("yearGrade").addEventListener("input", () => {
    const err = document.getElementById("errYearGrade");
    if (err.innerText !== "") err.innerText = "";
});

document.getElementById("college").addEventListener("input", () => {
    const err = document.getElementById("errCollege");
    if (err.innerText !== "") err.innerText = "";
});
document.getElementById("course").addEventListener("input", () => {
    const err = document.getElementById("errCourse");
    if (err.innerText !== "") err.innerText = "";
});
const addModalEl = document.getElementById("addStudentModal");
addModalEl.addEventListener("hidden.bs.modal", clearForm);

document.addEventListener("DOMContentLoaded", function () {
    renderStudents();
});

function deleteStudent(button){

    let row = button.parentElement.parentElement;

    row.remove();

}

function renderStudents(filteredStudents = students) {

    const container = document.getElementById("studentContainer");
    container.innerHTML = "";

    if (filteredStudents.length === 0) {
        container.innerHTML = `
        <div class="col-12 text-center mt-5 text-muted">
            <i class="bi bi-people-fill" style="font-size:3rem;"></i>
            <h5 class="mt-3">No students found</h5>
        </div>`;
        return;
    }

    filteredStudents.forEach((student, index) => {

        const studentCard = `
        <div class="col-md-4">
            <div class="card h-100 shadow-sm border-0 bg-light">
                <div class="card-body">

                    <div class="d-flex align-items-center mb-3">
                        <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                             style="width:45px;height:45px;">
                             ${student.name.charAt(0).toUpperCase()}
                        </div>

                        <div class="ms-3">
                            <h6 class="mb-0 fw-bold">${student.name}</h6>
                            <small class="text-muted">${student.number}</small>
                        </div>
                    </div>

                    <p class="mb-1 small"><strong>College:</strong> ${student.college}</p>
                    <p class="mb-3 small"><strong>Year:</strong> ${student.yearGrade}</p>

                </div>
            </div>
        </div>
        `;

        container.insertAdjacentHTML("beforeend", studentCard);
    });

}

function handleLiveSearch(event) {

    const term = event.target.value.toLowerCase().trim();

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(term) ||
        student.number.toLowerCase().includes(term) ||
        student.college.toLowerCase().includes(term) ||
        student.yearGrade.toLowerCase().includes(term)
    );

    renderStudents(filteredStudents);
}

