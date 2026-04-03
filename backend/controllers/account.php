<?php
include("../config/config.php");

$message = "";

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
        $message = "<div class='alert alert-success'>Account approved successfully.</div>";
      } else {
        $message = "<div class='alert alert-danger'>Error approving account.</div>";
      }
    }
  } elseif (isset($_POST['delete'])) {
    $id = $_POST['id'];
    $stmt = $conn->prepare("DELETE FROM pending_accounts WHERE id = ?");
    $stmt->bind_param("i", $id);
    if ($stmt->execute()) {
      $message = "<div class='alert alert-success'>Account deleted successfully.</div>";
    } else {
      $message = "<div class='alert alert-danger'>Error deleting account.</div>";
    }
  }
}

// Fetch pending accounts
$pendingAccounts = [];
$result = $conn->query("SELECT * FROM pending_accounts");
while ($row = $result->fetch_assoc()) {
  $pendingAccounts[] = $row;
}
?>