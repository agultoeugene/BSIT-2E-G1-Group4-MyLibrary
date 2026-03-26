const STUDENT_API = "/BSIT-2E-G1-Group4-MyLibrary/backend/controllers/student.php";
const BOOK_API = "/BSIT-2E-G1-Group4-MyLibrary/backend/controllers/book.php";

let students = [];
let bookss = [];


function loadStudents(selectedIdFromUrl = null, selectedNameFromUrl = null) {
    $.ajax({
        url: STUDENT_API,
        type: "GET",
        data: { action: "getS" },
        dataType: "json",
        success: function (response) {
            if (response.status === "success") {
                students = response.data;
                displayStudents(students);

                if (selectedIdFromUrl && selectedNameFromUrl) {
                    $('#studentButton').text(decodeURIComponent(selectedNameFromUrl));
                    $('#studentButton').attr('data-selected-id', selectedIdFromUrl);
                }
            }
        },
    });
}

function loadBooks() {
    $.ajax({
        url: BOOK_API,
        type: "GET",
        data: { action: "get" },
        dataType: "json",
        success: function (response) {
            if (response.status === "success") {
                bookss = response.data;
                populateGenres();
            }
        }
    });
}
function populateGenres() {
    const genreContainer = $('#genreListContainer');

    if (!bookss.length) {
        genreContainer.html('<li class="text-muted small text-center p-2">No genres available.</li>');
        return;
    }

    const uniqueGenres = [...new Set(bookss.map(b => b.genre))];

    const html = uniqueGenres.map(g => `
        <li><a class="dropdown-item genre-item" href="#">${g}</a></li>
    `).join('');

    genreContainer.html(html);

    $('.genre-item').on('click', function(e) {
        e.preventDefault();

        const selectedGenre = $(this).text().trim();
        $('#genreButton').text(selectedGenre);
        $('#bookDropdownButton').text("Select Books");

        const filtered = bookss.filter(b => b.genre === selectedGenre);

        $('#bookListContainer').html(
            filtered.length
                ? filtered.map((b, i) => `
                    <li class="dropdown-item d-flex align-items-center py-2">
                        <div class="form-check mb-0">
                            <input class="form-check-input book-checkbox"
                                   type="checkbox"
                                   id="book${i}"
                                   value="${b.title}"
                                   ${b.availability !== "Available" ? 'disabled' : ''}>
                            <label class="form-check-label ${b.availability !== "Available" ? 'text-muted' : ''} ms-2">
                                ${b.title}
                                ${b.availability !== "Available" ? '<small class="text-danger">(Unavailable)</small>' : ''}
                            </label>
                        </div>
                    </li>
                `).join('')
                : '<li class="text-muted small text-center p-3">No books available.</li>'
        );
    });
}


function goToStep(stepNumber) {

    const studentBtn = $('#studentButton');
    const progressBar = $('#main-progress-bar');

    if (stepNumber === 2) {

        const selectedId = studentBtn.attr('data-selected-id');
        const gen = $('#genreButton').text().trim();
        const dB = $('#dateBorrow').val();
        const dD = $('#dateDue').val();
        const booksChecked = $('.book-checkbox:checked');

        $('.text-danger.small').hide();

        let isValid = true;

        if (!selectedId) {
            $('#studentNumber-error').show();
            isValid = false;
        }

        if (gen === "Genre" || gen === "") {
            $('#genre-error').show();
            isValid = false;
        }

        if (booksChecked.length === 0) {
            $('#book-error').show();
            isValid = false;
        }

        if (!dB) {
            $('#borrow-error').show();
            isValid = false;
        }

        if (!dD) {
            $('#due-error').show();
            isValid = false;
        }

        if (!isValid) return;

  
        const student = students.find(s => s.student_id == selectedId);
        if (student) {
            $('#confirm-name').text(student.name);
        }

        $('#confirm-genre').text(gen);
        $('#confirm-dateBorrow').text(dB);
        $('#confirm-dateDue').text(dD);

        $('#confirm-books').text(
            booksChecked.map(function () {
                return $(this).val();
            }).get().join(", ")
        );
    }

 
    $('#step-1').toggle(stepNumber === 1);
    $('#step-2').toggle(stepNumber === 2);
    $('#step-3').toggle(stepNumber === 3);


    const widths = { 1: "33%", 2: "66%", 3: "100%" };
    progressBar.css('width', widths[stepNumber]);

    if (stepNumber === 3) {
        progressBar.addClass('bg-success');
    }
}



