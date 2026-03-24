//DUMMY DATA (try this para makita ui ng step 2, and 3)
/*const students = [
    { id: "2024-001", firstName: "Michael", lastName: "Irocio", middleInitial: "M." },
    { id: "2024-002", firstName: "Theo", lastName: "Mercado", middleInitial: "" }
];


const books = [
    { title: "The Hobbit", genre: "Adventure", availability: "Available" },
    { title: "Clean Code", genre: "Education", availability: "Available" },
    { title: "1984", genre: "Science Fiction", availability: "Available" }
];
*/

function goToStep(stepNumber) {
    const s1 = document.getElementById('step-1');
    const s2 = document.getElementById('step-2');
    const s3 = document.getElementById('step-3');
    const progressBar = document.getElementById('main-progress-bar');
    const studentBtn = document.getElementById('studentButton');


    if (stepNumber === 2) {
        const selectedId = studentBtn.getAttribute('data-selected-id');
        const gen = document.getElementById('genreButton').innerText.trim();
        const dB = document.getElementById('dateBorrow').value;
        const dD = document.getElementById('dateDue').value;
        const booksChecked = document.querySelectorAll('.book-checkbox:checked');


        document.querySelectorAll('.text-danger.small').forEach(el => el.style.display = 'none');


        let isValid = true;
        if (!selectedId) {
        const studentError = document.getElementById('studentNumber-error');

            if (studentError) studentError.style.display = 'block';
            isValid = false;
        }

        if (gen === "Genre" || gen === "") {
            document.getElementById('genre-error').style.display = 'block';
            isValid = false;
        }
        if (booksChecked.length === 0) {
            document.getElementById('book-error').style.display = 'block';
            isValid = false;
        }
        if (!dB) {
            document.getElementById('borrow-error').style.display = 'block';
            isValid = false;
        }
        if (!dD) {
            document.getElementById('due-error').style.display = 'block';
            isValid = false;
        }

        if (!isValid) return;

        //Confirmation 
        const student = students.find(s => s.id === selectedId);
        if (student) {
           const fullName = `${student.lastName}, ${student.firstName} ${student.middleInitial || ''}`;
           document.getElementById('confirm-name').innerText = fullName;
        }
       
        document.getElementById('confirm-genre').innerText = gen;
        document.getElementById('confirm-dateBorrow').innerText = dB;
        document.getElementById('confirm-dateDue').innerText = dD;
        document.getElementById('confirm-books').innerText = Array.from(booksChecked).map(b => b.value).join(", ");
    }

    // Step Visibility
    if (s1) s1.style.display = (stepNumber === 1) ? 'block' : 'none';
    if (s2) s2.style.display = (stepNumber === 2) ? 'block' : 'none';
    if (s3) s3.style.display = (stepNumber === 3) ? 'block' : 'none';


    // Progress Bar
    if (progressBar) {
        const widths = { 1: "33%", 2: "66%", 3: "100%" };
        progressBar.style.width = widths[stepNumber];
        if (stepNumber === 3) progressBar.classList.add('bg-success');
    }
}


//Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const borrowInput = document.getElementById('dateBorrow');
    const dueInput = document.getElementById('dateDue');
    const studentContainer = document.getElementById('studentListContainer');
    const studentBtn = document.getElementById('studentButton');
    const bookContainer = document.getElementById('bookListContainer');
    const genreBtn = document.getElementById('genreButton');
    const bookBtn = document.getElementById('bookDropdownButton');


    //Date should be today onwards
    const today = new Date().toISOString().split('T')[0];
    if (borrowInput) borrowInput.setAttribute('min', today);
    if (dueInput) dueInput.setAttribute('min', today);


    if (borrowInput && dueInput) {
        borrowInput.addEventListener('change', () => {
            dueInput.setAttribute('min', borrowInput.value || today);
            if (dueInput.value && dueInput.value < borrowInput.value) dueInput.value = "";
        });
    }


    //Students
    if (studentContainer && students.length > 0) {
        studentContainer.innerHTML = students.map(s => `
            <li><a class="dropdown-item student-item" href="#" data-id="${s.id}">${s.lastName}, ${s.firstName} ${s.middleInitial}</a></li>
        `).join('');
    } else if (studentContainer) {
        studentContainer.innerHTML = '<li><span class="dropdown-item text-muted">No students found</span></li>';
    }


    if (studentContainer) {
        studentContainer.addEventListener('click', (e) => {
            const item = e.target.closest('.student-item');
            if (item) {
                e.preventDefault();
                studentBtn.innerText = item.innerText.trim();
                studentBtn.setAttribute('data-selected-id', item.getAttribute('data-id'));
                const errorLabel = document.getElementById('studentNumber-error');
                if (errorLabel) errorLabel.style.display = 'none';
            }
        });
    }


    //Genre & Book
    document.querySelectorAll('.genre-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedGenre = e.target.innerText.trim();
            genreBtn.innerText = selectedGenre;
            bookBtn.innerText = "Select Books";


            const filtered = books.filter(b => b.genre === selectedGenre);
           
            if (bookContainer) {
                bookContainer.innerHTML = filtered.length ? filtered.map((b, i) => `
                    <li class="dropdown-item d-flex align-items-center py-2">
                        <div class="form-check mb-0">
                            <input class="form-check-input book-checkbox" type="checkbox" id="book${i}" value="${b.title}" ${b.availability !== "Available" ? 'disabled' : ''}>
                            <label class="form-check-label ${b.availability !== "Available" ? 'text-muted' : ''} ms-2" for="book${i}">
                                ${b.title} ${b.availability !== "Available" ? '<small class="text-danger">(Unavailable)</small>' : ''}
                            </label>
                        </div>
                    </li>`).join('') : '<li class="text-muted small text-center p-3">No books available.</li>';


                bookContainer.querySelectorAll('.book-checkbox').forEach(box => {
                    box.addEventListener('click', ev => ev.stopPropagation());
                    box.onchange = () => {
                        const checked = bookContainer.querySelectorAll('.book-checkbox:checked');
                        bookBtn.innerText = checked.length === 0 ? "Select Books" :
                                          (checked.length === 1 ? checked[0].value : `${checked.length} Books Selected`);
                    };
                });
            }
        });
    });
});

