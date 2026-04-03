<?php
include("../config/config.php"); 

header('Content-Type: application/json'); // tell browser it's JSON

if(isset($_POST['id'])) {

    $id = $_POST['id'];

    $stmt = $conn->prepare("DELETE FROM accounts WHERE account_id = ?");
    $stmt->bind_param("i", $id);

    if($stmt->execute()){
        echo json_encode([
            'status' => 'success',
            'message' => 'Account deleted successfully'
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to delete account'
        ]);
    }

} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'No ID provided'
    ]);
}