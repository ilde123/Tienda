<?php
	require 'datosDB.php';

	$sql = "SELECT codigo, descripcion, url_imagen FROM producto ORDER BY descripcion;";
	$resultado = $conexion->query($sql);
	$n_filas = $resultado->num_rows;

	if ($n_filas > 0) {
		$datos = [];
	
		while ($fila = $resultado->fetch_assoc()) {
			$datos[] = $fila;
		}
	}

	echo json_encode($datos);

	$conexion->close();
?>