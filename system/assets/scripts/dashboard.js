const api = "/BSIT-2E-G1-Group4-MyLibrary/backend/controllers/dashboard.php";

function get() {
    $.ajax({
        url: api,
        type: "GET",
        data: { action: "get" },
        dataType: "json",
        success: function(response) {
            if (response.status === "success") {
                $(".box-1 h2").text(response.totalBooks);      
                $(".box-2 h2").text(response.totalCategories); 
                $(".box-5 h2").text(response.availableBooks); 
                $(".box-3 h2").text(response.totalStudents);   
            } else {
                console.error("Failed to fetch dashboard data.");
            }
        },
        error: function(err) {
            console.error(err);
        }
    });
}

get();