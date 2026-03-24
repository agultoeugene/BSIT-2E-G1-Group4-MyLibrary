<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>My Library - Manage Borrow Books</title>
     <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />
    <link rel="stylesheet" href="../assets/css/nav.css" />
  
</head>
<body>
     <?php include("../includes/navigation.php");?>
   <div class="container manage-container">
    <div class="manage-header mb-5 d-flex justify-content-between align-items-center">
        <h2 class="fw-bold">Borrowed List</h2>
        <a href="borrow.php" class="btn-blue-action">Add Borrow</a>
    </div>
    <table class="table table-bordered custom-table" style="table-layout: fixed;">
    <thead>
        <tr>
            <th class="text-center">Name</th>
            <th class="text-center">Student Number</th>
            <th class="text-center">Book(s)</th>
            <th class="text-center">Due Date</th>
            <th class="text-center">Status</th>
            <th class="text-center">Action</th>
        </tr>
    </thead>
    <tbody id="manageTableBody"></tbody>
</table>

</div>


</body>
<script>
    function loadRecords() {
        const tbody = document.getElementById('manageTableBody');
        const data = JSON.parse(localStorage.getItem('borrowedBooks')) || [];
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="py-5 text-muted">No records found.</td></tr>';
            return;
        }

        tbody.innerHTML = data.map((record) => `
            <tr>
                <td>${record.name}</td>
                <td>${record.studentNumber}</td>
                <td>${record.books}</td>
                <td>${record.dueDate}</td>
                <td>
                    <select class="status-select" onchange="updateStatus(${record.id}, this.value)">
                        <option value="Borrowed" ${record.status === 'Borrowed' ? 'selected' : ''}>Borrowed</option>
                        <option value="Returned" ${record.status === 'Returned' ? 'selected' : ''}>Available</option>
                    </select>
                </td>
                <td>
                    <button class="btn btn-sm text-danger" onclick="deleteRecord(${record.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    function updateStatus(id, newStatus) {
        let data = JSON.parse(localStorage.getItem('borrowedBooks'));
        data = data.map(item => item.id === id ? {...item, status: newStatus} : item);
        localStorage.setItem('borrowedBooks', JSON.stringify(data));
    }

    function deleteRecord(id) {
        if(confirm("Remove this entry?")) {
            let data = JSON.parse(localStorage.getItem('borrowedBooks'));
            data = data.filter(item => item.id !== id);
            localStorage.setItem('borrowedBooks', JSON.stringify(data));
            loadRecords();
        }
    }

    document.addEventListener('DOMContentLoaded', loadRecords);
</script>
    <script src="https://code.jquery.com/jquery-4.0.0.js" integrity="sha256-9fsHeVnKBvqh3FB2HYu7g2xseAZ5MlN6Kz/qnkASV8U=" crossorigin="anonymous"></script> 
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    
</html>