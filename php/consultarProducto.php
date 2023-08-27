<?php
	require 'datosDB.php';

	$codigo = trim($_GET['codigo']);
	$descripcion = "";
	$precioMin = $_GET['precioMin'];
	$precioMax = $_GET['precioMax'];

	if (isset($_GET['descripcion'])) {
		$descripcion = trim($_GET['descripcion']);
	}

	$param = "";

	if ($codigo == '') {
		$sql = "SELECT * FROM producto
				INNER JOIN familia USING(familia)
				WHERE descripcion LIKE CONCAT('%',?,'%') AND producto.precio BETWEEN ? AND ?
				ORDER BY descripcion;";

		$param = $descripcion;
	} else if ($descripcion == '') {
		$sql = "SELECT * FROM producto
				INNER JOIN familia USING(familia)
				WHERE producto.codigo = ? AND producto.precio BETWEEN ? AND ?
				ORDER BY descripcion;";

		$param = $codigo;
	}

	$datos = [];

	if ($stmt = $conexion->prepare($sql)) {

		$stmt->bind_param('sdd', $param, $precioMin, $precioMax);

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