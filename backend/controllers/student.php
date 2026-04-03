<?php
    include("../config/config.php");

     if(isset($_POST['action'])) {
     if ($_POST['action'] === "store") {
    $payload = json_decode($_POST['payload']);

    $stmt = $conn->prepare("SELECT section_id FROM section WHERE section_name=? AND year_level=?  AND course_id=?");
    $stmt->bind_param("sii", $payload->section_name, $payload->year, $payload->course);
    $stmt->execute();
    $result = $stmt->get_result();

    if($result->num_rows > 0){
        $section_id = $result->fetch_assoc()['section_id']; 
    } else {
       
     $stmt = $conn->prepare("INSERT INTO section (section_name, course_id, year_level) VALUES (?, ?, ?)");
    $stmt->bind_param("sii", $payload->section_name, $payload->course, $payload->year,);
        $stmt->execute();
        $section_id = $conn->insert_id;
    }

    $stmt = $conn->prepare("INSERT INTO student (fname, lname, student_number, section_id) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssii", $payload->fname, $payload->lname, $payload->stud_number, $section_id);

   if ($stmt->execute()) {
            echo json_encode(["status"=>"success","message"=>"Student added successfully"]);
        } else {
            echo json_encode(["status"=>"failed","message"=>"Failed to add student"]);
        }
    exit;
}
     
if ($_POST['action'] === 'drop') {
    $stud_number = $_POST['student_number'];

    // 1. Get the student_id and section_id
    $stmt = $conn->prepare("SELECT student_id, section_id FROM student WHERE student_number=?");
    $stmt->bind_param("i", $stud_number);
    $stmt->execute();
    $result = $stmt->get_result();
    $student_id = null;
    $section_id = null;
    if($row = $result->fetch_assoc()) {
        $student_id = $row['student_id'];
        $section_id = $row['section_id'];
    }

    if (!$student_id) {
        echo json_encode(['status'=>'error','message'=>'Student not found']);
        exit;
    }

    // 2. Delete borrow details first (if any)
    $stmt = $conn->prepare("DELETE bd FROM borrow_details bd JOIN borrow b ON bd.borrow_id = b.borrow_id WHERE b.student_id = ?");
    $stmt->bind_param("i", $student_id);
    $stmt->execute();

    // 3. Delete borrow records
    $stmt = $conn->prepare("DELETE FROM borrow WHERE student_id = ?");
    $stmt->bind_param("i", $student_id);
    $stmt->execute();

    // 4. Delete the student
    $stmt = $conn->prepare("DELETE FROM student WHERE student_id = ?");
    $stmt->bind_param("i", $student_id);
    $success = $stmt->execute();

    // 5. If student deleted, check if section is empty
    if($success && $section_id) {
        $stmt = $conn->prepare("SELECT COUNT(*) AS cnt FROM student WHERE section_id=?");
        $stmt->bind_param("i", $section_id);
        $stmt->execute();
        $countResult = $stmt->get_result()->fetch_assoc();
        if($countResult['cnt'] == 0) {
            // delete empty section
            $stmt = $conn->prepare("DELETE FROM section WHERE section_id=?");
            $stmt->bind_param("i", $section_id);
            $stmt->execute();
        }
    }

    if($success){
        echo json_encode(['status'=>'success','message'=>'Student deleted successfully']);
    } else {
        echo json_encode(['status'=>'error','message'=>'Failed to delete student', 'sql_error'=>$conn->error]);
    }
    exit;
}

        	if ($_POST['action'] == "update") {
                    $stud_id = $_POST['id'];
                    $payload = json_decode($_POST['payload']);

                    // 1. Check if section exists
                    $stmt = $conn->prepare("SELECT section_id FROM section WHERE section_name=? AND year_level=?  AND course_id=?");
                    $stmt->bind_param("sii", $payload->section_name, $payload->year,$payload->course);
                    $stmt->execute();
                    $result = $stmt->get_result();

                    if($result->num_rows > 0){
                        $section_id = $result->fetch_assoc()['section_id'];
                    } else {
                        // Insert new section if not exists
                        $stmt = $conn->prepare("INSERT INTO section (section_name, course_id, year_level) VALUES (?, ?, ?)");
                        $stmt->bind_param("sii", $payload->section_name, $payload->course, $payload->year);
                        $stmt->execute();
                        $section_id = $conn->insert_id;
                    }

                    // 2. Update student record
                    $stmt = $conn->prepare("UPDATE student SET fname=?, lname=?, student_number=?, section_id=? WHERE student_id=?");
                    $stmt->bind_param("ssiii", $payload->fname, $payload->lname, $payload->stud_number, $section_id, $stud_id);

                    if ($stmt->execute()) {
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
                    exit;
                        
                        }
     }
     
      if (isset($_GET['action'])) {
         $action = $_GET['action'];
        if ($action == "get") {
            $sql = "
            SELECT 
            s.student_id,
            s.fname,
            s.lname,
            s.student_number,
            sec.year_level AS year,
            sec.section_name,
            c.course_name,
            c.department
            FROM student s
            LEFT JOIN section sec ON s.section_id = sec.section_id
            LEFT JOIN course c ON sec.course_id = c.course_id
            ORDER BY s.student_id ASC";
            
            $result = $conn->query($sql);
            
            $students = [];
            while ($row = $result->fetch_assoc()) {
              
                $row['name'] = $row['fname'] . ' ' . $row['lname'];
                $students[] = [
                    'student_id' => $row['student_id'],
                    'name' => $row['name'],
                    'student_number' => $row['student_number'],
                    'year' => $row['year'],
                    'section' => $row['section_name'],
                    'course' => $row['course_name'],
                    'department' => $row['department']
                ];
            }
            
            echo json_encode([
                "status" => "success",
                "data" => $students
            ]);
            exit;
        }
 if ($action == "getOne") {
    $id = $_GET['id'];

    $statement = $conn->prepare("
        SELECT s.*, sec.section_name, sec.year_level, sec.course_id, c.department, c.course_name
        FROM student s
        JOIN section sec ON s.section_id = sec.section_id
        JOIN course c ON sec.course_id = c.course_id
        WHERE s.student_id = ?
    ");

    $statement->bind_param("i", $id);
    $statement->execute();
    $result = $statement->get_result();

    echo json_encode([
        "status" => "success",
        "data" => $result->fetch_assoc()
    ]);
}
if($_GET['action'] === 'check_student_number') {
    $stud_number = $_GET['stud_number'];
    $id = $_GET['id']; // current student id to ignore

    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM student WHERE student_number = ? AND student_id != ?");
    $stmt->bind_param("ii", $stud_number, $id);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();

    echo json_encode([
        "is_unique" => $result['count'] == 0
    ]);
    exit;
}
  if(isset($_GET['action']) && $_GET['action'] === "checkStudentNumber") {
    $student_number = $_GET['student_number'];

    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM student WHERE student_number = ?");
    $stmt->bind_param("s", $student_number);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if($result['count'] > 0){
        echo json_encode(["status" => "exists"]);
    } else {
        echo json_encode(["status" => "available"]);
    }
    exit;
}     

if ($action == "getS") {

    $result = $conn->query("
        SELECT student_id, CONCAT(fname, ' ', lname) AS full_name, student_number 
        FROM student
    ");

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
if($action === 'get_courses'){
    $sql = "SELECT course_id, course_name FROM course ORDER BY course_name ASC";
    $result = $conn->query($sql);

    $courses = [];
    if($result && $result->num_rows > 0){
        while($row = $result->fetch_assoc()){
            $courses[] = $row;
        }
    }

    echo json_encode([
        'status' => 'success',
        'data' => $courses
    ]);
    exit;
}
if($action === 'get_sections'){
    $sql = "SELECT section_id, section_name FROM section ORDER BY section_name ASC";
    $result = $conn->query($sql);

    $sections = [];
    if($result && $result->num_rows > 0){
        while($row = $result->fetch_assoc()){
            $sections[] = $row;
        }
    }

    echo json_encode([
        'status' => 'success',
        'data' => $sections
    ]);
    exit;
}
      }
     
      	
?>