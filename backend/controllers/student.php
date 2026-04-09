<?php

// include database connection
include("../config/config.php");

// HANDLE POST REQUESTS
if(isset($_POST['action'])) {

    // ADD NEW STUDENT
    if ($_POST['action'] === "store") {

        // decode JSON payload from request
        $payload = json_decode($_POST['payload']);

        // check if section already exists
        $stmt = $conn->prepare("SELECT section_id FROM section WHERE section_name=? AND year_level=?  AND course_id=?");
        $stmt->bind_param("sii", $payload->section_name, $payload->year, $payload->course);
        $stmt->execute();
        $result = $stmt->get_result();

        // if section exists → use existing section_id
        if($result->num_rows > 0){
            $section_id = $result->fetch_assoc()['section_id']; 
        } else {

            // insert new section if not exists
            $stmt = $conn->prepare("INSERT INTO section (section_name, course_id, year_level) VALUES (?, ?, ?)");
            $stmt->bind_param("sii", $payload->section_name, $payload->course, $payload->year);
            $stmt->execute();

            // get newly created section id
            $section_id = $conn->insert_id;
        }

        // insert student record
        $stmt = $conn->prepare("INSERT INTO student (fname, lname, student_number, section_id) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssii", $payload->fname, $payload->lname, $payload->stud_number, $section_id);

        if ($stmt->execute()) {
            echo json_encode(["status"=>"success","message"=>"Student added successfully"]);
        } else {
            echo json_encode(["status"=>"failed","message"=>"Failed to add student"]);
        }

        exit;
    }


    // DELETE STUDENT
    if ($_POST['action'] === 'drop') {

        $stud_number = $_POST['student_number'];

        // get student_id and section_id
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

        // if student not found
        if (!$student_id) {
            echo json_encode(['status'=>'error','message'=>'Student not found']);
            exit;
        }

        // delete borrow details related to student
        $stmt = $conn->prepare("DELETE bd FROM borrow_details bd JOIN borrow b ON bd.borrow_id = b.borrow_id WHERE b.student_id = ?");
        $stmt->bind_param("i", $student_id);
        $stmt->execute();

        // delete borrow records
        $stmt = $conn->prepare("DELETE FROM borrow WHERE student_id = ?");
        $stmt->bind_param("i", $student_id);
        $stmt->execute();

        // delete student
        $stmt = $conn->prepare("DELETE FROM student WHERE student_id = ?");
        $stmt->bind_param("i", $student_id);
        $success = $stmt->execute();

        // check if section is empty after deleting student
        if($success && $section_id) {

            $stmt = $conn->prepare("SELECT COUNT(*) AS cnt FROM student WHERE section_id=?");
            $stmt->bind_param("i", $section_id);
            $stmt->execute();

            $countResult = $stmt->get_result()->fetch_assoc();

            // delete section if no students left
            if($countResult['cnt'] == 0) {

                $stmt = $conn->prepare("DELETE FROM section WHERE section_id=?");
                $stmt->bind_param("i", $section_id);
                $stmt->execute();

            }
        }

        // response
        if($success){
            echo json_encode(['status'=>'success','message'=>'Student deleted successfully']);
        } else {
            echo json_encode(['status'=>'error','message'=>'Failed to delete student', 'sql_error'=>$conn->error]);
        }

        exit;
    }


    // UPDATE STUDENT
    if ($_POST['action'] == "update") {

        $stud_id = $_POST['id'];
        $payload = json_decode($_POST['payload']);

        // check if section exists
        $stmt = $conn->prepare("SELECT section_id FROM section WHERE section_name=? AND year_level=?  AND course_id=?");
        $stmt->bind_param("sii", $payload->section_name, $payload->year,$payload->course);
        $stmt->execute();
        $result = $stmt->get_result();

        if($result->num_rows > 0){
            $section_id = $result->fetch_assoc()['section_id'];
        } else {

            // create section if not exists
            $stmt = $conn->prepare("INSERT INTO section (section_name, course_id, year_level) VALUES (?, ?, ?)");
            $stmt->bind_param("sii", $payload->section_name, $payload->course, $payload->year);
            $stmt->execute();

            $section_id = $conn->insert_id;
        }

        // update student record
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


// HANDLE GET REQUESTS
if (isset($_GET['action'])) {

    $action = $_GET['action'];

    // GET ALL STUDENTS
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

            // combine first name and last name
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


    // GET ONE STUDENT
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


    // CHECK IF STUDENT NUMBER IS UNIQUE (FOR EDIT)
    if($_GET['action'] === 'check_student_number') {

        $stud_number = $_GET['stud_number'];
        $id = $_GET['id'];

        $stmt = $conn->prepare("SELECT COUNT(*) as count FROM student WHERE student_number = ? AND student_id != ?");
        $stmt->bind_param("ii", $stud_number, $id);
        $stmt->execute();

        $result = $stmt->get_result()->fetch_assoc();

        echo json_encode([
            "is_unique" => $result['count'] == 0
        ]);

        exit;
    }


    // CHECK IF STUDENT NUMBER EXISTS (FOR ADD)
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


    // GET STUDENT LIST (FOR DROPDOWN)
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


    // GET COURSES
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


    // GET SECTIONS
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