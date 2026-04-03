<nav class="navbar navbar-expand-lg nav-container py-4 bg-body-tertiary fixed-top">
  <div class="container-fluid d-flex align-items-center justify-content-between">


    <a class="logo" href="#">My LIBRARY/</a>

    <div class="d-flex align-items-center gap-2 d-lg-none">
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

    <div class="collapse navbar-collapse justify-content-center ms-3" id="navbarNavAltMarkup">
      <div class="navbar-nav link-container mx-auto gap-5">
        <a class="nav-link <?php echo $currentPage == 'dashboard.php' ? 'active' : ''; ?>" href="/BSIT-2E-G1-Group4-MyLibrary/system/pages/dashboard.php">Dashboard</a>
        <a class="nav-link <?php echo $currentPage == 'book.php' ? 'active' : ''; ?>" href="/BSIT-2E-G1-Group4-MyLibrary/system/pages/book.php">Books</a>
        <a class="nav-link <?php echo $currentPage == 'student.php' ? 'active' : ''; ?>" href="/BSIT-2E-G1-Group4-MyLibrary/system/pages/student.php">Student</a>
        <a class="nav-link <?php echo $currentPage == 'borrow.php' ? 'active' : ''; ?>" href="/BSIT-2E-G1-Group4-MyLibrary/system/pages/borrow.php">Borrow</a>
        <a class="nav-link <?php echo $currentPage == 'manageBorrow.php' ? 'active' : ''; ?>" href="/../system/pages/manageBorrow.php">Manage Books</a>
        <?php if(isset($_SESSION['role']) && $_SESSION['role'] === 'Admin'): ?>
          <a class="nav-link <?php echo $currentPage == 'account.php' ? 'active' : ''; ?>" href="/BSIT-2E-G1-Group4-MyLibrary/system/pages/account.php">Account</a>
        <?php endif; ?>
      </div>
    </div>

    <!-- Desktop search + logout -->
    <form class="d-none d-lg-flex align-items-stretch gap-1 ms-1" role="search" onsubmit="handleSearch(event, true)">
      <input 
        class="form-control" 
        type="search"
        placeholder="<?php echo $placeholder; ?>"
        oninput="<?php echo $currentPage == 'student.php' ? 'handleLiveStudentSearch(event)' : 'handleLiveSearch(event)'; ?>"
        style="min-width: 200px;"
      >
      <button class="btn btn-outline-primary me-2" type="submit">
        <i class="bi bi-search"></i>
      </button>
      <a href="/../backend/controllers/logout.php" class="btn btn-danger btn-sm d-flex align-items-center px-3" onclick="return confirmLogout(event)">
        Logout <i class="bi bi-box-arrow-right ms-1"></i>
      </a>
    </form>

  </div>
</nav>

<div class="collapse bg-body-tertiary px-3 pb-3 pt-2 d-lg-none" id="mobileSearch">
  <form class="d-flex flex-column gap-2" onsubmit="handleSearch(event, true)">
    <input 
      class="form-control" 
      type="search" 
      placeholder="<?php echo $placeholder; ?>"
      oninput="<?php echo $currentPage == 'student.php' ? 'handleLiveStudentSearch(event)' : 'handleLiveSearch(event)'; ?>"
    >
    <button class="btn btn-outline-primary w-100" type="submit">
      <i class="bi bi-search"></i> Search
    </button>
    <a href="/../backend/controllers/logout.php" class="btn btn-danger w-100" onclick="return confirmLogout(event)">
      Logout <i class="bi bi-box-arrow-right ms-1"></i>
    </a>
  </form>
</div>

<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script>
function confirmLogout(event) {
    event.preventDefault(); 
    const logoutUrl = event.currentTarget.getAttribute('href');

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