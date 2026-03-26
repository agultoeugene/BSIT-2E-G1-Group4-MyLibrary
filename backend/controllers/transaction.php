<?php
include("../config/config.php");

if(isset($_POST['action']) && $_POST['action'] === "storeTransaction") {
    $payload = json_decode($_POST['payload'], true);

    $student_id = $payload['student_id'];
    $books = explode(",", $payload['books']); 
    $date_borrow = $payload['date_borrow'];
    $date_due = $payload['date_due'];

    $stmtCheck = $conn->prepare("SELECT books FROM transactions WHERE student_id=? AND status='Borrowed'");
    $stmtCheck->bind_param("i", $student_id);
    $stmtCheck->execute();
    $result = $stmtCheck->get_result();
    $currentBorrowed = 0;
    while($row = $result->fetch_assoc()) {
        $currentBorrowed += count(explode(",", $row['books']));
    }
    $stmtCheck->close();

    if($currentBorrowed + count($books) > 3) {
        echo json_encode(["status" => "error", "message" => "Cannot borrow more than 3 books per student."]);
        exit;
    }

  
    $unavailableBooks = [];
    foreach($books as $bookTitle) {
        $stmtBook = $conn->prepare("SELECT quantity FROM books WHERE title=?");
        $stmtBook->bind_param("s", $bookTitle);
        $stmtBook->execute();
        $res = $stmtBook->get_result()->fetch_assoc();
        if(!$res || $res['quantity'] <= 0) {
            $unavailableBooks[] = $bookTitle;
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

    $stmtInsert = $conn->prepare("INSERT INTO transactions (student_id, books, date_borrow, date_due) VALUES (?, ?, ?, ?)");
    $booksString = implode(",", $books);
    $stmtInsert->bind_param("isss", $student_id, $booksString, $date_borrow, $date_due);

    if($stmtInsert->execute()) {
    
        foreach($books as $bookTitle) {
            $stmtUpdate = $conn->prepare("UPDATE books SET quantity = quantity - 1 WHERE title=?");
            $stmtUpdate->bind_param("s", $bookTitle);
            $stmtUpdate->execute();
            $stmtUpdate->close();
        }
        echo json_encode(["status" => "success", "message" => "Book borrowed successfully."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to save transaction."]);
    }

    $stmtInsert->close();
    exit;
}
if(isset($_POST['action']) && $_POST['action'] === "returnBook") {
    $transaction_id = $_POST['id'];

    $stmt = $conn->prepare("SELECT books, status FROM transactions WHERE id=?");
    $stmt->bind_param("i", $transaction_id);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if(!$result) {
        echo json_encode(["status" => "error", "message" => "Transaction not found."]);
        exit;
    }

    if($result['status'] === 'Returned') {
        echo json_encode(["status" => "error", "message" => "This book is already returned."]);
        exit;
    }

    $books = explode(",", $result['books']);

   $stmtUpdate = $conn->prepare("UPDATE transactions SET status='Returned', return_date=? WHERE id=?");
    $returnDate = date("Y-m-d"); // today
    $stmtUpdate->bind_param("si", $returnDate, $transaction_id);
    $stmtUpdate->execute();
    $stmtUpdate->close();


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
    $query = "SELECT t.id, t.books, t.date_due, t.status,  t.return_date, s.name, s.student_number
              FROM transactions t
              JOIN students s ON t.student_id = s.student_id
              ORDER BY t.created_at DESC";

    $result = $conn->query($query);
    $transactions = [];
    while($row = $result->fetch_assoc()) {
        $transactions[] = $row;
    }

    echo json_encode(["status" => "success", "data" => $transactions]);
    exit;
}
if(isset($_POST['action']) && $_POST['action'] === "updateStatus") {
    $stmt = $conn->prepare("UPDATE transactions SET status=? WHERE id=?");
    $stmt->bind_param("si", $_POST['status'], $_POST['id']);
    $stmt->execute();
    echo json_encode(["status" => "success"]);
    exit;
}

if(isset($_POST['action']) && $_POST['action'] === "deleteTransaction") {
    $stmt = $conn->prepare("DELETE FROM transactions WHERE id=?");
    $stmt->bind_param("i", $_POST['id']);
    $stmt->execute();
    echo json_encode(["status" => "success"]);
    exit;
}
?>