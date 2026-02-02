function toInclude() {
  fetch("navbar.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("navbar-placeholder").innerHTML = data;

      const current = location.pathname.split("/").pop();
      const links = document.querySelectorAll(".nav-link");
      links.forEach((link) => {
        if (link.getAttribute("href") === current) {
          link.classList.add("active");
        }
      });
    });
}
document.addEventListener("DOMContentLoaded", toInclude);

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const err = document.getElementById("err");

  err.innerText = "";

  if (email == "") {
    err.innerText = "Please input your Email!";
    return false;
  }

  if (password == "") {
    err.innerText = "Please input your Password!";
    return false;
  }
}

function signup() {
  const fullName = document.getElementById("fullName").value;
  const emailS = document.getElementById("emailSignup").value;
  const passwordS = document.getElementById("passwordSignup").value;
  const confirmPass = document.getElementById("confirmPass").value;
  const err = document.getElementById("errS");

  err.innerText = "";

  if (fullName == "") {
    err.innerText = "Please input your Fullname!";
    return false;
  }

  if (emailS == "") {
    err.innerText = "Please input your Email!";
    return false;
  }

  if (passwordS == "") {
    err.innerText = "Please input your Password!";
    return false;
  }
  if (confirmPass == "") {
    err.innerText = "Please confirm your Password!";
    return false;
  }
}
