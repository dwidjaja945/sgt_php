<?php

require_once('./config/mysqlCredentials.php');

$output = [
    'success' => false,
    'data' => [],
    'errors' => []
];

$query = "
    SELECT students.first_name, students.last_name, grades.grade_value, classes.class_name
    FROM grades
    JOIN students
        ON students.id = grades.student_id
    JOIN classes
        ON classes.id = grades.class_id
    ORDER BY class_name";
// print($query);
$result = mysqli_query( $connection , $query );

// print_r($result);
if($result) {
    if(mysqli_num_rows($result) > 0) {
        $output['success'] = true;
        while( $row = mysqli_fetch_assoc($result) ) {
            $output['data'][] = $row;
        };
    } else {
        $output['errors'][] = 'no data';
    };
} else {
    $output['errors'][] = 'query error';
};

mysqli_close($connection);

$json_output = json_encode($output);

print $json_output;




?>