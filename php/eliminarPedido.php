<?php
	require 'datosDB.php';

	$npedido = $_POST['npedido'];

	$conexion->autocommit(false);
	$resultado = "";
	$msg = "";

	try {
		$resultadoPedido = $conexion->prepare("DELETE FROM pedido WHERE npedido = ?;");
		$resultadoPedido->bind_param('i', $npedido);

		// ejecuta sentencias prepradas
		$resultadoPedido->execute();

		if ($resultadoPedido) {
			$stmt = $conexion->prepare("DELETE FROM lpedido WHERE npedido = ?;");
			$stmt->bind_param('i', $npedido);

			$stmt->execute();

			$stmt->close();
			// cierra sentencia y conexión
			if ($conexion->commit()) {
				$resultado = "ok";
				$msg = "Pedido eliminado con éxito.";
			}
		}

	} catch (Exception $e) {
		$resultado = "fallo";
		$msg = "Fallo al eliminar pedido.\n".$e;
		$conexion->rollback();
	}

	$miArray = array("resultado"=>$resultado, "msg"=>$msg);
	echo json_encode($miArray);

	$conexion->close();
?>