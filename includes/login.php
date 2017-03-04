<?php
require_once realpath(dirname(__DIR__)) . '/lib/UserManagerLib/UserManagerLib/Authentication.php';

if(isset($_POST['login-btn'])) {
  Authentication::login($_POST['username'], $_POST['password'], 'advisingapp');
}

if(isset($_POST['logout-btn'])) {
  session_destroy();
  echo '<meta http-equiv="refresh" content="0" />'; // Refresh page after destroying session.
  // Authentication::logout('index.php'); // UserManagerLib logout doesn't work.
}
?>

<div class="modal modal-fixed-footer" id="login-modal">
  <div class="modal-content">
    <div class="row">
      <h4>Login</h4>
      <form class="col s12" method="post">
        <!--Username-->
        <div class="row">
          <div class="col s12 input-field">
            <input class="validate" id="login-modal-username" name="username" type="text" required>
            <label for="login-modal-username">Username</label>
          </div>
        </div>
        <!--Password-->
        <div class="row">
          <div class="col s12 input-field">
            <input class="validate" id="login-modal-password" name="password" type="password" required>
            <label for="login-modal-password">Password</label>
          </div>
        </div>
        <div class="row right">
          <!--Cancel Button-->
          <button class="btn modal-action modal-close waves-effect waves-red green">
            Cancel
          </button>
          <!--Login Button-->
          <button class="btn modal-action waves-effect waves-light green" id="login-btn" name="login-btn" type="submit">
            Login
          </button>
        </div>
      </form>
    </div>
  </div>
</div>