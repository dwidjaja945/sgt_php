<?php

require_once('../config/mysqlCredentials.php');

$output = [
    'success' => false,
    'data' => [],
    'errors' => []
];

$query = "
    SELECT id, student_name, grade_value, class_name
    FROM grades
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