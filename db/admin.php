<?php
/**
 * Green River IT Advising App
 * @author Arnold Koh <arnold@kohded.com>
 * @version 1.0, developed 9/23/16
 * @url http://advisingapp.greenrivertech.net/
 * admin.php
 */

include '../../../db.php';

//Check if post is sent from ajax call.
if(isset($_POST['type'])) {
  $type = $_POST['type'];

  if(isset($_POST['yearIdFrom']) || isset($_POST['quarterFrom']) || isset($_POST['quarterCoursesFrom']) ||
    isset($_POST['yearIdTo']) || isset($_POST['quarterTo']) || isset($_POST['quarterCoursesTo'])) {
    $yearIdFrom = $_POST['yearIdFrom'];
    $quarterFrom = $_POST['quarterFrom'];
    $quarterCoursesFrom = $_POST['quarterCoursesFrom'];
    $yearIdTo = $_POST['yearIdTo'];
    $quarterTo = $_POST['quarterTo'];
    $quarterCoursesTo = $_POST['quarterCoursesTo'];
  }

  switch($type) {
    case 'updateDegree' :
      updateDegree($yearIdFrom, $quarterFrom, $quarterCoursesFrom, $yearIdTo, $quarterTo, $quarterCoursesTo);
      break;
    default:
      break;
  }
}

function updateDegree($yearIdFrom, $quarterFrom, $quarterCoursesFrom, $yearIdTo, $quarterTo, $quarterCoursesTo) {
  $sqlFrom = "UPDATE year SET $quarterFrom=:quarterCoursesFrom WHERE id=:yearIdFrom";
  $sqlTo = "UPDATE year SET $quarterTo=:quarterCoursesTo WHERE id=:yearIdTo";

  $db = dbConnect();
  $stmtFrom = $db->prepare($sqlFrom);
  $stmtTo = $db->prepare($sqlTo);
  $db = null;
  $stmtFrom->bindParam(':yearIdFrom', $yearIdFrom, PDO::PARAM_STR);
  // $stmtFrom->bindParam(':quarterFrom', $quarterFrom, PDO::PARAM_STR);
  $stmtFrom->bindParam(':quarterCoursesFrom', $quarterCoursesFrom, PDO::PARAM_STR);
  $stmtTo->bindParam(':yearIdTo', $yearIdTo, PDO::PARAM_STR);
  // $stmtTo->bindParam(':quarterTo', $quarterTo, PDO::PARAM_STR);
  $stmtTo->bindParam(':quarterCoursesTo', $quarterCoursesTo, PDO::PARAM_STR);

  $updateFrom = $stmtFrom->execute();
  $updateTo = $stmtTo->execute();

  if($updateFrom || $updateTo) {
    echo json_encode(array('status' => 'success'));
  }
  else {
    echo json_encode(array('status' => 'failed'));
  }
}
?>