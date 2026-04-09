<?php

// include database connection
include("../config/config.php");

// check if action is set in URL
if (isset($_GET['action'])) {

    $action = $_GET['action']; 

    // if action is "get" → return dashboard statistics
    if ($action === 'get') {

        // get total number of books (sum of all quantities)
        $resultBooks = $conn->query("SELECT SUM(total_quantity) AS totalBooks FROM books");
        $totalBooks = $resultBooks->fetch_assoc()['totalBooks'];

        // count how many unique genres/categories exist
        $resultGenres = $conn->query("SELECT COUNT(DISTINCT genre) AS totalCategories FROM books");
        $totalCategories = $resultGenres->fetch_assoc()['totalCategories'];

        // count available books (books with quantity greater than 0)
        $resultAvailable = $conn->query("SELECT SUM(quantity) AS availableBooks FROM books WHERE quantity > 0");
        $availableBooks = $resultAvailable->fetch_assoc()['availableBooks'];

        // count total students registered
        $resultStudents = $conn->query("SELECT COUNT(*) AS totalStudents FROM student");
        $totalStudents = $resultStudents->fetch_assoc()['totalStudents'];

        // count currently borrowed books
        $resultBorrowed = $conn->query("SELECT COUNT(*) AS borrowedBooks FROM borrow WHERE status='Borrowed'");
        $borrowedBooks = $resultBorrowed->fetch_assoc()['borrowedBooks'];

        // count overdue books (borrowed but due date already passed)
        $resultOverdue = $conn->query("
            SELECT COUNT(*) AS overdueBooks 
            FROM borrow 
            WHERE status='Borrowed' AND date_due < CURDATE()
        ");

        // get overdue count, default to 0 if null
        $overdueBooks = $resultOverdue->fetch_assoc()['overdueBooks'] ?? 0;

        // return all dashboard statistics as JSON
        echo json_encode([
            'status' => 'success',
            'totalBooks' => $totalBooks,
            'totalCategories' => $totalCategories,
            'availableBooks' => $availableBooks,
            'totalStudents' => $totalStudents,
            'borrowedBooks' => $borrowedBooks,
            'overdueBooks' => $overdueBooks
        ]);

        exit;
    }
}
?>