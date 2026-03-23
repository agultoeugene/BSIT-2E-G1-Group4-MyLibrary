<?php

    include("../config/config.php");

    if(isset($_POST["action"])){
        if($_POST["action"] == "postOne"){
           
            $payload = json_decode($_POST["payload"]);
            $statement = $conn->prepare("SELECT * FROM accounts WHERE email = ?");
            $statement->bind_param("s", $payload->email);
            $statement->execute();
            $result = $statement->get_result();

            if($result->num_rows > 0){
            $user = $result->fetch_assoc();
                if (password_verify($payload->password, $user['password'])) {
                    $_SESSION['user'] = $user;
                    echo json_encode([
                        "status" => "success",
                        "message" => "Succesfully login"
                    ]);

			    } else {

                    echo json_encode([
                        "status" => "failed",
                        "message" => "Invalid password"
                    ]);
			    }
		        } else {
                    echo json_encode([
                        "status" => "failed",
                        "message" => "Account does not exists"
                    ]);
            }
        }
    }
?>