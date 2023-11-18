<?php
    header('Content-Type: application/json; charset=utf-8');
    include('./utils/connection.php') ;

    $get_categoryName = $_GET['name'] ?? null;
    $get_newCategoryName = $_GET['newName'] ?? null;
    $post_categoryName = $_POST['name'] ?? null;

    if ($_SERVER['REQUEST_METHOD'] === 'GET'){
        $categories = [];
        if (is_null($get_categoryName)){
            $categories = $conn -> query('SELECT * FROM category;') -> fetchAll(PDO::FETCH_ASSOC);
        }else{
            $stmt = $conn -> prepare("SELECT * FROM category WHERE category.name = :name");
            $stmt -> execute([
                ":name" => $get_categoryName
            ]);
            $categories = $stmt -> fetchAll(PDO::FETCH_ASSOC);
        }
        echo json_encode($categories);
    }
    else if ($_SERVER['REQUEST_METHOD'] === 'POST'){
        if (is_null($post_categoryName)){
            echo json_encode(false);
            return;
        };
        
        $stmt = $conn->prepare("INSERT INTO category(`name`) VALUES(:name);");
        try{
            $stmt->execute([
                ":name" => $post_categoryName
            ]);
            echo json_encode(["name" => $post_categoryName]);
        }catch (PDOException $e){
            echo json_encode(false);
        }
    
    }
    else if ($_SERVER['REQUEST_METHOD'] === 'DELETE'){
        if (is_null($get_categoryName)){
            echo json_encode(false);
            return;
        };
        
        $stmt = $conn->prepare("DELETE FROM category WHERE category.name = :name;");
        try{
            $stmt->execute([
                ":name" => $get_categoryName
            ]);
            echo json_encode(true);
        }catch(PDOException $e){
            echo json_encode(false);
        }
    
    }else if ($_SERVER['REQUEST_METHOD'] === 'PUT'){
        if (is_null($get_categoryName) or is_null($get_newCategoryName)){
            echo json_encode(false);
            return;
        }

        $stmt = $conn -> prepare("UPDATE category SET category.name = :newName WHERE category.name = :name;");
        try{
            $stmt -> execute([":newName" => $get_newCategoryName, ":name" => $get_categoryName]);
            echo json_encode(["name" => $get_newCategoryName]);
        }catch(PDOException $e){
            echo json_encode(false);
        }
    } 
?>