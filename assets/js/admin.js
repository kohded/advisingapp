/**
 * File: admin.js
 * Description: Used for admin functionality.
 *
 * @author Arnold Koh <arnold@kohded.com>
 * @version 2.0, developed 9/23/16
 */

'use strict';

var admin = {
  isLoggedIn  : true,
  div         : {
    adminBtnAddDegree  : $('#admin-btn-add-degree'),
    degreeSeasonCourses: $('.degree-season-courses')
  },
  init        : function() {
    //Add degree button on click.
    admin.div.adminBtnAddDegree.click(function(event) {
      event.preventDefault();
      //Add new degree
      admin.addDegree();
    });
  },
  initSortable: function() {
    let yearIdFrom;
    let quarterFrom;

    $('.degree-season-courses').sortable({
      connectWith: '.degree-season-courses',
      disabled   : false,
      dropOnEmpty: true,
      start      : function(event, ui) {
        yearIdFrom = ui.item.parent().parent().parent().parent().parent().attr(
            'data-degree-year-id');
        quarterFrom      = ui.item.parent().attr('data-quarter');
      },
      receive    : function(event, ui) {
        let quarterCoursesFrom = [];
        
        if(ui.sender) {
          $(ui.sender[0].children).each(function(index) {
            quarterCoursesFrom.push($(this).attr('data-course-number'))
          });
        }

        let yearIdTo = ui.item.parent().parent().parent().parent().parent().attr(
          'data-degree-year-id');
        let quarterTo      = ui.item.parent().attr('data-quarter');
        let quarterCoursesTo = [];

        $(ui.item.parent()[0].children).each(function(index) {
          quarterCoursesTo.push($(this).attr('data-course-number'))
        });

        $.ajax({
          data: 'type=updateDegree&yearIdFrom=' + yearIdFrom +
                                  '&quarterFrom=' + quarterFrom +
                                  '&quarterCoursesFrom=' + quarterCoursesFrom +
                                  '&yearIdTo=' + yearIdTo +
                                  '&quarterTo=' + quarterTo +
                                  '&quarterCoursesTo=' + quarterCoursesTo,
          dataType: 'json',
          type: 'POST',
          url: 'db/admin.php',
          success : function(update) {
            console.log(update)
          },
          error   : function(error) {
            console.log('Error: ' + error);
          }
        });
      },
    }).disableSelection();
  },
  addDegree   : function() {
    Handlebars.getTemplate('degree', function(template) {
      //Append template to #degree-list div.
      selector.degree.append(template);
      //Initialize sortable on degree quarterly courses.
    });
  }
};

$(function() {
  admin.init();
});