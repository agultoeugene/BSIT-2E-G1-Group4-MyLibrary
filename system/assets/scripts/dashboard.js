const apid = "/BSIT-2E-G1-Group4-MyLibrary/backend/controllers/dashboard.php";

function get() {
$.ajax({
    url: apid,
    type: "GET",
    data: { action: "get" },
    dataType: "json",
    success: function(response) {
        console.log("Dashboard data:", response); 
        if (response.status === "success") {
            $(".box-1 h2").text(response.totalBooks);      
            $(".box-2 h2").text(response.totalCategories); 
            $(".box-5 h2").text(response.availableBooks); 
            $(".box-3 h2").text(response.totalStudents);   
            $(".box-4 h2").text(response.borrowedBooks);
            $(".box-6 h2").text(response.overdueBooks);
        } else {
            console.error("Failed to fetch dashboard data:", response);
        }
    },
    error: function(err) {
        console.error("AJAX error:", err.responseText); 
    }
});
}

get();