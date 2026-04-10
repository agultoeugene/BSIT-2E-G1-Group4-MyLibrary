<?php
include("../config/config.php"); 
header('Content-Type: application/json');

if(isset($_POST['action']) && $_POST['action'] === "delete") {

    if(isset($_POST['id'])) {

        $id = $_POST['id'];

        $stmt = $conn->prepare("DELETE FROM accounts WHERE account_id = ?");
        $stmt->bind_param("i", $id);

        if($stmt->execute()){
            echo json_encode([
                "status" => "success",
                "message" => "Deleted successfully"
            ]);
        } else {
            echo json_encode([
                "status" => "error",
                "message" => "Delete failed"
            ]);
        }

    } else {
        echo json_encode([
            "status" => "error",
            "message" => "ID missing"
        ]);
    }

    exit;
}