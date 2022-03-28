<?php
	require 'datosDB.php';

	$familia = $_POST['familia'];

	$resultado = "ok";
	$msg = "Familia eliminada con éxito.";

	foreach ($familia as $k => $v) {
		if ($stmt = $conexion->prepare("DELETE FROM familia WHERE familia = ?;")) {
	
			$stmt->bind_param('s', $v);

			// ejecuta sentencias prepradas
			$stmt->execute();

			// cierra sentencia y conexión
			$stmt->close();
		}
		else {
			$resultado = "fallo";
			$msg = "Fallo al eliminar familia.";
		}
	}

	$miArray = array("resultado"=>$resultado, "msg"=>$msg);
	echo json_encode($miArray);

	$conexion->close();
?>