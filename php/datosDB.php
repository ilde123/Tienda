<?php
	session_start();

	$host_db = "localhost";
	$user_db = "root";
	$pass_db = "";
	$db_name = "Tienda";

	$conexion = new mysqli($host_db, $user_db, $pass_db, $db_name);
	$conexion->set_charset('utf8');

	/* verificar conexión */
/*	if (mysqli_connect_errno()) {
		$msg = "Error de conexión: %s\n".mysqli_connect_error();
		$miArray = array("resultado"=>"fallo", "mensaje"=>$msg);
		echo json_encode($miArray);
		exit();
	}
*/
?>