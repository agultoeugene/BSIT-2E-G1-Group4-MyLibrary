// APPROVE ACCOUNT BUTTON
$(document).on("click", ".approve-btn", function () {

    // Get account ID from button data attribute
    let id = $(this).data("id");

    // Get selected role from dropdown with same ID
    let role = $(`.role-select[data-id='${id}']`).val();

    // Check if role is selected
    if(!role){
        alert("Please select a role first.");
        return;
    }

    // Confirm approval action
    if(confirm("Approve this account?")){

        // Send AJAX request to approve account
        $.ajax({
            url: "/BSIT-2E-G1-Group4-MyLibrary/backend/controllers/approve.php",
            type: "POST",
            data: {
                id: id,
                role: role
            },

            // If approval successful
            success: function(response){
                alert("Account Approved!");
                location.reload(); // reload page to refresh list
            }
        });

    }
});


// DELETE ACCOUNT BUTTON
$(document).on("click", ".delete-btn", function () {

    // Get account ID
    let id = $(this).data("id");

    // Get table row of the clicked button
    let row = $(this).closest("tr");

    // Confirm delete action
    if(confirm("Delete this account?")){

        // Send AJAX request to delete account
        $.ajax({
            url: "/BSIT-2E-G1-Group4-MyLibrary/backend/controllers/delete.php",
            type: "POST",
            data: { id: id },

            // If deletion successful
            success: function(){

                alert("Account Deleted!");

                // Remove row from table without refreshing
                row.remove();
            }
        });

    }
});