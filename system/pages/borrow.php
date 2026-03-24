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
                          <ul class="dropdown-menu w-100 shadow" id="studentListContainer" style="max-height: 250px; overflow-y: auto;"></ul>
                  </div>
                <div id="studentNumber-error" class="text-danger small mt-1" style="display: none;">Please select a student.</div>
             </div>
           
                    <div class="row mb-5">
                    <div class="col-md-6 text-start">
                        <label class="form-label fw-bold mb-1">Choose Genre</label>
                        <div class="dropdown">
                            <button class="btn btn-primary dropdown-toggle w-100 d-flex align-items-center justify-content-between" type="button" id="genreButton" data-bs-toggle="dropdown">
                             Genre
                            </button>
                            <ul class="dropdown-menu w-100 shadow">
                                <li><a class="dropdown-item genre-item" href="#">Adventure</a></li>
                                <li><a class="dropdown-item genre-item" href="#">Art</a></li>
                                <li><a class="dropdown-item genre-item" href="#">Cooking</a></li>
                                <li><a class="dropdown-item genre-item" href="#">Education</a></li>
                                <li><a class="dropdown-item genre-item" href="#">History</a></li>
                                <li><a class="dropdown-item genre-item" href="#">Lifestyle</a></li>
                                <li><a class="dropdown-item genre-item" href="#">Mystery</a></li>
                                <li><a class="dropdown-item genre-item" href="#">Science</a></li>
                                <li><a class="dropdown-item genre-item" href="#">Science Fiction</a></li>
                                <li><a class="dropdown-item genre-item" href="#">Self-Help</a></li>
                            </ul>
                        </div>
                        <div id="genre-error" class="text-danger small mt-1" style="display: none;">Please select a genre.</div>
                    </div>


                    <div class="col-md-6 text-start mt-3 mt-md-0">
                        <label class="form-label fw-bold mb-1">Choose Book</label>
                        <div class="dropdown">
                            <button class="btn btn-primary dropdown-toggle w-100 d-flex align-items-center justify-content-between" type="button" id="bookDropdownButton" data-bs-toggle="dropdown">
                                Select Book(s)
                            </button>
                            <ul class="dropdown-menu w-100 shadow p-0" id="bookListContainer">
                                <li class="text-muted small text-center p-3">Select a Genre First</li>
                            </ul>
                        </div>
                        <div id="book-error" class="text-danger small mt-1" style="display: none;">Select at least one book.</div>
                    </div>
                </div>


                <div class="row justify-content-center mt-5">
                    <div class="col-md-8 text-start mb-4">
                        <label for="dateBorrow" class="form-label fw-bold mb-1">Date of Borrow</label>
                        <input type="date" id="dateBorrow" class="form-control custom-date-blue">
                        <div id="borrow-error" class="text-danger small mt-1" style="display: none;">Please select a borrow date.</div>
                    </div>
                    <div class="col-md-8 text-start mb-5">
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
        <button class="btn btn-primary px-5" onclick="goToStep(3)">Confirm</button>
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
 
</html>