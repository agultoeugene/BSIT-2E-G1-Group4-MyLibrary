// API endpoints for students and books
const STUDENT_API = "/Library/backend/controllers/student.php";
const BOOK_API = "/Library/backend/controllers/book.php";

// Arrays to store students and books from database
let students = [];
let bookss = [];


// Load students from API
function loadStudents(selectedIdFromUrl = null, selectedNameFromUrl = null) {
    $.ajax({
        url: STUDENT_API,
        type: "GET",
        data: { action: "getS" }, // request action
        dataType: "json",
        success: function (response) {

            // If request is successful
            if (response.status === "success") {
                students = response.data; // store students
                displayStudents(students); // show in dropdown

                // If student came from URL parameters
                if (selectedIdFromUrl && selectedNameFromUrl) {
                    $('#studentButton').text(decodeURIComponent(selectedNameFromUrl));
                    $('#studentButton').attr('data-selected-id', selectedIdFromUrl);
                }
            }
        },
    });
}


// Load books from API
function loadBooks() {
    $.ajax({
        url: BOOK_API,
        type: "GET",
        data: { action: "get" }, // request all books
        dataType: "json",
        success: function (response) {

            // Save books in array
            if (response.status === "success") {
                bookss = response.data;
            }
        }
    });
}


// Controls step navigation in the borrow form
function goToStep(stepNumber) {

    const studentBtn = $('#studentButton');
    const progressBar = $('#main-progress-bar');

    // Validation before moving to step 2
    if (stepNumber === 2) {

        const selectedId = studentBtn.attr('data-selected-id');
        const dB = $('#dateBorrow').val();
        const dD = $('#dateDue').val();
        const selectedBookId = $('#bookId').val();

        // Hide previous errors
        $('.text-danger.small').hide();

        let isValid = true;

        // Validate student
        if (!selectedId) {
            $('#studentNumber-error').show();
            isValid = false;
        }

        // Validate book
        if (!selectedBookId) {
            $('#book-error').show();
            isValid = false;
        }

        // Validate borrow date
        if (!dB) {
            $('#borrow-error').show();
            isValid = false;
        }

        // Validate due date
        if (!dD) {
            $('#due-error').show();
            isValid = false;
        }

        // Stop if invalid
        if (!isValid) return;

        // Get selected student details
        const student = students.find(s => s.student_id == selectedId);
        if (student) {
            $('#confirm-name').text(student.full_name);
        }

        // Show confirmation details
        $('#confirm-dateBorrow').text(dB);
        $('#confirm-dateDue').text(dD);
        $('#confirm-genre').text($('#bookGenre').val());
        $('#confirm-books').text($('#bookTitle').val());
    }

    // Toggle steps
    $('#step-1').toggle(stepNumber === 1);
    $('#step-2').toggle(stepNumber === 2);
    $('#step-3').toggle(stepNumber === 3);

    // Progress bar percentage
    const widths = {1: "33%", 2: "66%", 3: "100%"};
    progressBar.css('width', widths[stepNumber]);

    // Change color when finished
    if (stepNumber === 3) {
        progressBar.addClass('bg-success');
    } else {
        progressBar.removeClass('bg-success');
    }
}


