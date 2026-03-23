const api = "/BSIT-2E-G1-Group4-MyLibrary/backend/controllers/book.php";
get();
let books = []; 
function get() {
     let container = $("#bookContainer");
    $.ajax({
        url : api,
        type : "GET",
        data : "action=get",
        success : function(response){

            let resp = JSON.parse(response);

           if (resp.status == "success") {
                books = resp.data;
                displayBooks(books);
            } else {
                container.html("<p>No books found.</p>");
            }
        },
        error : function (error)
         {
            alert(error);
         }
    })
}

function displayBooks(bookList) {
    let container = $("#bookContainer");
    container.html("");

    bookList.forEach(function(book, index) {
        let badgeClass = book.availability === "Available" ? "bg-success" : "bg-danger";
        let quantityColor = book.quantity > 0 ? "green" : "red";

        container.append(`
            <div class="col-12 col-md-6 col-lg-4 d-flex justify-content-center mb-3">
                <div class="card shadow-sm" style="cursor:pointer;" onclick="showBookModal(${index})">
                    <img src="${book.cover}" class="card-img-top book-img">
                    <div class="card-body text-center">
                        <h5>${book.title}</h5>
                        <p><strong>Author:</strong> ${book.author}</p>
                        <p><strong>Quantity:</strong> <span style="color:${quantityColor}">${book.quantity}</span></p>
                        <p><strong>Status:</strong> <span class="badge ${badgeClass}">${book.availability}</span></p>
                    </div>
                </div>
            </div>
        `);
    });
}
function showBookModal(index) {
    let book = books[index];

    $("#viewCover").attr("src", book.cover);
    $("#viewTitle").text(book.title);
    $("#viewAuthor").text(book.author);
    $("#viewIsbn").text(book.isbn);
    $("#viewGenre").text(book.genre);
    $("#viewLocation").text(book.location);
    $("#viewPublisher").text(book.publisher);
    $("#viewDescription").text(book.description);

    const statusEl = $("#viewStatus");

    statusEl.text(book.availability);
    if (book.availability === "Available") {
        statusEl.css({ color: "green", fontWeight: "bold" });
    } else {
        statusEl.css({ color: "red", fontWeight: "bold" });
    }


    let deleteBtnContainer = $("#deleteBookBtnContainer");
    deleteBtnContainer.html(`
        <button class="btn btn-danger" onclick="drop(${book.book_id}, ${index})">Delete Book</button>
        <button class="btn btn-primary btn-action me-2" onclick="editBook(${book.book_id})">Edit Book</button>
    `);

    let myModal = new bootstrap.Modal(document.getElementById('bookDetailsModal'));
    myModal.show();
}
function searchBooks(query) {
    if (!query.trim()) {
        displayBooks(books);
        return;
    }

    const searchTerm = query.toLowerCase();
    const filteredBooks = books.filter(book => {
        return (
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            book.genre.toLowerCase().includes(searchTerm) ||
            book.isbn.toLowerCase().includes(searchTerm) ||
            book.publisher.toLowerCase().includes(searchTerm) ||
            book.location.toLowerCase().includes(searchTerm) ||
            book.availability.toLowerCase().includes(searchTerm) ||
            book.description.toLowerCase().includes(searchTerm)
        );
    });

    displaySearchResults(filteredBooks, query);
}

function displaySearchResults(filteredBooks, query) {
    let container = document.getElementById("bookContainer");
    container.innerHTML = "";

    if (filteredBooks.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center mt-5">
                <h4 class="text-muted">Books not found</h4>
                <p class="text-secondary">No books match your search for "${query}"</p>
                <button class="btn btn-primary mt-3" onclick="clearSearch()">Clear Search</button>
            </div>
        `;
        return;
    }

    filteredBooks.forEach((book, originalIndex) => {
        let actualIndex = books.indexOf(book);
        let badgeClass = "";
        if (book.availability === "Available") badgeClass = "bg-success";
        else if (book.availability === "Not Avilable") badgeClass = "bg-danger";

        container.innerHTML += `
            <div class="col-12 col-md-6 col-lg-4 d-flex justify-content-center mb-3">
                <div class="card shadow-sm" style="cursor:pointer;" onclick="showBookModal(${actualIndex})">
                    <img src="${book.cover}" class="card-img-top book-img">
                    <div class="card-body text-center">
                        <h5>${book.title}</h5>
                        <p><strong>Author:</strong> ${book.author}</p>
                        <p><strong>:</strong> ${book.author}</p>
                        <p><strong>Quantity:</strong> ${book.quantity}</p>
                        <p><strong>Status:</strong> <span class="badge ${badgeClass}">${book.availability}</span></p>
                    </div>
                </div>
            </div>
        `;
    });
}

function clearSearch() {
    let searchInputs = document.querySelectorAll("input[type='search']");
    searchInputs.forEach(input => input.value = "");
    displayBooks(books);
}

function handleLiveSearch(event) {
    let query = event.target.value.trim();
    searchBooks(query);
}

function handleSearch(event, isFromDashboard = false) {
    event.preventDefault();
    let searchInput = event.target.querySelector("input[type='search']");
    let query = searchInput.value.trim();

    if (isFromDashboard && query) {
        window.location.href = "/BSIT-2E-G1-Group4-MyLibrary/pages/book.php?search=" + encodeURIComponent(query);
    }
}

function executeSearchFromURL() {
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get("search");

    if (searchQuery) {
        let searchInputs = document.querySelectorAll("input[type='search']");
        searchInputs.forEach(input => input.value = searchQuery);
        searchBooks(searchQuery);
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", executeSearchFromURL);
} else {
    executeSearchFromURL();
}

