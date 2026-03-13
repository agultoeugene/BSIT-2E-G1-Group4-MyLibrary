let students = [];

function addStudent() {
    let name = document.getElementById("studentName").value.trim();
    let number = document.getElementById("studentNumber").value.trim();
    let yearGrade = document.getElementById("yearGrade").value.trim();
    let course = document.getElementById("course").value.trim();
    let college = document.getElementById("college").value.trim();

    let errName = document.getElementById("errStudentName");
    let errNumber = document.getElementById("errStudentNumber");
    let errYear = document.getElementById("errYearGrade");
    let errCollege = document.getElementById("errCollege");

    let isValid = true;

    errName.innerText = "";
    errNumber.innerText = "";
    errYear.innerText = "";
    errCollege.innerText = "";

    if (name === "") { errName.innerText = "Student name is required"; isValid = false; }
    if (number === "") { errNumber.innerText = "Student number is required"; isValid = false; }
    if (yearGrade === "") { errYear.innerText = "Year / Grade is required"; isValid = false; }
    if (college === "") { errCollege.innerText = "College is required"; isValid = false; }

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
        <button class="btn btn-danger btn-sm" onclick="deleteStudent(this)">
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
const addModalEl = document.getElementById("addStudentModal");
addModalEl.addEventListener("hidden.bs.modal", clearForm);

function deleteStudent(button){

    let row = button.parentElement.parentElement;

    row.remove();

}

