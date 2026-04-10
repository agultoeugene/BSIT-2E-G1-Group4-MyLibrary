<?php
// Include the database connection
include("../config/config.php");
// to store or to record the value to database
    if(isset($_POST["action"])){
        if($_POST["action"] == "store"){

            $payload = json_decode($_POST["payload"]);
            $hashPass = password_hash($payload->passwordS, PASSWORD_DEFAULT);

            $statement = $conn->prepare("INSERT INTO accounts (fname, lname, email, password, role) VALUES (?, ?, ?, ?, ?)");
            $statement->bind_param("sssss", $payload->fName, $payload->lName, $payload->emailS, $hashPass,  $payload->role);

            if ($statement->execute()) {
			echo json_encode([
				"status" => "success",
				"message" => "Successfully Inserted"
			]);
            } else {
                echo json_encode([
                    "status" => "failed",
                    "message" => "Failed to insert"
                ]);
            }

        }
    }
?>