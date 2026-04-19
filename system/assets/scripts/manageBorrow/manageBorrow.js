let allBorrowedRows = [];
let currentReturnId = null;
let currentNotifyId = null;
let returnedRows = [];
let overdueRows = [];
let allReturnedData = [];
let allOverdueData = [];

// ================= LOAD BORROWED =================
function loadRecords() {

    $.ajax({
        url: "/Library/backend/controllers/transaction.php",
        type: "GET",
        data: { action: "getTransactions" },
        dataType: "json",

        success: function(response) {

            const tbody = $('#manageTableBody');

            if(response.status !== 'success' || response.data.length === 0) {
                tbody.html('<tr><td colspan="9" class="py-5 text-muted text-center">No records found.</td></tr>');
                return;
            }

            let html = '';

            const borrowedRecords = response.data.filter(r => r.status === "Borrowed");

            if (borrowedRecords.length === 0) {
                tbody.html('<tr><td colspan="9" class="py-5 text-muted text-center">No borrowed records.</td></tr>');
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
                    ? `<span class="fw-semibold text-danger">Overdue</span>`
                    : `<span class="fw-semibold text-primary">Borrowed</span>`;

                const returnBtn = `
                    <button class="btn btn-sm btn-success me-2 return-btn" data-id="${record.borrow_id}">
                        Return
                    </button>
                `;

                const notifyBtn = isOverdue
                    ? `<button class="btn btn-sm btn-warning notify-btn" data-id="${record.borrow_id}" data-name="${record.full_name}" data-book="${record.book_title}" data-due="${record.date_due}">
                         Notify
                    </button>`
                    : '';

                let courseYearSection = record.course_year_section || '-';
                if (!record.course_year_section && record.course_name) {
                    const year = record.year_level ? record.year_level : '';
                    const section = record.section_name ? record.section_name : '';
                    courseYearSection = `${record.course_name}${year || section ? '/' : ''}${year}${section}`.replace(/\/+$/g, '');
                }
                const department = record.department || '-';

                html += `
                <tr>
                    <td data-label="ID">${record.borrow_id}</td>
                    <td data-label="Name">${record.full_name}</td>
                    <td data-label="Student No.">${record.student_number}</td>
                    <td data-label="Course/Year/Section">${courseYearSection}</td>
                    <td data-label="Department">${department}</td>
                    <td data-label="Book">${record.book_title}</td>
                    <td data-label="Due Date">${record.date_due}</td>
                    <td data-label="Status" class="text-center">${statusBadge}</td>
                    <td data-label="Action">
                        <div class="d-flex justify-content-center gap-2">
                            ${returnBtn}
                            ${notifyBtn}
                        </div>
                    </td>
                </tr>`;
            });

            tbody.html(html);

            $('.return-btn').off('click').on('click', function() {
                const id = $(this).data('id');
                markAsReturned(id);
            });

            $('.notify-btn').off('click').on('click', function() {
                const id = $(this).data('id');
                const name = $(this).data('name');
                const book = $(this).data('book');
                const due = $(this).data('due');
                showNotifyModal(id, name, book, due);
            });

            allBorrowedRows = tbody.children().clone();

        }
    });
}


// ================= RETURN MODAL =================
function markAsReturned(id) {

    currentReturnId = id;

    const row = $(`.return-btn[data-id="${id}"]`).closest('tr');

    const studentName = row.find('td:eq(1)').text();
    const studentNumber = row.find('td:eq(2)').text();
    const books = row.find('td:eq(5)').text();
    const dueDate = row.find('td:eq(6)').text();

    const returnDate = new Date().toISOString().split('T')[0];

    $('#modalStudentName').text(studentName);
    $('#modalStudentNumber').text(studentNumber);
    $('#modalBooks').text(books);
    $('#modalDueDate').text(dueDate);
    $('#modalReturnDate').text(returnDate);

    const modal = new bootstrap.Modal(document.getElementById('returnBookModal'));
    modal.show();
}


