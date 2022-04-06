<?php
	require 'datosDB.php';

	$npedido = $_POST['npedido'];

	$resultado = "ok";
	$msg = "Pedido eliminado con éxito.";

	if ($stmt = $conexion->prepare("DELETE FROM pedido WHERE npedido = ?;")) {

		$stmt->bind_param('i', $npedido);

		// ejecuta sentencias prepradas
		#$stmt->execute();

		// cierra sentencia y conexión
		$stmt->close();
	}
	else {
		$resultado = "fallo";
		$msg = "Fallo al eliminar pedido.";
	}

	$miArray = array("resultado"=>$resultado, "msg"=>$msg);
	echo json_encode($miArray);

	$conexion->close();
?>