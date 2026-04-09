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

    // get account who returned the book
    $current_account_id = $_SESSION['account_id'];

    // update borrow record to returned
    $stmtUpdate = $conn->prepare("
        UPDATE borrow 
        SET status='Returned', return_date=?, account_id=? 
        WHERE borrow_id=?
    ");

    // set return date to today
    $returnDate = date("Y-m-d");

    $stmtUpdate->bind_param("sii", $returnDate, $current_account_id, $transaction_id);
    $stmtUpdate->execute();
    $stmtUpdate->close();


    // GET ALL BOOKS IN THIS TRANSACTION
    $stmtBooks = $conn->prepare("
        SELECT bo.title
        FROM borrow_details bd
        JOIN books bo ON bd.book_id = bo.book_id
        WHERE bd.borrow_id=?
    ");

    $stmtBooks->bind_param("i", $transaction_id);
    $stmtBooks->execute();

    $result = $stmtBooks->get_result();

    $books = [];

    while($row = $result->fetch_assoc()) {
        $books[] = $row['title'];
    }

    $stmtBooks->close();


    // INCREASE QUANTITY FOR EACH RETURNED BOOK
    foreach($books as $bookTitle) {

        $stmtBook = $conn->prepare("
            UPDATE books 
            SET quantity = quantity + 1 
            WHERE title=?
        ");

        $stmtBook->bind_param("s", $bookTitle);
        $stmtBook->execute();
        $stmtBook->close();
    }


    echo json_encode([
        "status" => "success",
        "message" => "Book(s) returned successfully."
    ]);

    exit;
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