// ================= CONFIRM RETURN =================
$(document).ready(function() {

    $('#confirmReturnBtn').off('click').on('click', function() {

        if (!currentReturnId) return;

        $.ajax({
            url: "/Library/backend/controllers/transaction.php",
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
                    loadOverdueReturned();

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
        url: "/Library/backend/controllers/transaction.php",
        type: "GET",
        data: { action: "getTransactions" },
        dataType: "json",

        success: function(response) {

            const tbody = $('#returnedSummaryBody');

            if (response.status !== 'success') {
                tbody.html('<tr><td colspan="8" class="text-center text-muted">No returned records.</td></tr>');
                return;
            }

            let html = '';

            const returnedRecords = response.data.filter(r => {

                if(r.status !== "Returned" || !r.return_date) return false;

                const [y1,m1,d1] = r.date_due.split('-');
                const [y2,m2,d2] = r.return_date.split('-');

                const due = new Date(y1, m1-1, d1);
                const returned = new Date(y2, m2-1, d2);
                due.setHours(0,0,0,0);
                returned.setHours(0,0,0,0);

                // ONLY ON-TIME RETURNS
                return returned <= due;
            });

            if(returnedRecords.length === 0){
                tbody.html('<tr><td colspan="9" class="text-center text-muted">No returned records.</td></tr>');
                return;
            }

            returnedRecords.forEach(r => {
                let courseYearSection = r.course_year_section || '';
                if (!courseYearSection) {
                    const year = r.year_level ? r.year_level : '';
                    const section = r.section_name ? r.section_name : '';
                    courseYearSection = `${year}${section ? '/' + section : ''}`.trim();
                }
                const department = r.department || '-';

                html += `
                <tr>
                    <td data-label="ID" class="text-center">${r.borrow_id}</td>
                    <td data-label="Name" class="text-center">${r.full_name}</td>
                    <td data-label="Student No." class="text-center">${r.student_number}</td>
                    <td data-label="Course/Year/Section" class="text-center">${courseYearSection}</td>
                    <td data-label="Department" class="text-center">${department}</td>
                    <td data-label="Book" class="text-center">${r.book_title}</td>
                    <td data-label="Return Date" class="text-center">${r.return_date}</td>
                    <td data-label="Returned To" class="text-center">${r.account_name}</td>
                    <td data-label="Status" class="text-center">
                        <span class="fw-semibold text-success">Returned</span>
                    </td>
                </tr>
                `;
            });

            tbody.html(html);

            returnedRows = tbody.children().clone();
            allReturnedData = returnedRecords;

        }
    });
}
$('#searchReturnedInput').on('input', function(){

    const queryTokens = getSearchTokens($(this).val());
    const tbody = $('#returnedSummaryBody');

    if(!queryTokens.length){
        tbody.html(returnedRows);
        return;
    }

    const filtered = returnedRows.filter(function(){
        const normalizedText = normalizeSearchText($(this).text());
        return queryTokens.every(token => normalizedText.includes(token));
    });

    tbody.html(
        filtered.length ? filtered :
        '<tr><td colspan="8" class="text-center text-muted">No matching records.</td></tr>'
    );

});

// ================= OVERDUE RETURNED =================
function loadOverdueReturned() {

    $.ajax({
        url: "/Library/backend/controllers/transaction.php",
        type: "GET",
        data: { action: "getTransactions" },
        dataType: "json",

        success: function(response){

            const tbody = $("#overdueSummaryBody");

            if(response.status !== "success"){
                tbody.html('<tr><td colspan="8" class="text-center text-muted">No records found.</td></tr>');
                return;
            }

            let html = "";

            const overdueReturned = response.data.filter(r => {

                if(r.status !== "Returned" || !r.return_date) return false;

               const [y1,m1,d1] = r.date_due.split('-');
                const [y2,m2,d2] = r.return_date.split('-');

                const due = new Date(y1, m1-1, d1);
                const returned = new Date(y2, m2-1, d2);

                due.setHours(0,0,0,0);
                returned.setHours(0,0,0,0);

                return returned > due;
            });

            if(overdueReturned.length === 0){
                tbody.html('<tr><td colspan="8" class="text-center text-muted">No overdue returned books.</td></tr>');
                return;
            }

            overdueReturned.forEach(r => {
                let courseYearSection = r.course_year_section || '';
                if (!courseYearSection) {
                    const year = r.year_level ? r.year_level : '';
                    const section = r.section_name ? r.section_name : '';
                    courseYearSection = `${year}${section ? '/' + section : ''}`.trim();
                }
                const department = r.department || '-';

                html += `
                <tr>
                    <td data-label="ID" class="text-center">${r.borrow_id}</td>
                    <td data-label="Name" class="text-center">${r.full_name}</td>
                    <td data-label="Student No." class="text-center">${r.student_number}</td>
                    <td data-label="Course/Year/Section" class="text-center">${courseYearSection}</td>
                    <td data-label="Department" class="text-center">${department}</td>
                    <td data-label="Book" class="text-center">${r.book_title}</td>
                    <td data-label="Due Date" class="text-center">${r.date_due}</td>
                    <td data-label="Return Date" class="text-center">${r.return_date}</td>
                    <td data-label="Status" class="text-center">
                        <span class="text-danger fw-semibold">Returned Late</span>
                    </td>
                </tr>
                `;

            });

            tbody.html(html);
            overdueRows = tbody.children().clone();
            allOverdueData = overdueReturned;

        }
    });

}
$('#searchOverdueInput').on('input', function(){

    const queryTokens = getSearchTokens($(this).val());
    const tbody = $('#overdueSummaryBody');

    if(!queryTokens.length){
        tbody.html(overdueRows);
        return;
    }

    const filtered = overdueRows.filter(function(){
        const normalizedText = normalizeSearchText($(this).text());
        return queryTokens.every(token => normalizedText.includes(token));
    });

    tbody.html(
        filtered.length ? filtered :
        '<tr><td colspan="8" class="text-center text-muted">No matching records.</td></tr>'
    );

});

// ================= REPORT VIEW SWITCH =================
function showReportSection(view) {
    $('#manageHeader').toggleClass('d-none', view !== 'borrowed');
    $('#manageActions').toggleClass('d-none', view !== 'borrowed');
    $('#borrowedSection').toggleClass('d-none', view !== 'borrowed');
    $('#returnedSection').toggleClass('d-none', view !== 'returned');
    $('#overdueSection').toggleClass('d-none', view !== 'overdue');

    if (view === 'returned') {
        loadReturnedSummary();
    } else if (view === 'overdue') {
        loadOverdueReturned();
    }
}

function openReportViewFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');

    if (view === 'returned' || view === 'overdue') {
        showReportSection(view);
    } else {
        showReportSection('borrowed');
    }
}

// ================= NOTIFY MODAL =================
function showNotifyModal(id, name, book, due_date) {

    currentNotifyId = id;

    $('#notifyStudentName').text(name);
    $('#notifyBookTitle').text(book);
    $('#notifyDueDate').text(due_date);

    const modal = new bootstrap.Modal(document.getElementById('notifyOverdueModal'));
    modal.show();
}


// ================= EXPORT FUNCTIONS =================
function getVisibleBorrowedRows() {
    // Get currently visible rows from the main borrowed table
    const tbody = $('#manageTableBody');
    const rows = [];
    
    tbody.find('tr').each(function() {
        const $row = $(this);
        const text = $row.text();
        
        // Skip "no records" message rows
        if (text.includes('No records') || text.includes('No borrowed') || text.includes('No matching')) {
            return;
        }
        
        const cells = $row.find('td');
        if (cells.length > 0) {
            rows.push({
                borrow_id: cells.eq(0).text().trim(),
                full_name: cells.eq(1).text().trim(),
                student_number: cells.eq(2).text().trim(),
                year_section: cells.eq(3).text().trim(),
                book_title: cells.eq(4).text().trim(),
                date_due: cells.eq(5).text().trim(),
                status: cells.eq(6).text().trim()
            });
        }
    });
    
    return rows;
}

function exportBorrowExcel() {
    const filteredData = getVisibleBorrowedRows();
    
    if (filteredData.length === 0) {
        Swal.fire({
            icon: "warning",
            title: "No Data",
            text: "No records to export."
        });
        return;
    }
    
    const exportData = filteredData.map(r => ({
        'ID': r.borrow_id,
        'Name': r.full_name,
        'Student No.': r.student_number,
        'Year/Section': r.year_section,
        'Book': r.book_title,
        'Due Date': r.date_due,
        'Status': r.status
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Borrowed Books");
    XLSX.writeFile(workbook, "borrowed_books.xlsx");
}

function getJsPDFConstructor() {
    if (window.jspdf && typeof window.jspdf.jsPDF === 'function') {
        return window.jspdf.jsPDF;
    }
    if (typeof window.jsPDF === 'function') {
        return window.jsPDF;
    }
    return null;
}

function exportBorrowPDF() {
    const filteredData = getVisibleBorrowedRows();
    
    if (filteredData.length === 0) {
        Swal.fire({
            icon: "warning",
            title: "No Data",
            text: "No records to export."
        });
        return;
    }

    const jsPDFConstructor = getJsPDFConstructor();
    if (!jsPDFConstructor) {
        Swal.fire({
            icon: "error",
            title: "Export Error",
            text: "PDF export library is not loaded."
        });
        return;
    }
    
    const doc = new jsPDFConstructor();
    const tableData = filteredData.map(r => [
        r.borrow_id,
        r.full_name,
        r.student_number,
        r.year_section,
        r.book_title,
        r.date_due,
        r.status
    ]);
    
    doc.autoTable({
        head: [['ID', 'Name', 'Student No.', 'Year/Section', 'Book', 'Due Date', 'Status']],
        body: tableData,
        didDrawPage: function(data) {
            doc.setFontSize(14);
            doc.text("Borrowed Books Report", 14, 15);
        }
    });
    
    doc.save("borrowed_books.pdf");
}

function getVisibleReturnedRows() {
    // Get currently visible rows from the table
    const tbody = $('#returnedSummaryBody');
    const rows = [];
    
    tbody.find('tr').each(function() {
        const $row = $(this);
        const text = $row.text();
        
        // Skip "no records" message rows
        if (text.includes('No matching') || text.includes('No returned')) {
            return;
        }
        
        const cells = $row.find('td');
        if (cells.length > 0) {
            rows.push({
                borrow_id: cells.eq(0).text().trim(),
                full_name: cells.eq(1).text().trim(),
                student_number: cells.eq(2).text().trim(),
                year_section: cells.eq(3).text().trim(),
                department: cells.eq(4).text().trim(),
                book_title: cells.eq(5).text().trim(),
                return_date: cells.eq(6).text().trim(),
                account_name: cells.eq(7).text().trim(),
                status: 'Returned'
            });
        }
    });
    
    return rows;
}

function getVisibleOverdueRows() {
    // Get currently visible rows from the table
    const tbody = $('#overdueSummaryBody');
    const rows = [];
    
    tbody.find('tr').each(function() {
        const $row = $(this);
        const text = $row.text();
        
        // Skip "no records" message rows
        if (text.includes('No matching') || text.includes('No overdue')) {
            return;
        }
        
        const cells = $row.find('td');
        if (cells.length > 0) {
            rows.push({
                borrow_id: cells.eq(0).text().trim(),
                full_name: cells.eq(1).text().trim(),
                student_number: cells.eq(2).text().trim(),
                year_section: cells.eq(3).text().trim(),
                department: cells.eq(4).text().trim(),
                book_title: cells.eq(5).text().trim(),
                date_due: cells.eq(6).text().trim(),
                return_date: cells.eq(7).text().trim(),
                status: 'Returned Late'
            });
        }
    });
    
    return rows;
}

function exportReturnedExcel() {
    const filteredData = getVisibleReturnedRows();
    
    if (filteredData.length === 0) {
        Swal.fire({
            icon: "warning",
            title: "No Data",
            text: "No records to export."
        });
        return;
    }
    
    const exportData = filteredData.map(r => ({
        'ID': r.borrow_id,
        'Name': r.full_name,
        'Student No.': r.student_number,
        'Course/Year/Section': r.year_section,
        'Department': r.department || '-',
        'Book': r.book_title,
        'Return Date': r.return_date,
        'Returned To': r.account_name,
        'Status': 'Returned'
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Returned Books");
    XLSX.writeFile(workbook, "returned_books.xlsx");
}

function exportReturnedPDF() {
    const filteredData = getVisibleReturnedRows();
    
    if (filteredData.length === 0) {
        Swal.fire({
            icon: "warning",
            title: "No Data",
            text: "No records to export."
        });
        return;
    }

    const jsPDFConstructor = getJsPDFConstructor();
    if (!jsPDFConstructor) {
        Swal.fire({
            icon: "error",
            title: "Export Error",
            text: "PDF export library is not loaded."
        });
        return;
    }
    
    const doc = new jsPDFConstructor();
    const tableData = filteredData.map(r => [
        r.borrow_id,
        r.full_name,
        r.student_number,
        r.year_section,
        r.department || '-',
        r.book_title,
        r.return_date,
        r.account_name,
        'Returned'
    ]);
    
    doc.autoTable({
        head: [['ID', 'Name', 'Student No.', 'Course/Year/Section', 'Department', 'Book', 'Return Date', 'Returned To', 'Status']],
        body: tableData,
        didDrawPage: function(data) {
            doc.setFontSize(14);
            doc.text("Returned Books Report", 14, 15);
        }
    });
    
    doc.save("returned_books.pdf");
}

function exportOverdueExcel() {
    const filteredData = getVisibleOverdueRows();
    
    if (filteredData.length === 0) {
        Swal.fire({
            icon: "warning",
            title: "No Data",
            text: "No records to export."
        });
        return;
    }
    
    const exportData = filteredData.map(r => ({
        'ID': r.borrow_id,
        'Name': r.full_name,
        'Student No.': r.student_number,
        'Year/Section': r.year_section,
        'Book': r.book_title,
        'Due Date': r.date_due,
        'Return Date': r.return_date,
        'Status': 'Returned Late'
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Overdue Books");
    XLSX.writeFile(workbook, "overdue_books.xlsx");
}

function exportOverduePDF() {
    const filteredData = getVisibleOverdueRows();
    
    if (filteredData.length === 0) {
        Swal.fire({
            icon: "warning",
            title: "No Data",
            text: "No records to export."
        });
        return;
    }

    const jsPDFConstructor = getJsPDFConstructor();
    if (!jsPDFConstructor) {
        Swal.fire({
            icon: "error",
            title: "Export Error",
            text: "PDF export library is not loaded."
        });
        return;
    }
    
    const doc = new jsPDFConstructor();
    const tableData = filteredData.map(r => [
        r.borrow_id,
        r.full_name,
        r.student_number,
        r.year_section,
        r.book_title,
        r.date_due,
        r.return_date,
        'Returned Late'
    ]);
    
    doc.autoTable({
        head: [['ID', 'Name', 'Student No.', 'Year/Section', 'Book', 'Due Date', 'Return Date', 'Status']],
        body: tableData,
        didDrawPage: function(data) {
            doc.setFontSize(14);
            doc.text("Overdue Returned Books Report", 14, 15);
        }
    });
    
    doc.save("overdue_books.pdf");
}


// ================= SEARCH =================
function normalizeSearchText(text) {
    return text.toString().toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function getSearchTokens(text) {
    return normalizeSearchText(text).split(' ').filter(Boolean);
}

function updateBorrowedSearch() {
    const rawQuery = $('#searchBorrowInput').val();
    const queryTokens = getSearchTokens(rawQuery);
    const tbody = $('#manageTableBody');

    if (!queryTokens.length) {
        tbody.html(allBorrowedRows);
        bindBorrowActionEvents();
        return;
    }

    const visibleRows = allBorrowedRows.filter(function() {
        const rawText = $(this).text();
        const normalizedText = normalizeSearchText(rawText);
        return queryTokens.every(token => normalizedText.includes(token));
    });

    tbody.html(
        visibleRows.length > 0
        ? visibleRows
        : '<tr><td colspan="9" class="py-5 text-muted text-center">No matching records found.</td></tr>'
    );

    if (visibleRows.length > 0) {
        bindBorrowActionEvents();
    }
}

$('#searchBorrowInput').on('input', updateBorrowedSearch);


// ================= INITIAL LOAD =================
$(document).ready(function() {

    loadRecords();
    openReportViewFromQuery();

    // ================= NOTIFY CONFIRMATION =================
    $('#confirmNotifyBtn').off('click').on('click', function() {
        
        if (!currentNotifyId) return;

        $.ajax({
            url: "/Library/backend/controllers/transaction.php",
            type: "POST",
            data: { 
                action: "sendOverdueNotification", 
                borrow_id: currentNotifyId 
            },
            dataType: "json",

            success: function(response) {

                if(response.status === "success") {

                    Swal.fire({
                        icon: "success",
                        title: "Email Sent!",
                        text: response.message,
                        timer: 2000,
                        showConfirmButton: false
                    });

                } else {

                    Swal.fire({
                        icon: "error",
                        title: "Failed",
                        text: response.message
                    });

                }

            },

            complete: function() {
                currentNotifyId = null;

                const modalEl = document.getElementById('notifyOverdueModal');
                const modalInstance = bootstrap.Modal.getInstance(modalEl);
                if (modalInstance) modalInstance.hide();
            },

            error: function(err){

                console.error(err);

                Swal.fire({
                    icon: "error",
                    title: "Server Error",
                    text: "Failed to send notification email."
                });

            }

        });

    });

    // ================= EXPORT MAIN BORROWED TABLE =================
    $('#exportBorrowPdf').off('click').on('click', function() {
        exportBorrowPDF();
    });

    $('#exportBorrowExcel').off('click').on('click', function() {
        exportBorrowExcel();
    });

    // ================= EXPORT RETURNED BOOKS =================
    $('#exportReturnedPdf').off('click').on('click', function() {
        exportReturnedPDF();
    });

    $('#exportReturnedExcel').off('click').on('click', function() {
        exportReturnedExcel();
    });

    // ================= EXPORT OVERDUE BOOKS =================
    $('#exportOverduePdf').off('click').on('click', function() {
        exportOverduePDF();
    });

    $('#exportOverdueExcel').off('click').on('click', function() {
        exportOverdueExcel();
    });

});
