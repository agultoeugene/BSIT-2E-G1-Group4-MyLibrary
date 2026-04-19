
const api = "/Library/backend/controllers/login.php";
// Login event listner and clear error
$(document).ready(function() {

    $("#loginForm").on("submit", function(e){
        e.preventDefault(); 
        postOne(); 
    });

    $("#email").on("input", function() {
        $("#errEmail").text("");
    });

    $("#password").on("input", function() {
        $("#errPassword").text("");
    });

    $('#loginModal').on('hidden.bs.modal', function () {
        $("#errEmail").text("");
        $("#errPassword").text("");
        $("#email").val("");      
        $("#password").val("");   
    });
});
// Function to get the value from database and error handling
function postOne() {
  let email = $("#email").val();
  let password = $("#password").val();
  
  let errEmail = $("#errEmail");
  let errPassword = $("#errPassword");

  errEmail.text("");
  errPassword.text("");

  if (email == "") {
    errEmail.text("Please input your Email!"); 
    return false;
  }

  if (password == "") {
    errPassword.text("Please input your Password!");
    return false;
  }

  let payload = {
      email : email,
      password : password
  }

  $.ajax({
     url : api,
     type : "POST",
     data: {
                    action: "postOne",
                    payload: JSON.stringify(payload)
           },
     dataType: "json",
     success : function (response) {
        
           if (response.status == "success") {
           Swal.fire({
            icon: "success",
            title: "Login Successfully",
            text: response.message,
            timer: 1500,
            showConfirmButton: false
        }).then(() => {
            window.location.href = "/Library/system/pages/dashboard.php";
        });

        } else {

            Swal.fire({
                title: "Login Failed!",
                text: response.message,
                icon: "error"
            });

        }
    },
     error : function (error) {
			      alert(error.message);
	    	  }
  })
}

