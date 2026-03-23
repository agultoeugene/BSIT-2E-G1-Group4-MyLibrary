
<!doctype html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Library - Book</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />
    <link rel="stylesheet" href="../assets/css/nav.css" />
    <link rel="stylesheet" href="../assets/css/book.css" />
    <title>My Library - Category</title>
</head>

<body>
  <?php include("../includes/navigation.php");?>
    <div class="container mt-1 pt-1 page-content">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h3>Book List</h3>
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addBookModal">
          Add Book
        </button>
        </div>

        <div class="row g-4" id="bookContainer"></div>
    </div>
<div class="modal fade" id="addBookModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-lg modal-dialog-centered">
    <div class="modal-content">

      <div class="modal-header">
        <h5 class="modal-title">Add New Book</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>

      <div class="modal-body">
        <div class="row g-3">
          
        <input type="hidden" id="book_id">
          <div class="col-md-6">
            <label for="title" class="form-label">Book Title</label>
            <input type="text" id="title" class="form-control" />
             <small class="text-danger" id="errTitle"></small>
          </div>

          <div class="col-md-6">
            <label for="author" class="form-label">Author</label>
            <input type="text" id="author" class="form-control" />
            <small class="text-danger" id="errAuthor"></small>
          </div>

          <div class="col-md-6">
            <label for="isbn" class="form-label">ISBN</label>
            <input type="text" id="isbn" class="form-control" />
            <small class="text-danger" id="errIsbn"></small>
          </div>

          <div class="col-md-6">
            <label for="genre" class="form-label">Genre</label>
            <input type="text" id="genre" class="form-control" />
            <small class="text-danger" id="errGenre"></small>
          </div>

          <div class="col-md-6">
            <label for="location" class="form-label">Library Location</label>
            <input type="text" id="location" class="form-control" />
            <small class="text-danger" id="errLoc"></small>
          </div>

          <div class="col-md-6">
            <label for="availability" class="form-label">Availability</label>
            <select id="availability" class="form-select">
              <option value="Available">Available</option>
              <option value="Not Available">Not Available</option>
            </select>
          </div>

          <div class="col-md-6">
            <label for="quantity" class="form-label">Quantity</label>
            <input type="number" id="quantity" class="form-control" min="1" />
            <small class="text-danger" id="errQuantity"></small>
          </div>

          <div class="col-md-6">
            <label for="publisher" class="form-label">Publisher (Optional)</label>
            <input type="text" id="publisher" class="form-control" />
          </div>

          <div class="col-md-6">
            <label for="cover" class="form-label">Book Cover (Optional)</label>
            <input type="file" id="cover" class="form-control" accept="image/*" />
          </div>

          <div class="col-12">
            <label for="description" class="form-label">Short Description</label>
            <textarea id="description" class="form-control" rows="3"></textarea>
          <small class="text-danger" id="errDesc"></small>
          </div>
          <input type="hidden" id="originalCover">
        </div>
        
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary" onclick="saveBook()">
          Save Book
      </button>
      </div>

    </div>
  </div>
</div>

<div class="modal fade" id="bookDetailsModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header border-0">
        <h5 class="modal-title">Book Details</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body text-center">
        <img id="viewCover" src="" class="img-fluid mb-3" style="max-height: 250px; border-radius: 5px;" alt="Book Cover">
        
        <h3 id="viewTitle" class="fw-bold"></h3>
        <p class="mb-1"><strong>Author:</strong> <span id="viewAuthor"></span></p>
        <p class="mb-1"><strong>ISBN:</strong> <span id="viewIsbn"></span></p>
        <p class="mb-1"><strong>Genre:</strong> <span id="viewGenre"></span></p>
        <p class="mb-1"><strong>Location:</strong> <span id="viewLocation"></span></p>
        <p class="mb-1"><strong>Publisher:</strong> <span id="viewPublisher"></span></p>
        <p class="mb-3"><strong>Availability:</strong> <span id="viewStatus"></span></p>
        
        <p id="viewDescription" class="text-muted small px-4"></p>
        <div class="modal-footer">
          <div id="deleteBookBtnContainer"></div>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</div>
   <script src="https://code.jquery.com/jquery-4.0.0.js" integrity="sha256-9fsHeVnKBvqh3FB2HYu7g2xseAZ5MlN6Kz/qnkASV8U=" crossorigin="anonymous"></script> 
   <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
   <script src="../assets/scripts/Books/displayBook.js"></script>
   <script src="../assets/scripts/Books/addBook.js"></script>
   <script src="../assets/scripts/Books/deleteBook.js"></script>
   <script src="../assets/scripts/Books/editBook.js"></script>
</body>
</html>