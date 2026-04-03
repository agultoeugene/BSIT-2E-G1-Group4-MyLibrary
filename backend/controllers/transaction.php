<?php
include("../config/config.php");

if(isset($_POST['action']) && $_POST['action'] === "storeTransaction") {
    
  $payload = json_decode($_POST['payload'], true);
    $account_id = $_SESSION['account_id'];
    $student_id = $payload['student_id'];
    $book_ids = [$payload['book_id']];
    $date_borrow = $payload['date_borrow'];
    $date_due = $payload['date_due'];
   
    $stmtCheck = $conn->prepare("SELECT bd.book_id FROM borrow b 
                                 JOIN borrow_details bd ON b.borrow_id = bd.borrow_id
                                 WHERE b.student_id=? AND b.status='Borrowed'");
    $stmtCheck->bind_param("i", $student_id);
    $stmtCheck->execute();
    $result = $stmtCheck->get_result();
    $currentBorrowed = $result->num_rows;
    $stmtCheck->close();

    if($currentBorrowed + count($book_ids) > 3) {
        echo json_encode(["status" => "error", "message" => "Cannot borrow more than 3 books per student."]);
        exit;
    }

    $unavailableBooks = [];
    foreach($book_ids as $bookId) {
        $stmtBook = $conn->prepare("SELECT title, quantity FROM books WHERE book_id=?");
        $stmtBook->bind_param("i", $bookId);
        $stmtBook->execute();
        $res = $stmtBook->get_result()->fetch_assoc();
        if(!$res || $res['quantity'] <= 0) {
            $unavailableBooks[] = $res ? $res['title'] : "Book ID $bookId";
        }
        $stmtBook->close();
    }

    if(!empty($unavailableBooks)) {
        echo json_encode([
            "status" => "error",
            "message" => "These books are unavailable: " . implode(", ", $unavailableBooks)
        ]);
        exit;
    }

    $stmtInsertBorrow = $conn->prepare("INSERT INTO borrow (student_id, account_id, date_borrow, date_due, status, created_at) 
                                        VALUES (?, ?, ?, ?, 'Borrowed', NOW())");

    $stmtInsertBorrow->bind_param("iiss", $student_id, $account_id, $date_borrow, $date_due);

    if($stmtInsertBorrow->execute()) {
        $borrow_id = $stmtInsertBorrow->insert_id; 

    
        foreach($book_ids as $bookId) {
            // Insert into borrow_details
            $stmtDetail = $conn->prepare("INSERT INTO borrow_details (borrow_id, book_id, quantity) VALUES (?, ?, 1)");
            $stmtDetail->bind_param("ii", $borrow_id, $bookId);
            $stmtDetail->execute();
            $stmtDetail->close();

            // Update books quantity
            $stmtUpdate = $conn->prepare("UPDATE books SET quantity = quantity - 1 WHERE book_id=?");
            $stmtUpdate->bind_param("i", $bookId);
            $stmtUpdate->execute();
            $stmtUpdate->close();
        }

        echo json_encode(["status" => "success", "message" => "Book(s) borrowed successfully."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to save transaction."]);
    }

    $stmtInsertBorrow->close();
    exit;
}
if(isset($_POST['action']) && $_POST['action'] === "returnBook") {
    $transaction_id = $_POST['id'];
    $current_account_id = $_SESSION['account_id'];

    // Update borrow status AND account_id to the person returning
    $stmtUpdate = $conn->prepare("
        UPDATE borrow 
        SET status='Returned', return_date=?, account_id=? 
        WHERE borrow_id=?
    ");
    $returnDate = date("Y-m-d"); // today
    $stmtUpdate->bind_param("sii", $returnDate, $current_account_id, $transaction_id);
    $stmtUpdate->execute();
    $stmtUpdate->close();

    // Update each book quantity
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

    foreach($books as $bookTitle) {
        $stmtBook = $conn->prepare("UPDATE books SET quantity = quantity + 1 WHERE title=?");
        $stmtBook->bind_param("s", $bookTitle);
        $stmtBook->execute();
        $stmtBook->close();
    }

    echo json_encode(["status" => "success", "message" => "Book(s) returned successfully."]);
    exit;
}
if(isset($_GET['action']) && $_GET['action'] === "getTransactions") {
    $query = "SELECT 
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
    ORDER BY b.created_at DESC";

    $result = $conn->query($query); 
    $transactions = [];
    while($row = $result->fetch_assoc()) {
        $transactions[] = $row;
    }

    echo json_encode(["status" => "success", "data" => $transactions]);
    exit;
}


?>