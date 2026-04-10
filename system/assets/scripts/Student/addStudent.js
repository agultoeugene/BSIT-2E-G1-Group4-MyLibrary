const api = "/BSIT-2E-G1-Group4-MyLibrary/backend/controllers/student.php";

let students = [];
let editRow = null;


function storeWithValidation() {

    let studentNumber = $("#studentNumber").val().trim();
    let email = $("#email").val().trim();

    if (studentNumber === "") {
        $("#errStudentNumber").text("Student number is required");
        return;
    }

    $.ajax({
        url: api,
        type: "GET",
        data: { 
            action: "checkStudentNumber", 
            student_number: studentNumber 
        },
        dataType: "json",
        success: function(response) {

            if (response.status === "exists") {
                $("#errStudentNumber").text("This student number already exists");
                return;
            }

  
            if (email !== "") {
                if (!email.includes("@")) {
                    $("#errEmail").text("Invalid email format");
                    return;
                }
            }

            store();
        },
        error: function(err) {
            console.error("Error checking student number:", err);
        }
    });
}


function store() {

    let fname = $("#firstName").val().trim();
    let lname = $("#lastName").val().trim();
    let stud_number =($("#studentNumber").val().trim());
    let email = $("#email").val().trim();
    let year = $("#yearGrade").val().trim();
    let sectionId = parseInt($("#section_id").val());
    let sectionName = $("#section_id option:selected").text();
    let course = parseInt($("#course_id").val());

    let isValid = true;

    // clear errors
    $("#errFirstName, #errLastName, #errStudentNumber, #errEmail, #errYearGrade, #errSection, #errCourse").text("");

    // validation
    if (fname === "") {
        $("#errFirstName").text("Student Firstname is required");
        isValid = false;
    }

    if (lname === "") {
        $("#errLastName").text("Student Lastname is required");
        isValid = false;
    }

    if (isNaN(stud_number)) {
        $("#errStudentNumber").text("Student number must be a number");
        isValid = false;
    }

    if (email === "") {
        $("#errEmail").text("Email is required");
        isValid = false;
    } else if (!email.includes("@")) {
        $("#errEmail").text("Invalid email format");
        isValid = false;
    }

    if (year === "") {
        $("#errYearGrade").text("Year / Grade is required");
        isValid = false;
    }

    if (parseInt(year) <= 0 || parseInt(year) >= 6) {
        $("#errYearGrade").text("Invalid year");
        isValid = false;
    }
      if (isNaN(year)) {
        $("#errYearGrade").text("Invalid year");
        isValid = false;
    }

    if (!sectionId) {
        $("#errSection").text("Section is required");
        isValid = false;
    }

    if (!course) {
        $("#errCourse").text("Course/Strand is required");
        isValid = false;
    }

    if (!isValid) return;

    let payload = {
        fname: fname,
        lname: lname,
        stud_number: stud_number,
        email: email,  
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

            if (response.status === "success") {

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

        error: function(jqXHR, textStatus, errorThrown) {
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

    clearForm();

    $("#modalTitle").text("Add New Student");

    $("#addBtn").show();
    $("#saveBtn").hide();

    loadCourses();

    let modal = new bootstrap.Modal(document.getElementById("addStudentModal"));
    modal.show();
}


function clearForm() {

    $("#firstName").val("");
    $("#lastName").val("");
    $("#studentNumber").val("");
    $("#email").val("");
    $("#yearGrade").val("");
    $("#section_id").val("");
    $("#course_id").val("");
    $("#studentId").val("");

    $("#errFirstName, #errLastName, #errStudentNumber, #errEmail, #errYearGrade, #errSection, #errCourse").text("");
}


$("#firstName").on("input", () => $("#errFirstName").text(""));
$("#lastName").on("input", () => $("#errLastName").text(""));
$("#studentNumber").on("input", () => $("#errStudentNumber").text(""));
$("#email").on("input", () => $("#errEmail").text(""));
$("#yearGrade").on("input", () => $("#errYearGrade").text(""));

$("#course_id").on("change", () => $("#errCourse").text(""));
$("#section_id").on("change", () => $("#errSection").text(""));


function loadCourses() {

    const courseSelect = $("#course_id");

    courseSelect.empty();

    $.ajax({
        url: api,
        type: "GET",
        data: { action: "get_courses" },
        dataType: "json",
        success: function(response) {

            if (response.status === "success") {

                response.data.forEach(course => {
                    courseSelect.append(
                        `<option value="${course.course_id}">${course.course_name}</option>`
                    );
                });

                courseSelect.prepend('<option value="" selected disabled>Select Course / Strand</option>');
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