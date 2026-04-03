const API = "/BSIT-2E-G1-Group4-MyLibrary/backend/controllers/register.php";
$(document).ready(function() {
    $("#signupForm").on("submit", function(e){
        e.preventDefault(); 
        store(); 
    });
});
function store() {
    let fName =  $("#fName").val();
    let lName =  $("#lName").val();
    let emailS =  $("#emailSignup").val();
    let passwordS =  $("#passwordSignup").val();
    let confirmPass =  $("#confirmPass").val();
    
    let errfName =  $("#errfName");
    let errlName =  $("#errlName");
    let errEmailS =  $("#errEmailS");
    let errPasswordS =  $("#errPasswordS");
    let errConPass =  $("#errConPass");

  errfName.text("");
  errlName.text("");
  errEmailS.text("");
  errPasswordS.text("");
  errConPass.text("");

  if (fName == "") {
    errfName.text("Firstname is required!");
    return false;
  }

  if (lName == "") {
    errlName.text("Lastname is required!");
    return false;
  }

  if (emailS == "") {
    errEmailS.text("Email is required!");
    return false;
  }

  if (passwordS == "") {
    errPasswordS.text("Password is required!");
    return false;
  }
  if (confirmPass == "") {
    errConPass.text("Password is required!");
    return false;
  }else{
      if (passwordS != confirmPass) {
           errConPass.text("Password didn't match!");
            return false;
      }
  }

  let payload ={
        fName : fName,
        lName : lName,
        emailS : emailS,
        passwordS : passwordS
  }
   $.ajax({
        url : API,
        type : "POST",
        data: {
                    action: "store",
                    payload: JSON.stringify(payload)
              },
        dataType: "json",
        success : function (response) {
             if (response.status == "success") {

            Swal.fire({
                icon: "success",
                title: "Success",
                text: response.message,
                confirmButtonText: "OK"
            }).then(() => {
                window.location.href = "/BSIT-2E-G1-Group4-MyLibrary/index.php";
            });

        } else {

            Swal.fire({
                icon: "error",
                title: "Error",
                text: response.message
            });

        }
    },
       error : function (error) {
			    alert(error.message);
		    }
   });

}
$('#signupModal').on('hidden.bs.modal', function () {
    clearForm();
});
function clearError(inputId, errorId) {
    const input = $(inputId);
    const error = $(errorId);

    input.on("input", function () {
        if ($(this).val().trim() !== "") {
            error.text("");
        }
    });
}
$(document).ready(function() {
    clearError("#fName", "#errfName");
    clearError("#lName", "#errlName");
    clearError("#emailSignup", "#errEmailS");
    clearError("#passwordSignup", "#errPasswordS");
    clearError("#confirmPass", "#errConPass");
});
function clearForm() {
    $("#fName").val("");
    $("#lName").val("");
    $("#emailSignup").val("");
    $("#passwordSignup").val("");
    $("#confirmPass").val("");

    $("#errfName").text("");
    $("#errlName").text("");
    $("#errEmailS").text("");
    $("#errPasswordS").text("");
    $("#errConPass").text("");
}