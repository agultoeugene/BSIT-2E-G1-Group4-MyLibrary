<?php
include("../../backend/config/config.php");
requireLogin();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>My Library - Student</title>
     <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />
    <link rel="stylesheet" href="../assets/css/nav.css" />
    <style>
        .student-action-btn {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            min-width: 64px;
            padding: 0.35rem 0.75rem;
            white-space: nowrap;
        }
        .student-action-btn span {
            display: inline-block;
            width: 100%;
        }
        @media (max-width: 768px) {
            .page-content .btn-sm {
                padding: 0.35rem 0.85rem;
                font-size: 0.82rem;
            }
        }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  
</head>
<body>
     <?php include("../includes/navigation.php");?>
       <div class="container mt-1 pt-1 page-content">
        <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <h3>Student List</h3>
            <button type="button" class="btn btn-primary btn-sm" onclick="openAddStudentModal()" style="white-space:nowrap;">Add New Student</button>
        </div>

        <form class="mb-3" onsubmit="handleSearch(event)">
            <div class="input-group">
                <span class="input-group-text"><i class="bi bi-search"></i></span>
                <input type="search" class="form-control" placeholder="Search student" aria-label="Search student" oninput="handleLiveStudentSearch(event)">
            </div>
        </form>

      <div class="table-responsive">
        <table class="table table-bordered">
          <thead class="table-primary">
        <tr>
            <th class="text-center">Name</th>
            <th class="text-center">Student Number</th>
            <th class="text-center">Year/Section</th>
            <th class="text-center">Course</th>
            <th class="text-center">College</th>
            <th class="text-center">Email</th>
            <th class="text-center">Action</th>
        </tr>
    </thead>
    <tbody id="studentTableBody"></tbody>
</table>



    </div>
</div>

<!-- Add Student Modal -->
<div class="modal fade" id="addStudentModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">

                <div class="modal-header">
                    <h5 id="modalTitle" class="modal-title">Add New Student</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body">
         <div class="row g-3">

    <!-- Full Name -->
            <div class="col-md-6">
                    <label for="firstName" class="form-label">First Name</label>
                    <input type="text" id="firstName" class="form-control" />
                    <small class="text-danger" id="errFirstName"></small>
                </div>

                <div class="col-md-6">
                    <label for="lastName" class="form-label">Last Name</label>
                    <input type="text" id="lastName" class="form-control" />
                    <small class="text-danger" id="errLastName"></small>
                </div>

                <!-- Student Number -->
                <div class="col-md-6">
                    <label for="studentNumber" class="form-label">Student Number</label>
                    <input type="text" id="studentNumber" class="form-control" />
                    <small class="text-danger" id="errStudentNumber"></small>
                </div>
                <!-- Email -->
            <div class="col-md-6">
                <label for="email" class="form-label">Email</label>
                <input type="email" id="email" class="form-control" />
                <small class="text-danger" id="errEmail"></small>
            </div>
                <!-- Year/Grade -->
                <div class="col-md-6">
                    <label for="yearGrade" class="form-label">Year / Grade</label>
                    <input type="text" id="yearGrade" class="form-control" />
                    <small class="text-danger" id="errYearGrade"></small>
                </div>

                <!-- Section -->
                <div class="col-md-6">
                    <label for="section_id" class="form-label">Section</label>
                    <select id="section_id" class="form-select">
                        <option value="" selected disabled>Select Section</option>
                        <option value="1">A</option>
                        <option value="2">B</option>
                        <option value="3">C</option>
                        <option value="4">D</option>
                        <option value="5">E</option>
                        <option value="6">F</option>
                        <option value="7">G</option>
                        <option value="8">H</option>
                        <option value="9">I</option>
                        <option value="10">J</option>
                    </select>
                    <small class="text-danger" id="errSection"></small>
                </div>

                <!-- Course -->
                <div class="col-md-6">
                    <label for="course_id" class="form-label">Course / Strand</label>
                    <select id="course_id" class="form-select">
                        <option value="" selected disabled>Select Course / Strand</option>
                    </select>
                    <small class="text-danger" id="errCourse"></small>
                </div>
 

                <input type="hidden" id="studentId">
            </div>
        </div>

                <div class="modal-footer">
                        <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal" style="white-space:nowrap;">Cancel</button>
                        <button type="button" class="btn btn-primary btn-sm" id="addBtn" onclick="storeWithValidation()" style="white-space:nowrap; padding:0.45rem 0.9rem;">
                            Add Student
                        </button>
                        <button type="button" class="btn btn-success btn-sm" id="saveBtn" onclick="update()" style="display:none; white-space:nowrap; padding:0.45rem 0.9rem;">
                            Save Changes
                        </button>
                </div>
            </div>
            </div>
        </div>
    </div>
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="../assets/scripts/Student/addStudent.js"></script>
    <script src="../assets/scripts/Student/displayStudent.js"></script>
    <script src="../assets/scripts/Student/deleteStudent.js"></script>
    <script src="../assets/scripts/Student/editStudent.js"></script>
</body>
</html>