const apiE = "/BSIT-2E-G1-Group4-MyLibrary/backend/controllers/book.php";
let isEdit = false;
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

function update() {
    let id = $("#book_id").val();
    let fileInput = $("#cover")[0];
    let file = fileInput ? fileInput.files[0] : null;
    let originalCover = $("#originalCover").val();
    let currentCover = $("#coverPreview").attr("src");

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
                timer: 1500,
                showConfirmButton: false
            });

            bootstrap.Modal.getInstance(
                document.getElementById('addBookModal')
            ).hide();

            $("#bookContainer").html("");
            get();

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
        // keep original cover if no new file uploaded
        sendUpdate(originalCover);
    }
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