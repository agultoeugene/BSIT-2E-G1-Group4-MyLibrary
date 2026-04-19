<?php

// include database configuration
include("../config/config.php");


// CHECK IF BOOK TITLE ALREADY EXISTS
if(isset($_POST['action']) && $_POST['action'] === "checkDuplicateTitle" && isset($_POST['title'])){

    // remove extra spaces
    $title = trim($_POST['title']);

    // prepare query to count books with same title
    $stmt = $conn->prepare("SELECT COUNT(*) AS cnt FROM books WHERE title=?");
    $stmt->bind_param("s", $title);

    $stmt->execute();

    // get result
    $result = $stmt->get_result()->fetch_assoc();

    // return true if title exists
    echo json_encode([
        "exists" => $result['cnt'] > 0
    ]);

    exit;
}


// HANDLE POST REQUESTS
if(isset($_POST['action'])) {

    // STORE NEW BOOK
   if($_POST['action'] === "store"){

    $payload = json_decode($_POST["payload"]);

    // prepare CALL statement
    $statement = $conn->prepare("CALL insert_book(?,?,?,?,?,?,?,?,?,?,?)");

    $statement->bind_param(
        "sssssssiiss",
        $payload->cover,
        $payload->title,
        $payload->author,
        $payload->isbn,
        $payload->genre,
        $payload->location,
        $payload->availability,
        $payload->quantity,
        $payload->quantity, // total_quantity
        $payload->publisher,
        $payload->description
    );

    if ($statement->execute()) {
        echo json_encode([
            "status" => "success",
            "message" => "Book added Successfully"
        ]);
    } else {
        echo json_encode([
            "status" => "failed",
            "message" => $statement->error
        ]);
    }

    $statement->close();
    $conn->close();
}


    // DELETE BOOK
   if ($_POST['action'] == "drop") {

    $id = $_POST['book_id'];

    // Check if book is currently borrowed
    $check = $conn->prepare("
        SELECT b.borrow_id
        FROM borrow_details bd
        JOIN borrow b ON bd.borrow_id = b.borrow_id
        WHERE bd.book_id = ? AND b.status = 'Borrowed'
    ");
    $check->bind_param("i", $id);
    $check->execute();
    $result = $check->get_result();

    if ($result->num_rows > 0) {

        echo json_encode([
            "status" => "failed",
            "message" => "Cannot delete book. It is currently borrowed."
        ]);
        exit;
    }

    // delete related borrow details
    $stmt1 = $conn->prepare("DELETE FROM borrow_details WHERE book_id = ?");
    $stmt1->bind_param("i", $id);
    $stmt1->execute();

    // delete book
    $stmt2 = $conn->prepare("DELETE FROM books WHERE book_id = ?");
    $stmt2->bind_param("i", $id);

    if ($stmt2->execute()) {

        echo json_encode([
            "status" => "success",
            "message" => "Book successfully deleted"
        ]);

    } else {

        echo json_encode([
            "status" => "failed",
            "message" => "Cannot delete record"
        ]);
    }
}


    // UPDATE BOOK
    if ($_POST['action'] == "update") {

        // get book id
        $id = $_POST['id'];

        // decode JSON payload
        $payload = json_decode($_POST['payload']);

        // prepare update query
        $statement = $conn->prepare("
        UPDATE books SET 
        cover = ?,
        title = ?, 
        author = ?, 
        isbn = ?, 
        genre = ?, 
        location = ?, 
        publisher = ?, 
        quantity = ?, 
        total_quantity = ?, 
        description = ?,
        availability = ?
        WHERE book_id = ?
        ");

        // bind parameters
        $statement->bind_param(
            "sssssssiissi",
            $payload->cover,
            $payload->title,
            $payload->author,
            $payload->isbn,
            $payload->genre,
            $payload->location,
            $payload->publisher,
            $payload->quantity,
            $payload->quantity, // total quantity
            $payload->description,
            $payload->availability,
            $id
        );

        // execute update
        if ($statement->execute()) {

            echo json_encode([
                "status" => "success",
                "message" => "Book successfully updated"
            ]);

        } else {

            echo json_encode([
                "status" => "failed",
                "message" => "Cannot update book"
            ]);

        }
    }
}


// HANDLE GET REQUESTS
if (isset($_GET['action'])) {

    if ($_GET['action'] == "get") {

        header('Content-Type: application/json');

        $statement = $conn->prepare("SELECT * FROM books");

        if (!$statement) {
            echo json_encode([
                "status" => "error",
                "message" => $conn->error
            ]);
            exit;
        }

        if (!$statement->execute()) {
            echo json_encode([
                "status" => "error",
                "message" => $statement->error
            ]);
            exit;
        }

        $result = $statement->get_result();

        $books = [];

        while ($row = $result->fetch_assoc()) {
            $books[] = $row;
        }

        echo json_encode([
            "status" => "success",
            "data" => $books
        ]);

        exit;
    }
}

?>