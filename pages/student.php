
<?php include("navbar.php"); ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>My Library - Student</title>
     <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />
    <link rel="stylesheet" href="../assets/nav.css" />
    <link rel="stylesheet" href="../assets/book.css" />
</head>
<body>
       <div class="container mt-1 pt-1 page-content">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h3>Student List</h3>
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addStudentModal">
                Add Student
            </button>
        </div>

      <table class="table table-bordered">
    <thead>
        <tr>
            <th class="text-center">Name</th>
            <th class="text-center">Student Number</th>
            <th class="text-center">Year</th>
            <th class="text-center">Course</th>
            <th class="text-center">College</th>
            <th class="text-center">Action</th>
        </tr>
    </thead>
    <tbody id="studentTableBody"></tbody>
</table>



    </div>

    <!-- Add Student Modal -->
    <div class="modal fade" id="addStudentModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">

                <div class="modal-header">
                    <h5 class="modal-title">Add New Student</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body">
                    <div class="row g-3">

                        <div class="col-md-6">
                            <label for="studentName" class="form-label">Student Name</label>
                            <input type="text" id="studentName" class="form-control" />
                            <small class="text-danger" id="errStudentName"></small>
                        </div>

                        <div class="col-md-6">
                            <label for="studentNumber" class="form-label">Student Number</label>
                            <input type="text" id="studentNumber" class="form-control" />
                            <small class="text-danger" id="errStudentNumber"></small>
                        </div>

                        <div class="col-md-6">
                            <label for="yearGrade" class="form-label">Year / Grade (Section)</label>
                            <input type="text" id="yearGrade" class="form-control" />
                            <small class="text-danger" id="errYearGrade"></small>
                        </div>

                        <div class="col-md-6">
                            <label for="course" class="form-label">Course / Strand</label>
                            <input type="text" id="course" class="form-control" />
                            <small class="text-danger" id="errCourse"></small>
                        </div>
                       <div class="col-md-12">
                        <label for="college" class="form-label">College</label>
                        <input type="text" id="college" class="form-control" />
                        <small class="text-danger" id="errCollege"></small>
                    </div>

                    </div>
                </div>

                <div class="modal-footer">
                        <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>

                        <button class="btn btn-primary" id="addBtn" onclick="addStudent()">
                            Add Student
                        </button>

                        <button class="btn btn-success" id="saveBtn" onclick="saveStudent()" style="display:none;">
                            Save Changes
                        </button>
                </div>

            </div>
        </div>
    </div>
</body>
 <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
 <script src="../script/stud.js"></script>
</html>