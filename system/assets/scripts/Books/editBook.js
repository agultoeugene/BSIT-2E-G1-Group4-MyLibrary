const apiE = "/BSIT-2E-G1-Group4-MyLibrary/backend/controllers/book.php";
let isEdit = false;
// Function to edit book
function editBook(id) {
    isEdit = true;
    
    let detailsModalEl = document.getElementById('bookDetailsModal');
    let detailsModal = bootstrap.Modal.getInstance(detailsModalEl);
    if (detailsModal) detailsModal.hide();
    let book = books.find(b => b.book_id == id);
    if(!book){
        alert("Book not found");
        return;
    }

    $(".modal-title").text("Edit Book");
    $("#book_id").val(book.book_id);
    $("#title").val(book.title);
    $("#author").val(book.author);
    $("#isbn").val(book.isbn);
    $("#genre").val(book.genre);
    $("#location").val(book.location);
    $("#publisher").val(book.publisher);
    $("#quantity").val(book.quantity);
    $("#description").val(book.description);
    $("#availability").val(book.availability || "Available");

   $("#originalCover").val(book.cover || ""); 
$("#coverPreview").attr("src", book.cover ? book.cover : "/BSIT-2E-G1-Group4-MyLibrary/system/assets/scripts/Books/placeholderimg/placeholder.png");


    let modal = new bootstrap.Modal(document.getElementById('addBookModal'));
    modal.show();
}
// funtion to save edit or to  update
function update() {
    let id = $("#book_id").val();
    let title = $("#title").val().trim();

    if (!title) {
        $("#errTitle").text("Book title is required");
        return;
    }

    // Step 1: Check for duplicate title
    $.ajax({
        url: apiE,
        type: "POST",
        data: { action: "checkDuplicateTitle", title: title },
        dataType: "json",
        success: function(res) {
            let currentBook = books.find(b => b.book_id == id);
            let isDuplicate = res.exists && currentBook && currentBook.title.toLowerCase() !== title.toLowerCase();

            if (isDuplicate) {
                Swal.fire({
                    icon: "warning",
                    title: "Duplicate Book",
                    text: "A book with this title already exists!"
                });
                return; // stop update
            }

            // Step 2: Prepare cover
            let fileInput = $("#cover")[0];
            let file = fileInput ? fileInput.files[0] : null;
            let originalCover = $("#originalCover").val();

            const sendUpdate = (coverData) => {
                let payload = {
                    cover: coverData,
                    title: $("#title").val(),
                    author: $("#author").val(),
                    isbn: $("#isbn").val(),
                    genre: $("#genre").val(),
                    location: $("#location").val(),
                    availability: $("#availability").val(),
                    publisher: $("#publisher").val(),
                    quantity: $("#quantity").val(),
                    description: $("#description").val()
                };

                $.ajax({
                    url: apiE,
                    type: "POST",
                    data: {
                        action: "update",
                        id: id,
                        payload: JSON.stringify(payload)
                    },
                    success: function(response){
                        let resp = JSON.parse(response);
                        if(resp.status === "success"){
                            Swal.fire({
                                icon: "success",
                                title: "Updated!",
                                text: resp.message,
                                confirmButtonText: "OK"
                            }).then(() => {
                                bootstrap.Modal.getInstance(
                                    document.getElementById('addBookModal')
                                ).hide();
                                $("#bookContainer").html("");
                                get(); // reload books
                            });
                        } else {
                            Swal.fire({
                                icon: "error",
                                title: "Update Failed",
                                text: resp.message
                            });
                        }
                    },
                    error: function(err){
                        console.log(err);
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: "Something went wrong!"
                        });
                    }
                });
            };

            if(file){
                let reader = new FileReader();
                reader.onload = function(e){
                    sendUpdate(e.target.result);
                };
                reader.readAsDataURL(file);
            } else {
                sendUpdate(originalCover);
            }

        },
        error: function(err){
            console.log(err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Could not check for duplicate title."
            });
        }
    });
}

function validateBookForm() {
    let quantity = Number($("#quantity").val());
    let isValid = true;

    // Clear previous errors
    $("#errQuantity").text("");

    if (isNaN(quantity) || quantity <= 0) {
        $("#errQuantity").text("Quantity must be greater than 0");
        isValid = false;
    }

    return isValid;
}

function saveBook() {
    if (isEdit) {
        update();
    } else {
        store();
    }
}
$('#addBookModal').on('show.bs.modal', function () {
    if(!isEdit){
        $("#book_id").val("");
        $("#title").val("");
        $("#author").val("");
        $("#isbn").val("");
        $("#genre").val("");
        $("#location").val("");
        $("#publisher").val("");
        $("#quantity").val("");
        $("#description").val("");
        $("#availability").val("Available");
        $("#coverPreview").attr("src", "/BSIT-2E-G1-Group4-MyLibrary/system/assets/scripts/Books/placeholderimg/placeholder.png");
        $("#originalCover").val("");
    }
});
$('#addBookModal').on('hidden.bs.modal', function () {
    isEdit = false;
});