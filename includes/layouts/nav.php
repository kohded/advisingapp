<!--Nav-->
<nav>
  <div class="nav-wrapper green darken-4">
    <!--Logo-->
    <a href="#" class="brand-logo left">
      <img src="assets/img/logo.jpg" alt="logo" class="responsive-img" id="logo">
    </a>
    
    <!--Login/Logout Button-->
    <?php
    if(isset($_SESSION['auth-current-user'])) {
      echo '<form method="post"><button class="btn waves-effect waves-light grey darken-3" id="logout-btn" name="logout-btn" type="submit">Logout</button></form>';
    }
    else {
      echo '<a href="#login-modal" class="btn modal-trigger waves-effect waves-light grey darken-3" id="login-modal-btn">Login</a>';
    }
    ?>
  </div>
</nav>

<!--Main-->
<div id="main">