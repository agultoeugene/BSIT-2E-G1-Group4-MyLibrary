const API = "/BSIT-2E-G1-Group4-MyLibrary/backend/controllers/book.php";
function store() {
    let title = $("#title").val().trim();
    let author = $("#author").val().trim();
    let isbn = $("#isbn").val().trim();
    let genre = $("#genre").val().trim();
    let location = $("#location").val().trim();
    let availability = $("#availability").val();
    let quantity = $("#quantity").val();
    let description = $("#description").val().trim();
    let publisher = $("#publisher").val().trim() || "Unknown";

    let errTitle = $("#errTitle");
    let errAuthor = $("#errAuthor");
    let errIsbn = $("#errIsbn");
    let errGenre = $("#errGenre");
    let errLoc = $("#errLoc");
    let errQuantity = $("#errQuantity");
    let errDesc = $("#errDesc");

    // Clear previous errors
    errTitle.text(""); errAuthor.text(""); errIsbn.text("");
    errGenre.text(""); errLoc.text(""); errQuantity.text(""); errDesc.text("");

    let isValid = true;

    if (title == "") { errTitle.text("Book title is required"); isValid = false; }
    if (author == "") { errAuthor.text("Author name is required"); isValid = false; }
    if (isbn == "") { errIsbn.text("Please enter the ISBN"); isValid = false; }
    if (genre == "") { errGenre.text("Please enter the Genre"); isValid = false; }
    if (location == "") { errLoc.text("Library Location is required"); isValid = false; }
    if (quantity === "" || isNaN(quantity) || Number(quantity) <= 0) { 
        errQuantity.text("Quantity is required and must be greater than 0!"); 
        isValid = false; 
    }
    if (description == "") { errDesc.text("Please enter the Short Description"); isValid = false; }

    if (!isValid) return;

$.ajax({
    url: API,
    type: "POST",
    data: {
        action: "checkDuplicateTitle",
        title: title
    },
    dataType: "json",
    success: function(res) {
        if(res.exists) {
            Swal.fire({
                icon: "warning",
                title: "Duplicate Book",
                text: "A book with this title already exists!"
            });
            return;
        } else {
            submitBook();
        }
    },
    error: function(err) {
        console.error(err);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Could not check for duplicate book title."
        });
    }
});

    function submitBook() {
        let fileInput = $("#cover")[0];
        let file = fileInput.files[0];
        let cover = "/BSIT-2E-G1-Group4-MyLibrary/system/assets/scripts/Books/placeholderimg/placeholder.png";

        const sendAjax = (coverData) => {
            let payload = {
                cover: coverData,
                title, author, isbn, genre, location, availability, quantity, publisher, description
            };
            $.ajax({
                url: API,
                type: "POST",
                data: { action: "store", payload: JSON.stringify(payload) },
                dataType: "json",
                success: function(response) {
                    if(response.status === "success") {
                        Swal.fire({
                            icon: "success",
                            title: "Success",
                            text: response.message,
                            confirmButtonText: "OK"
                        }).then(() => {
                            hideModalAndDisplayBook();
                            window.location.href = "/BSIT-2E-G1-Group4-MyLibrary/system/pages/book.php";
                        });
                    } else {
                        Swal.fire({ icon: "error", title: "Error", text: response.message });
                    }
                },
                error: function(error) { alert(error.message); }
            });
        }

        if(file){
            let reader = new FileReader();
            reader.onload = function(e){ sendAjax(e.target.result); }
            reader.readAsDataURL(file);
        } else {
            sendAjax(cover);
        }
    }
}

function hideModalAndDisplayBook() {
    const modalEl = $("#addBookModal");
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) modalInstance.hide();
}
function clearError(inputId, errorId) {
    const input = $(inputId);
    const error = $(errorId);

    input.on("input", function () {
        if ($(this).val().trim() !== "") {
            error.text("");
        }
    });
}
$(document).ready(function() {
    clearError("#title", "#errTitle");
    clearError("#author", "#errAuthor");
    clearError("#isbn", "#errIsbn");
    clearError("#genre", "#errGenre");
    clearError("#location", "#errLoc");
    clearError("#quantity", "#errQuantity");
    clearError("#description", "#errDesc");

     $("#addBookModal").on("hidden.bs.modal", function () {
        clearForm();
    });
});
function clearForm() {

    $("#title").val("");
    $("#author").val("");
    $("#isbn").val("");
    $("#genre").val("");
    $("#location").val("");
    $("#availability").val("Available");
    $("#quantity").val("");
    $("#publisher").val("");
    $("#description").val("");
    $("#cover").val("");

    $("#errTitle").text("");
    $("#errAuthor").text("");
    $("#errIsbn").text("");
    $("#errGenre").text("");
    $("#errLoc").text("");
    $("#errQuantity").text("");
    $("#errDesc").text("");
}