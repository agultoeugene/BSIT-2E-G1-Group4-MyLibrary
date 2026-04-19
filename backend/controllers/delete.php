<?php
include("../config/config.php"); 
header('Content-Type: application/json');

if(isset($_POST['action']) && $_POST['action'] === "delete") {

    if(isset($_POST['id'])) {

        $id = $_POST['id'];

        // Check if account has transaction records
        $check = $conn->prepare("SELECT borrow_id FROM borrow WHERE account_id = ?");
        $check->bind_param("i", $id);
        $check->execute();
        $result = $check->get_result();

        if($result->num_rows > 0){
            echo json_encode([
                "status" => "error",
                "message" => "Cannot delete account. This account has transaction records."
            ]);
            exit;
        }

        // Delete account if no transaction
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