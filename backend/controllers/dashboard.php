<?php
       include("../config/config.php");

if (isset($_GET['action'])) {
    $action = $_GET['action']; 

    if ($action === 'get') {


        $resultBooks = $conn->query("SELECT COUNT(*) AS totalBooks FROM books");
        $totalBooks = $resultBooks->fetch_assoc()['totalBooks'];


        $resultGenres = $conn->query("SELECT COUNT(DISTINCT genre) AS totalCategories FROM books");
        $totalCategories = $resultGenres->fetch_assoc()['totalCategories'];

     
        $resultAvailable = $conn->query("SELECT COUNT(*) AS availableBooks FROM books WHERE quantity > 0");
        $availableBooks = $resultAvailable->fetch_assoc()['availableBooks'];

     
        $resultStudents = $conn->query("SELECT COUNT(*) AS totalStudents FROM students");
        $totalStudents = $resultStudents->fetch_assoc()['totalStudents'];

        $resultBorrowed = $conn->query("SELECT COUNT(*) AS borrowedBooks FROM transactions WHERE status='Borrowed'");
        $borrowedBooks = $resultBorrowed->fetch_assoc()['borrowedBooks'];

      
        $today = date("Y-m-d");
        $resultOverdue = $conn->query("SELECT COUNT(*) AS overdueBooks FROM transactions WHERE status='Borrowed' AND date_due < '$today'");
        $overdueBooks = $resultOverdue->fetch_assoc()['overdueBooks'];

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