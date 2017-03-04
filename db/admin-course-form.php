<?php
/**
 * Green River IT Advising App
 * @author Arnold Koh <arnold@kohded.com>
 * @version 2.0, developed 9/23/16
 * @url http://advisingapp.greenrivertech.net/
 * admin-course-form.php
 * Database queries for admin course form.
 */

include '../../db.php';

//Check if post is sent from ajax call.
if(isset($_POST['type'])) {
  $type = $_POST['type'];
  
  // addCourse, updateCourse, deleteCourse
  if(isset($_POST['id']) || isset($_POST['number']) || isset($_POST['title']) || isset($_POST['credit'])
    || isset($_POST['prereq']) || isset($_POST['description'])
  ) {
    $id = $_POST['id'];
    $number = $_POST['number'];
    $title = $_POST['title'];
    $credit = $_POST['credit'];
    $prereq = $_POST['prereq'];
    $description = $_POST['description'];
  }
  
  // autocompleteCourse
  if(isset($_POST['courseInput'])) {
    $courseInput = '%' . $_POST['courseInput'] . '%';
  }
  
  // getCourseInfo
  if(isset($_POST['courseNumber'])) {
    $courseNumber = $_POST['courseNumber'];
  }
  
  switch($type) {
    case 'addCourse' :
      addCourse($id, $number, $title, $credit, $prereq, $description);
      break;
    case 'updateCourse' :
      updateCourse($number, $title, $credit, $prereq, $description);
      break;
    case 'deleteCourse' :
      deleteCourse($number);
      break;
    case 'autocompleteCourse' :
      autocompleteCourse($courseInput);
      break;
    case 'getCourseInfo' :
      getCourseInfo($courseNumber);
      break;
    default:
      break;
  }
}

function addCourse($id, $number, $title, $credit, $prereq, $description) {
  $sql = 'INSERT INTO course(id, number, title, credit, prereq, description) 
          VALUES (:id, :number, :title, :credit, :prereq, :description)';
  
  $db = dbConnect();
  $stmt = $db->prepare($sql);
  $db = null;
  $stmt->bindParam(':id', $id, PDO::PARAM_STR);
  $stmt->bindParam(':number', $number, PDO::PARAM_STR);
  $stmt->bindParam(':title', $title, PDO::PARAM_STR);
  $stmt->bindParam(':credit', $credit, PDO::PARAM_STR);
  $stmt->bindParam(':prereq', $prereq, PDO::PARAM_STR);
  $stmt->bindParam(':description', $description, PDO::PARAM_STR);
  $stmt->execute();
  
  echo json_encode(array('status' => 'success'));
}

function updateCourse($number, $title, $credit, $prereq, $description) {
  $sql = 'UPDATE course 
          SET number=:number, title=:title, credit=:credit, prereq=:prereq, description=:description 
          WHERE number=:number';
  
  $db = dbConnect();
  $stmt = $db->prepare($sql);
  $db = null;
  $stmt->bindParam(':number', $number, PDO::PARAM_STR);
  $stmt->bindParam(':title', $title, PDO::PARAM_STR);
  $stmt->bindParam(':credit', $credit, PDO::PARAM_STR);
  $stmt->bindParam(':prereq', $prereq, PDO::PARAM_STR);
  $stmt->bindParam(':description', $description, PDO::PARAM_STR);
  $stmt->execute();
  
  echo json_encode(array('status' => 'success'));
}

function deleteCourse($number) {
  $sql = 'DELETE FROM course WHERE number=:number';
  
  $db = dbConnect();
  $stmt = $db->prepare($sql);
  $db = null;
  $stmt->bindParam(':number', $number, PDO::PARAM_STR);
  $stmt->execute();
  
  echo json_encode(array('status' => 'success'));
}

function autocompleteCourse($courseInput) {
  $courses = array();
  $sql = 'SELECT * FROM course WHERE number LIKE (:courseInput)';
  
  $db = dbConnect();
  $stmt = $db->prepare($sql);
  $db = null;
  $stmt->bindParam(':courseInput', $courseInput, PDO::PARAM_STR);
  $stmt->execute();
  $result = $stmt->fetchAll();
  
  foreach($result as $row) {
    $course = array();
    $course['value'] = $row['number'];
    $course['data'] = '';
    $courses[] = $course;
  }
  
  echo json_encode($courses);
}

function getCourseInfo($courseNumber) {
  $courseInfo = array();
  $sql = 'SELECT * FROM course c WHERE c.number = :courseNumber';
  
  $db = dbConnect();
  $stmt = $db->prepare($sql);
  $db = null;
  $stmt->bindParam(':courseNumber', $courseNumber, PDO::PARAM_STR);
  $stmt->execute();
  $result = $stmt->fetchAll();
  
  foreach($result as $row) {
    $courseInfo['title'] = $row['title'];
    $courseInfo['credit'] = $row['credit'];
    $courseInfo['prereq'] = $row['prereq'];
    $courseInfo['description'] = $row['description'];
  }
  
  echo json_encode($courseInfo);
}

?>