$(document).ready(function () {

    const borrowInput = $('#dateBorrow');
    const dueInput = $('#dateDue');
    const studentBtn = $('#studentButton');
    const bookContainer = $('#bookListContainer');
    const genreBtn = $('#genreButton');
    const bookBtn = $('#bookDropdownButton');
    loadBooks();

    const urlParams = new URLSearchParams(window.location.search);
        const studentId = urlParams.get('student_id');
const studentName = urlParams.get('student_name');

loadStudents(studentId, studentName);

    if(studentId && studentName) {
        $('#studentButton').text(decodeURIComponent(studentName));
        $('#studentButton').attr('data-selected-id', studentId);
    }

      $('#studentListContainer').on('input', '#studentSearchInput', function() {
    const query = $(this).val().trim();
    searchStudents(query);
});

    $('#studentListContainer').on('click', '.student-item', function(e) {
        e.preventDefault();
        $('#studentButton').text($(this).text());
        $('#studentButton').attr('data-selected-id', $(this).data('id'));
        $('#studentNumber-error').hide();
    });

    const today = new Date().toISOString().split('T')[0];
    borrowInput.attr('min', today);
    dueInput.attr('min', today);

    borrowInput.on('change', function () {
        dueInput.attr('min', $(this).val() || today);
        if (dueInput.val() < $(this).val()) {
            dueInput.val("");
        }
    });


    $('.genre-item').on('click', function (e) {
        e.preventDefault();

        const selectedGenre = $(this).text().trim();
        genreBtn.text(selectedGenre);
        bookBtn.text("Select Books");

        const filtered = bookss.filter(b => b.genre === selectedGenre);

        if (bookContainer.length) {

            bookContainer.html(
                filtered.length
                    ? filtered.map((b, i) => `
                        <li class="dropdown-item d-flex align-items-center py-2">
                            <div class="form-check mb-0">
                                <input class="form-check-input book-checkbox"
                                       type="checkbox"
                                       id="book${i}"
                                       value="${b.title}"
                                       ${b.availability !== "Available" ? 'disabled' : ''}>
                                <label class="form-check-label ${b.availability !== "Available" ? 'text-muted' : ''} ms-2">
                                    ${b.title}
                                    ${b.availability !== "Available" ? '<small class="text-danger">(Unavailable)</small>' : ''}
                                </label>
                            </div>
                        </li>
                    `).join('')
                    : '<li class="text-muted small text-center p-3">No books available.</li>'
            );
        }
    });

    $('#bookListContainer').on('change', '.book-checkbox', function () {

        const checked = $('.book-checkbox:checked');

        if (checked.length === 0) {
            $('#bookDropdownButton').text("Select Books");
        } else if (checked.length === 1) {
            $('#bookDropdownButton').text(checked.val());
        } else {
            $('#bookDropdownButton').text(`${checked.length} Books Selected`);
        }
    });

});
function displayStudents(studentArray) {
    const container = $("#studentListContainer");
    if (!$('#studentSearchInput').length) {
        container.html(`
            <li class="px-3 py-2">
                <input type="search" class="form-control form-control-sm" id="studentSearchInput" placeholder="Search student...">
            </li>
        `);
    }

    const studentHtml = studentArray.map(s => `
        <li>
            <a class="dropdown-item student-item" href="#" data-id="${s.student_id}">
                ${s.name} (${s.student_number})
            </a>
        </li>
    `).join("");

    container.find('li:gt(0)').remove(); 
    container.append(studentHtml);
}
function searchStudents(query) {
    if (!query.trim()) {
        displayStudents(students); 
        return;
    }

    const searchTerm = query.toLowerCase();
    const filteredStudents = students.filter(student => {
        return (
            student.name.toLowerCase().includes(searchTerm) ||
            student.student_number.toString().toLowerCase().includes(searchTerm)
        );
    });

    displayStudents(filteredStudents);
}

function saveTransaction() {
    const selectedId = $('#studentButton').attr('data-selected-id');
    const booksChecked = $('.book-checkbox:checked');

    if (!selectedId || booksChecked.length === 0) return;

    const books = booksChecked.map(function() {
        return $(this).val();
    }).get().join(", ");

    const payload = {
        student_id: selectedId,
        books: books,
        date_borrow: $('#dateBorrow').val(),
        date_due: $('#dateDue').val()
    };

    $.ajax({
        url: "/BSIT-2E-G1-Group4-MyLibrary/backend/controllers/transaction.php",
        type: "POST",
        data: { action: "storeTransaction", payload: JSON.stringify(payload) },
        dataType: "json",
        success: function(response) {
            if(response.status === "success") {
                alert(response.message);
                goToStep(1);
                loadTransactions(); 
            } else {
                alert(response.message);
            }
        }
    });
}