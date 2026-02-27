let books = [{
        cover: "https://m.media-amazon.com/images/I/91IOt4XgJoL._AC_UF1000,1000_QL80_.jpg",
        title: "The Great Adventurer",
        author: "R. E. Pritchard",
        isbn: "978-0001",
        genre: "Adventure",
        location: "Shelf A1",
        availability: "Available",
        publisher: "Pen and Sword History",
        dueDate: "",
        description: "An exciting journey through uncharted territories.",
    },
    {
        cover: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1626787181i/57517908.jpg",
        title: "Mystery of the Night Watchers",
        author: "A.M. Howell",
        isbn: "978-0002",
        genre: "Mystery",
        location: "Shelf B3",
        availability: "Borrowed",
        publisher: "Usborne Publishing Ltd",
        dueDate: "2026-03-05",
        description: "A mystery that keeps you guessing until the end.",
    },
    {
        cover: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1386626820i/19319366.jpg",
        title: "Learning JavaScript",
        author: "Mark Myers",
        isbn: "978-0003",
        genre: "Education",
        location: "Shelf C2",
        availability: "Available",
        publisher: "Tech Books",
        dueDate: "",
        description: "A comprehensive guide to mastering JavaScript programming.",
    },
    {
        cover: "https://m.media-amazon.com/images/I/91MKJwtI3XL._AC_UF1000,1000_QL80_.jpg",
        title: "History of the World",
        author: "Emma Marriott",
        isbn: "978-0004",
        genre: "History",
        location: "Shelf D1",
        availability: "Reserved",
        publisher: "History Press",
        dueDate: "",
        description: "Explore the major events and people that shaped our world.",
    },
    {
        cover: "https://m.media-amazon.com/images/I/51W7HRC923L._AC_UF1000,1000_QL80_.jpg",
        title: "101 Essential Tips: Microwave Cooking",
        author: "Sarah Brown",
        isbn: "978-0005",
        genre: "Cooking",
        location: "Shelf E4",
        availability: "Available",
        publisher: "Culinary House",
        dueDate: "",
        description: "Simple recipes and techniques for beginners in the kitchen.",
    },
    {
        cover: "https://walterfoster.com/wp-content/uploads/2025/05/7f86abfb-3ad6-46de-83a4-aa79016e2640-scaled.jpeg",
        title: "SUPER Science Experiments: At Home",
        author: "Elizabeth Snoke Harris",
        isbn: "978-0006",
        genre: "Science",
        location: "Shelf F2",
        availability: "Borrowed",
        publisher: "MoonDance Press",
        dueDate: "2026-02-28",
        description: "Fun and easy science experiments you can try at home.",
    },
    {
        cover: "https://img.perlego.com/book-covers/3592594/9781782837657.jpg",
        title: "The Artist Way",
        author: "Julia Cameron",
        isbn: "978-0007",
        genre: "Art",
        location: "Shelf G1",
        availability: "Available",
        publisher: "TarcherPerigee",
        dueDate: "",
        description: "Explore your artistic skills and creative thinking techniques.",
    },
    {
        cover: "https://cdn.kobo.com/book-images/2b60c58a-8c39-4314-b17a-ef4a56d2bb8b/353/569/90/False/the-martian-6.jpg",
        title: "The Martian",
        author: "Andy Weir",
        isbn: "978-0008",
        genre: "Science Fiction",
        location: "Shelf H3",
        availability: "Reserved",
        publisher: "Crown Publishing Group",
        dueDate: "",
        description: "After his crew mistakenly leaves him for dead during a dust storm, botanist Mark Watney must use his scientific ingenuity and wit to survive on the hostile surface of Mars.",
    },
    {
        cover: "https://www.hachettebookgroup.com/wp-content/uploads/2025/12/9781604697070.jpg",
        title: "The Well-Tended Perennial Garden",
        author: "Tracy DiSabato-Aust",
        isbn: "978-0009",
        genre: "Lifestyle",
        location: "Shelf I2",
        availability: "Available",
        publisher: "Timber Press",
        dueDate: "",
        description: "Learn how to grow beautiful plants and maintain your garden.",
    },
    {
        cover: "https://cdn1.bookmanager.com/i/m?b=VdT28uSLKvbdf2aCOEppyw&cb=1741405717",
        title: "The Miracle of Mindfulness",
        author: "Thich Nhat Hanh",
        isbn: "978-0010",
        genre: "Self-Help",
        location: "Shelf J1",
        availability: "Borrowed",
        publisher: "Beacon Press",
        dueDate: "2026-03-10",
        description: "Learn how to stay calm and happy every day just by paying attention to the simple things you are doing right now.",
    },
];

// Display books on page load
displayBooks();

