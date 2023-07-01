<?php
	require 'datosDB.php';

	$npedido = $_POST['npedido'];
	$nlinea = $_POST['nlinea'];

	$conexion->autocommit(false);
	$resultado = "";
	$msg = "";

	try {
		$resultadoLPedido = $conexion->prepare("DELETE FROM lpedido WHERE npedido = ? AND nlinea = ?;");
		$resultadoLPedido->bind_param('ii', $npedido, $nlinea);

		// ejecuta sentencias prepradas
		$resultadoLPedido->execute();

		if ($resultadoLPedido) {
			if ($result = $conexion->query("DELETE FROM pedido WHERE npedido NOT IN (SELECT npedido FROM lpedido)")) {

				if ($conexion->commit()) {
					$resultado = "ok";
					$msg = "Linea de pedido eliminado con éxito.";
				}
			}
		}

		// cierra sentencia y conexión
		$resultadoLPedido->close();

		// DELETE FROM pedido WHERE npedido NOT IN (SELECT npedido FROM lpedido)
	} catch (Exception $e) {
		$resultado = "fallo";
		$msg = "Fallo al eliminar pedido.\n".$e;
		$conexion->rollback();
	}

	$miArray = array("resultado"=>$resultado, "msg"=>$msg);
	echo json_encode($miArray);

	$conexion->close();
?>