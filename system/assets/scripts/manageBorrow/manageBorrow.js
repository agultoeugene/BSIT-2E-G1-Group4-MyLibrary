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
                const today = new Date().toISOString().split('T')[0];
                const isOverdue = record.date_due < today;

                const statusBadge = isOverdue
                    ? `<span class="badge bg-danger">Overdue</span>`
                    : `<span class="badge bg-warning text-dark">Borrowed</span>`;
                    
                const returnBtn = record.status === 'Borrowed' 
                    ? `<button class="btn btn-sm btn-success me-2 return-btn" data-id="${record.id}">Return</button>` 
                    : '';

                html += `
                <tr>
                    <td>${record.name}</td>
                    <td>${record.student_number}</td>
                    <td>${record.books}</td>
                    <td>${record.date_due}</td>
                    <td class="text-center">
                        ${statusBadge}
                    </td>
                    <td>
                <div class="d-flex justify-content-center gap-2">
                    ${returnBtn}
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${record.id}">Delete</button>
                </div>
                </td>
                </tr>`;
            });

            tbody.html(html);

       
            $('.return-btn').off('click').on('click', function() {
                const id = $(this).data('id');
                markAsReturned(id);
            });

            $('.delete-btn').off('click').on('click', function() {
                const id = $(this).data('id');
                deleteRecord(id);
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
                    alert(response.message);
                    loadRecords(); 
                    loadReturnedSummary();
                } else {
                    alert(response.message);
                }
            },
            complete: function() {
                currentReturnId = null;
                const modalEl = document.getElementById('returnBookModal');
                const modalInstance = bootstrap.Modal.getInstance(modalEl);
                modalInstance.hide();
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
                <td>${r.name}</td>
                <td>${r.student_number}</td>
                <td>${r.books}</td>
                <td>${returnDate}</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-danger delete-summary-btn" data-id="${r.id}">
                        Delete
                    </button>
                </td>
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



function deleteRecord(id) {
    if(!confirm("Are you sure you want to delete this transaction?")) return;

    $.post("/BSIT-2E-G1-Group4-MyLibrary/backend/controllers/transaction.php", 
        { action: "deleteTransaction", id: id }, 
        function(resp) {
            if(resp.status === 'success') {
                 loadRecords();        
                loadReturnedSummary(); 
            }
            else alert("Failed to delete transaction");
        }, 'json'
    );
}

$(document).ready(loadRecords);