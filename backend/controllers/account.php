<?php

// include database connection
include("../config/config.php");


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