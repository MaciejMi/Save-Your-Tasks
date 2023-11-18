<?php
    define ('USER', 'root');
    define ('PASSWORD', '');
    define ('HOST', 'localhost');
    define ('DATABASE', 'saveyourtasks_db');
    define ('PORT', "4306");
    define('SYSTEM', 'mysql');

    $conn = new PDO(SYSTEM . ":host=" . HOST . ':' . PORT . ";dbname=" . DATABASE, USER, PASSWORD);
?>