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

	$sql = "SELECT SUM(lpedido.unidades * lpedido.precio) total, DATE_FORMAT(pedido.fecha, '%d %m %Y') fecha FROM pedido
			INNER JOIN lpedido USING(npedido)
			INNER JOIN producto USING(codigo)
			WHERE fecha BETWEEN '2021-7-1' AND '2021-8-17' AND UPPER(producto.familia) != 'TABACO'
			GROUP BY DATE_FORMAT(pedido.fecha, '%d %m %Y')
			ORDER BY pedido.fecha, producto.descripcion;";

	$sql = "SELECT producto.codigo, producto.descripcion, lpedido.precio, lpedido.unidades, pedido.fecha, pedido.npedido, lpedido.nlinea, lpedido.unidades * lpedido.precio total FROM pedido
			INNER JOIN lpedido USING(npedido)
			INNER JOIN producto USING(codigo)
			WHERE fecha BETWEEN ? AND ? AND UPPER(producto.familia) != 'TABACO'
			ORDER BY pedido.fecha, producto.descripcion;";

	$sql = "SELECT pedido.npedido, producto.descripcion, lpedido.unidades, lpedido.precio, pedido.fecha, lpedido.nlinea
			FROM lpedido
			INNER JOIN producto ON lpedido.codigo = producto.codigo
			INNER JOIN pedido ON pedido.npedido = lpedido.npedido
			WHERE fecha BETWEEN ? AND ? AND UPPER(producto.familia) != 'TABACO'
			ORDER BY pedido.fecha DESC;";

	$datos = [];
	$datosPrueba = [];

	try {
		if ($stmt = $conexion->prepare($sql)) {
	
			$stmt->bind_param('ss', $fi, $ff);
	
			// ejecuta sentencias prepradas
			$stmt->execute();
	
			$result = $stmt->get_result();
	
			/* obtener valores */
			while ($fila = $result->fetch_array(MYSQLI_ASSOC)) {
//				$datos[] = $fila;
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