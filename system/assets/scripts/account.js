const API = "/Library/backend/controllers/account.php";
const APID = "/Library/backend/controllers/delete.php";
let allAccounts = [];

function get(){
    return $.ajax({
        url: API,
        type: 'GET',
        data: { action: "get" },
        dataType: 'json',
        success: function(response) {

            if (response.status === 'success') {
                allAccounts = response.data;
                displayAccounts(allAccounts);
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
            class="btn btn-warning btn-sm me-1 changePassAccount"
            data-id="${account.account_id}"
            data-name="${account.fname} ${account.lname}">
            Change Password
        </button>
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

$(document).ready(function() {
    get();

    $(document).on('input', '#searchAccountInput', function() {
        const query = $(this).val().trim().toLowerCase();
        if (!query) {
            displayAccounts(allAccounts);
            return;
        }

        const filtered = allAccounts.filter(account => {
            const text = `${account.fname} ${account.lname} ${account.email} ${account.role}`.toLowerCase();
            return text.includes(query);
        });

        displayAccounts(filtered);
    });

    $(document).on('click', '.changePassAccount', function() {
        const accountId = $(this).data('id');
        const userName = $(this).data('name');

        $('#changePasswordAccountId').val(accountId);
        $('#newPassword').val('');
        $('#confirmNewPassword').val('');
        $('#errNewPassword').text('');
        $('#errConfirmNewPassword').text('');

        $('#changePasswordModal .modal-title').text(`Change Password for ${userName}`);
        let modal = new bootstrap.Modal(document.getElementById('changePasswordModal'));
        modal.show();
    });

    $('#changePasswordForm').on('submit', function(e) {
        e.preventDefault();

        const accountId = $('#changePasswordAccountId').val();
        const password = $('#newPassword').val().trim();
        const confirmPassword = $('#confirmNewPassword').val().trim();

        $('#errNewPassword').text('');
        $('#errConfirmNewPassword').text('');

        let valid = true;
        if (password.length < 6) {
            $('#errNewPassword').text('Password must be at least 6 characters');
            valid = false;
        }
        if (password !== confirmPassword) {
            $('#errConfirmNewPassword').text('Passwords do not match');
            valid = false;
        }

        if (!valid) return;

        $.ajax({
            url: API,
            type: 'POST',
            data: {
                action: 'change_password',
                id: accountId,
                password: password
            },
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Password updated',
                        text: response.message,
                        timer: 1500,
                        showConfirmButton: false
                    });
                    bootstrap.Modal.getInstance(document.getElementById('changePasswordModal')).hide();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Update Failed',
                        text: response.message
                    });
                }
            },
            error: function(xhr) {
                console.error(xhr.responseText);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Unable to change password.'
                });
            }
        });
    });
});
