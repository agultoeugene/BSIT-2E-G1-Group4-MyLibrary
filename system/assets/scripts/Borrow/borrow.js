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
            }
        }
    });
}



function goToStep(stepNumber) {

    const studentBtn = $('#studentButton');
    const progressBar = $('#main-progress-bar');

    if (stepNumber === 2) {

        const selectedId = studentBtn.attr('data-selected-id');
        const dB = $('#dateBorrow').val();
        const dD = $('#dateDue').val();
        const selectedBookId = $('#bookId').val();

        $('.text-danger.small').hide();

        let isValid = true;

        if (!selectedId) {
            $('#studentNumber-error').show();
            isValid = false;
        }

        if (!selectedBookId) {
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
            $('#confirm-name').text(student.full_name);
        }

        $('#confirm-dateBorrow').text(dB);
        $('#confirm-dateDue').text(dD);
        $('#confirm-genre').text($('#bookGenre').val());
        $('#confirm-books').text($('#bookTitle').val());
    }

    $('#step-1').toggle(stepNumber === 1);
    $('#step-2').toggle(stepNumber === 2);
    $('#step-3').toggle(stepNumber === 3);

    const widths = {1: "33%", 2: "66%", 3: "100%"};
    progressBar.css('width', widths[stepNumber]);

    if (stepNumber === 3) {
        progressBar.addClass('bg-success');
    } else {
        progressBar.removeClass('bg-success');
    }
}

$(document).ready(function () {

    const borrowInput = $('#dateBorrow');
    const dueInput = $('#dateDue');
    const studentBtn = $('#studentButton');
    const bookContainer = $('#bookListContainer');
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

   $('#bookSearchInput').on('input', function () {
    const query = $(this).val().trim().toLowerCase();

    if (!query) {
        $('#bookTitle').val('');
        $('#bookGenre').val('');
        $('#bookAuthor').val('');
        $('#bookISBN').val('');
        $('#bookId').val(''); 

        $('#book-error').hide();
        return;
    }

    const matchedBook = bookss.find(b => 
        b.title.toLowerCase().includes(query) ||
        b.genre.toLowerCase().includes(query) ||
        b.author.toLowerCase().includes(query) ||
        b.isbn.toLowerCase().includes(query)

        
    );

    if (matchedBook) {
        $('#bookTitle').val(matchedBook.title);
        $('#bookGenre').val(matchedBook.genre);
        $('#bookAuthor').val(matchedBook.author);
        $('#bookISBN').val(matchedBook.isbn);
        $('#bookId').val(matchedBook.book_id);

         $('#book-error').hide()
    } else {
        $('#bookTitle').val('Not Found');
        $('#bookGenre').val('');
        $('#bookAuthor').val('');
        $('#bookISBN').val('');
        $('#bookId').val(''); 
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
                ${s.full_name} (${s.student_number})
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
        student.full_name.toLowerCase().includes(searchTerm) ||
        student.student_number.toString().toLowerCase().includes(searchTerm)
    );
});

    displayStudents(filteredStudents);
}

function saveTransaction() {
const selectedId = $('#studentButton').attr('data-selected-id');
const selectedBookId = $('#bookId').val();

if (!selectedId || !selectedBookId) return;

const payload = {
    student_id: selectedId,
    book_id: selectedBookId, 
    date_borrow: $('#dateBorrow').val(),
    date_due: $('#dateDue').val()
};

$.ajax({
    url: "/BSIT-2E-G1-Group4-MyLibrary/backend/controllers/transaction.php",
    type: "POST",
    data: { 
        action: "storeTransaction", 
        payload: JSON.stringify(payload) 
    },
    dataType: "json",

    success: function(response) {

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