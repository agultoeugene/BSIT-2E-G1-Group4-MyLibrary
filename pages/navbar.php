
<nav class="navbar navbar-expand-lg nav-container py-4 bg-body-tertiary fixed-top">
  <div class="container-fluid d-flex align-items-center justify-content-between">

     <a class="logo" href="#">My LIBRARY/</a>

    <div class="d-flex align-items-center gap-3 d-lg-none">

      <button class="btn" type="button" data-bs-toggle="collapse" data-bs-target="#mobileSearch">
        <i class="bi bi-search fs-5"></i>
      </button>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup">
        <span class="navbar-toggler-icon"></span>
      </button>

    </div>
    <?php 
        $currentPage = basename($_SERVER['PHP_SELF']);
        $placeholder = "Search Book";
          if ($currentPage == "student.php") {
              $placeholder = "Search Student";
          }
    ?>
    <div class="collapse navbar-collapse justify-content-lg-center" id="navbarNavAltMarkup">
      <div class="navbar-nav link-container gap-5">
        <a class="nav-link <?php echo $currentPage == 'index.php' ? 'active' : ''; ?>" href="/BSIT-2E-G1-Group4-MyLibrary/index.php">Dashboard</a>
        <a class="nav-link <?php echo $currentPage == 'book.php' ? 'active' : ''; ?>" href="/BSIT-2E-G1-Group4-MyLibrary/pages/book.php">Books</a>
        <a class="nav-link <?php echo $currentPage == 'student.php' ? 'active' : ''; ?>" href="/BSIT-2E-G1-Group4-MyLibrary/pages/student.php">Student</a>
        <a class="nav-link <?php echo $currentPage == 'borrow.php' ? 'active' : ''; ?>" href="/BSIT-2E-G1-Group4-MyLibrary/pages/borrow.php">Borrow Books</a>
        <a class="nav-link <?php echo $currentPage == 'manageBorrow.php' ? 'active' : ''; ?>" href="/BSIT-2E-G1-Group4-MyLibrary/pages/manageBorrow.php">Manage Books</a>
      </div>
    </div>

    <form class="d-none d-lg-flex search-box" role="search" onsubmit="handleSearch(event, true)">
      <input 
        class="form-control me-2"
        type="search"
        placeholder="<?php echo $placeholder; ?>"
        oninput="handleLiveSearch(event)"
      >
      <button class="btn btn-outline-primary" type="submit">
        <i class="bi bi-search"></i>
      </button>
    </form>

  </div>
</nav>

<div class="collapse bg-body-tertiary px-3 pb-3 pt-2 d-lg-none" id="mobileSearch">
  <form class="d-flex" onsubmit="handleSearch(event, true)">
    <input 
      id="searchInput"
      class="form-control me-2"
      type="search"
      placeholder="Search Book"
      oninput="handleLiveSearch(event)"
    >
    <button class="btn btn-outline-primary" type="submit">
      <i class="bi bi-search"></i>
    </button>
  </form>
</div>