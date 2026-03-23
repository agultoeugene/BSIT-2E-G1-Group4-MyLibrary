const api = "/BSIT-2E-G1-Group4-MyLibrary/backend/controllers/student.php";
let students = [];
let editRow = null;

    function store() {
        let name = $("#studentName").val().trim();
        let stud_number = $("#studentNumber").val().trim();
        let year = $("#yearGrade").val().trim();
        let course = $("#course").val().trim();
        let college = $("#college").val().trim();

        let isValid = true;

        $("#errStudentName, #errStudentNumber, #errYearGrade, #errCourse, #errCollege").text("");

        if (name === "") { $("#errStudentName").text("Student name is required"); isValid = false; }
      if (stud_number === "") {
            $("#errStudentNumber").text("Student number is required");
            isValid = false;
        } else if (!/^\d+$/.test(stud_number)) {
            $("#errStudentNumber").text("Student number must be an integer");
            isValid = false;
        }
        if (year === "") { $("#errYearGrade").text("Year / Grade is required"); isValid = false; }
        if (course === "") { $("#errCourse").text("Course/Strand is required"); isValid = false; }
        if (college === "") { $("#errCollege").text("College is required"); isValid = false; }

        if (!isValid) return;
       isStudentNumberUnique(stud_number, null, function(isUnique) {
            if (!isUnique) {
                $("#errStudentNumber").text("Student number already exists");
                return;
            }

            let payload = {
                name: name,
                stud_number: stud_number,
                year:  year,
                course: course,
                college: college
            };

            $.ajax({
                url: api, 
                type: "POST",
                data: {
                    action: "store",
                    payload: JSON.stringify(payload)
                },
                dataType: "json",
                success: function(response) {
                    if(response.status === "success") {
                        alert(response.message); 
                        window.location.href = "/BSIT-2E-G1-Group4-MyLibrary/system/pages/student.php";
                    } else {
                        alert("Failed to save student: " + response.message);
                    }
                },
                error: function(error){
                    alert(error.message);
                }
         });
});
    }
function openAddStudentModal() {
    
    $("#studentName").val('');
    $("#studentNumber").val('');
    $("#yearGrade").val('');
    $("#course").val('');
    $("#college").val('');
    $("#studentId").val(''); 

   
    $(".error").text('');

    $("#modalTitle").text("Add New Student");

    $("#addBtn").show();
    $("#saveBtn").hide();

    let modal = new bootstrap.Modal(document.getElementById("addStudentModal"));
    modal.show();
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


