<?php
	require 'datosDB.php';

	$codigo = trim($_POST['codigo']);
	$precio = trim($_POST['precio']);

	if ($stmt = $conexion->prepare("UPDATE producto SET precio = ? WHERE codigo = ?")) {

		$stmt->bind_param('di', $precio, $codigo);

		// ejecuta sentencias prepradas
		$stmt->execute();

		$n_filas = $stmt->affected_rows;

		if ($n_filas > 0) {
			if ($stmt = $conexion->prepare("INSERT INTO historial_producto(codigo, precio) VALUES (?, ?)")) {
				
				$stmt->bind_param('sd', $codigo, $precio);
				
				// ejecuta sentencias prepradas
				$stmt->execute();
				
				// cierra sentencia y conexión
				$stmt->close();
				
				$resultado = "ok";
				$msg = "Precio actualizado.";
			}
		}
	}
	else {
		$resultado = "fallo";
		$msg = "No se pudo actualizar el precio.";
	}

	$miArray = array("resultado"=>$resultado, "msg"=>$msg);
	echo json_encode($miArray);

	$conexion->close();
?>