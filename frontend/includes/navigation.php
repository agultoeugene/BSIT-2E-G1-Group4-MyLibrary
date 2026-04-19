 <nav
      class="navbar navbar-expand-lg nav-container py-4 bg-body-tertiary fixed-top"
    >
      <div
        class="container-fluid d-flex align-items-center justify-content-between"
      >
        <a class="logo" href="#">My LIBRARY/</a>

        
        <div class="d-flex align-items-center flex-nowrap gap-1 d-lg-none">
          <!-- Login button -->
          <button
            id="login-btn"
            class="btn btn-outline-primary login-btn"
            data-bs-toggle="modal"
            data-bs-target="#loginModal"
          >
            LOGIN
          </button>
        
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
        </div>
        <?php 
            $currentPage = basename($_SERVER['PHP_SELF']);  
        ?>
        <div
          class="collapse navbar-collapse justify-content-lg-center"
          id="navbarNavAltMarkup"
        >
          <div class="navbar-nav link-container gap-lg-5">
                                                                 <!-- Navigation Link -->
                <a class="nav-link <?php echo $currentPage == 'index.php' ? 'active' : ''; ?>" href="/Library/index.php">Home</a>
                <a class="nav-link <?php echo $currentPage == 'about.php' ? 'active' : ''; ?>" href="/Library/frontend/public/about.php">About Us</a>
                <a class="nav-link <?php echo $currentPage == 'services.php' ? 'active' : ''; ?>" href="/Library/frontend/public/services.php">Services</a>
                <a class="nav-link <?php echo $currentPage == 'gallery.php' ? 'active' : ''; ?>" href="/Library/frontend/public/gallery.php">Gallery</a>
                <a class="nav-link <?php echo $currentPage == 'contact.php' ? 'active' : ''; ?>" href="/Library/frontend/public/contact.php">Contact</a>
          </div>
        </div>
        <div class="d-none d-lg-flex gap-4">
          <button
            id="login-btn-create"
            class="btn btn-outline-primary login-btn  w-200"
            data-bs-toggle="modal"
            data-bs-target="#loginModal"
          >
            LOGIN
          </button>
        
        </div>
      </div>
    </nav>
    <div class="modal fade" id="loginModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content p-3">
          <div class="modal-header border-0">
            <h5 class="modal-title text-primary fw-bold">Librarian Login</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div class="modal-body">
            <form id="loginForm">
              <div class="mb-1">
                <label class="form-label">Email</label>
                <input id="email" type="email" class="form-control" />
              </div>
              <small id="errEmail" class="text-danger"></small>

              <div class="mb-1">
                <label class="form-label">Password</label>
                <input id="password" type="password" class="form-control" />
              </div>
               <small id="errPassword" class="text-danger"></small>
              <div class="form-check mb-3">
                <input class="form-check-input" type="checkbox" id="remember" />
                <label class="form-check-label" for="remember">
                  Remember me
                </label>
              </div>
            
              <button class="btn btn-primary w-100 mt-4">Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="signupModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content p-3">
          <div class="modal-header border-0">
            <h5 class="modal-title text-success fw-bold">Create Account</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

         
        </div>
      </div>
    </div>
