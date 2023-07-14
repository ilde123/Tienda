<?php
	require 'datosDB.php';

	$codigo = trim($_POST['codigo']);
	$descripcion = "";
	
	if (isset($_POST['descripcion'])) {
		$descripcion = trim($_POST['descripcion']);
	}

	$param = "";

	if ($codigo == '') {
		$sql = "SELECT * FROM producto
				INNER JOIN familia USING(familia)
				WHERE descripcion LIKE CONCAT('%',?,'%') ORDER BY descripcion;";

		$param = $descripcion;
	} else if ($descripcion == '') {
		$sql = "SELECT * FROM producto
				INNER JOIN familia USING(familia)
				WHERE producto.codigo = ? ORDER BY descripcion;";

		$param = $codigo;
	}

	$datos = [];

	if ($stmt = $conexion->prepare($sql)) {

		$stmt->bind_param('s', $param);

		// ejecuta sentencias prepradas
		$stmt->execute();

		$result = $stmt->get_result();

		/* obtener valores */
		while ($fila = $result->fetch_array(MYSQLI_ASSOC)) {
			$datos[] = $fila;
		}

		// cierra sentencia y conexión
		$stmt->close();

		$resultado = "ok";
		$msg = "Consulta realizada con éxito.";
	}
	else {
		$resultado = "fallo";
		$msg = "Fallo al realizar la consulta.";
	}

	$respuesta = array("resultado"=>$resultado, "json"=>json_encode($datos));
	echo json_encode($respuesta);

	$conexion->close();
?>