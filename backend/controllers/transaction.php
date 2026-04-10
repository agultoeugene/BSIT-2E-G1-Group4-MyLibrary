<?php

// include database connection
include("../config/config.php");


if (isset($_POST['action']) && $_POST['action'] === "storeTransaction") {

    $payload = json_decode($_POST['payload'], true);

    $account_id = $_SESSION['account_id'];
    $student_id = $payload['student_id'];
    $book_id = $payload['book_id'];
    $date_borrow = $payload['date_borrow'];
    $date_due = $payload['date_due'];

    $stmt = $conn->prepare("
        SELECT MAX(penalty_date) AS last_penalty
        FROM (
            SELECT date_due AS penalty_date
            FROM borrow
            WHERE student_id = ?
            AND return_date IS NULL
            AND date_due < NOW()

            UNION ALL

            SELECT return_date AS penalty_date
            FROM borrow
            WHERE student_id = ?
            AND return_date IS NOT NULL
            AND return_date > date_due
        ) AS penalties
    ");

    $stmt->bind_param("ii", $student_id, $student_id);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();

    $last_penalty = $result['last_penalty'];

    if ($last_penalty) {

        $today = new DateTime();
        $last = new DateTime($last_penalty);

        $last->modify('+7 days');

        if ($today < $last) {
            echo json_encode([
                "status" => "error",
                "message" => "Blocked: You are under 7-day borrowing penalty."
            ]);
            exit;
        }
    }

    $stmt = $conn->prepare("CALL BorrowBook(?, ?, ?, ?, ?)");
    $stmt->bind_param(
        "iiiss",
        $student_id,
        $account_id,
        $book_id,
        $date_borrow,
        $date_due
    );

    if ($stmt->execute()) {

        echo json_encode([
            "status" => "success",
            "message" => "Book borrowed successfully."
        ]);

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