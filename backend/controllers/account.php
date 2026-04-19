<?php

// include database connection
include("../config/config.php");

// HANDLE POST REQUESTS
if (isset($_POST['action'])) {
    $action = $_POST['action'];

    if ($action === 'change_password') {
        $id = $_POST['id'];
        $password = $_POST['password'];

        if (empty($id) || empty($password)) {
            echo json_encode([
                "status" => "error",
                "message" => "Missing account ID or password."
            ]);
            exit;
        }

        $hashed = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $conn->prepare("UPDATE accounts SET password = ? WHERE account_id = ?");
        $stmt->bind_param("si", $hashed, $id);

        if ($stmt->execute()) {
            echo json_encode([
                "status" => "success",
                "message" => "Password changed successfully."
            ]);
        } else {
            echo json_encode([
                "status" => "error",
                "message" => "Unable to update password."
            ]);
        }

        exit;
    }
}


// HANDLE GET REQUESTS
if (isset($_GET['action'])) {

    $action = $_GET['action'];

    // GET ALL Account
   if ($action == "get") {

    $sql = "SELECT * FROM accounts ORDER BY account_id ASC";
    $result = $conn->query($sql);

    $account = [];
    while ($row = $result->fetch_assoc()) {
        $account[] = $row;
    }

    echo json_encode([
        "status" => "success",
        "data" => $account
    ]);

    exit;
}


}

?>