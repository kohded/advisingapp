/**
 * File: degree.js
 * Description: Used for the degree select, degree filter, and course modal.
 * Retrieves course data from the database through ajax, then outputs the data
 * to a Handlebars template.
 *
 * @author Arnold Koh <arnold@kohded.com>
 * @version 2.0, developed 9/23/16
 */

'use strict';

var degree = {
  div             : {
    courseModalTitle      : $('.course-modal-title'),
    courseModalDescription: $('.course-modal-description'),
    courseModalPrereq     : $('.course-modal-prereq'),
    degreeForm            : $('#degree-form'),
    degreeMap             : $('#degree-map'),
    degreeSelectTitle     : $('#degree-select-title'),
    degreeSelectStart     : $('#degree-select-start'),
    select                : $('select')
  },
  init            : function() {
    degree.div.degreeMap.hide();
    degree.div.select.material_select();
    degree.select.loadDegreeTitles();
    degree.submitSearchForm();

    degree.div.degreeSelectTitle.change(function(event) {
      event.preventDefault();
      degree.select.loadQuarterStartByDegree(event.target.value);
    });
  },
  select          : {
    loadDegreeTitles        : function() {
      $.ajax({
        data    : 'type=getTitle',
        dataType: 'json',
        type    : 'POST',
        url     : 'db/degree.php',
        success : function(degreeTitles) {
          degree.select.loadQuarterStartByDegree(degreeTitles[0]);

          //Loop through degree titles and append as select option.
          for(let i = 0; i < degreeTitles.length; i++) {
            degree.div.degreeSelectTitle.append($('<option/>', {
              value: degreeTitles[i],
              text : degreeTitles[i]
            }));
          }
        },
        error   : function(error) {
          console.log('Error: ' + error);
        }
      });
    },
    loadQuarterStartByDegree: function(title) {
      $.ajax({
        data    : 'type=getStart&title=' + encodeURIComponent(title),
        dataType: 'json',
        type    : 'POST',
        url     : 'db/degree.php',
        success : function(degreeStart) {
          degree.div.degreeSelectStart.empty();

          //Loop through quarter start and append as select option.
          for(let i = 0; i < degreeStart.length; i++) {
            degree.div.degreeSelectStart.append($('<option/>', {
              value: degreeStart[i],
              text : degreeStart[i]
            }));
          }
        },
        complete: function() {
          //Re-initialize select after data loads
          degree.div.select.material_select();
        },
        error   : function(error) {
          console.log('Error: ' + error);
        }
      });
    }
  },
  submitSearchForm: function() {
    degree.div.degreeForm.submit(function(event) {
      event.preventDefault();
      let title      = event.target[1].value;
      let start      = event.target[3].value;

      $.ajax({
        data    : 'type=getDegree&title=' + encodeURIComponent(title) +
        '&start=' + start,
        dataType: 'json',
        type    : 'POST',
        url     : 'db/degree.php',
        success : function(degreeResult) {
          Handlebars.getTemplate('degree', function(template) {
            degreeResult.title = title;
            degreeResult.start = start;
            //Undefined until admin logs in. For hbs template.
            try { degreeResult.admin = admin.isLoggedIn; } catch(e) {}

            //Set degree results in Handlebars template the display in html.
            degree.div.degreeMap.html(template(degreeResult));

            //Undefined until admin logs in.
            try { admin.initSortable(); } catch(e) {}

            degree.div.degreeMap.show();

            degree.course.initModalClickEventLoadData();
            degree.course.initModal();
            degree.quarter.resizeCardsToSameHeight();

          });
        },
        error   : function(error) {
          console.log('Error: ' + error);
        }
      });
    });
  },
  course          : {
    initModalClickEventLoadData: function() {
      $('.degree-season-course').click(function(event) {
        event.preventDefault();
        //Get course number data attribute from course li.
        let number = $(this).attr('data-course-number');

        $.ajax({
          data    : 'type=getCourse&number=' + number,
          dataType: 'json',
          type    : 'POST',
          url     : 'db/degree.php',
          success : function(course) {
            let credit = '';
            if(course.credit) {
              credit = ' (' + course.credit + ')';
            }

            let title = course.number + ': ' + course.title + credit;
            degree.div.courseModalTitle.html(title);
            degree.div.courseModalDescription.html(course.description);

            if(course.prereq) {
              degree.div.courseModalPrereq.html('Prerequisites: ' +
                course.prereq);
            }
          },
          error   : function(error) {
            console.log('Error: ' + error);
          }
        });
      });
    },
    initModal      : function() {
      $('.degree-course-modal').leanModal({
          dismissible : true, // Can be dismissed by clicking outside modal
          opacity     : .5, // Opacity of modal background
          in_duration : 400, // Transition in duration
          out_duration: 400, // Transition out duration
          starting_top: '4%', // Starting top style attribute
          ending_top  : '10%', // Ending top style attribute
          //ready: function() { }, // Callback for open
          complete    : function() { // Callback for close
            //Clear modal text
            degree.div.courseModalTitle.empty();
            degree.div.courseModalDescription.empty();
            degree.div.courseModalPrereq.empty();
          }
        }
      );
    }
  },
  quarter : {
    resizeCardsToSameHeight : function() {
      let cardHeight = 0;

      //Find the tallest quarter card and set all to the same height.
      $('.degree-season-content').each(function() {
        cardHeight =
          (cardHeight > $(this).height()) ? cardHeight : $(this).height();
      });

      $('.degree-season-content').height(cardHeight);
    }
  }
};

//Function attached to the Handlebars object to compile template files.
Handlebars.getTemplate = function(name, callback) {
  $.ajax({
    ajax   : false,
    url    : 'assets/js/templates/' + name + '.hbs',
    success: function(data) {
      if(Handlebars.template === undefined) {
        Handlebars.template = {};
      }
      //Compile template.
      Handlebars.template[name] = Handlebars.compile(data);
      //Callback the template if it exists.
      if(callback) {
        callback(Handlebars.template[name]);
      }
    }
  });
};

$(function() {
  degree.init();
});