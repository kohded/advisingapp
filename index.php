<?php
session_start();

include 'includes/layouts/header.php';
// Must be before nav so logout button shows when logged in without refreshing.
include('includes/login.php');
include 'includes/layouts/nav.php';
include 'includes/degree.php';
include 'includes/layouts/footer.php';
?>