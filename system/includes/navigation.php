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
    <div class="collapse navbar-collapse justify-content-lg-center ms-5" id="navbarNavAltMarkup">
      <div class="navbar-nav link-container gap-5 mx-auto">
        <a class="nav-link <?php echo $currentPage == 'dashboard.php' ? 'active' : ''; ?>" href="/BSIT-2E-G1-Group4-MyLibrary/system/pages/dashboard.php">Dashboard</a>
        <a class="nav-link <?php echo $currentPage == 'book.php' ? 'active' : ''; ?>" href="/BSIT-2E-G1-Group4-MyLibrary/system/pages/book.php">Books</a>
        <a class="nav-link <?php echo $currentPage == 'student.php' ? 'active' : ''; ?>" href="/BSIT-2E-G1-Group4-MyLibrary/system/pages/student.php">Student</a>
        <a class="nav-link <?php echo $currentPage == 'borrow.php' ? 'active' : ''; ?>" href="/BSIT-2E-G1-Group4-MyLibrary/system/pages/borrow.php">Borrow Books</a>
        <a class="nav-link <?php echo $currentPage == 'manageBorrow.php' ? 'active' : ''; ?>" href="/BSIT-2E-G1-Group4-MyLibrary/system/pages/manageBorrow.php">Manage Books</a>
         <?php if(isset($_SESSION['role']) && $_SESSION['role'] === 'Admin'): ?>
        <a class="nav-link <?php echo $currentPage == 'account.php' ? 'active' : ''; ?>" href="/BSIT-2E-G1-Group4-MyLibrary/system/pages/account.php">Account</a>
    <?php endif; ?>
      </div>
    </div>
<form class="d-none d-lg-flex align-items-stretch gap-2 ms-1" role="search" onsubmit="handleSearch(event, true)">
  <input 
    class="form-control" 
    type="search"
    placeholder="<?php echo $placeholder; ?>"
    oninput="<?php echo $currentPage == 'student.php' ? 'handleLiveStudentSearch(event)' : 'handleLiveSearch(event)'; ?>"
    style="min-width: 250px;"
  >
  <button class="btn btn-outline-primary me-5" type="submit">
    <i class="bi bi-search"></i>
  </button>
  <a href="/BSIT-2E-G1-Group4-MyLibrary/backend/controllers/logout.php" class="btn btn-danger btn-sm ms-3 d-flex align-items-center px-3"  onclick="return confirmLogout(event)">
    Logout <i class="bi bi-box-arrow-right ms-1"></i>
  </a>
</form>

  </div>
</nav>

<div class="collapse bg-body-tertiary px-3 pb-3 pt-2 d-lg-none" id="mobileSearch">
  <form class="d-flex" onsubmit="handleSearch(event, true)">
  <input 
  class="form-control me-2"
  type="search"
  placeholder="<?php echo $placeholder; ?>"
  oninput="<?php echo $currentPage == 'student.php' ? 'handleLiveStudentSearch(event)' : 'handleLiveSearch(event)'; ?>"
>
    <button class="btn btn-outline-primary" type="submit">
      <i class="bi bi-search"></i>
    </button>
  </form>
</div>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script>
function confirmLogout(event) {
    event.preventDefault(); 
    let logoutUrl = event.currentTarget.getAttribute('href');

    Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to logout?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, logout",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#d33"
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = logoutUrl;
        }
    });
}
</script>