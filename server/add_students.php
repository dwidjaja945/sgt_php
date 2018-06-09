<?php

require_once('../config/mysqlCredentials.php');

$output = [
    'success' => false,
    'data' => [],
    'errors' => []
];

$data = json_decode(file_get_contents('php://input'), true);

$student_name = $_POST['student_name'];
$class_name = $_POST['class_name'];
$grade_value = $_POST['grade_value'];
// foreach($_POST as $key=>$value){
//     $_POST[$key] = addslashes($value);
// }
//GET request
/*
GET someaddress/somepage.php?name=dan&age=43&valWithSpaces=hi%20there
data-encoding: json, xml
user-agent: osx mozilla 65.11

*/
//POST request with www-url-encoding
/*
POST someaddress/somepage.php
data-encoding: json, xml
user-agent: osx mozilla 65.11

name=dan&age=43&valWithSpaces=hi%20there
*/
//POST request with ajax encoding
/*
POST someaddress/somepage.php
data-encoding: json, xml
user-agent: osx mozilla 65.11

{"name":"Dan","age":43}
*/

$query = "
    INSERT INTO grades
    (student_name, class_name, grade_value)
    VALUES (?, ?, ?)";

$params = [$student_name, $class_name, $grade_value];

$statement = $connection->prepare($query);
$statement->bind_param("sss" , ...$params);
$result = $statement->execute();
$insert_id = $statement->insert_id;

if($result > 0) {
    $output['success'] = true;
    $output['data'] = $result;
    $output['new_id'] = $insert_id;
} else {
    $output['errors'][] = "error with query - Could not add student";
}

mysqli_close($connection);

$json_output = json_encode($output);

print $json_output;
?>

