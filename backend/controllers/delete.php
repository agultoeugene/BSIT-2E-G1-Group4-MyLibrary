<?php
include("../config/config.php"); 

if(isset($_POST['id'])) {

    $id = $_POST['id'];

    $stmt = $conn->prepare("DELETE FROM accounts WHERE account_id = ?");
    $stmt->bind_param("i", $id);

    if($stmt->execute()){
        echo "success";
    } else {
        echo "error";
    }

}
?>