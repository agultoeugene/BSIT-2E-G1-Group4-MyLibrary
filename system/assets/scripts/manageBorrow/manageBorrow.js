let allBorrowedRows = [];
function loadRecords() {
    $.ajax({
        url: "/BSIT-2E-G1-Group4-MyLibrary/backend/controllers/transaction.php",
        type: "GET",
        data: { action: "getTransactions" },
        dataType: "json",
        success: function(response) {
            const tbody = $('#manageTableBody');

            if(response.status !== 'success' || response.data.length === 0) {
                tbody.html('<tr><td colspan="6" class="py-5 text-muted text-center">No records found.</td></tr>');
                return;
            }

            let html = '';
          const borrowedRecords = response.data.filter(r => r.status === "Borrowed");

            if (borrowedRecords.length === 0) {
                tbody.html('<tr><td colspan="6" class="py-5 text-muted text-center">No borrowed records.</td></tr>');
                return;
            }

borrowedRecords.forEach(record => {
    const today = new Date();
    
    const [year, month, day] = record.date_due.split('-');
    const dueDate = new Date(year, month - 1, day);

    today.setHours(0,0,0,0);
    dueDate.setHours(0,0,0,0);

    const isOverdue = dueDate < today;

const statusBadge = isOverdue
    ? `<span class="badge bg-danger-subtle text-danger">Overdue</span>`
    : `<span class="badge bg-warning-subtle text-dark">Borrowed</span>`;
        
    const returnBtn = record.status === 'Borrowed' 
        ? `<button class="btn btn-sm btn-success me-2 return-btn" data-id="${record.borrow_id}">Return</button>` 
        : '';

    html += `
    <tr>
        <td>${record.full_name}</td>
        <td>${record.student_number}</td>
        <td>${record.title}</td>
        <td>${record.date_due}</td>
        <td class="text-center">${statusBadge}</td>
        <td>
            <div class="d-flex justify-content-center gap-2">
                ${returnBtn}
            </div>
        </td>
    </tr>`;
});

            tbody.html(html);

       
            $('.return-btn').off('click').on('click', function() {
                const id = $(this).data('id');
                markAsReturned(id);
            });
             allBorrowedRows = tbody.children().clone();

            $('.return-btn').off('click').on('click', function() {
                const id = $(this).data('id');
                markAsReturned(id);
            });

          
        }
    });
}
let currentReturnId = null;

function markAsReturned(id) {
    currentReturnId = id;

    const row = $(`.return-btn[data-id="${id}"]`).closest('tr');
    const studentName = row.find('td:eq(0)').text();
    const studentNumber = row.find('td:eq(1)').text();
    const books = row.find('td:eq(2)').text();
    const dueDate = row.find('td:eq(3)').text();
    const returnDate = new Date().toISOString().split('T')[0];


    $('#modalStudentName').text(studentName);
    $('#modalStudentNumber').text(studentNumber);
    $('#modalBooks').text(books);
    $('#modalDueDate').text(dueDate);
    $('#modalReturnDate').text(returnDate);

 
    const modal = new bootstrap.Modal(document.getElementById('returnBookModal'));
    modal.show();
}

$(document).ready(function() {

    $('#confirmReturnBtn').off('click').on('click', function() {
        if (!currentReturnId) return;

       $.ajax({
            url: "/BSIT-2E-G1-Group4-MyLibrary/backend/controllers/transaction.php",
            type: "POST",
            data: { action: "returnBook", id: currentReturnId },
            dataType: "json",

            success: function(response) {

        if(response.status === "success") {

            Swal.fire({
                icon: "success",
                title: "Book Returned!",
                text: response.message,
                timer: 1500,
                showConfirmButton: false
            });

            loadRecords(); 
            loadReturnedSummary();

        } else {

            Swal.fire({
                icon: "error",
                title: "Failed",
                text: response.message
            });

        }

    },

    complete: function() {
        currentReturnId = null;
        const modalEl = document.getElementById('returnBookModal');
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        modalInstance.hide();
    },

    error: function(err){
        console.error(err);
        Swal.fire({
            icon: "error",
            title: "Server Error",
            text: "Failed to return the book."
        });
    }

});
    });

});
function loadReturnedSummary() {
    $.ajax({
        url: "/BSIT-2E-G1-Group4-MyLibrary/backend/controllers/transaction.php",
        type: "GET",
        data: { action: "getTransactions" },
        dataType: "json",
        success: function(response) {
            const tbody = $('#returnedSummaryBody');
            if (response.status !== 'success') {
                tbody.html('<tr><td colspan="4" class="py-3 text-center text-muted">No returned records.</td></tr>');
                return;
            }

            const returnedRecords = response.data.filter(r => r.status === "Returned");
            if (returnedRecords.length === 0) {
                tbody.html('<tr><td colspan="4" class="py-3 text-center text-muted">No returned records.</td></tr>');
                return;
            }

            let html = '';
           returnedRecords.forEach(r => {
             const returnDate = r.return_date || '—'; 

        html += `
            <tr>
                <td class="text-center">${r.full_name}</td>
                <td class="text-center">${r.student_number}</td>
                <td class="text-center">${r.title}</td>
                <td class="text-center">${returnDate}</td>
                <td class="text-center">${r.account_name}</td>
            </tr>
        `;
});

            tbody.html(html);
        
        }
    });
}
$('#returnedSummaryBody').off('click', '.delete-summary-btn').on('click', '.delete-summary-btn', function() {
    const id = $(this).data('id');
    deleteRecord(id);
});
$('#returnedSummaryModal').on('show.bs.modal', loadReturnedSummary);

$('#exportPdfBtn').on('click', function() {
    const table = document.getElementById('returnedSummaryBody').closest('table');

    html2canvas(table).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'pt', 'a4');

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('returned_books.pdf');
    });
});
$('#exportPdfBtn').on('click', function() {
    const table = document.getElementById('returnedSummaryBody').closest('table');

    html2canvas(table).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'pt', 'a4');

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('returned_books.pdf');
    });
});

$('#exportExcelBtn').on('click', function() {
    const table = document.getElementById('returnedSummaryBody').closest('table');
    const wb = XLSX.utils.table_to_book(table, { sheet: "Returned Books" });
    XLSX.writeFile(wb, "returned_books.xlsx");
});

$('#searchBorrowInput').on('input', function() {
    const query = $(this).val().toLowerCase();
    const tbody = $('#manageTableBody');

    if (!query) {
        tbody.html(allBorrowedRows);
        return;
    }

    const visibleRows = allBorrowedRows.filter(function() {
        const name = $(this).find('td:eq(0)').text().toLowerCase();
        const studentNumber = $(this).find('td:eq(1)').text().toLowerCase();
        const books = $(this).find('td:eq(2)').text().toLowerCase();
        return name.includes(query) || studentNumber.includes(query) || books.includes(query);
    });

    tbody.html(visibleRows.length > 0 
        ? visibleRows 
        : '<tr><td colspan="6" class="py-5 text-muted text-center">No matching records found.</td></tr>'
    );
});
$(document).ready(loadRecords);