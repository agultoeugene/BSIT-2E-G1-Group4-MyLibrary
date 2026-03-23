const apiD = "/BSIT-2E-G1-Group4-MyLibrary/backend/controllers/book.php";
function drop(book_id, index) {
    if (confirm("Are you sure you want to delete this book?")) {
        $.ajax({
            url: apiD,
            type: "POST",
            data: { action: "drop", book_id: book_id },
            dataType: "json",
            success: function(response) {
              
                if (response.status === "success") {
                    alert("Book deleted successfully!");
                    books.splice(index, 1);
                    $("#bookContainer").children().eq(index).remove();
                    let myModal = bootstrap.Modal.getInstance(document.getElementById('bookDetailsModal'));
                    myModal.hide();
             
                } else {
                    alert("Failed to delete book: " + resp.message);
                }
            },
            error: function(error) {
                alert("Error deleting book: " + error.responseText);
            }
        });
    }
}