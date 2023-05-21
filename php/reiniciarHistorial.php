<?php
	require 'datosDB.php';

	$sql = "SELECT codigo, precio FROM producto ORDER BY descripcion;";
	$resultado = $conexion->query($sql);
	$n_filas = $resultado->num_rows;

	if ($n_filas > 0) {
	
		while ($fila = $resultado->fetch_assoc()) {
			$codigo = $fila['codigo'];
			$precio = $fila['precio'];

			if ($stmt = $conexion->prepare("INSERT INTO historial_producto(codigo, precio) VALUES (?, ?)")) {

				$stmt->bind_param('sd', $codigo, $precio);
		
				// ejecuta sentencias prepradas
				$stmt->execute();
		
				// cierra sentencia y conexión
				$stmt->close();
		
				$msg = "Precio actualizado.";
			}
		}
	}

	$conexion->close();
?>