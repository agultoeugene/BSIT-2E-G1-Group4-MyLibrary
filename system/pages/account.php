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
  </head>

  <body class="bg-body-tertiary">
    <?php include("../includes/navigation.php"); ?>
    <div class="container mt-3 pt-5 page-content">
      <h1 class="mb-4 text-primary text-center">Pending Accounts</h1>

      <?php
      include("../../backend/config/config.php");

      // Create pending_accounts table if it doesn't exist
      $createTable = "CREATE TABLE IF NOT EXISTS pending_accounts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fname VARCHAR(100),
        lname VARCHAR(100),
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL
      )";
      $conn->query($createTable);

      // Create accounts table if it doesn't exist
      $createAccountsTable = "CREATE TABLE IF NOT EXISTS accounts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fname VARCHAR(100),
        lname VARCHAR(100),
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL
      )";
      $conn->query($createAccountsTable);

      // Handle approve or delete actions
      if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        if (isset($_POST['approve'])) {
          $id = $_POST['id'];
          // Get the pending account
          $stmt = $conn->prepare("SELECT * FROM pending_accounts WHERE id = ?");
          $stmt->bind_param("i", $id);
          $stmt->execute();
          $result = $stmt->get_result();
          if ($row = $result->fetch_assoc()) {
            // Insert into accounts
            $insertStmt = $conn->prepare("INSERT INTO accounts (fname, lname, email, password) VALUES (?, ?, ?, ?)");
            $insertStmt->bind_param("ssss", $row['fname'], $row['lname'], $row['email'], $row['password']);
            if ($insertStmt->execute()) {
              // Delete from pending_accounts
              $deleteStmt = $conn->prepare("DELETE FROM pending_accounts WHERE id = ?");
              $deleteStmt->bind_param("i", $id);
              $deleteStmt->execute();
              echo "<div class='alert alert-success'>Account approved successfully.</div>";
            } else {
              echo "<div class='alert alert-danger'>Error approving account.</div>";
            }
          }
        } elseif (isset($_POST['delete'])) {
          $id = $_POST['id'];
          $stmt = $conn->prepare("DELETE FROM pending_accounts WHERE id = ?");
          $stmt->bind_param("i", $id);
          if ($stmt->execute()) {
            echo "<div class='alert alert-success'>Account deleted successfully.</div>";
          } else {
            echo "<div class='alert alert-danger'>Error deleting account.</div>";
          }
        }
      }

      // Fetch pending accounts
      $result = $conn->query("SELECT * FROM pending_accounts");
      ?>

      <div class="card shadow-sm">
        <div class="card-body">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <?php while ($row = $result->fetch_assoc()): ?>
              <tr>
                <td><?php echo $row['id']; ?></td>
                <td><?php echo htmlspecialchars($row['fname']); ?></td>
                <td><?php echo htmlspecialchars($row['lname']); ?></td>
                <td><?php echo htmlspecialchars($row['email']); ?></td>
                <td>
                  <form method="post" style="display: inline;">
                    <input type="hidden" name="id" value="<?php echo $row['id']; ?>">
                    <button type="submit" name="approve" class="btn btn-success btn-sm">Approve</button>
                  </form>
                  <form method="post" style="display: inline;">
                    <input type="hidden" name="id" value="<?php echo $row['id']; ?>">
                    <button type="submit" name="delete" class="btn btn-danger btn-sm">Delete</button>
                  </form>
                </td>
              </tr>
              <?php endwhile; ?>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </body>
</html>
