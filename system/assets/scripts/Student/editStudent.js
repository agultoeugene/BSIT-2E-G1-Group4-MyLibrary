const APIU = "/BSIT-2E-G1-Group4-MyLibrary/backend/controllers/student.php";
function edit(id) {
    $.ajax({
        url: APIU,
        type: "GET",
        data: "action=getOne&id=" + id,
        dataType: "json",
        success: function(response) {
            if (response.status === "success") {
                let modal = new bootstrap.Modal(document.getElementById("addStudentModal"));

                $("#modalTitle").text("Edit Student");
                $("#firstName").val(response.data.fname);
                $("#lastName").val(response.data.lname);
                $("#studentNumber").val(response.data.student_number);
                $("#yearGrade").val(response.data.year_level);
                $("#studentId").val(response.data.student_id);

                // pass the selected course to loadCourses
                loadCourses(response.data.course_id, function() {
                    $("#course_id").val(response.data.course_id);
                });

                // pass the selected section to loadSections
                loadSections(response.data.section_id, function() {
                    $("#section_id").val(response.data.section_id);
                });

                $("#saveBtn").show();
                $("#addBtn").hide();

                modal.show();
            }
        }
    });
}
function update() {
    let payload = {
        fname: $("#firstName").val().trim(),
        lname: $("#lastName").val().trim(),
        stud_number: parseInt($("#studentNumber").val().trim()),
        year: $("#yearGrade").val().trim(),
        course: parseInt($("#course_id").val()), 
        section_name: $("#section_id option:selected").text().trim()
    };

    let id = $("#studentId").val();
    let isValid = true;
    $(".error").text("");

    if (payload.fname === "") { $("#errFirstName").text("First name required"); isValid = false; }
    if (payload.lname === "") { $("#errLastName").text("Last name required"); isValid = false; }
    if (!payload.stud_number) { $("#errStudentNumber").text("Student number required"); isValid = false; }
    if (payload.year === "") { $("#errYearGrade").text("Year required"); isValid = false; }
    if (parseInt(payload.year) <=0 || parseInt(payload.year) >= 6) { $("#errYearGrade").text("Invalid year"); isValid = false; }
    if (!payload.course) { $("#errCourse").text("Course required"); isValid = false; }

    if (!isValid) return;

    // Check uniqueness before updating
    checkStudentNumberUnique(payload.stud_number, id, function(isUnique) {
        if (!isUnique) {
            $("#errStudentNumber").text("Student number already exists!");
            return;
        }

        // Proceed with update
       $.ajax({
    url: APIU,
    type: "POST",
    data: {
        action: "update",
        id: id,
        payload: JSON.stringify(payload)
    },
    dataType: "json",

    success: function(response) {

        if (response.status === "success") {

            Swal.fire({
                icon: "success",
                title: "Updated!",
                text: response.message,
                timer: 1500,
                showConfirmButton: false
            });

            let modalEl = document.getElementById("addStudentModal");
            let modal = bootstrap.Modal.getInstance(modalEl);
            modal.hide();

            get(); // refresh student list

        } else {

            Swal.fire({
                icon: "error",
                title: "Update Failed",
                text: response.message
            });

        }
    },

    error: function(err) {
        console.error(err);

        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to update student."
        });
    }
});
    });
}
function loadCourses(selectedCourseId = null, callback = null) {
    $.ajax({
        url: APIU,
        type: "GET",
        data: { action: "get_courses" },
        dataType: "json",
        success: function(response) {
            if(response.status === "success") {
                const courseSelect = $("#course_id");
                courseSelect.empty();
                courseSelect.append('<option value="" disabled selected>Select Course / Strand</option>');

                response.data.forEach(course => {
                    courseSelect.append(`
                        <option value="${course.course_id}">
                            ${course.course_name}
                        </option>
                    `);
                });

                if(selectedCourseId !== null) {
                    courseSelect.val(selectedCourseId);
                }

                if(callback) callback(); 
            } else {
                alert("Failed to load courses.");
            }
        },
        error: function(err) {
            console.error("Error loading courses:", err);
        }
    });
}
function loadSections(selectedSectionId = null, callback = null) {
    $.ajax({
        url: APIU,
        type: "GET",
        data: { action: "get_sections" },
        dataType: "json",
        success: function(response) {
            if(response.status === "success") {
                const sectionSelect = $("#section_id");
                sectionSelect.empty();
                sectionSelect.append('<option value="" disabled>Select Section</option>');

                response.data.forEach(section => {
                    sectionSelect.append(`
                        <option value="${section.section_id}">
                            ${section.section_name}
                        </option>
                    `);
                });

                if(selectedSectionId !== null) {
                    sectionSelect.val(selectedSectionId);
                }

                if(callback) callback();
            } else {
                alert("Failed to load sections.");
            }
        },
        error: function(err) {
            console.error("Error loading sections:", err);
        }
    });
}
function checkStudentNumberUnique(stud_number, studentId, callback) {
    $.ajax({
        url: APIU,
        type: "GET",
        data: {
            action: "check_student_number",
            stud_number: stud_number,
            id: studentId 
        },
        dataType: "json",
        success: function(response) {
            callback(response.is_unique); 
        },
        error: function(err) {
            console.error("Error checking student number:", err);
            callback(false);
        }
    });
}