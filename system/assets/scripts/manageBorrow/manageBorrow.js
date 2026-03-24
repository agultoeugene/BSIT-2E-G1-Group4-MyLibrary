if (stepNumber === 3) {
    const newBorrowing = {
        id: Date.now(), 
        name: document.getElementById('confirm-name').innerText,
        studentNumber: document.getElementById('confirm-studentNumber').innerText,
        genre: document.getElementById('confirm-genre').innerText,
        books: document.getElementById('confirm-books').innerText,
        borrowDate: document.getElementById('confirm-dateBorrow').innerText,
        dueDate: document.getElementById('confirm-dateDue').innerText,
        status: "Borrowed"
    };

   
    let borrowings = JSON.parse(localStorage.getItem('borrowedBooks')) || [];
    

    borrowings.push(newBorrowing);
    localStorage.setItem('borrowedBooks', JSON.stringify(borrowings));
    
    s2.style.display = 'none';
    s3.style.display = 'block';
    progressBar.style.width = "100%";
    progressBar.classList.add('bg-success');
}