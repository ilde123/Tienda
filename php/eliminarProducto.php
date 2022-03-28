<?php
	require 'datosDB.php';

	$codigo = trim($_POST['codigo']);

	if ($stmt = $conexion->prepare("DELETE FROM producto
									WHERE codigo = ?;")) {

		$stmt->bind_param('i', $codigo);

		// ejecuta sentencias prepradas
		$stmt->execute();

		// cierra sentencia y conexión
		$stmt->close();

		$resultado = "ok";
		$msg = "Producto eliminado con éxito.";
	}
	else {
		$resultado = "fallo";
		$msg = "Fallo al eliminar producto.";
	}

	$respuesta = array("resultado"=>$resultado, "msg"=>$msg);
	echo json_encode($respuesta);

	$conexion->close();
?>