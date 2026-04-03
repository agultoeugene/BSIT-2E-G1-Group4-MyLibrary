<?php
include("../config/config.php");

// Ensure pending_accounts exists before inserting frontend signup requests.
$createTable = "CREATE TABLE IF NOT EXISTS pending_accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fname VARCHAR(100),
  lname VARCHAR(100),
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL
)";
$conn->query($createTable);

if(isset($_POST["action"])){
    if($_POST["action"] == "store"){

        $payload = json_decode($_POST["payload"]);
        $hashPass = password_hash($payload->passwordS, PASSWORD_DEFAULT);

        $statement = $conn->prepare("INSERT INTO pending_accounts (fname, lname, email, password) VALUES (?, ?, ?, ?)");
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