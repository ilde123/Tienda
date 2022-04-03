<?php
	require 'datosDB.php';

	$fechaInicio = trim($_POST['fechaInicio']);
	$fechaFin = trim($_POST['fechaFin']);
	$horaInicio = trim($_POST['horaInicio']);
	$horaFin = trim($_POST['horaFin']);

	if ($horaInicio == '') {
		$horaInicio = '00:00:00';
	}

	if ($horaFin == '') {
		$horaFin = '23:59:59';
	}

	$fi = $fechaInicio.' '.$horaInicio;
	$ff = $fechaFin.' '.$horaFin;
	$respuesta;

	$sql = "SELECT pedido.npedido, producto.descripcion, lpedido.unidades, lpedido.precio, DATE_FORMAT(pedido.fecha, '%H:%i %d/%m/%Y') fecha, lpedido.nlinea
			FROM lpedido
			INNER JOIN producto ON lpedido.codigo = producto.codigo
			INNER JOIN pedido ON pedido.npedido = lpedido.npedido
			WHERE fecha BETWEEN ? AND ? AND DATE_FORMAT(pedido.fecha, '%H:%i') BETWEEN ? AND ? AND UPPER(producto.familia) != 'TABACO'
			ORDER BY pedido.fecha DESC;";

	$datos = [];
	$datosPrueba = [];

	try {
		if ($stmt = $conexion->prepare($sql)) {
	
			$stmt->bind_param('ssss', $fechaInicio, $fechaFin, $horaInicio, $horaFin);
	
			// ejecuta sentencias prepradas
			$stmt->execute();
	
			$result = $stmt->get_result();
	
			/* obtener valores */
			while ($fila = $result->fetch_array(MYSQLI_ASSOC)) {
				$datos[$fila['npedido']][$fila['nlinea']] = $fila;
//				$datos[$fila['npedido']]['fecha'] = $fila['fecha'];
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