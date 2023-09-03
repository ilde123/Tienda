<?php
	require 'datosDB.php';

	$fechaInicio = trim($_GET['fechaInicio']);
	$fechaFin = trim($_GET['fechaFin']);
	$horaInicio = trim($_GET['horaInicio']);
	$horaFin = trim($_GET['horaFin']);

	// Sumar un día a la fecha de fin para que incluya la fecha de fin
	$fechaFin = date('Y-m-d', strtotime($fechaFin . ' + 1 day'));

	if ($horaInicio == '') {
		$horaInicio = '00:00:00';
	}

	if ($horaFin == '') {
		$horaFin = '23:59:59';
	}

	$fi = $fechaInicio.' '.$horaInicio;
	$ff = $fechaFin.' '.$horaFin;

	$cadenaFamilias = '';

	if (isset($_GET['familias'])) {
		$familias = $_GET['familias'];

		foreach ($familias as $key => $familia) {
			$cadenaFamilias .= "AND UPPER(producto.familia) != UPPER('".$familia."') ";
		}
	}

	$respuesta;

	$sql = "SELECT pedido.npedido, producto.codigo, producto.descripcion, lpedido.unidades, lpedido.precio, DATE_FORMAT(pedido.fecha, '%H:%i %d/%m/%Y') fecha, lpedido.nlinea, pedido.nombre_cliente
			FROM lpedido
			INNER JOIN producto ON lpedido.codigo = producto.codigo
			INNER JOIN pedido ON pedido.npedido = lpedido.npedido
			WHERE fecha BETWEEN ? AND ? AND DATE_FORMAT(pedido.fecha, '%H:%i') BETWEEN ? AND ? ".$cadenaFamilias."
			ORDER BY pedido.fecha DESC;";

	$datos = [];

	try {
		if ($stmt = $conexion->prepare($sql)) {
	
			$stmt->bind_param('ssss', $fechaInicio, $fechaFin, $horaInicio, $horaFin);
	
			// ejecuta sentencias prepradas
			$stmt->execute();
	
			$result = $stmt->get_result();
	
			/* obtener valores */
			while ($fila = $result->fetch_array(MYSQLI_ASSOC)) {
				$datos[$fila['npedido']][$fila['nlinea']] = $fila;
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
	} catch (Exception $e) {
		$respuesta = array("resultado"=>$e, "json"=>json_encode($datos));
	}

	echo json_encode($respuesta);

	$conexion->close();
?>