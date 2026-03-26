<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>My Library - Manage Borrow Books</title>
     <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />
    <link rel="stylesheet" href="../assets/css/nav.css" />
  
</head>
<body>
     <?php include("../includes/navigation.php");?>
<div class="container manage-container ">

    <div class="manage-header mb-4 d-flex justify-content-between align-items-center">
        <h2 class="fw-bold">Borrowed List</h2>
        <a href="borrow.php" class="btn btn-primary">Add Borrow</a>
    </div>

   <div class="mb-4 text-start">
    <button class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#returnedSummaryModal">
        Show Returned Books Summary
    </button>
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
<div class="modal fade" id="returnedSummaryModal" tabindex="-1" aria-labelledby="returnedSummaryModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title fw-bold" id="returnedSummaryModalLabel">Returned Books Summary</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <table class="table table-bordered">
          <thead class="table-light">
            <tr>

              <th class="text-center">Name</th>
              <th class="text-center">Student Number</th>
              <th class="text-center">Book(s)</th>
              <th class="text-center">Return Date</th>
              <th class="text-center">Action</th>
            </tr>
          </thead>
          <tbody id="returnedSummaryBody"></tbody>
        </table>
      </div>
    </div>
  </div>
</div>

    <table class="table table-bordered custom-table mt-2" style="table-layout: fixed;">
        <thead class="table-light">
            <tr>
                <th class="text-center">Name</th>
                <th class="text-center">Student Number</th>
                <th class="text-center">Book(s)</th>
                <th class="text-center">Due Date</th>
                <th class="text-center">Status</th>
                <th class="text-center">Action</th>
            </tr>
        </thead>
        <tbody id="manageTableBody"></tbody>
    </table>

</div>

</body>
</script>
    <script src="https://code.jquery.com/jquery-4.0.0.js" integrity="sha256-9fsHeVnKBvqh3FB2HYu7g2xseAZ5MlN6Kz/qnkASV8U=" crossorigin="anonymous"></script> 
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="../assets/scripts/manageBorrow/manageBorrow.js"></script>
    <script src="../assets/scripts/Books/displayBook.js"></script>
    
</html>