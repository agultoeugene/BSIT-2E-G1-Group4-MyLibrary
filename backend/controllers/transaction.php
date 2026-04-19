<?php

include("../config/config.php");

if (isset($_POST['action']) && $_POST['action'] === "storeTransaction") {

    $payload = json_decode($_POST['payload'], true);

    $account_id   = $_SESSION['account_id'];
    $student_id   = $payload['student_id'];
    $book_id      = $payload['book_id'];
    $date_borrow  = $payload['date_borrow'];
    $date_due     = $payload['date_due'];

    // ================= 1. CHECK UNRETURNED OVERDUE =================
    $stmt = $conn->prepare("
        SELECT borrow_id
        FROM borrow
        WHERE student_id = ?
        AND return_date IS NULL
        AND date_due < CURDATE()
        LIMIT 1
    ");
    $stmt->bind_param("i", $student_id);
    $stmt->execute();
    $overdue = $stmt->get_result()->fetch_assoc();

    if ($overdue) {
        echo json_encode([
            "status"  => "error",
            "message" => "Borrow blocked: You still have overdue books."
        ]);
        exit;
    }

    // ================= 2. CHECK 7-DAY PENALTY =================
    // Check if student has ANY active penalty from late returns
    $stmt = $conn->prepare("
        SELECT return_date, date_due
        FROM borrow
        WHERE student_id = ?
        AND return_date IS NOT NULL
        AND status = 'Returned'
        ORDER BY return_date DESC
    ");
    $stmt->bind_param("i", $student_id);
    $stmt->execute();
    $penalties = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

    if ($penalties) {
        $today = new DateTime();
        $today->setTime(0, 0, 0);
        
        // Check each late return for active penalty
        foreach ($penalties as $record) {
            $return_date = new DateTime($record['return_date']);
            $due_date = new DateTime($record['date_due']);
            
            // If returned after due date (late return)
            if ($return_date > $due_date) {
                // Calculate penalty end date (7 days from return date)
                $penalty_end = clone $return_date;
                $penalty_end->setTime(0, 0, 0);
                $penalty_end->modify('+7 days');
                
                // If penalty is still active
                if ($today < $penalty_end) {
                    echo json_encode([
                        "status"  => "error",
                        "message" => "Borrow blocked: 7-day penalty active until " . $penalty_end->format('Y-m-d')
                    ]);
                    exit;
                }
            }
        }
    } 

    // ================= 3. PROCEED BORROW =================
    $stmt = $conn->prepare("CALL BorrowBook(?, ?, ?, ?, ?)");
    $stmt->bind_param("iiiss", $student_id, $account_id, $book_id, $date_borrow, $date_due);

    if ($stmt->execute()) {
        echo json_encode([
            "status"  => "success",
            "message" => "Book borrowed successfully."
        ]);
    } else {
        echo json_encode([
            "status"  => "error",
            "message" => "Failed to execute borrow procedure."
        ]);
    }

    $stmt->close();
    exit;
}


// ================= RETURN BOOK =================
if (isset($_POST['action']) && $_POST['action'] === "returnBook") {

    $transaction_id     = $_POST['id'];
    $current_account_id = $_SESSION['account_id'];

    $stmt = $conn->prepare("CALL return_book(?, ?)");
    $stmt->bind_param("ii", $transaction_id, $current_account_id);

    if ($stmt->execute()) {
        echo json_encode([
            "status"  => "success",
            "message" => "Book(s) returned successfully."
        ]);
    } else {
        echo json_encode([
            "status"  => "failed",
            "message" => $stmt->error
        ]);
    }

    $stmt->close();
}


// ================= SEND OVERDUE NOTIFICATION EMAIL =================
if (isset($_POST['action']) && $_POST['action'] === "sendOverdueNotification") {

    include("../config/mailer.php");

    $borrow_id = $_POST['borrow_id'];

    // Get borrow details with student info
    $stmt = $conn->prepare("
        SELECT 
            b.borrow_id,
            b.date_due,
            b.return_date,
            s.email,
            CONCAT(s.fname, ' ', s.lname) as student_name,
            bk.title as book_title
        FROM borrow b
        JOIN student s ON b.student_id = s.student_id
        JOIN borrow_details bd ON b.borrow_id = bd.borrow_id
        JOIN books bk ON bd.book_id = bk.book_id
        WHERE b.borrow_id = ?
    ");
    
    $stmt->bind_param("i", $borrow_id);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();

    if (!$result) {
        echo json_encode([
            "status"  => "error",
            "message" => "Borrow record not found."
        ]);
        exit;
    }

    // Validate email exists
    if (empty($result['email'])) {
        echo json_encode([
            "status"  => "error",
            "message" => "Student email not found. Please update student profile with email address."
        ]);
        exit;
    }

    // Send email
    $mailer = new Mailer();
    $email_result = $mailer->sendOverdueNotification(
        $result['email'],
        $result['student_name'],
        $result['book_title'],
        $result['date_due'],
        $result['return_date']
    );

    echo json_encode($email_result);
    $stmt->close();
    exit;
}


// ================= GET TRANSACTIONS =================
if (isset($_GET['action']) && $_GET['action'] === "getTransactions") {

    $query = "SELECT b.borrow_id, CONCAT(s.fname,' ',s.lname) AS full_name, s.student_number, CONCAT(a.fname,' ',a.lname) AS account_name, bo.book_id, bo.title AS book_title, sec.year_level AS year_level, sec.section_name AS section_name, c.course_name AS course_name, c.department AS department, CONCAT(c.course_name, '/', sec.year_level, sec.section_name) AS course_year_section, b.date_borrow, b.date_due, b.status, b.return_date FROM borrow b JOIN student s ON b.student_id = s.student_id JOIN accounts a ON b.account_id = a.account_id JOIN borrow_details bd ON b.borrow_id = bd.borrow_id JOIN books bo ON bd.book_id = bo.book_id LEFT JOIN section sec ON s.section_id = sec.section_id LEFT JOIN course c ON sec.course_id = c.course_id ORDER BY borrow_id DESC";
    $result = $conn->query($query);

    $transactions = [];
    while ($row = $result->fetch_assoc()) {
        $transactions[] = $row;
    }

    echo json_encode([
        "status" => "success",
        "data"   => $transactions
    ]);
    exit;
}

?>
