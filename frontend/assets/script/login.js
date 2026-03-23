const api = "/BSIT-2E-G1-Group4-MyLibrary/backend/controllers/login.php";
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
                alert(response.message);
                if(response.status == "success"){
                    window.location.href = "/BSIT-2E-G1-Group4-MyLibrary/system/pages/dashboard.php";
                }
        },
     error : function (error) {
			      alert(error.message);
	    	  }
  })
}
