<?php
include("../../backend/config/config.php");
requireLogin();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>My Library - Manage Borrow Books</title>
     <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />
    <link rel="stylesheet" href="../assets/css/nav.css" />
    <style>
        html,
        body {
            overflow-x: hidden;
        }
        .manage-container {
            overflow-x: hidden;
        }
        .manage-container .btn {
            border-radius: 0.75rem;
            padding: 8px 16px;
            font-weight: 600;
            font-size: 0.88rem;
            box-shadow: none;
            transition: transform 0.15s ease, background-color 0.15s ease, opacity 0.15s ease;
            min-height: 38px;
        }
        .manage-container .action-row > button,
        .manage-container .action-row > a {
            flex: 1 1 168px;
            min-width: 140px;
            max-width: 220px;
            text-align: center;
        }
        .manage-container .btn i {
            margin-right: 0.3rem;
        }
        .manage-container .btn:hover,
        .manage-container .btn:focus {
            transform: translateY(-1px);
            opacity: 0.95;
        }
        .manage-container .btn-primary {
            background-color: #111827;
            border-color: #111827;
            color: #ffffff;
        }
        .manage-container .btn-secondary {
            background-color: #f8fafc;
            border-color: #d1d5db;
            color: #111827;
        }
        .manage-container .btn-success {
            background-color: #0f766e;
            border-color: #0f766e;
            color: #ffffff;
        }
        .manage-container .btn-danger {
            background-color: #dc2626;
            border-color: #dc2626;
            color: #ffffff;
        }
        .manage-container .action-row {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            align-items: center;
        }
        .manage-container .action-row > button,
        .manage-container .action-row > a {
            flex: 0 1 auto;
            white-space: nowrap;
        }
        .manage-container .action-row .ms-auto,
        .manage-container .action-row .search-box {
            flex: 0 1 auto;
            min-width: 180px;
            max-width: 260px;
            width: auto;
        }
        .manage-container .table-responsive {
            display: block;
            width: 100%;
            max-width: 100%;
            border: 1px solid #e5e7eb;
            border-radius: 18px;
            overflow-x: auto;
            background: #ffffff;
            -webkit-overflow-scrolling: touch;
            margin-top: 0;
        }
        .manage-container .table {
            width: auto;
            min-width: 100%;
            border-collapse: collapse;
            table-layout: auto;
        }
        .manage-container .table thead th,
        .manage-container .table tbody td {
            white-space: nowrap;
            overflow-wrap: normal;
        }
        .manage-container .table {
            border: none;
            margin-bottom: 0;
        }
        .manage-container .table thead th {
            color: #6b7280;
            font-weight: 700;
            font-size: 0.78rem;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            border-bottom: 1px solid #e5e7eb;
            padding: 12px 10px;
        }
        .manage-container .table tbody tr {
            border-bottom: 1px solid #f3f4f6;
        }
        .manage-container .table tbody td {
            border: none;
            padding: 10px 10px;
            color: #111827;
            font-size: 0.90rem;
        }
        .manage-container .table tbody tr:hover {
            background: #f8fafc;
        }
        .manage-container .form-control {
            border-radius: 999px;
            border: 1px solid #d1d5db;
            background: #f8fafc;
            padding: 12px 18px;
        }
        .manage-container .form-control:focus {
            border-color: #9ca3af;
            box-shadow: none;
        }
        @media (max-width: 992px) {
            .manage-container .manage-header {
                flex-direction: column;
                align-items: stretch;
                gap: 0.75rem;
            }
            .manage-container .manage-header .btn {
                width: 100%;
            }
        }
        @media (max-width: 768px) {
            .manage-container .action-row {
                flex-direction: column;
                align-items: stretch;
            }
            .manage-container .action-row > button,
            .manage-container .action-row > a {
                width: 100%;
            }
            .manage-container .action-row .ms-auto {
                width: auto;
                max-width: 260px;
                margin-left: 0 !important;
                min-width: auto;
            }
            .manage-container .form-control {
                padding: 10px 12px;
            }
            .manage-container .table {
                min-width: 100%;
            }
            .manage-container .table thead th,
            .manage-container .table tbody td {
                padding: 10px 8px;
                font-size: 0.84rem;
            }
            .manage-container .table-responsive {
                overflow-x: auto;
            }
            .manage-container .table-responsive::-webkit-scrollbar {
                height: 8px;
            }
            .manage-container .table-responsive::-webkit-scrollbar-thumb {
                background: rgba(15, 23, 42, 0.16);
                border-radius: 10px;
            }
        }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  
</head>
<body>
     <?php include("../includes/navigation.php");?>
<div class="container manage-container ">

    <div class="manage-header mb-4 d-flex justify-content-between align-items-center">
        <h2 class="fw-bold">Borrowed List</h2>
        <a href="borrow.php" class="btn btn-primary">Add Borrow</a>
    </div>

<div class="mb-0 d-flex align-items-center gap-2 action-row">

    <!-- Returned Books Report -->
    <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#returnedSummaryModal">
        Returned Books Report
    </button>

    <!-- Overdue Returns -->
    <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#overdueSummaryModal">
        Overdue Returns
    </button>

    <!-- Export Main Table -->
    <button id="exportBorrowPdf" class="btn btn-secondary">
        <i class="bi bi-file-pdf"></i> Export PDF
    </button>
    <button id="exportBorrowExcel" class="btn btn-success">
        <i class="bi bi-file-earmark-excel"></i> Export Excel
    </button>

    <!-- Search -->
    <div class="ms-auto search-box">
        <input type="text" id="searchBorrowInput" class="form-control" placeholder="🔍 Search borrowed">
    </div>

