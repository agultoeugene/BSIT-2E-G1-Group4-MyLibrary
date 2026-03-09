<?php $currentPage = basename($_SERVER['PHP_SELF']);?>
<?php include("pages/navbar.php"); ?>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>My Library - Dashboard</title>
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
    />
    <link rel="stylesheet" href="assets/nav.css" />
    <link rel="stylesheet" href="assets/dash.css" />
  </head>

  <body class="bg-body-tertiary">
    <div class="container mt-3 pt-5 page-content">
      <h1 class="mb-4 text-primary text-center">Dashboard Overview</h1>
      <div class="row g-4">
        <!-- Box 1 -->
        <div class="col-12 col-md-6 col-lg-4">
          <div class="card shadow-sm dashboard-card box-1">
            <div class="card-body align-content-center text-center">
              <h4 class="text-muted">Total Books</h4>
              <h2 class="fw-bold">0</h2>
            </div>
          </div>
        </div>

        <!-- Box 2 -->
        <div class="col-12 col-md-6 col-lg-4">
          <div class="card shadow-sm dashboard-card box-2">
            <div class="card-body text-center align-content-center">
              <h4 class="text-muted">Total Categories</h4>
              <h2 class="fw-bold">0</h2>
            </div>
          </div>
        </div>

        <!-- Box 3 -->
        <div class="col-12 col-md-6 col-lg-4">
          <div class="card shadow-sm dashboard-card box-3">
            <div class="card-body text-center align-content-center">
              <h4 class="text-muted">Total Students</h4>
              <h2 class="fw-bold">0</h2>
            </div>
          </div>
        </div>

        <!-- Box 4 -->
        <div class="col-12 col-md-6 col-lg-4">
          <div class="card shadow-sm dashboard-card box-4">
            <div class="card-body text-center align-content-center">
              <h4 class="text-muted">Borrowed Books</h4>
              <h2 class="fw-bold text-warning">0</h2>
            </div>
          </div>
        </div>

        <!-- Box 5 -->
        <div class="col-12 col-md-6 col-lg-4">
          <div class="card shadow-sm dashboard-card box-5">
            <div class="card-body text-center align-content-center">
              <h4 class="text-muted">Available Books</h4>
              <h2 class="fw-bold text-success">0</h2>
            </div>
          </div>
        </div>

        <!-- Box 6 -->
        <div class="col-12 col-md-6 col-lg-4">
          <div class="card shadow-sm dashboard-card box-6">
            <div class="card-body text-center align-content-center">
              <h4 class="text-muted">Overdue Books</h4>
              <h2 class="fw-bold text-danger">0</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
    <script src="script/books.js"></script>
  </body>
</html>
