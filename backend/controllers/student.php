<?php
    include("../config/config.php");

     if(isset($_POST['action'])) {
        if($_POST['action'] === "store"){

            $payload = json_decode($_POST["payload"]);

            $statement = $conn->prepare("INSERT INTO students (name, student_number, year, course, college)
            VALUES(?,?,?,?,?)");

            $statement->bind_param("sisss", $payload->name, $payload->stud_number, $payload->year, 
            $payload->course, $payload->college);

            if ($statement->execute()) {
                echo json_encode([
                    "status" => "success",
                    "message" => "Student added Successfully"
                ]);
                } else {
                    echo json_encode([
                        "status" => "failed",
                        "message" => "Failed to add student"
                    ]);
                }
        }

        if ($_POST['action'] === 'drop') {
             $stud_number = $_POST['student_number'];
            $statement = $conn->prepare("DELETE FROM students WHERE student_number=?");
            $statement->bind_param("i", $stud_number);

            if ($statement->execute()) {
                echo json_encode([
                    'status'=>'success',
                    'message'=>'Student deleted successfully'
                    ]);
            } else {
                echo json_encode([
                    'status'=>'error',
                    'message'=>'Failed to delete student'
                    ]);
            }
            exit;
        }

        	if ($_POST['action'] == "update") {
                $stud_id = $_POST['id'];
                $payload = json_decode($_POST['payload']);
                
                $statement = $conn->prepare("UPDATE students set name = ?, student_number = ?, year = ?, course = ?, college = ? where student_id = ?");
                $statement->bind_param("sisssi", $payload->name, $payload->stud_number, $payload->year, $payload->course, $payload->college, $stud_id);
		
            if ($statement->execute()) {
                echo json_encode([
                    "status" => "success",
                    "message" => "Student record successfully updated"
                ]);
            } else {
                echo json_encode([
                    "status" => "failed",
                    "message" => "Cannot update record"
                ]);
            }
		
	    }
     }
     
      if (isset($_GET['action'])) {
         $action = $_GET['action'];
         if ($action == "get") {
            $statement = $conn->prepare("SELECT * FROM students");
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
        }
        if ($action == "getOne") {
                $id = $_GET['id'];
                $statement = $conn->prepare("SELECT * FROM students where student_id = ?");
                $statement->bind_param("i", $id);
                $statement->execute();
                $result = $statement->get_result();
                
                echo json_encode([
                    "status" => "success",
                    "data" => $result->fetch_assoc()
                ]);
	}
     if ($action === 'checkStudentNumber') {
        $stud_number = $_GET['student_number'];
        $id = isset($_GET['id']) ? $_GET['id'] : null;

        if ($id) {
            $sql = "SELECT COUNT(*) AS count FROM students WHERE student_number = ? AND student_id != ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("si", $stud_number, $id);
        } else {
            $sql = "SELECT COUNT(*) AS count FROM students WHERE student_number = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("s", $stud_number);
        }

        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        echo json_encode(['isUnique' => $result['count'] == 0]);
        exit;
     }       

     if ($action == "getS") {

    $result = $conn->query("SELECT student_id, name, student_number FROM students");

    $students = [];

    while ($row = $result->fetch_assoc()) {
        $students[] = $row;
    }

    echo json_encode([
        "status" => "success",
        "data" => $students
    ]);
    exit;
}
      }
     
      	
?>