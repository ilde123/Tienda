<?php
	require 'datosDB.php';

	$familia = trim($_POST['familia']);

	if ($stmt = $conexion->prepare("INSERT INTO familia(familia) VALUES (?);")) {

		$stmt->bind_param('s', $familia);

		// ejecuta sentencias prepradas
		$stmt->execute();

		// cierra sentencia y conexión
		$stmt->close();

		$resultado = "ok";
		$msg = "Operación realizada con éxito.";
	}
	else {
		$resultado = "fallo";
		$msg = "No se pudo realizar la operación.";
	}

	$miArray = array("resultado"=>$resultado, "msg"=>$msg);
	echo json_encode($miArray);

	$conexion->close();
?>