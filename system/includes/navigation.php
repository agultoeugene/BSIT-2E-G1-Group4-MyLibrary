<aside class="sidebar">
  <div class="sidebar-header d-flex align-items-center justify-content-between">
    <a class="logo" href="/Library/system/pages/dashboard.php">My LIBRARY</a>
    <button class="btn btn-outline-secondary sidebar-toggler d-lg-none" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
      <i class="bi bi-list"></i>
    </button>
  </div>

  <?php 
    $currentPage = basename($_SERVER['PHP_SELF']);
    $placeholder = "Search Book";
    if ($currentPage == "student.php") {
      $placeholder = "Search Student";
    } elseif ($currentPage == "manageBorrow.php") {
      $placeholder = "Search Borrowed Books";
    }
  ?>

  <div class="collapse d-lg-block" id="sidebarMenu">
    <div class="sidebar-nav link-container">
      <a class="nav-link <?php echo $currentPage == 'dashboard.php' ? 'active' : ''; ?>" href="/Library/system/pages/dashboard.php"><i class="bi bi-speedometer2 me-2"></i>Dashboard</a>
      <a class="nav-link <?php echo $currentPage == 'book.php' ? 'active' : ''; ?>" href="/Library/system/pages/book.php"><i class="bi bi-book me-2"></i>Books</a>
      <a class="nav-link <?php echo $currentPage == 'student.php' ? 'active' : ''; ?>" href="/Library/system/pages/student.php"><i class="bi bi-people me-2"></i>Student</a>
      <a class="nav-link <?php echo $currentPage == 'borrow.php' ? 'active' : ''; ?>" href="/Library/system/pages/borrow.php"><i class="bi bi-journal-plus me-2"></i>Borrow</a>
      <a class="nav-link <?php echo $currentPage == 'manageBorrow.php' && !isset($_GET['view']) ? 'active' : ''; ?>" href="/Library/system/pages/manageBorrow.php"><i class="bi bi-journal-bookmark me-2"></i>Manage Books</a>
      <a class="nav-link <?php echo $currentPage == 'manageBorrow.php' && isset($_GET['view']) && $_GET['view'] === 'returned' ? 'active' : ''; ?>" href="/Library/system/pages/manageBorrow.php?view=returned"><i class="bi bi-arrow-counterclockwise me-2"></i>Returned Books</a>
      <a class="nav-link <?php echo $currentPage == 'manageBorrow.php' && isset($_GET['view']) && $_GET['view'] === 'overdue' ? 'active' : ''; ?>" href="/Library/system/pages/manageBorrow.php?view=overdue"><i class="bi bi-clock-history me-2"></i>Late Returned</a>
      <?php if(isset($_SESSION['role']) && $_SESSION['role'] === 'Admin'): ?>
        <a class="nav-link <?php echo $currentPage == 'account.php' ? 'active' : ''; ?>" href="/Library/system/pages/account.php"><i class="bi bi-person-badge me-2"></i>Account</a>
      <?php endif; ?>
    </div>

    <div class="sidebar-footer mt-4 px-3">
      <a href="/Library/backend/controllers/logout.php" class="btn btn-danger w-100 logout-btn d-flex align-items-center justify-content-center" onclick="return confirmLogout(event)">
        <i class="bi bi-box-arrow-right me-1"></i> Logout
      </a>
    </div>
  </div>
</aside>

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
