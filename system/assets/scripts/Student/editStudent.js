const APIU = "/BSIT-2E-G1-Group4-MyLibrary/backend/controllers/student.php";
function edit(id) {
    $.ajax({
        url: APIU,
        type: "GET",
        data: "action=getOne&id=" + id,
        dataType: "json",
        success: function(response) {

            if (response.status === "success") {

                let modal = new bootstrap.Modal(
                    document.getElementById("addStudentModal")
                );
                $("#modalTitle").text("Edit Student");
                $("#studentName").val(response.data.name);
                $("#studentNumber").val(response.data.student_number);
                $("#yearGrade").val(response.data.year);
                $("#course").val(response.data.course);
                $("#college").val(response.data.college);

                $("#studentId").val(response.data.student_id);

                $("#saveBtn").show();
                $("#addBtn").hide();

                modal.show();
            }
        }
    });
}
function update() {
    let payload = {
        name: $("#studentName").val().trim(),
        stud_number: $("#studentNumber").val().trim(),
        year: $("#yearGrade").val().trim(),
        course: $("#course").val().trim(),
        college: $("#college").val().trim()
    };

    let id = $("#studentId").val();

    let isValid = true;

    $(".error").text("");

    if (payload.name === "") {
        $("#errStudentName").text("Student name is required");
        isValid = false;
    }
    if (payload.stud_number === "") {
        $("#errStudentNumber").text("Student number is required");
        isValid = false;
    }

    if (payload.year === "") {
        $("#errYearGrade").text("Year / Grade is required");
        isValid = false;
    }
    if (payload.course === "") {
        $("#errCourse").text("Course is required");
        isValid = false;
    }
    if (payload.college === "") {
        $("#errCollege").text("College is required");
        isValid = false;
    }

    if (!isValid) return;
       isStudentNumberUnique(payload.stud_number, id, function(isUnique) {
    if (!isUnique) {
        $("#errStudentNumber").text("Student number already exists");
        return;
    }
    $.ajax({
        url: APIU,
        type: "POST",
        data: "action=update&id=" + id + "&payload=" + JSON.stringify(payload),
        dataType: "json",
        success: function(response) {

            alert(response.message);

            if (response.status === "success") {
                $("#addStudentModal").modal("hide");
                get();
            }
        }
    });
        });
}
function isStudentNumberUnique(stud_number, id = null, callback) {
    $.ajax({
        url: APIU,
        type: "GET",
        data: { action: "checkStudentNumber", student_number: stud_number, id: id },
        dataType: "json",
        success: function(response) {
            callback(response.isUnique);
        },
        error: function() {
            callback(false);
        }
    });
}