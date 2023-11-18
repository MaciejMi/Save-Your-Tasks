<?php
    header('Content-Type: application/json; charset=utf-8');
    include('./utils/connection.php');
    
    $get_id = $_GET['id'] ?? null;
    $get_text = $_GET['text'] ?? null;
    $get_status = $_GET['status'] ?? null;
    $get_date = $_GET['date'] ?? null;
    $get_category = $_GET['category'] ?? null; 

    $post_text = $_POST['text'] ?? null;
    $post_status = $_POST['status'] ?? null;
    $post_date = $_POST['date'] ?? null;
    $post_category = $_POST['category'] ?? null;
    

    if ($_SERVER['REQUEST_METHOD'] === 'GET'){
        $todos = []; 
        if (is_null($get_id) AND is_null($get_text) AND is_null($get_status) AND is_null($get_date) AND is_null($get_category)) {
            $todos = $conn->query("SELECT * FROM todo;")->fetchAll(PDO::FETCH_ASSOC);
        }else{
            $query = "SELECT * FROM todo WHERE ";
            $isChanged = false;
            $values = [];
            if (!is_null($get_id)){
                $query .= "todo.id = :id";
                $isChanged = true;
                $values[':id'] = $get_id;
            }
            if (!is_null($get_text)){
                $query .= $isChanged ? ", todo.text = :text" : "todo.text = :text";
                $isChanged = true;
                $values[':text'] = $get_text;
            }
            if (!is_null($get_status)){
                $query .= $isChanged ? ", todo.status = :status" : "todo.status = :status";
                $isChanged = true;
                $values[':status'] = $get_status;
            }
            if (!is_null($get_date)){
                $query .= $isChanged ? ", todo.date = :date" : "todo.date = :date";
                $isChanged = true;
                $values[':date'] = $get_date;
            }
            if (!is_null($get_category)){
                $query .= $isChanged ? ", todo.category_id = :category_id" : "todo.category_id = :category_id";
                $isChanged = true;
                $values[':category_id'] = $get_category;
            }
            $query .= ";";
            $stmt = $conn->prepare($query);
            $stmt->execute(
                $values
            );
            $todos = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
        echo json_encode($todos);
        return;
    }elseif ($_SERVER['REQUEST_METHOD'] === 'POST'){
        if (is_null($post_status)){
            $post_status = "not yet";
        }
        
        if (is_null($post_text) or is_null($post_status) or is_null($post_date) or is_null($post_category)) {
            echo json_encode(false);
            return;
        }
        $stmt = $conn->prepare("INSERT INTO todo(`text`, `status`, `date`, `category_id`) VALUES(:text, :status, :date, :category_id);");
        try{
            $stmt->execute([
                ':text' => $post_text,
                ':status' => $post_status,
                ':date' => $post_date,
                ':category_id' => $post_category
            ]);
            echo json_encode(["id" => $conn->lastInsertId()]);
        }catch (PDOException $e){
            echo json_encode(false);
        }
    
    }else if ($_SERVER['REQUEST_METHOD'] == "DELETE"){
        if (is_null($get_id) AND is_null($get_text) AND is_null($get_status) AND is_null($get_date) AND is_null($get_category)) {
            echo json_encode(false);
            return;
        }else{
            $query = "DELETE FROM todo WHERE ";
            $isChanged = false;
            $values = [];
            
            if (!is_null($get_id)){
                $query .= "todo.id = :id";
                $isChanged = true;
                $values[':id'] = $get_id;
            }
            if (!is_null($get_text)){
                $query .= $isChanged ? ", todo.text = :text" : "todo.text = :text";
                $isChanged = true;
                $values[':text'] = $get_text;
            }
            if (!is_null($get_status)){
                $query .= $isChanged ? ", todo.status = :status" : "todo.status = :status";
                $isChanged = true;
                $values[':status'] = $get_status;
            }
            if (!is_null($get_date)){
                $query .= $isChanged ? ", todo.date = :date" : "todo.date = :date";
                $isChanged = true;
                $values[':date'] = $get_date;
            }
            if (!is_null($get_category)){
                $query .= $isChanged ? ", todo.category_id = :category_id" : "todo.category_id = :category_id";
                $isChanged = true;
                $values[':category_id'] = $get_category;
            }
            $stmt = $conn -> prepare($query);
            try{
                $stmt -> execute($values);
                echo json_encode(true);
            }catch (PDOException $e){
                echo json_encode(false);
            }
        }
    }else if ($_SERVER['REQUEST_METHOD'] === "PUT"){
        $query = "UPDATE todo SET ";
        $isChanged = false;
        $values = [];
        
        if (is_null($get_id)){
            echo json_encode(false);
            return;
        }
        
        if (!is_null($get_text)){
            $query .= $isChanged ? ", todo.text = :text" : "todo.text = :text";
            $isChanged = true;
            $values[':text'] = $get_text;
        }
        if (!is_null($get_status)){
            $query .= $isChanged ? ", todo.status = :status" : "todo.status = :status";
            $isChanged = true;
            $values[':status'] = $get_status;
        }
        if (!is_null($get_date)){
            $query .= $isChanged ? ", todo.date = :date" : "todo.date = :date";
            $isChanged = true;
            $values[':date'] = $get_date;
        }
        if (!is_null($get_category)){
            $query .= $isChanged ? ", todo.category_id = :category_id" : "todo.category_id = :category_id";
            $isChanged = true;
            $values[':category_id'] = $get_category;
        }
        $query .= " WHERE todo.id = :id;";
        $values[":id"] = $get_id;
        $stmt = $conn -> prepare($query);
        try{
            $stmt -> execute($values);
            echo json_encode(["id" => $get_id]);
        }catch (PDOException $e){
            echo json_encode(false);
        }
    }

?>