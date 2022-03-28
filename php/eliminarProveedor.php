<?php
	require 'datosDB.php';

	$proveedores = $_POST['proveedores'];

	$resultado = "ok";
	$msg = "Proveedor eliminado con éxito.";

	foreach ($proveedores as $k => $v) {
		if ($stmt = $conexion->prepare("DELETE FROM proveedor WHERE descripcion = ?;")) {

			$stmt->bind_param('i', $v);

			// ejecuta sentencias prepradas
			$stmt->execute();

			// cierra sentencia y conexión
			$stmt->close();
		}
		else {
			$resultado = "fallo";
			$msg = "Fallo al eliminar proveedor.";
		}
	}

	$respuesta = array("resultado"=>$resultado, "msg"=>$msg);
	echo json_encode($respuesta);

	$conexion->close();
?>