// Run when page loads
$(document).ready(function () {

    const borrowInput = $('#dateBorrow');
    const dueInput = $('#dateDue');
    const studentBtn = $('#studentButton');
    const bookContainer = $('#bookListContainer');

    loadBooks(); // load books

    // Get parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const studentId = urlParams.get('student_id');
    const studentName = urlParams.get('student_name');

    loadStudents(studentId, studentName);

    // Preselect student if URL has data
    if(studentId && studentName) {
        $('#studentButton').text(decodeURIComponent(studentName));
        $('#studentButton').attr('data-selected-id', studentId);
    }

    // Student search input
    $('#studentListContainer').on('input', '#studentSearchInput', function() {
        const query = $(this).val().trim();
        searchStudents(query);
    });

    // When student is clicked in dropdown
    $('#studentListContainer').on('click', '.student-item', function(e) {
        e.preventDefault();
        $('#studentButton').text($(this).text());
        $('#studentButton').attr('data-selected-id', $(this).data('id'));
        $('#studentNumber-error').hide();
    });

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    borrowInput.attr('min', today);
    dueInput.attr('min', today);

    // Update due date minimum based on borrow date
    borrowInput.on('change', function () {
        dueInput.attr('min', $(this).val() || today);

        // Reset due date if earlier
        if (dueInput.val() < $(this).val()) {
            dueInput.val("");
        }
    });

    // Book search
    $('#bookSearchInput').on('input', function () {

        const query = $(this).val().trim().toLowerCase();

        // Clear fields if empty
        if (!query) {
            $('#bookTitle').val('');
            $('#bookGenre').val('');
            $('#bookAuthor').val('');
            $('#bookISBN').val('');
            $('#bookId').val('');
            $('#book-error').hide();
            return;
        }

        // Find matching book
        const matchedBook = bookss.find(b => 
            b.title.toLowerCase().includes(query) ||
            b.genre.toLowerCase().includes(query) ||
            b.author.toLowerCase().includes(query) ||
            b.isbn.toLowerCase().includes(query)
        );

        // If book found
        if (matchedBook) {
            $('#bookTitle').val(matchedBook.title);
            $('#bookGenre').val(matchedBook.genre);
            $('#bookAuthor').val(matchedBook.author);
            $('#bookISBN').val(matchedBook.isbn);
            $('#bookId').val(matchedBook.book_id);

            $('#book-error').hide()

        } else {

            // If book not found
            $('#bookTitle').val('Not Found');
            $('#bookGenre').val('');
            $('#bookAuthor').val('');
            $('#bookISBN').val('');
            $('#bookId').val('');
        }
    });

});


// Display students in dropdown
function displayStudents(studentArray) {

    const container = $("#studentListContainer");

    // Add search input if not existing
    if (!$('#studentSearchInput').length) {
        container.html(`
            <li class="px-3 py-2">
                <input type="search" class="form-control form-control-sm" id="studentSearchInput" placeholder="Search student...">
            </li>
        `);
    }

    // Create student list HTML
    const studentHtml = studentArray.map(s => `
        <li>
            <a class="dropdown-item student-item" href="#" data-id="${s.student_id}">
                ${s.full_name} (${s.student_number})
            </a>
        </li>
    `).join("");

    container.find('li:gt(0)').remove(); 
    container.append(studentHtml);
}


// Search students
function searchStudents(query) {

    if (!query.trim()) {
        displayStudents(students); 
        return;
    }

    const searchTerm = query.toLowerCase();

    // Filter students by name or student number
    const filteredStudents = students.filter(student => {
        return (
            student.full_name.toLowerCase().includes(searchTerm) ||
            student.student_number.toString().toLowerCase().includes(searchTerm)
        );
    });

    displayStudents(filteredStudents);
}


// Save borrow transaction
function saveTransaction() {

const selectedId = $('#studentButton').attr('data-selected-id');
const selectedBookId = $('#bookId').val();

// Stop if student or book not selected
if (!selectedId || !selectedBookId) return;

// Transaction payload
const payload = {
    student_id: selectedId,
    book_id: selectedBookId, 
    date_borrow: $('#dateBorrow').val(),
    date_due: $('#dateDue').val()
};

$.ajax({

    url: "/Library/backend/controllers/transaction.php",
    type: "POST",

    data: { 
        action: "storeTransaction", 
        payload: JSON.stringify(payload) 
    },

    dataType: "json",

    success: function(response) {

        // If saved successfully
        if(response.status === "success") {

            goToStep(3);

        } else {

            Swal.fire({
                icon: "error",
                title: "Failed",
                text: response.message
            });

        }

    },

    error: function(err){

        console.error(err);

        Swal.fire({
            icon: "error",
            title: "Server Error",
            text: "Failed to process transaction."
        });

    }

});

}
