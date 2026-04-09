<?php
include("../config/config.php");
// to update the record if the admin approve the account
if(isset($_POST['id']) && isset($_POST['role'])){

    $id = $_POST['id'];
    $role = $_POST['role'];

    $stmt = $conn->prepare("UPDATE accounts SET role=?, status='approved' WHERE account_id=?");
    $stmt->bind_param("si", $role, $id);
    $stmt->execute();

    echo "success";
}
?>