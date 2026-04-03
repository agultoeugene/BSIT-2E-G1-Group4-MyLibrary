const api = "/BSIT-2E-G1-Group4-MyLibrary/backend/controllers/book.php";
get();
let books = []; 
function get() {
    return new Promise((resolve, reject) => {
        let container = $("#bookContainer");
        $.ajax({
            url: api,
            type: "GET",
            data: "action=get",
            success: function(response) {
                let resp = JSON.parse(response);
                if (resp.status == "success") {
                    books = resp.data;
                    displayBooks(books);
                    resolve(books); 
                } else {      
                    container.html("<p>No books found.</p>");
                    resolve([]); 
                }
            },
            error: function(error) {
                alert(error);
                reject(error);
            }
        });
    });
}

function displayBooks(bookList) {
    let container = $("#bookContainer");
    container.html("");

    bookList.forEach(function(book, index) {
        const isAvailable = book.quantity > 0; 
        let badgeClass = isAvailable ? "bg-success" : "bg-danger";
        let statusText = isAvailable ? "Available" : "Unavailable";
        let quantityColor = book.quantity > 0 ? "green" : "red";

        container.append(`
            <div class="col-12 col-md-6 col-lg-4 d-flex justify-content-center mb-3">
                <div class="card shadow-sm" style="cursor:pointer;" onclick="showBookModal(${index})">
                    <img src="${book.cover}" class="card-img-top book-img">
                    <div class="card-body text-center">
                        <h5>${book.title}</h5>
                        <p><strong>Author:</strong> ${book.author}</p>
                        <p><strong>Quantity:</strong> <span style="color:${quantityColor}">${book.quantity}</span></p>
                        <p><strong>Status:</strong> <span class="badge ${badgeClass}">${statusText}</span></p>
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
    const isAvailable = book.quantity > 0; 
        let badgeClass = isAvailable ? "bg-success" : "bg-danger";
        let statusText = isAvailable ? "Available" : "Unavailable";
        let quantityColor = book.quantity > 0 ? "green" : "red";

    statusEl.html(`<span class="badge ${badgeClass}">${statusText}</span>`);
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

   filteredBooks.forEach((book) => {
    let actualIndex = books.indexOf(book);

    const isAvailable = book.quantity > 0;
    let badgeClass = isAvailable ? "bg-success" : "bg-danger";
    let statusText = isAvailable ? "Available" : "Unavailable";

    container.innerHTML += `
        <div class="col-12 col-md-6 col-lg-4 d-flex justify-content-center mb-3">
            <div class="card shadow-sm" style="cursor:pointer;" onclick="showBookModal(${actualIndex})">
                <img src="${book.cover}" class="card-img-top book-img">
                <div class="card-body text-center">
                    <h5>${book.title}</h5>
                    <p><strong>Author:</strong> ${book.author}</p>
                    <p><strong>Quantity:</strong> 
                        <span style="color:${isAvailable ? 'green' : 'red'}">${book.quantity}</span>
                    </p>
                     <p><strong>Status:</strong> <span class="badge ${badgeClass}">${statusText}</span></
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

function handleSearch(event) {
    event.preventDefault();

    
    let searchInput = event.target.querySelector("input[type='search']");
    if (!searchInput) return;

    let query = searchInput.value.trim();
    if (!query) return;


    const currentPage = window.location.pathname.split("/").pop(); 

    if (currentPage !== "student.php") {
        window.location.href = "/BSIT-2E-G1-Group4-MyLibrary/system/pages/book.php?search=" + encodeURIComponent(query);
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
$(document).ready(function() {
    get().then(() => {
    
        executeSearchFromURL();
    });
});