<?php
include("../../backend/config/config.php");
requireLogin();

if ($_SESSION['role'] != 'Admin') {
    header("Location: ../pages/dashboard.php"); 
    exit();
}

$sql = "SELECT * FROM accounts WHERE status='pending'";
$result = mysqli_query($conn, $sql);
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
      <h1 class="mb-4 text-primary text-center">Pending Accounts</h1>


      <div class="card shadow-sm">
        <div class="card-body">
          <table class="table ">
            <thead class="table-success">
              <tr>
                <th class="text-center">ID</th>
                <th class="text-center" >First Name</th>
                <th class="text-center">Last Name</th>
                <th class="text-center">Email</th>

                <th class="text-center">Role</th>
                <th class="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
        <?php while($row = mysqli_fetch_assoc($result)) { ?>
            <tr>
                <td class="text-center"><?= $row['account_id'] ?></td>
                <td class="text-center"><?= $row['fname'] ?></td>
                <td class="text-center"><?= $row['lname'] ?></td>
                <td class="text-center"><?= $row['email'] ?></td>


    <?php if ($row['status'] == 'pending'): ?>

<td class="text-center">
    <select class="form-select form-select-sm role-select mx-auto" style="width:150px;" data-id="<?= $row['account_id'] ?>">
        <option value="">Select Role</option>
        <option value="Librarian">Librarian</option>
        <option value="Admin">Admin</option>
    </select>
</td>

    <?php endif; ?>

<td class="text-center">
    <?php if ($row['status'] == 'pending'): ?>
      <!-- approve or delete button -->
        <button class="btn btn-success btn-sm approve-btn" data-id="<?= $row['account_id'] ?>">
            Approve
        </button>

        <button class="btn btn-danger btn-sm delete-btn" data-id="<?= $row['account_id'] ?>">
            Delete
        </button>
    <?php else: ?>
        <span class="text-muted">No Action</span>
    <?php endif; ?>
</td>
            </tr>
        <?php } ?>
        </tbody>
    </table>
</div>
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="../assets/scripts/Books/displayBook.js"></script>
 <script src="../assets/scripts/account.js"></script>
</body>
</html>