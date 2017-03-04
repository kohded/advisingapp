</div>
<!--Main End-->

<!--Footer-->
<footer class="page-footer green darken-4">
  <div class="footer-copyright green darken-4">
    Copyright &copy; <?php echo date('Y') ?> Green River College
  </div>
</footer>

<!--Scripts-->
<script rel="text/javascript" src="assets/bower_components/jquery/dist/jquery.min.js"></script>
<script rel="text/javascript" src="assets/bower_components/jquery-ui/jquery-ui.min.js"></script>
<script rel="text/javascript" src="assets/bower_components/materialize/dist/js/materialize.min.js"></script>
<script rel="text/javascript" src="assets/bower_components/handlebars/handlebars.min.js"></script>
<script rel="text/javascript" src="assets/bower_components/devbridge-autocomplete/dist/jquery.autocomplete.js"></script>
<script rel="text/javascript" src="assets/js/main.js"></script>
<script rel="text/javascript" src="assets/js/degree.js"></script>

<?php if(isset($_SESSION['auth-current-user'])) { ?>
  <script rel="text/javascript" src="assets/js/admin.js"></script>
<?php } ?>
</body>
</html>