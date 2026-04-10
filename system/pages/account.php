<?php
include("../../backend/config/config.php");
requireLogin();

if ($_SESSION['role'] != 'Admin') {
    header("Location: ../pages/dashboard.php"); 
    exit();
}

?>

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>My Library - Account Management</title>
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
    />
    <link rel="stylesheet" href="../assets/css/nav.css" />
    <link rel="stylesheet" href="../assets/css/dashboard.css" />
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  </head>

  <body class="bg-body-tertiary">
    <?php include("../includes/navigation.php"); ?>
<div class="container mt-3 pt-5 page-content">

  <h1 class="mb-4 text-primary text-center">Accounts</h1>

  <!-- Create Account Button -->
  <div class="d-flex justify-content-end mb-3">
    <button 
      class="btn btn-primary"
      data-bs-toggle="modal"
      data-bs-target="#createAccountModal"
    >
      Create Account
    </button>
  </div>

  <!-- Accounts Table -->
  <table class="table table-bordered table-hover text-center">
    <thead class="table-primary">
      <tr>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Email</th>
        <th>Role</th>
        <th>Action</th>
      </tr>
    </thead>

    <tbody id="accountsTable">
    </tbody>

  </table>

</div>

<div class="modal fade" id="createAccountModal" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered"> 
    <div class="modal-content">

      <div class="modal-header">
        <h5 class="modal-title fw-bold">Create Account</h5>
        <button class="btn-close" data-bs-dismiss="modal"></button>
      </div>

      <div class="modal-body">

        <form id="signupForm">

          <div class="mb-2">
            <label class="form-label">First Name</label>
            <input id="fName" type="text" class="form-control">
            <small id="errfName" class="text-danger"></small>
          </div>

          <div class="mb-2">
            <label class="form-label">Last Name</label>
            <input id="lName" type="text" class="form-control">
            <small id="errlName" class="text-danger"></small>
          </div>

          <div class="mb-2">
            <label class="form-label">Role</label>
            <select id="role" class="form-select">
              <option value="">Select Role</option>
              <option value="Librarian">Librarian</option>
              <option value="Admin">Admin</option>
            </select>

            <small id="errRole" class="text-danger"></small>
          </div>

          <div class="mb-2">
            <label class="form-label">Email</label>
            <input id="emailSignup" type="email" class="form-control">
            <small id="errEmailS" class="text-danger"></small>
          </div>

          <div class="mb-2">
            <label class="form-label">Password</label>
            <input id="passwordSignup" type="password" class="form-control">
            <small id="errPasswordS" class="text-danger"></small>
          </div>

          <div class="mb-2">
            <label class="form-label">Confirm Password</label>
            <input id="confirmPass" type="password" class="form-control">
            <small id="errConPass" class="text-danger"></small>
          </div>

          <button class="btn btn-success w-100 mt-3">
            Sign Up
          </button>

        </form>

      </div>

    </div>
  </div>
</div>
  
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="../assets/scripts/Books/displayBook.js"></script>
    <script src="../assets/scripts/account.js"></script>
     <script src="../assets/scripts/register.js"></script>
</body>
</html>