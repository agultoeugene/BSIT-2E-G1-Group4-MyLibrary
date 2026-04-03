const api = "/BSIT-2E-G1-Group4-MyLibrary/backend/controllers/student.php";
let students = [];
let editRow = null;
function storeWithValidation() {
    let studentNumber = $("#studentNumber").val().trim();

    if (studentNumber === "") {
        $("#errStudentNumber").text("Student number is required");
        return;
    }

    $.ajax({
        url: api,
        type: "GET",
        data: { action: "checkStudentNumber", student_number: studentNumber },
        dataType: "json",
        success: function(response) {
            if (response.status === "exists") {
                $("#errStudentNumber").text("This student number already exists");
                return;
            } else {
                store();
            }
        },
        error: function(err) {
            console.error("Error checking student number:", err);
        }
    });
}
  function store() {
    let fname = $("#firstName").val().trim();
    let lname = $("#lastName").val().trim();
    let stud_number = parseInt($("#studentNumber").val().trim());
    let year = $("#yearGrade").val().trim();
    let sectionId = parseInt($("#section_id").val());
    let sectionName = $("#section_id option:selected").text(); 
    let course = parseInt($("#course_id").val()); 


    let isValid = true;
    $("#errFirstName, #errLastName, #errStudentNumber, #errYearGrade, #errSection, #errCourse").text("");

    if (fname === "") { $("#errFirstName").text("Student Firstname is required"); isValid = false; }
    if (lname === "") { $("#errLastName").text("Student Lastname is required"); isValid = false; }
    if (isNaN(stud_number)) { $("#errStudentNumber").text("Student number must be a number"); isValid = false; }
    if (year === "") { $("#errYearGrade").text("Year / Grade is required"); isValid = false; }
    if (parseInt(year) <=0 || parseInt(year) >= 6) { $("#errYearGrade").text("Invalid year"); isValid = false; }
    if (!sectionId) { $("#errSection").text("Section is required"); isValid = false; }
    if (!course) { $("#errCourse").text("Course/Strand is required"); isValid = false; }
    if (!isValid) return;

    let payload = {
        fname: fname,
        lname: lname,
        stud_number: stud_number,
        section_id: sectionId,
        section_name: sectionName,  
        year: year,
        course: course
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

            Swal.fire({
                icon: "success",
                title: "Success",
                text: response.message,
                confirmButtonText: "OK"
            }).then(() => {
                window.location.href = "/BSIT-2E-G1-Group4-MyLibrary/system/pages/student.php";
            });

        } else {

            Swal.fire({
                icon: "error",
                title: "Failed",
                text: "Failed to save student: " + response.message
            });

        }
    },

    error: function(jqXHR, textStatus, errorThrown){
        console.error(jqXHR, textStatus, errorThrown);

        Swal.fire({
            icon: "error",
            title: "AJAX Error",
            text: jqXHR.responseText
        });
    }
});
}
function openAddStudentModal() {
    clearForm(); // reset inputs and selects
    $("#modalTitle").text("Add New Student");

    $("#addBtn").show();
    $("#saveBtn").hide();

    loadCourses(); // load courses after reset

    let modal = new bootstrap.Modal(document.getElementById("addStudentModal"));
    modal.show();
}


function clearForm() {
    // Clear input values
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("studentNumber").value = "";
    document.getElementById("yearGrade").value = "";
    document.getElementById("section_id").value = "";
    document.getElementById("course_id").value = "";
    document.getElementById("studentId").value = "";

    // Clear error messages
    document.getElementById("errFirstName").innerText = "";
    document.getElementById("errLastName").innerText = "";
    document.getElementById("errStudentNumber").innerText = "";
    document.getElementById("errYearGrade").innerText = "";
    document.getElementById("errSection").innerText = "";
    document.getElementById("errCourse").innerText = "";
}

document.getElementById("firstName").addEventListener("input", () => {
    const err = document.getElementById("errFirstName");
    if (err.innerText !== "") err.innerText = "";
});

document.getElementById("lastName").addEventListener("input", () => {
    const err = document.getElementById("errLastName");
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


// For select dropdowns, use "change" instead of "input"
document.getElementById("course_id").addEventListener("change", () => {
    const err = document.getElementById("errCourse");
    if (err.innerText !== "") err.innerText = "";
});

document.getElementById("section_id").addEventListener("change", () => {
    const err = document.getElementById("errSection");
    if (err.innerText !== "") err.innerText = "";
});

function loadCourses() {
    const courseSelect = $("#course_id");

    // clear existing options
    courseSelect.empty();

    $.ajax({
        url: api,
        type: "GET",
        data: { action: "get_courses" },
        dataType: "json",
        success: function(response) {
            if(response.status === "success") {

                // add courses
                response.data.forEach(course => {
                    courseSelect.append(`<option value="${course.course_id}">${course.course_name}</option>`);
                });

                // add default option **after all courses**
                courseSelect.prepend('<option value="" selected disabled>Select Course / Strand</option>');
                
                // ensure default is selected
                courseSelect.val("");
            } else {
                alert("Failed to load courses.");
            }
        },
        error: function(err) {
            console.error("Error loading courses:", err);
        }
    });
}