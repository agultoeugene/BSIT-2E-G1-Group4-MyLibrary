<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>My Library - Home</title>
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />
     <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <link rel="stylesheet" href="frontend/assets/css/home.css" />
    <link rel="stylesheet" href="frontend/assets/css/navigation.css">
   
  </head>
<?php
  include("frontend/includes/navigation.php");
?> 
  <body class="bg-body-tertiary">
    <section class="content-container d-flex align-items-center page-content">
      <div class="container">
        <div class="row align-items-center min-vh-75">
          <div class="col-lg-6 text-center text-lg-start text">
            <h1 class="display-4 fw-bold">
              Welcome to <span class="text-primary">My Library</span>
            </h1>
            <h2>— Your Gateway to Knowledge</h2>
            <p class="lead fs-4">
              Welcome, Librarian! This page serves as your central dashboard for
              managing student borrowings. Here, you can see and track all the
              books that students are allowed to borrow from the library. It
              helps you stay organized, monitor which titles are currently
              borrowed or available, and ensure that every student has access to
              the resources they need. By using this page, you can efficiently
              manage lending, plan for returns, and maintain the library’s
              collection in an orderly and accessible way. Think of this as your
              main control center for overseeing student reading activity and
              keeping the library running smoothly.
            </p>
          </div>
          <div class="col-lg-6 text-center mt-4 mt-lg-0">
            <img
              src="https://static.vecteezy.com/system/resources/previews/060/264/719/non_2x/stack-of-books-illustration-free-png.png"
              class="img-fluid book-img"
              alt="Stack of Books"
            />
          </div>
        </div>
      </div>
    </section>
    
    <script src="https://code.jquery.com/jquery-4.0.0.js" integrity="sha256-9fsHeVnKBvqh3FB2HYu7g2xseAZ5MlN6Kz/qnkASV8U=" crossorigin="anonymous"></script>
    <script src="frontend/assets/script/login.js"></script> 
    <script src="frontend/assets/script/register.js"></script> 
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    
    
  </body>
</html>
