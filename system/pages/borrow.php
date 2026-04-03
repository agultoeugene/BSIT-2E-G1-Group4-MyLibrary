<?php
include("../../backend/config/config.php");
requireLogin();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>My Library - Borrow Books</title>
     <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />
    <link rel="stylesheet" href="../assets/css/nav.css" />
    <link rel="stylesheet" href="../assets/css/borrow.css" />
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>
<body>
     <?php include("../includes/navigation.php");?>
   
<div class="container mt-4 page-content">
    <div class="mb-4">
        <h3>Borrow Books</h3>
    </div>

    <div class="row justify-content-center">
        <div class="col-md-8 mx-auto text-center">
       
            <div id="step-1">
               <div class="mb-4 text-start">
                   <label class="form-label fw-bold mb-1">Choose Student</label>
                   <div class="dropdown">
                       <button class="btn btn-outline-primary dropdown-toggle w-100 d-flex align-items-center justify-content-between" type="button" id="studentButton" data-bs-toggle="dropdown">
                        Select a Student
                       </button>
                          <ul class="dropdown-menu w-100 shadow" id="studentListContainer" style="max-height: 250px; overflow-y: auto;">
                             <li class="px-3 py-2">
                                <input type="search" class="form-control form-control-sm" id="studentSearchInput" placeholder="Search student">
                            </li>
                          </ul>
                  </div>
                <div id="studentNumber-error" class="text-danger small mt-1" style="display: none;">Please select a student.</div>
             </div>
           
                   <div class="row mb-5">
            <div class="mb-4 text-start">
                <label class="form-label fw-bold mb-1">Book</label>
                <div class="input-group mb-1">
                    <input type="text" id="bookSearchInput" class="form-control" placeholder="Search book to borrow">
                    <button class="btn btn-primary" type="button">
                        <i class="bi bi-search"></i>
                    </button>
                   
                </div>
                 <small id="book-error" class="text-danger small" style="display:none;">
                    Please input a valid book.
                </small>
                <input type="hidden" id="bookId">
                <div id="book-error" class="text-danger small mt-1" style="display: none;"></div>
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label fw-bold">Title</label>
                        <input type="text" id="bookTitle" class="form-control" disabled>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label fw-bold">Genre</label>
                        <input type="text" id="bookGenre" class="form-control" disabled>
                    </div>
                </div>

                <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label fw-bold">Author</label>
                        <input type="text" id="bookAuthor" class="form-control" disabled>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label fw-bold">ISBN</label>
                        <input type="text" id="bookISBN" class="form-control" disabled>
                    </div>
                </div>
            </div>
                <div class="row justify-content-center mt-3">
                    <div class=" text-start mb-4">
                        <label for="dateBorrow" class="form-label fw-bold mb-1">Date of Borrow</label>
                        <input type="date" id="dateBorrow" class="form-control custom-date-blue">
                        <div id="borrow-error" class="text-danger small mt-1" style="display: none;">Please select a borrow date.</div>
                    </div>
                    <div class="text-start mb-5">
                        <label for="dateDue" class="form-label fw-bold mb-1">Date Due</label>
                        <input type="date" id="dateDue" class="form-control custom-date-blue">
                        <div id="due-error" class="text-danger small mt-1" style="display: none;">Please select a due date.</div>
                    </div>
                </div>
           
                <div class="text-center">
                    <button class="btn btn-primary px-5 fw-bold" type="button" onclick="goToStep(2)">Next</button>
                </div>
            </div>
        </div>

   
<div id="step-2" style="display: none;">
    <h4 class="mb-4 text-center">Confirm Details</h4>


    <div class="row justify-content-center">
        <div class="col-md-6 d-flex justify-content-center">
            <table class="table table-borderless w-auto">
                <tbody>
                    <tr>
                        <td class="fw-bold text-end">Full Name:</td>
                        <td id="confirm-name" class="text-primary text-start">--</td>
                    </tr>

                    <tr>
                        <td class="fw-bold text-end">Genre:</td>
                        <td id="confirm-genre" class="text-primary text-start">--</td>
                    </tr>
                    <tr>
                        <td class="fw-bold text-end">Book(s):</td>
                        <td id="confirm-books" class="text-primary text-start">--</td>
                    </tr>
                    <tr>
                        <td class="fw-bold text-end">Date of Borrow:</td>
                        <td id="confirm-dateBorrow" class="text-primary text-start">--</td>
                    </tr>
                    <tr>
                        <td class="fw-bold text-end">Due Date:</td>
                        <td id="confirm-dateDue" class="text-primary text-start">--</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>


    <div class="mt-4 d-flex justify-content-center gap-3">
        <button class="btn btn-outline-secondary px-5" onclick="goToStep(1)">Back</button>
        <button class="btn btn-primary px-5"  onclick="saveTransaction()">Confirm</button>
    </div>
</div>
   

<div id="step-3" style="display: none;">
    <div class="text-center py-5">
        <div class="mb-4">
            <i class="bi bi-check-circle-fill" style="font-size: 5rem; color: #4c76ff;"></i>
        </div>
        <h2 class="fw-bold" style="color: #4c76ff;">Borrowing Successful!</h2>
        <p class="text-muted">Your request is complete. Please return the book(s) by the deadline. Thank you.</p>
       
        <div class="mt-5 d-flex justify-content-center gap-2">
            <button class="btn btn-primary px-5 fw-bold" onclick="location.reload()">
                Borrow Another Book
            </button>
            <a href="/BSIT-2E-G1-Group4-MyLibrary/system/pages/dashboard.php" class="btn btn-outline-secondary px-5">
                Go to Dashboard
            </a>
        </div>
    </div>  
</div>

         <div class="progress mt-5 mx-auto" style="height: 12px; max-width: 65%; border-radius: 10px;">
                <div id="main-progress-bar" class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: 33%"></div>
        </div>
      </div>
    </div>    
</div>

</body>
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="../assets/scripts/borrow/borrow.js"></script>
    <script src="../assets/scripts/Books/displayBook.js"></script>
 
</html>