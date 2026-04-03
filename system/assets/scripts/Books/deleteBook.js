const apiD = "/BSIT-2E-G1-Group4-MyLibrary/backend/controllers/book.php";
function drop(book_id, index) {

    Swal.fire({
        title: "Are you sure?",
        text: "This book will be permanently deleted!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#d33"
    }).then((result) => {

        if (result.isConfirmed) {

            $.ajax({
                url: apiD,
                type: "POST",
                data: { action: "drop", book_id: book_id },
                dataType: "json",

                success: function(response) {

                    if (response.status === "success") {

                        Swal.fire({
                            icon: "success",
                            title: "Deleted!",
                            text: "Book deleted successfully.",
                            timer: 1500,
                            showConfirmButton: false
                        });

                        books.splice(index, 1);
                        $("#bookContainer").children().eq(index).remove();

                        let myModal = bootstrap.Modal.getInstance(
                            document.getElementById('bookDetailsModal')
                        );
                        myModal.hide();

                    } else {

                        Swal.fire({
                            icon: "error",
                            title: "Failed",
                            text: response.message
                        });

                    }
                },

                error: function(error) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: error.responseText
                    });
                }
            });

        }

    });
}