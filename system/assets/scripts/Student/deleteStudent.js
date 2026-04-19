const APID = "/Library/backend/controllers/student.php";
// Function to delete a student record
function drop(button, student_number) {

    Swal.fire({
        title: "Are you sure?",
        text: "This student will be permanently deleted!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#d33"
    }).then((result) => {

        if (!result.isConfirmed) return;

        $.ajax({
            url: APID,
            type: "POST",
            data: {
                action: "drop",
                student_number: student_number
            },
            dataType: "json",

            success: function(response) {

                if(response.status === "success") {

                    Swal.fire({
                        icon: "success",
                        title: "Deleted!",
                        text: response.message,
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => {
                        window.location.reload();
                    });

                } else {

                    Swal.fire({
                        icon: "error",
                        title: "Failed",
                        text: response.message
                    });

                }
            },

            error: function(err) {
                console.error(err);

                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Error deleting student."
                });
            }
        });

    });
}
