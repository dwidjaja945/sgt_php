<?php

require_once('../config/mysqlCredentials.php');

$output= [
    'success' => false,
    'data' => [],
    'errors' => []
];

$student_id = $_POST['student_id'];

$query = "
    DELETE FROM grades
    WHERE id = ?";

$inserts = [$student_id];

$statement = $connection->prepare($query);
$statement->bind_param("i" , ...$inserts);
$result = $statement->execute();

if($result > 0) {
    $output['success'] = true;
    $output['message'] = "Student Deleted";
} else {
    $output['errors'] = "Could not delete student";
};

mysqli_close($connection);

$json_output = json_encode($output);

print $json_output;


?>