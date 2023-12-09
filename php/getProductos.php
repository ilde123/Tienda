<?php
	require 'datosDB.php';

	$n_filas = 0;
	$datos = [];

	if (isset($_GET['descripcion'])) {
		$descrcipcion = trim($_GET['descripcion']);

		$sqlDescripcion = "SELECT codigo, descripcion, url_imagen FROM producto WHERE UPPER(descripcion) LIKE CONCAT('%',?,'%') ORDER BY descripcion;";

		if ($stmt = $conexion->prepare($sqlDescripcion)) {
			$stmt->bind_param('s', $descrcipcion);
			// ejecuta sentencias prepradas
			$stmt->execute();

			$resultado = $stmt->get_result();

			while ($fila = $resultado->fetch_array()) {
				$datos[] = $fila;
			}
		}
	} else {
		
		$sql = "SELECT codigo, descripcion, url_imagen FROM producto ORDER BY descripcion;";
		$resultado = $conexion->query($sql);
		$n_filas = $resultado->num_rows;
		
		if ($n_filas > 0) {
			while ($fila = $resultado->fetch_assoc()) {
				$datos[] = $fila;
			}
		}
	}

	echo json_encode($datos);

	$conexion->close();
?>