<?php

// include database connection
include("../config/config.php");


// STORE BORROW TRANSACTION
if(isset($_POST['action']) && $_POST['action'] === "storeTransaction") {
    
    // decode JSON payload from frontend
    $payload = json_decode($_POST['payload'], true);

    // get logged-in account id from session
    $account_id = $_SESSION['account_id'];

    // get transaction data
    $student_id = $payload['student_id'];
    $book_ids = [$payload['book_id']]; // store book id in array
    $date_borrow = $payload['date_borrow'];
    $date_due = $payload['date_due'];

    
    // CHECK HOW MANY BOOKS THE STUDENT CURRENTLY BORROWED
    $stmtCheck = $conn->prepare("
        SELECT bd.book_id 
        FROM borrow b 
        JOIN borrow_details bd ON b.borrow_id = bd.borrow_id
        WHERE b.student_id=? AND b.status='Borrowed'
    ");

    $stmtCheck->bind_param("i", $student_id);
    $stmtCheck->execute();

    $result = $stmtCheck->get_result();

    // count current borrowed books
    $currentBorrowed = $result->num_rows;

    $stmtCheck->close();

    // limit borrowing to maximum of 3 books
    if($currentBorrowed + count($book_ids) > 3) {
        echo json_encode([
            "status" => "error",
            "message" => "Cannot borrow more than 3 books per student."
        ]);
        exit;
    }


    // CHECK IF BOOKS ARE AVAILABLE
    $unavailableBooks = [];

    foreach($book_ids as $bookId) {

        $stmtBook = $conn->prepare("SELECT title, quantity FROM books WHERE book_id=?");
        $stmtBook->bind_param("i", $bookId);

        $stmtBook->execute();

        $res = $stmtBook->get_result()->fetch_assoc();

        // if book does not exist or quantity is zero
        if(!$res || $res['quantity'] <= 0) {
            $unavailableBooks[] = $res ? $res['title'] : "Book ID $bookId";
        }

        $stmtBook->close();
    }

    // stop if some books are unavailable
    if(!empty($unavailableBooks)) {

        echo json_encode([
            "status" => "error",
            "message" => "These books are unavailable: " . implode(", ", $unavailableBooks)
        ]);

        exit;
    }


    // INSERT MAIN BORROW RECORD
    $stmtInsertBorrow = $conn->prepare("
        INSERT INTO borrow 
        (student_id, account_id, date_borrow, date_due, status, created_at) 
        VALUES (?, ?, ?, ?, 'Borrowed', NOW())
    ");

    $stmtInsertBorrow->bind_param("iiss", $student_id, $account_id, $date_borrow, $date_due);


    if($stmtInsertBorrow->execute()) {

        // get generated borrow_id
        $borrow_id = $stmtInsertBorrow->insert_id;


        // INSERT BORROW DETAILS FOR EACH BOOK
        foreach($book_ids as $bookId) {

            // insert record in borrow_details
            $stmtDetail = $conn->prepare("
                INSERT INTO borrow_details (borrow_id, book_id, quantity) 
                VALUES (?, ?, 1)
            ");

            $stmtDetail->bind_param("ii", $borrow_id, $bookId);
            $stmtDetail->execute();
            $stmtDetail->close();


            // reduce book quantity
            $stmtUpdate = $conn->prepare("
                UPDATE books 
                SET quantity = quantity - 1 
                WHERE book_id=?
            ");

            $stmtUpdate->bind_param("i", $bookId);
            $stmtUpdate->execute();
            $stmtUpdate->close();
        }

        // success response
        echo json_encode([
            "status" => "success",
            "message" => "Book(s) borrowed successfully."
        ]);

    } else {

        echo json_encode([
            "status" => "error",
            "message" => "Failed to save transaction."
        ]);
    }

    $stmtInsertBorrow->close();

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

    $query = "
    SELECT 
        b.borrow_id,
        CONCAT(s.fname, ' ', s.lname) AS full_name,
        s.student_number,
        CONCAT(a.fname, ' ', a.lname) AS account_name,
        bo.book_id,
        bo.title,
        b.date_borrow,
        b.date_due,
        b.status,
        b.return_date
    FROM borrow b
    JOIN student s ON b.student_id = s.student_id
    JOIN accounts a ON b.account_id = a.account_id
    JOIN borrow_details bd ON b.borrow_id = bd.borrow_id
    JOIN books bo ON bd.book_id = bo.book_id
    ORDER BY b.created_at DESC
    ";

    // execute query
    $result = $conn->query($query);

    $transactions = [];

    // collect all transaction rows
    while($row = $result->fetch_assoc()) {
        $transactions[] = $row;
    }

    // return JSON response
    echo json_encode([
        "status" => "success",
        "data" => $transactions
    ]);

    exit;
}

?>