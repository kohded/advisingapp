<?php if(isset($_SESSION['auth-current-user'])) { ?>
  <div class="divider"></div>
  
  <!--Admin title-->
  <div class="row">
    <div class="col s12 center">
      <h5>Admin</h5>
    </div>
  </div>
  
  <ul class="collapsible" id="admin-collapsible" data-collapsible="accordion">
    <li>
      <div class="collapsible-header">
        <i class="material-icons">school</i>
        Degree <small>(Add or delete pre-populated degree.)</small>
      </div>
      <div class="collapsible-body">
        <form class="row">
          <!--Degrees input-->
          <div class="col s12 m6 input-field">
            <input class="validate" id="admin-input-degree" type="text"/>
            <label for="admin-input-degree">Degree title</label>
          </div>
          <!--Quarter start input-->
          <div class="col s12 m6 input-field">
            <input class="validate" id="admin-input-start" type="text"/>
            <label for="admin-input-start">Quarter start</label>
          </div>
          <!--Submit degree button-->
          <div class="col s12">
            <button class="col s12 m4 btn-large waves-effect waves-light green darken-4" id="admin-btn-add-degree">
              ADD
            </button>
          </div>
        </form>
      </div>
    </li>
    <li>
      <div class="collapsible-header">
        <i class="material-icons">class</i>
        Course <small>(Add, update, or delete pre-populated course.)</small>
      </div>
      <div class="collapsible-body">
        <form class="row">
          <!--Number-->
          <div class="col s12 m3 input-field">
            <input class="validate" id="admin-input-course-number" type="text"/>
            <label for="admin-input-course-number">Number</label>
          </div>
          <!--Title-->
          <div class="col s12 m6 input-field">
            <input class="validate" id="admin-input-course-title" type="text"/>
            <label for="admin-input-course-title">Title</label>
          </div>
          <!--Credit-->
          <div class="col s12 m3 input-field">
            <input class="validate" id="admin-input-course-credit" type="text"/>
            <label for="admin-input-course-credit">Credit</label>
          </div>
          <!--Prereq-->
          <div class="col s12 input-field">
            <textarea class="validate materialize-textarea" id="admin-input-course-prereq" type="text"/></textarea>
            <label for="admin-input-course-prereq">Prereq</label>
          </div>
          <!--Description-->
          <div class="col s12 input-field">
            <textarea class="validate materialize-textarea" id="admin-input-course-description" type="text"/></textarea>
            <label for="admin-input-course-description">Description</label>
          </div>
          <!--Submit course button-->
          <div class="col s12" id="admin-form-course-btns">
            <button class="col s12 m4 btn-large waves-effect waves-light green darken-4" id="admin-btn-add-course" type="submit">
              ADD
            </button>
          </div>
        </form>
      </div>
    </li>
  </ul>
<?php } ?>