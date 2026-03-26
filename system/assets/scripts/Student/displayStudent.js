
const API = "/BSIT-2E-G1-Group4-MyLibrary/backend/controllers/student.php";
let stud = []; 
function get(){
     $.ajax({
        url: API,  
        type: 'GET',
        data : "action=get",
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
               stud = response.data;
                displayStudents(stud);
            } else {
                alert("Failed to fetch students: " + response.message);
            }
        },
        error : function (error)
         {
            alert(error);
         }
    });
}
function displayStudents(studentList) {
    let container = $("#studentTableBody");
    container.empty();

    if (studentList.length === 0) {
        container.html("<tr><td colspan='6' class='text-center'>No students match your search.</td></tr>");
        return;
    }

    studentList.forEach(student => {
        container.append(createStudentRow(student));
    });
}

function createStudentRow(student) {
    return `
<tr>
    <td class="text-center">${student.name}</td>
    <td class="text-center">${student.student_number}</td>
    <td class="text-center">${student.year}</td>
    <td class="text-center">${student.course}</td>
    <td class="text-center">${student.college}</td>
    <td class="text-center">
        <button class="btn btn-success btn-sm" style="width:60px;" onclick="edit('${student.student_id}')">Edit</button>
        <button class="btn btn-danger btn-sm" style="width:60px;" onclick="drop(this, '${student.student_number}')">Delete</button>
        <button class="btn btn-primary btn-sm" style="width:60px;" onclick="goToBorrow('${student.student_id}')">Borrow</button>
    </td>
</tr>
`;
}
function goToBorrow(studentId) {
 
    const id = Number(studentId);

    const student = stud.find(s => Number(s.student_id) === id);
    if (!student) {
        alert("Student not found!");
        return;
    }

    const studentName = encodeURIComponent(student.name);

    window.location.href = `/BSIT-2E-G1-Group4-MyLibrary/system/pages/borrow.php?student_id=${id}&student_name=${studentName}`;
}
function handleSearch(event, redirectToBook = false) {
    event.preventDefault();
    
    let input = event.target.querySelector("input[type='search']");
    let query = input.value.trim();

    if (!query) return;

    const currentPage = window.location.pathname.split("/").pop();

    if (currentPage === "student.php") {
        handleLiveStudentSearch({ target: input });
    } else {
        window.location.href = `/BSIT-2E-G1-Group4-MyLibrary/system/pages/book.php?search=${encodeURIComponent(query)}`;
    }
}
window.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get("search");

    if (searchQuery) {
        const input = document.querySelector(".search-box input[type='search']");
        input.value = searchQuery;
        handleLiveSearch({ target: input });
    }
});

function searchStudents(query) {
    if (!query.trim()) {
        displayStudents(stud);
        return;
    }

    const searchTerm = query.toLowerCase();
    const filteredStudents = stud.filter(student => {
        return (
            student.name.toLowerCase().includes(searchTerm) ||
           student.student_number.toString().toLowerCase().includes(searchTerm) ||
            student.year.toLowerCase().includes(searchTerm) ||
            student.course.toLowerCase().includes(searchTerm) ||
            student.college.toLowerCase().includes(searchTerm)
        );
    });

    displayStudents(filteredStudents);
}


function handleLiveStudentSearch(event) {
    const query = event.target.value.trim();
    searchStudents(query);
}


function clearStudentSearch() {
    let searchInputs = document.querySelectorAll("input[type='search']");
    searchInputs.forEach(input => input.value = "");
    displayStudents(stud);
}


$(document).ready(function() {
    get();
});