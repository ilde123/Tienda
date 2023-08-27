<?php
	require 'datosDB.php';

	$sql = "SELECT MAX(precio) precio FROM producto ORDER BY precio;";
	if ($resultado = $conexion->query($sql)) {
		$n_filas = $resultado->num_rows;

		if ($n_filas > 0) {
			$fila = $resultado->fetch_assoc();;
		
			echo $fila['precio'];
		}
	}

	$conexion->close();
?>