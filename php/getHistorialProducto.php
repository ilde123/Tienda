<?php
	require 'datosDB.php';

	$codigo = $_REQUEST['codigo'];

	$sql = "SELECT producto.codigo, producto.descripcion,  DATE_FORMAT(historial_producto.fecha, '%d/%m/%Y') fecha, historial_producto.precio FROM producto
			INNER JOIN historial_producto ON historial_producto.codigo = producto.codigo
			WHERE producto.codigo = ? ORDER BY descripcion;";

	$datos = [];

	if ($stmt = $conexion->prepare($sql)) {
	
		$stmt->bind_param('s', $codigo);

		// ejecuta sentencias prepradas
		$stmt->execute();

		$result = $stmt->get_result();

		/* obtener valores */
		while ($fila = $result->fetch_array(MYSQLI_ASSOC)) {
			$datos[] = $fila;
		}

		// cierra sentencia y conexión
		$stmt->close();
	}

	echo json_encode($datos);

	$conexion->close();
?>