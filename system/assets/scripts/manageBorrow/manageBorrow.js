// Store all borrowed table rows for search filtering
let allBorrowedRows = [];

// Load borrowed records from server
function loadRecords() {
    $.ajax({
        url: "/BSIT-2E-G1-Group4-MyLibrary/backend/controllers/transaction.php",
        type: "GET",
        data: { action: "getTransactions" }, // request transactions
        dataType: "json",
        success: function(response) {

            const tbody = $('#manageTableBody');

            // If request failed or no data
            if(response.status !== 'success' || response.data.length === 0) {
                tbody.html('<tr><td colspan="6" class="py-5 text-muted text-center">No records found.</td></tr>');
                return;
            }

            let html = '';

            // Filter only borrowed records
            const borrowedRecords = response.data.filter(r => r.status === "Borrowed");

            // If no borrowed records
            if (borrowedRecords.length === 0) {
                tbody.html('<tr><td colspan="6" class="py-5 text-muted text-center">No borrowed records.</td></tr>');
                return;
            }

            // Loop each borrowed record
            borrowedRecords.forEach(record => {

                const today = new Date();

                // Convert due date string to Date object
                const [year, month, day] = record.date_due.split('-');
                const dueDate = new Date(year, month - 1, day);

                // Remove time so only date is compared
                today.setHours(0,0,0,0);
                dueDate.setHours(0,0,0,0);

                // Check if overdue
                const isOverdue = dueDate < today;

                // Status badge
                const statusBadge = isOverdue
                    ? `<span class="badge bg-danger-subtle text-danger">Overdue</span>`
                    : `<span class="badge bg-warning-subtle text-dark">Borrowed</span>`;

                // Return button if still borrowed
                const returnBtn = record.status === 'Borrowed' 
                    ? `<button class="btn btn-sm btn-success me-2 return-btn" data-id="${record.borrow_id}">Return</button>` 
                    : '';

                // Create table row
                html += `
                <tr>
                    <td>${record.borrow_id}</td>
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

            // Insert rows into table
            tbody.html(html);

            // Attach return button click
            $('.return-btn').off('click').on('click', function() {
                const id = $(this).data('id');
                markAsReturned(id);
            });

            // Save rows for search
            allBorrowedRows = tbody.children().clone();

            // Attach click again (ensures events work after filtering)
            $('.return-btn').off('click').on('click', function() {
                const id = $(this).data('id');
                markAsReturned(id);
            });

        }
    });
}

// Store ID of record being returned
let currentReturnId = null;


// Show return modal
function markAsReturned(id) {

    currentReturnId = id;

    // Get row data
    const row = $(`.return-btn[data-id="${id}"]`).closest('tr');

    const studentName = row.find('td:eq(0)').text();
    const studentNumber = row.find('td:eq(1)').text();
    const books = row.find('td:eq(2)').text();
    const dueDate = row.find('td:eq(3)').text();

    // Set return date to today
    const returnDate = new Date().toISOString().split('T')[0];

    // Fill modal fields
    $('#modalStudentName').text(studentName);
    $('#modalStudentNumber').text(studentNumber);
    $('#modalBooks').text(books);
    $('#modalDueDate').text(dueDate);
    $('#modalReturnDate').text(returnDate);

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('returnBookModal'));
    modal.show();
}


// When page loads
$(document).ready(function() {

    // Confirm return button
    $('#confirmReturnBtn').off('click').on('click', function() {

        if (!currentReturnId) return;

        $.ajax({
            url: "/BSIT-2E-G1-Group4-MyLibrary/backend/controllers/transaction.php",
            type: "POST",
            data: { action: "returnBook", id: currentReturnId },
            dataType: "json",

            success: function(response) {

                // If return success
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

            // After request finishes
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


// Load returned books summary
function loadReturnedSummary() {

    $.ajax({
        url: "/BSIT-2E-G1-Group4-MyLibrary/backend/controllers/transaction.php",
        type: "GET",
        data: { action: "getTransactions" },
        dataType: "json",

        success: function(response) {

            const tbody = $('#returnedSummaryBody');

            // If request failed
            if (response.status !== 'success') {
                tbody.html('<tr><td colspan="4" class="py-3 text-center text-muted">No returned records.</td></tr>');
                return;
            }

            // Filter returned records
            const returnedRecords = response.data.filter(r => r.status === "Returned");

            // If none returned
            if (returnedRecords.length === 0) {
                tbody.html('<tr><td colspan="4" class="py-3 text-center text-muted">No returned records.</td></tr>');
                return;
            }

            let html = '';

            // Loop returned records
            returnedRecords.forEach(r => {

                const returnDate = r.return_date || '—';

                html += `
                    <tr>    
                        <td class="text-center">${r.borrow_id}</td>
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


// Load summary when modal opens
$('#returnedSummaryModal').on('show.bs.modal', loadReturnedSummary);


// Export returned summary to PDF
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


// Export returned summary to Excel
$('#exportExcelBtn').on('click', function() {

    const table = document.getElementById('returnedSummaryBody').closest('table');

    const wb = XLSX.utils.table_to_book(table, { sheet: "Returned Books" });

    XLSX.writeFile(wb, "returned_books.xlsx");

});


// Search borrowed records
$('#searchBorrowInput').on('input', function() {

    const query = $(this).val().toLowerCase();

    const tbody = $('#manageTableBody');

    // Show all rows if search empty
    if (!query) {
        tbody.html(allBorrowedRows);
        return;
    }

    // Filter rows based on name, student number, or book title
    const visibleRows = allBorrowedRows.filter(function() {

        const name = $(this).find('td:eq(0)').text().toLowerCase();
        const studentNumber = $(this).find('td:eq(1)').text().toLowerCase();
        const books = $(this).find('td:eq(2)').text().toLowerCase();

        return name.includes(query) || studentNumber.includes(query) || books.includes(query);

    });

    // Show filtered rows
    tbody.html(
        visibleRows.length > 0 
        ? visibleRows 
        : '<tr><td colspan="6" class="py-5 text-muted text-center">No matching records found.</td></tr>'
    );

});


// Load records when page starts
$(document).ready(loadRecords);