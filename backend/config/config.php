<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
include("env.php");
$conn = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
function requireLogin() {
    if (!isset($_SESSION['account_id'])) {
        header("Location: ../../"); // redirect to login
        exit();
    }
}
?>