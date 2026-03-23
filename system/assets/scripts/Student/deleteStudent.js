const APID = "/BSIT-2E-G1-Group4-MyLibrary/backend/controllers/student.php";
function drop(button, student_number) {
    if (!confirm("Are you sure you want to delete this student?")) return;

    $.ajax({
        url: APID,
        type: "POST",
        data: { action: "drop", student_number: student_number },
        dataType: "json",
        success: function(response) {
            if (response.status === "success") {
                alert(response.message);
                $(button).closest('tr').remove();

            } else {
                alert("Failed to delete student: " + response.message);
            }
        },
         error: function(error){
                alert(error.message);
            }
    });
}