function addBook() {
    let title = document.getElementById("title").value.trim();
    let author = document.getElementById("author").value.trim();
    let isbn = document.getElementById("isbn").value.trim();
    let genre = document.getElementById("genre").value.trim();
    let location = document.getElementById("location").value.trim();
    let availability = document.getElementById("availability").value;
    let description = document.getElementById("description").value.trim();
    let publisher = document.getElementById("publisher")?.value.trim() || "Unknown";
    let dueDate = document.getElementById("dueDate")?.value || "";


     var errTitle = document.getElementById("errTitle");
    var errAuthor = document.getElementById("errAuthor");
    var errIsbn = document.getElementById("errIsbn");
    var errGenre = document.getElementById("errGenre");
    var errLoc = document.getElementById("errLoc");
    var errDesc = document.getElementById("errDesc");
    let isValid = true;

    let fileInput = document.getElementById("cover");
    let file = fileInput.files[0];

    if (title == "") {
        errTitle.innerText = "Book title is required";
        isValid = false;
       
    }
    
    if (author == "") {
        errAuthor.innerText = "Author name is required";
        isValid = false;
    }

    if (isbn == "") {
        errIsbn.innerText = "Please enter the ISBN";
        isValid = false;
    }

     if (genre == "") {
        errGenre.innerText = "Please enter the Genre";
        isValid = false;
    }
      if (location == "") {
        errLoc.innerText = "Library Location is required";
        isValid = false;
    }

      if (description == "") {
        errDesc.innerText = "Please enter the Short Description";
        isValid = false;
    }

    if (!isValid) {
        return;
    }


    // Use placeholder if no file uploaded
    let cover = "https://via.placeholder.com/300x400";
    if (file) {
        let reader = new FileReader();
        reader.onload = function(e) {
            saveBook(
                e.target.result,
                title,
                author,
                isbn,
                genre,
                location,
                availability,
                publisher,
                dueDate,
                description
            );
        };
        reader.readAsDataURL(file);
    } else {
        saveBook(
            cover,
            title,
            author,
            isbn,
            genre,
            location,
            availability,
            publisher,
            dueDate,
            description
        );
    }
}

function saveBook(
    cover,
    title,
    author,
    isbn,
    genre,
    location,
    availability,
    publisher,
    dueDate,
    description
) {
    books.push({
        cover,
        title,
        author,
        isbn,
        genre,
        location,
        availability,
        publisher,
        dueDate,
        description
    });

    displayBooks();
    clearForm();

    const modalEl = document.getElementById("addBookModal");
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    modalInstance.hide(); 
}
function clearForm() {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
    document.getElementById("genre").value = "";
    document.getElementById("location").value = "";
    document.getElementById("availability").value = "Available";
    document.getElementById("publisher").value = "";
    document.getElementById("description").value = "";
    document.getElementById("cover").value = "";
}
function displayBooks() {
    let container = document.getElementById("bookContainer");
    container.innerHTML = "";

    books.forEach((book, index) => {
        let badgeClass = "";
        if (book.availability === "Available") badgeClass = "bg-success";
        else if (book.availability === "Reserved")
            badgeClass = "bg-warning text-dark";
        else if (book.availability === "Borrowed") badgeClass = "bg-danger";

    container.innerHTML += `
      <div class="col-12 col-md-6 col-lg-4 d-flex justify-content-center mb-3">
        <div class="card shadow-sm" style="cursor:pointer;" onclick="showBookModal(${index})">
          <img src="${book.cover}" class="card-img-top book-img">
          <div class="card-body text-center">
            <h5>${book.title}</h5>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Status:</strong> <span class="badge ${badgeClass}">${book.availability}</span></p>
          </div>
        </div>
      </div>
    `;
    }); 
}

function showBookModal(index) {
    let book = books[index];

    document.getElementById("viewCover").src = book.cover;
    document.getElementById("viewTitle").innerText = book.title;
    document.getElementById("viewAuthor").innerText = book.author;
    document.getElementById("viewIsbn").innerText = book.isbn;
    document.getElementById("viewGenre").innerText = book.genre;
    document.getElementById("viewLocation").innerText = book.location;
    document.getElementById("viewPublisher").innerText = book.publisher;
    document.getElementById("viewDescription").innerText = book.description;
    const due = document.getElementById("dueDate");

    let statusEl = document.getElementById("viewStatus");
    statusEl.innerText = book.availability;
    
    if (book.availability === "Available") {
        statusEl.style.color = "green";
        statusEl.style.fontWeight = "bold";
    } else if (book.availability === "Borrowed") {
        statusEl.style.color = "red";
        statusEl.style.fontWeight = "bold";
    } else {
        statusEl.style.color = "orange";
        statusEl.style.fontWeight = "bold";
    }
    if(book.dueDate === ""){
        due.innerText = "N/A";
    }else{
        due.innerText = book.dueDate;
    }

    let myModal = new bootstrap.Modal(document.getElementById('bookDetailsModal'));
    myModal.show();
}

// Flexible search functionality
function searchBooks(query) {
    if (!query.trim()) {
        displayBooks();
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
        else if (book.availability === "Reserved") badgeClass = "bg-warning text-dark";
        else if (book.availability === "Borrowed") badgeClass = "bg-danger";

        container.innerHTML += `
            <div class="col-12 col-md-6 col-lg-4 d-flex justify-content-center mb-3">
                <div class="card shadow-sm" style="cursor:pointer;" onclick="showBookModal(${actualIndex})">
                    <img src="${book.cover}" class="card-img-top book-img">
                    <div class="card-body text-center">
                        <h5>${book.title}</h5>
                        <p><strong>Author:</strong> ${book.author}</p>
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
    displayBooks();
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

        window.location.href = "../pages/book.html?search=" + encodeURIComponent(query);
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