</div>
<div class="modal fade" id="returnBookModal" tabindex="-1" aria-labelledby="returnBookModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title fw-bold" id="returnBookModalLabel">Return Book</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p><strong>Student Name:</strong> <span id="modalStudentName"></span></p>
        <p><strong>Student Number:</strong> <span id="modalStudentNumber"></span></p>
        <p><strong>Book(s):</strong> <span id="modalBooks"></span></p>
        <p><strong>Due Date:</strong> <span id="modalDueDate"></span></p>
        <p><strong>Return Date:</strong> <span id="modalReturnDate"></span></p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-success" id="confirmReturnBtn">Confirm Return</button>
      </div>
    </div>
  </div>
</div>

<!-- Notify Overdue Modal -->
<div class="modal fade" id="notifyOverdueModal" tabindex="-1" aria-labelledby="notifyOverdueModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title fw-bold" id="notifyOverdueModalLabel">
          📧 Send Overdue Notification
        </h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="alert alert-warning" role="alert">
          <strong>⚠️ Confirmation Required</strong>
          <p>You are about to send an overdue book notification email to the student.</p>
        </div>
        
        <div class="details-box bg-light p-3 rounded border">
          <p><strong>Student:</strong> <span id="notifyStudentName"></span></p>
          <p><strong>Book:</strong> <span id="notifyBookTitle"></span></p>
          <p><strong>Due Date:</strong> <span id="notifyDueDate"></span></p>
        </div>

        <p class="mt-3 text-muted">
          A formal email notification with the overdue book details will be sent to the student's registered email address.
        </p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary" id="confirmNotifyBtn">
          <i class="bi bi-send"></i> Send Notification Email
        </button>
      </div>
    </div>
  </div>
</div>
<div class="modal fade" id="returnedSummaryModal" tabindex="-1">
  <div class="modal-dialog modal-xl">
    <div class="modal-content">

      <div class="modal-header">
        <h5 class="modal-title fw-bold">Returned Books Report</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>

      <div class="modal-body">

        <!-- SEARCH -->
        <input type="text" id="searchReturnedInput" class="form-control mb-2"
               placeholder="Search returned records...">

        <div class="table-responsive">
          <table class="table table-sm table-bordered custom-table">
            <thead class="table-success">
              <tr>
                <th class="text-center">ID</th>
                <th class="text-center">Name</th>
                <th class="text-center">Student No.</th>
                <th class="text-center">Year/Section</th>
                <th class="text-center">Book</th>
                <th class="text-center">Return Date</th>
                <th class="text-center">Returned To</th>
                <th class="text-center">Status</th>
              </tr>
            </thead>
            <tbody id="returnedSummaryBody"></tbody>
          </table>
        </div>

        <div class="mt-3">
          <button id="exportReturnedPdf" class="btn btn-danger">Export PDF</button>
          <button id="exportReturnedExcel" class="btn btn-success">Export Excel</button>
          <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>

      </div>
    </div>
  </div>
</div>
<div class="modal fade" id="overdueSummaryModal" tabindex="-1">
  <div class="modal-dialog modal-xl">
    <div class="modal-content">

      <div class="modal-header">
        <h5 class="modal-title fw-bold">Overdue Returned Books</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>

      <div class="modal-body">

        <!-- SEARCH -->
        <input type="text" id="searchOverdueInput" class="form-control mb-2"
               placeholder="Search overdue records...">

        <div class="table-responsive">
          <table class="table table-sm table-bordered">
            <thead class="table-danger">
              <tr>
                <th class="text-center">ID</th>
                <th class="text-center">Name</th>
                <th class="text-center">Student No.</th>
                <th class="text-center">Year/Section</th>
                <th class="text-center">Book</th>
                <th class="text-center">Due Date</th>
                <th class="text-center">Return Date</th>
                <th class="text-center">Status</th>
              </tr>
            </thead>
            <tbody id="overdueSummaryBody"></tbody>
          </table>
        </div>

        <div class="mt-3">
          <button id="exportOverduePdf" class="btn btn-danger">Export PDF</button>
          <button id="exportOverdueExcel" class="btn btn-success">Export Excel</button>
          <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>

      </div>
  
    </div>
  </div>
</div>
<div class="table-responsive">
   <table class="table table-sm table-bordered">

        <thead class="table-primary">
            <tr>
                <th class="text-center">ID</th>
                <th class="text-center">Name</th>
                <th class="text-center">Student Number</th>
                <th class="text-center">Year/Section</th>
                <th class="text-center">Book(s)</th>
                <th class="text-center">Due Date</th>
                <th class="text-center">Status</th>
                <th class="text-center">Action</th>
            </tr>
        </thead>
        <tbody id="manageTableBody" class="text-center"></tbody>
    </table>
</div>

</div>

<script src="https://code.jquery.com/jquery-4.0.0.js" integrity="sha256-9fsHeVnKBvqh3FB2HYu7g2xseAZ5MlN6Kz/qnkASV8U=" crossorigin="anonymous"></script> 
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
<script src="../assets/scripts/manageBorrow/manageBorrow.js"></script>
<script src="../assets/scripts/Books/displayBook.js"></script>
</body>
</html>