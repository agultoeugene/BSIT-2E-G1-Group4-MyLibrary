
const API = "/Library/backend/controllers/student.php";
let stud = []; 
// Function to get the student record from the backend
function get(){
     $.ajax({
    url: API,  
    type: 'GET',
    data: { action: "get" },
    dataType: 'json',
    success: function(response) {
      
        if (response.status === 'success') {
            stud = response.data;
            displayStudents(stud);
        } else {
            console.error("Failed to fetch students:", response.message);
        }
    },
    error: function(xhr, status, error) {
        console.error("AJAX Error:", status, error, xhr.responseText);
    }
});
}
// Function to display student
function displayStudents(studentList) {
    let container = $("#studentTableBody");
    container.empty();

    if (studentList.length === 0) {
        container.html("<tr><td colspan='6' class='text-center'>No students match record.</td></tr>");
        return;
    }

    studentList.forEach(student => {
        container.append(createStudentRow(student));
    });
}
// function to create the table
function createStudentRow(student) {
    return `
<tr>
    <td class="text-center">${student.name}</td>
    <td class="text-center">${student.student_number}</td>
    <td class="text-center">${student.year}${student.section}</td>
    <td class="text-center">${student.course}</td>
    <td class="text-center">${student.department}</td>
     <td class="text-center">${student.email}</td>
    
    <td class="text-center">
        <div class="d-flex justify-content-center gap-1 flex-wrap">
            <button class="btn btn-success btn-sm student-action-btn" onclick="edit('${student.student_id}')"><span>Edit</span></button>
            <button class="btn btn-danger btn-sm student-action-btn" onclick="drop(this, '${student.student_number}')"><span>Delete</span></button>
            <button class="btn btn-primary btn-sm student-action-btn" onclick="goToBorrow('${student.student_id}')"><span>Borrow</span></button>
        </div>
    </td>
</tr>
`;
}
// Function to redirect the student to borrow
function goToBorrow(studentId) {
 
    const id = Number(studentId);
    const student = stud.find(s => Number(s.student_id) === id);
    if (!student) {
        alert("Student not found!");
        return;
    }

    const studentName = encodeURIComponent(student.name);

    window.location.href = `/Library/system/pages/borrow.php?student_id=${id}&student_name=${studentName}`;
}
// function to search student
function handleSearch(event, redirectToBook = false) {
    event.preventDefault();
    
    let input = event.target.querySelector("input[type='search']");
    let query = input.value.trim();

    if (!query) return;

    const currentPage = window.location.pathname.split("/").pop();

    if (currentPage === "student.php") {
        handleLiveStudentSearch({ target: input });
    } else {
        window.location.href = `/Library/system/pages/book.php?search=${encodeURIComponent(query)}`;
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
// function to ignore case the search input
function searchStudents(query) {
    if (!query.trim()) {
        displayStudents(stud);
        return;
    }

    const searchTerm = query.toLowerCase();
    const filteredStudents = stud.filter(student => {
        return (
            student.name?.toLowerCase().includes(searchTerm) ||
            student.student_number?.toString().toLowerCase().includes(searchTerm) ||
            student.year?.toString().toLowerCase().includes(searchTerm) ||
            student.course?.toLowerCase().includes(searchTerm) ||
            student.collage?.toLowerCase().includes(searchTerm)
        );
    });

    displayStudents(filteredStudents);
}
// function to handle live search
function handleLiveStudentSearch(event) {
    const query = event.target.value.trim();
    searchStudents(query);
}

// funtion to clear student search
function clearStudentSearch() {
    let searchInputs = document.querySelectorAll("input[type='search']");
    searchInputs.forEach(input => input.value = "");
    displayStudents(stud);
}


$(document).ready(function() {
    get();
});
