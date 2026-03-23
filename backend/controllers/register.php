<?php
include("../config/config.php");
    if(isset($_POST["action"])){
        if($_POST["action"] == "store"){

            $payload = json_decode($_POST["payload"]);
            $hashPass = password_hash($payload->passwordS, PASSWORD_DEFAULT);

            $statement = $conn->prepare("INSERT INTO accounts (fname, lname, email, password) VALUES (?, ?, ?, ?)");
            $statement->bind_param("ssss", $payload->fName, $payload->lName, $payload->emailS, $hashPass);

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