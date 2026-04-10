<?php

// include database connection
include("../config/config.php");


// STORE BORROW TRANSACTION
if(isset($_POST['action']) && $_POST['action'] === "storeTransaction") {

    $payload = json_decode($_POST['payload'], true);
    $account_id = $_SESSION['account_id'];
    $student_id = $payload['student_id'];
    $book_id = $payload['book_id']; // single book
    $date_borrow = $payload['date_borrow'];
    $date_due = $payload['date_due'];

    // call stored procedure
    $stmt = $conn->prepare("CALL BorrowBook(?, ?, ?, ?, ?)");
    $stmt->bind_param("iiiss", $student_id, $account_id, $book_id, $date_borrow, $date_due);

    if($stmt->execute()) {

        // fetch result from procedure
        $result = $stmt->get_result();
        if($result) {
            $response = $result->fetch_assoc();
            echo json_encode($response);
        } else {
            // if procedure only selects messages
            echo json_encode([
                "status" => "success",
                "message" => "Book borrowed successfully."
            ]);
        }

    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Failed to execute borrow procedure."
        ]);
    }

    $stmt->close();
    exit;
}

// RETURN BOOK
if(isset($_POST['action']) && $_POST['action'] === "returnBook") {

    $transaction_id = $_POST['id'];
    $current_account_id = $_SESSION['account_id'];

    $stmt = $conn->prepare("CALL return_book(?, ?)");

    $stmt->bind_param("ii", $transaction_id, $current_account_id);

    if($stmt->execute()) {

        echo json_encode([
            "status" => "success",
            "message" => "Book(s) returned successfully."
        ]);

    } else {

        echo json_encode([
            "status" => "failed",
            "message" => $stmt->error
        ]);

    }

    $stmt->close();
}

// GET ALL TRANSACTIONS
if(isset($_GET['action']) && $_GET['action'] === "getTransactions") {

    $query = "SELECT * FROM transactions_view ORDER BY borrow_id DESC";
    $result = $conn->query($query);

    $transactions = [];
    while($row = $result->fetch_assoc()) {
        $transactions[] = $row; 
    }

    echo json_encode([
        "status" => "success",
        "data" => $transactions
    ]);

    exit;
}

?>