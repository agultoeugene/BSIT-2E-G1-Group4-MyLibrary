const API = "/BSIT-2E-G1-Group4-MyLibrary/backend/controllers/account.php";
const APID = "/BSIT-2E-G1-Group4-MyLibrary/backend/controllers/delete.php";
 function get(){
    return $.ajax({
        url: API,
        type: 'GET',
        data: { action: "get" },
        dataType: 'json',
        success: function(response) {

            if (response.status === 'success') {
                acc = response.data;
                displayAccounts(acc);
            }

        },
        error: function(xhr, status, error) {
            console.error(error);
        }
    });
}



// display accounts
function displayAccounts(accountList) {
    let container = $("#accountsTable");
    container.empty();

    if (accountList.length === 0) {
        container.html("<tr><td colspan='5' class='text-center'>No accounts found.</td></tr>");
        return;
    }

    accountList.forEach(account => {
        container.append(createAccountRow(account));
    });
}


// create table row
function createAccountRow(account) {
    return `
<tr>
    <td class="text-center">${account.fname}</td>
    <td class="text-center">${account.lname}</td>
    <td class="text-center">${account.email}</td>
    <td class="text-center">${account.role}</td>
    <td class="text-center">
       <button 
            class="btn btn-danger btn-sm deleteAccount"
            data-id="${account.account_id}">
            Delete
        </button>
    </td>
</tr>
`;
}
$(document).on("click", ".deleteAccount", function () {

    let id = $(this).data("id");
    let row = $(this).closest("tr");

    Swal.fire({
        title: "Are you sure?",
        text: "This account will be permanently deleted!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#d33"
    }).then((result) => {

        if (result.isConfirmed) {

            $.ajax({
                url: APID,
                type: "POST",
                data: {
                    action: "delete",
                    id: id
                },
                dataType: "json",
                success: function(response) {

                    if(response.status === "success") {

                        Swal.fire({
                            icon: "success",
                            title: "Deleted!",
                            text: response.message,
                            timer: 1500,
                            showConfirmButton: false
                        });

                        row.remove(); 

                    } else {

                        Swal.fire({
                            icon: "error",
                            title: "Failed",
                            text: response.message
                        });

                    }

                },
                error: function(xhr) {

                    console.log("ERROR RESPONSE:");
                    console.log(xhr.responseText);

                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Something went wrong!"
                    });

                }
            });

        }
    });

});