<?php
	require 'datosDB.php';

	$descripcion = trim($_POST['descripcion']);
	$direccion = trim($_POST['direccion']);
	$telefono = trim($_POST['telefono']);

	if ($stmt = $conexion->prepare("INSERT INTO proveedor(descripcion, direccion, telefono) VALUES (?, ?, ?);")) {

		$stmt->bind_param('ssi', $descripcion, $direccion, $telefono);

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