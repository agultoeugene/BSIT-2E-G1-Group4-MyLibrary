<?php

   include("../config/config.php");
   if(isset($_POST['action'])) {
        if($_POST['action'] === "store"){

            $payload = json_decode($_POST["payload"]);

            $statement = $conn->prepare("INSERT INTO books (cover, title, author, isbn, genre, location, availability, quantity, publisher, description) 
            VALUES(?,?,?,?,?,?,?,?,?,?)");

            $statement->bind_param("sssssssiss", $payload->cover, $payload->title, $payload->author, 
            $payload->isbn, $payload->genre, $payload->location,  $payload->availability, $payload->quantity,
            $payload->publisher, $payload->description);

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
		
		$statement = $conn->prepare("DELETE FROM books where book_id = ?");
		$statement->bind_param("i", $id);
		
		if ($statement->execute()) {
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
            description = ?,
            availability = ?
        WHERE book_id = ?
    ");

  
    $statement->bind_param(
        "sssssssissi",
        $payload->cover,
        $payload->title,
        $payload->author,
        $payload->isbn,
        $payload->genre,
        $payload->location,
        $payload->publisher,
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