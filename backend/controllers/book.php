<?php

   include("../config/config.php");
   if(isset($_POST['action']) && $_POST['action'] === "checkDuplicateTitle" && isset($_POST['title'])){
    $title = trim($_POST['title']);
    $stmt = $conn->prepare("SELECT COUNT(*) AS cnt FROM books WHERE title=?");
    $stmt->bind_param("s", $title);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();

    echo json_encode([
        "exists" => $result['cnt'] > 0
    ]);
    exit;
}
   if(isset($_POST['action'])) {
        if($_POST['action'] === "store"){

            $payload = json_decode($_POST["payload"]);

           $statement = $conn->prepare("
            INSERT INTO books 
            (cover, title, author, isbn, genre, location, availability, quantity, total_quantity, publisher, description) 
            VALUES (?,?,?,?,?,?,?,?,?,?,?)
            ");

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
                $payload->quantity,    // available
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
                        "message" => "Failed to insert"
                    ]);
                }
        }
if ($_POST['action'] == "drop") {
    $id = $_POST['book_id'];

  
    $stmt1 = $conn->prepare("DELETE FROM borrow_details WHERE book_id = ?");
    $stmt1->bind_param("i", $id);
    $stmt1->execute();


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
    if ($_POST['action'] == "update") {

    $id = $_POST['id'];
    $payload = json_decode($_POST['payload']);

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
        $payload->quantity,
        $payload->description,
        $payload->availability, 
        $id
    );

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

    if (isset($_GET['action'])) {
        if ($_GET['action'] == "get") {
            $statement = $conn->prepare("SELECT * FROM books");
            $statement->execute();
            $result = $statement->get_result();
            
            $books = [];
            while($row = $result->fetch_assoc()){
                $books[] = $row;
            }
            
            echo json_encode([
                "status" => "success",
                "data" => $books
            ]);
             exit;
        }
        if ($_GET['action'] === "get") {

            $result = $conn->query("SELECT title, genre, availability FROM books");

            $books = [];

            while ($row = $result->fetch_assoc()) {
                $books[] = $row;
            }

            echo json_encode([
                "status" => "success",
                "data" => $books
            ]);
        }
	
}

?>