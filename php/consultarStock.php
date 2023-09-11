<?php
	require 'datosDB.php';

	if ($resultado = $conexion->query("SELECT * FROM producto WHERE stock >= stock_minimo ORDER BY descripcion")) {

		$datos = [];
	
		while ($fila = $resultado->fetch_assoc()) {
			$datos[] = $fila;
		}

		$respuesta = "ok";
		$msg = "Operación realizada con éxito.";
	}
	else {
		$respuesta = "fallo";
		$msg = "Error al realizar la operación.";
	}

	$miArray = array("resultado"=>$respuesta, "msg"=>$msg, "json"=>json_encode($datos));
	echo json_encode($miArray);

	$conexion->close();
?>