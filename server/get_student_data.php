<?php

require_once('../config/mysqlCredentials.php');

$output = [
    'success' => false,
    'data' => [],
    'errors' => []
];

$order_by = 'NULL';

if(isset($_POST['order_by'])) {
    $order_by = $_POST['order_by'];
};

$query = sprintf("
    SELECT id, student_name, grade_value, class_name
    FROM grades
    ORDER BY %s", $order);


// $inserts = [$order_by];
// print_r($order_by);
$statement = $connection->prepare($query);
// 
$statement->execute();
$result = $statement->get_result();
// $result = mysqli_query( $connection , $query );

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

// print $json_output;
?>