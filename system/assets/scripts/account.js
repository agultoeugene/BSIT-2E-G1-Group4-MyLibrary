// APPROVE
$(document).on("click", ".approve-btn", function () {

    let id = $(this).data("id");
    let role = $(`.role-select[data-id='${id}']`).val();

    if(!role){
        alert("Please select a role first.");
        return;
    }

    if(confirm("Approve this account?")){

        $.ajax({
            url: "/BSIT-2E-G1-Group4-MyLibrary/backend/controllers/approve.php",
            type: "POST",
            data: {
                id: id,
                role: role
            },
            success: function(response){
                alert("Account Approved!");
                location.reload();
            }
        });

    }
});


$(document).on("click", ".delete-btn", function () {

    let id = $(this).data("id");
    let row = $(this).closest("tr");

    if(confirm("Delete this account?")){

        $.ajax({
            url: "/BSIT-2E-G1-Group4-MyLibrary/backend/controllers/delete.php",
            type: "POST",
            data: { id: id },
            success: function(){
                alert("Account Deleted!");
                row.remove();
            }
        });

    }
});