function goToStep(stepNumber) {
    const s1 = document.getElementById('step-1');
    const s2 = document.getElementById('step-2');
    const s3 = document.getElementById('step-3');
    const progressBar = document.getElementById('main-progress-bar');

    if (stepNumber === 2) {
        document.querySelectorAll('.text-danger.small').forEach(el => el.style.display = 'none');
        
        const ln = document.getElementById('lastName').value.trim();
        const fn = document.getElementById('firstName').value.trim();
        const sn = document.getElementById('studentNumber').value.trim(); 
        const gen = document.getElementById('genreButton').innerText.trim();
        const dB = document.getElementById('dateBorrow').value;
        const dD = document.getElementById('dateDue').value;
        const booksChecked = document.querySelectorAll('.book-checkbox:checked');

        let isValid = true;

        if (!ln) { document.getElementById('lastName-error').style.display = 'block'; isValid = false; }
        if (!fn) { document.getElementById('firstName-error').style.display = 'block'; isValid = false; }
        if (!sn) { document.getElementById('studentNumber-error').style.display = 'block'; isValid = false; }
        if (gen === "Genre") { document.getElementById('genre-error').style.display = 'block'; isValid = false; }
        if (booksChecked.length === 0) { document.getElementById('book-error').style.display = 'block'; isValid = false; }
        if (!dB) { document.getElementById('borrow-error').style.display = 'block'; isValid = false; }
        if (!dD) { document.getElementById('due-error').style.display = 'block'; isValid = false; }

        if (!isValid) return; 

        const mi = document.getElementById('mi').value.trim();
        document.getElementById('confirm-name').innerText = `${ln}, ${fn} ${mi}`;
        document.getElementById('confirm-studentNumber').innerText = sn; 
        document.getElementById('confirm-genre').innerText = gen;
        document.getElementById('confirm-dateBorrow').innerText = dB;
        document.getElementById('confirm-dateDue').innerText = dD;
        
        let bookTitles = [];
        booksChecked.forEach(b => bookTitles.push(b.value));
        document.getElementById('confirm-books').innerText = bookTitles.join(", ");

        s1.style.display = 'none';
        s2.style.display = 'block';
        progressBar.style.width = "66%";
    }

    if (stepNumber === 1) {
        s1.style.display = 'block';
        s2.style.display = 'none';
        s3.style.display = 'none';
        progressBar.style.width = "33%";
    }

    if (stepNumber === 3) {
        s2.style.display = 'none';
        s3.style.display = 'block';
        progressBar.style.width = "100%";
        progressBar.classList.add('bg-success');
    }
}

document.addEventListener('DOMContentLoaded', () => {   
    const dateBorrowInput = document.getElementById('dateBorrow');
    const dateDueInput = document.getElementById('dateDue');
    
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayLocal = `${year}-${month}-${day}`;
    
    dateBorrowInput.setAttribute('min', todayLocal);

    dateBorrowInput.addEventListener('change', function() {
        if (this.value) {
            dateDueInput.setAttribute('min', this.value);
            if (dateDueInput.value && dateDueInput.value < this.value) {
                dateDueInput.value = "";
            }
        }
    });

    const genreItems = document.querySelectorAll('.genre-item');
    const bookContainer = document.getElementById('bookListContainer');
    const genreBtn = document.getElementById('genreButton');
    const bookBtn = document.getElementById('bookDropdownButton');

    genreItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const selectedGenre = this.innerText.trim();
            genreBtn.innerText = selectedGenre;
            bookBtn.innerText = "Select Books";

            const filteredBooks = books.filter(book => book.genre === selectedGenre);
            bookContainer.innerHTML = ''; 

            if (filteredBooks.length > 0) {
                filteredBooks.forEach((book, index) => {
                    const isAvailable = book.availability === "Available";
                    const li = document.createElement('li');

                      li.className = "dropdown-item d-flex align-items-center py-2"; 
                      li.innerHTML = `<div class="form-check mb-0">
                                      <input class="form-check-input book-checkbox" type="checkbox" 
                                      id="book${index}" value="${book.title}"
                                      ${!isAvailable ? 'disabled' : ''}>
                                      <label class="form-check-label ${!isAvailable ? 'text-muted' : ''} ms-2" for="book${index}">
                                      ${book.title} ${!isAvailable ? `<small class="text-danger d-block">(Unavailable)</small>` : ''}
                         </label>
                     </div>`;
                bookContainer.appendChild(li);
                });
                attachCheckboxListeners();
            } else {
                bookContainer.innerHTML = '<li class="text-muted small text-center p-3">No books available.</li>';
            }
        });
    });

function attachCheckboxListeners() {
    const checkboxes = document.querySelectorAll('.book-checkbox');
    checkboxes.forEach(box => {
        box.addEventListener('click', (e) => e.stopPropagation());
            
        box.onchange = () => {
            const checked = document.querySelectorAll('.book-checkbox:checked');
                if (checked.length === 0) bookBtn.innerText = "Select Books";
                else if (checked.length === 1) bookBtn.innerText = checked[0].value;
                else bookBtn.innerText = checked.length + " Books Selected";
            };
        });
    }
});

