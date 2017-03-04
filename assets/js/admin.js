/**
 * File: admin.js
 * Description: Used for admin functionality.
 *
 * @author Arnold Koh <arnold@kohded.com>
 * @version 2.0, developed 9/23/16
 */

const admin = {
  isLoggedIn: true,
  div: {
    adminCollapsible: $('#admin-collapsible'),
    adminFormCourseBtns: $('#admin-form-course-btns'),
    adminInputCourseCredit: $('#admin-input-course-credit'),
    adminInputCourseDescription: $('#admin-input-course-description'),
    adminInputCourseNumber: $('#admin-input-course-number'),
    adminInputCoursePrereq: $('#admin-input-course-prereq'),
    adminInputCourseTitle: $('#admin-input-course-title'),
    degreeMap: $('#degree-map'),
    degreeSeasonCourses: $('.degree-season-courses')
  },
  init: function () {
    // Admin forms to add a degree or course.
    admin.div.adminCollapsible.collapsible();
    admin.courseForm.autocomplete();

    // Degree map quarterly courses.
    admin.course.autocomplete();
    admin.course.add();
    admin.course.delete();

    // Admin course form.
    admin.div.adminFormCourseBtns.on('click', '#admin-btn-add-course', () => {
      admin.courseForm.add(event);
    });
    admin.div.adminFormCourseBtns.on('click', '#admin-btn-update-course', () => {
      admin.courseForm.update(event);
    });
    admin.div.adminFormCourseBtns.on('click', '#admin-btn-delete-course', () => {
      admin.courseForm.delete(event);
    });
  },
  course: {
    autocomplete: function () {
      admin.div.degreeMap.on('click', '.admin-new-course-autocomplete', () => {
        $('.admin-new-course-autocomplete').devbridgeAutocomplete({
          autoSelectFirst: true,
          maxHeight: 5000,
          lookup: function (courseInput, done) {
            $.ajax({
              data: `type=autocompleteCourse&courseInput=${courseInput}`,
              dataType: 'json',
              type: 'POST',
              url: 'db/admin-course-form.php',
              success: function (courses) {
                const result = {
                  suggestions: courses
                };

                done(result);
              },
              error: function (error) {
                console.log(`Error: ${error}`);
              }
            });
          }
        });
      });
    },
    sort: function () {
      let yearIdFrom;
      let quarterFrom;
      const quarterCoursesFrom = [];

      $('.degree-season-courses').sortable({
        connectWith: '.degree-season-courses',
        disabled: false,
        dropOnEmpty: true,
        start: function (event, ui) {
          // Get year id and quarter data attribute of From div.
          yearIdFrom = ui.item.parent().parent().parent().parent().parent()
                         .attr('data-degree-year-id');
          quarterFrom = ui.item.parent().attr('data-quarter');
        },
        update: function (event, ui) {
          // Get the From list of quarter courses.
          if (ui.sender) {
            $(ui.sender[0].children).each(function () {
              // Add courses to quarterCoursesFrom array.
              quarterCoursesFrom.push($(this).attr('data-course-number'));
            });
          }

          // Get year id and quarter data attribute of To div.
          const yearIdTo = ui.item.parent().parent().parent().parent().parent()
                             .attr('data-degree-year-id');
          const quarterTo = ui.item.parent().attr('data-quarter');
          const quarterCoursesTo = [];

          // Get the To list of quarter courses.
          $(ui.item.parent()[0].children).each(function () {
            // Add courses to quarterCoursesTo array.
            quarterCoursesTo.push($(this).attr('data-course-number'));
          });

          // Save From and To list of quarterly courses.
          $.ajax({
            data: `type=sortCourse&yearIdFrom=${yearIdFrom}&quarterFrom=${quarterFrom}
            &quarterCoursesFrom=${quarterCoursesFrom}&yearIdTo=${yearIdTo}&quarterTo=${quarterTo}
            &quarterCoursesTo=${quarterCoursesTo}`,
            dataType: 'json',
            type: 'POST',
            url: 'db/admin-degree-map.php',
            error: function (error) {
              console.log(`Error: ${error}`);
            }
          });
        }
      }).disableSelection();
    },
    add: function () {
      admin.div.degreeMap.on('click', '.admin-course-add-btn', function (event) {
        event.preventDefault();
        const coursesAfterAdd = [];
        const newCourseInput = $(this).siblings('.admin-new-course-autocomplete').val();
        const courseUnorderedList = $(this).parent().parent().siblings('.degree-season-courses');
        const courseListItems = $(this).parent().parent().siblings('.degree-season-courses')
                                       .children();
        const yearId = $(this).parent().parent().parent().parent().parent().parent()
                              .attr('data-degree-year-id');
        const quarter = $(this).parent().parent().siblings().attr('data-quarter');

        courseListItems.each(function () {
          coursesAfterAdd.push($(this).attr('data-course-number'));
        });
        // Add new course to coursesAfterAdd array.
        coursesAfterAdd.push(newCourseInput);

        $.ajax({
          data: `type=addCourse&courses=${coursesAfterAdd}&yearId=${yearId}&quarter=${quarter}`,
          dataType: 'json',
          type: 'POST',
          url: 'db/admin-degree-map.php',
          error: function (error) {
            console.log(`Error: ${error}`);
          }
        });

        Handlebars.getTemplate('admin-course-add', (template) => {
          // Append Handlebars template of course to unordered list.
          courseUnorderedList.append(template({ course: newCourseInput }));
        });
      });
    },
    delete: function () {
      admin.div.degreeMap.on('click', '.admin-course-delete-btn', function (event) {
        event.preventDefault();
        const coursesAfterDelete = [];
        const courseListItems = $(this).parent().parent().parent().children();
        const yearId = $(this).parent().parent().parent().parent().parent().parent().parent()
                              .attr('data-degree-year-id');
        const quarter = $(this).parent().parent().parent().attr('data-quarter');
        const course = $(this).parent().parent().attr('data-course-number');
        const courseIndex = $(this).parent().parent().index();

        // Add all courses to array without deleted course.
        courseListItems.each(function (index) {
          if (index !== courseIndex) {
            coursesAfterDelete.push($(this).attr('data-course-number'));
          }
        });

        $.ajax({
          data: `type=deleteCourse&courses=${coursesAfterDelete}&yearId=${yearId}&quarter=${quarter}`,
          dataType: 'json',
          type: 'POST',
          url: 'db/admin-degree-map.php',
          error: function (error) {
            console.log(`Error: ${error}`);
          }
        });

        // Remove course from DOM.
        $(this).parent().parent().filter(`[data-course-number="${course}"]`).remove();
      });
    }
  },
  courseForm: { // Admin course form to add/edit pre-populated courses.
    autocomplete: function () {
      admin.div.adminInputCourseNumber.devbridgeAutocomplete({
        autoSelectFirst: true,
        maxHeight: 5000,
        lookup: function (courseInput, done) {
          $.ajax({
            data: `type=autocompleteCourse&courseInput=${courseInput}`,
            dataType: 'json',
            type: 'POST',
            url: 'db/admin-course-form.php',
            success: function (courses) {
              const result = { suggestions: courses };
              done(result);
            },
            error: function (error) {
              console.log(`Error: ${error}`);
            }
          });
        },
        onSearchStart: function () {
          // Clear values.
          admin.div.adminInputCourseTitle.val('');
          admin.div.adminInputCourseCredit.val('');
          admin.div.adminInputCoursePrereq.val('');
          admin.div.adminInputCourseDescription.val('');

          admin.div.adminFormCourseBtns.html(
            `<button class="col s12 m4 btn-large waves-effect waves-light green darken-4" id="admin-btn-add-course" type="submit">
              ADD
            </button>`
          );
        },
        onSelect: function (suggestion) {
          $.ajax({
            data: `type=getCourseInfo&courseNumber=${suggestion.value}`,
            dataType: 'json',
            type: 'POST',
            url: 'db/admin-course-form.php',
            success: function (courseInfo) {
              admin.div.adminInputCourseTitle.val(courseInfo.title);
              admin.div.adminInputCourseCredit.val(courseInfo.credit);
              admin.div.adminInputCoursePrereq.val(courseInfo.prereq);
              admin.div.adminInputCourseDescription.val(courseInfo.description);
              Materialize.updateTextFields();

              // Change buttons if course exists.
              admin.div.adminFormCourseBtns.html(
                `<button class="col s12 m4 btn-large waves-effect waves-light green darken-4" id="admin-btn-update-course" type="submit">
                UPDATE
                </button>
                <button class="col s12 m4 btn-large waves-effect waves-light red darken-4" id="admin-btn-delete-course" type="submit">
                DELETE
                </button>`
              );
            },
            error: function (error) {
              console.log(`Error: ${error}`);
            }
          });
        }
      });
    },
    add: function (event) {
      event.preventDefault();
      const number = event.target.form[0].value;
      const title = event.target.form[1].value;
      const credit = event.target.form[2].value;
      const prereq = event.target.form[3].value;
      const description = event.target.form[4].value;
      const id = number.toLowerCase().replace(/\s/g, ''); // Convert to lowercase and strip spaces.

      $.ajax({
        data: `type=addCourse&id=${id}&number=${number}&title=${title}&credit=${credit}
        &prereq=${prereq}&description=${description}`,
        dataType: 'json',
        type: 'POST',
        url: 'db/admin-course-form.php',
        error: function (error) {
          console.log(`Error: ${error}`);
        }
      });
    },
    update: function (event) {
      event.preventDefault();
      const number = event.target.form[0].value;
      const title = event.target.form[1].value;
      const credit = event.target.form[2].value;
      const prereq = event.target.form[3].value;
      const description = event.target.form[4].value;

      $.ajax({
        data: `type=updateCourse&number=${number}&title=${title}&credit=${credit}
        &prereq=${prereq}&description=${description}`,
        dataType: 'json',
        type: 'POST',
        url: 'db/admin-course-form.php',
        error: function (error) {
          console.log(`Error: ${error}`);
        }
      });
    },
    delete: function (event) {
      event.preventDefault();
      const number = event.target.form[0].value;

      $.ajax({
        data: `type=deleteCourse&number=${number}`,
        dataType: 'json',
        type: 'POST',
        url: 'db/admin-course-form.php',
        success: function () {
          admin.div.adminInputCourseNumber.val('');
          admin.div.adminInputCourseTitle.val('');
          admin.div.adminInputCourseCredit.val('');
          admin.div.adminInputCoursePrereq.val('');
          admin.div.adminInputCourseDescription.val('');
        },
        error: function (error) {
          console.log(`Error: ${error}`);
        }
      });
    }
  }
};

$(() => {
  admin.init();
});
