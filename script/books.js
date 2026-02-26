let books = [{
        cover: "https://via.placeholder.com/300x400?text=Book+1",
        title: "The Great Adventure",
        author: "John Smith",
        isbn: "978-0001",
        genre: "Adventure",
        location: "Shelf A1",
        availability: "Available",
        publisher: "Adventure Press",
        dueDate: "",
        description: "An exciting journey through uncharted territories.",
    },
    {
        cover: "https://via.placeholder.com/300x400?text=Book+2",
        title: "Mystery of the Night",
        author: "Jane Doe",
        isbn: "978-0002",
        genre: "Mystery",
        location: "Shelf B3",
        availability: "Borrowed",
        publisher: "Mystery House",
        dueDate: "2026-03-05",
        description: "A thrilling mystery that keeps you guessing until the end.",
    },
    {
        cover: "https://via.placeholder.com/300x400?text=Book+3",
        title: "Learning JavaScript",
        author: "Mark Lee",
        isbn: "978-0003",
        genre: "Education",
        location: "Shelf C2",
        availability: "Available",
        publisher: "Tech Books",
        dueDate: "",
        description: "A comprehensive guide to mastering JavaScript programming.",
    },
    {
        cover: "https://via.placeholder.com/300x400?text=Book+4",
        title: "World History",
        author: "Emma White",
        isbn: "978-0004",
        genre: "History",
        location: "Shelf D1",
        availability: "Reserved",
        publisher: "History Press",
        dueDate: "",
        description: "Explore the major events and people that shaped our world.",
    },
    {
        cover: "https://via.placeholder.com/300x400?text=Book+5",
        title: "Cooking 101",
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
        cover: "https://via.placeholder.com/300x400?text=Book+6",
        title: "Science Experiments",
        author: "David Clark",
        isbn: "978-0006",
        genre: "Science",
        location: "Shelf F2",
        availability: "Borrowed",
        publisher: "EduScience",
        dueDate: "2026-02-28",
        description: "Fun and easy science experiments you can try at home.",
    },
    {
        cover: "https://via.placeholder.com/300x400?text=Book+7",
        title: "Art & Creativity",
        author: "Linda Green",
        isbn: "978-0007",
        genre: "Art",
        location: "Shelf G1",
        availability: "Available",
        publisher: "Creative Press",
        dueDate: "",
        description: "Explore your artistic skills and creative thinking techniques.",
    },
    {
        cover: "https://via.placeholder.com/300x400?text=Book+8",
        title: "The Space Odyssey",
        author: "Alan Walker",
        isbn: "978-0008",
        genre: "Science Fiction",
        location: "Shelf H3",
        availability: "Reserved",
        publisher: "SciFi Publishing",
        dueDate: "",
        description: "A thrilling journey through the vast universe and unknown planets.",
    },
    {
        cover: "https://via.placeholder.com/300x400?text=Book+9",
        title: "Gardening Tips",
        author: "Olivia King",
        isbn: "978-0009",
        genre: "Lifestyle",
        location: "Shelf I2",
        availability: "Available",
        publisher: "Green Thumb Press",
        dueDate: "",
        description: "Learn how to grow beautiful plants and maintain your garden.",
    },
    {
        cover: "https://via.placeholder.com/300x400?text=Book+10",
        title: "Meditation Guide",
        author: "Sophia Turner",
        isbn: "978-0010",
        genre: "Self-Help",
        location: "Shelf J1",
        availability: "Borrowed",
        publisher: "Wellness Books",
        dueDate: "2026-03-10",
        description: "A practical guide to meditation and mindfulness for beginners.",
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

    let fileInput = document.getElementById("cover");
    let file = fileInput.files[0];

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

