<?php
	require 'datosDB.php';

	$codigo = trim($_GET['codigo']);
	$descripcion = "";
	$cadenaPrecios = '';

	if (isset($_GET['precioMin']) && isset($_GET['precioMax'])) {
		$precioMin = $_GET['precioMin'];
		$precioMax = $_GET['precioMax'];

		$cadenaPrecios = 'AND producto.precio BETWEEN ? AND ?';
	}

	if (isset($_GET['descripcion'])) {
		$descripcion = trim($_GET['descripcion']);
	}

	$param = "";

	if ($codigo == '') {
		$sql = "SELECT * FROM producto
				INNER JOIN familia USING(familia)
				WHERE descripcion LIKE CONCAT('%',?,'%') ".$cadenaPrecios."
				ORDER BY descripcion;";

		$param = $descripcion;
	} else if ($descripcion == '') {
		$sql = "SELECT * FROM producto
				INNER JOIN familia USING(familia)
				WHERE producto.codigo = ? ".$cadenaPrecios."
				ORDER BY descripcion;";

		$param = $codigo;
	}

	$datos = [];

	if ($stmt = $conexion->prepare($sql)) {

		if ($cadenaPrecios == '') {
			$stmt->bind_param('s', $param);
		} else {
			$stmt->bind_param('sdd', $param, $precioMin, $precioMax);
		}

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