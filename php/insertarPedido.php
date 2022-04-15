<?php
	require 'datosDB.php';

	$codigo = $_POST['codigo'];
	$unidades = $_POST['unidades'];
	$precio = $_POST['precio'];
	$nombre = "";

	if (isset($_POST['nombre']) && $_POST['nombre'] != "") {
		$nombre = $_POST['nombre'];
	} else {
		$nombre = null;
	}

	$conexion->autocommit(false);
	$resultado = "";
	$msg = "";

	try {
		$resultado = $conexion->prepare("INSERT INTO pedido(npedido, fecha, nombre_cliente) VALUES (DEFAULT, DEFAULT, ?);"); // Se prepara la consulta

		$resultado->bind_param("s", $nombre); // Se vinculan los parámetros

		$resultado->execute(); // Se ejecuta la consulta

		if ($resultado) {
			$sql = "SELECT last_insert_id();";

			$resulset = $conexion->query($sql);
			$fila = $resulset->fetch_array();
			$nPedido = $fila[0];

			foreach ($codigo as $k => $v) {
				$sql = "INSERT INTO lpedido(npedido, nlinea, codigo, unidades, precio) VALUES ($nPedido, DEFAULT, ?, ?, ?)";

				$stmt = $conexion->prepare($sql);
				$stmt->bind_param('sid', $codigo[$k], $unidades[$k], $precio[$k]);

				// ejecuta sentencias prepradas
				$stmt->execute();

				// ACTUALIZAR STOCK
				$sql = "UPDATE producto SET stock = 
							(SELECT stock FROM producto WHERE codigo = ?) - ?
						WHERE codigo = ?";
				$stmt = $conexion->prepare($sql);
				$stmt->bind_param('sis', $codigo[$k], $unidades[$k], $codigo[$k]);

				// ejecuta sentencias prepradas
				$stmt->execute();
			}

			$stmt->close();
			if ($conexion->commit()) {
				$resultado = "ok";
				$msg = "Pedido insertado correctamente.";
			}
		}
	} catch (Exception $e) {
		$resultado = "fallo";
		$msg = "Fallo al insertar pedido.\n".$e;
		$conexion->rollback();
	}

	$miArray = array("resultado"=>$resultado, "msg"=>$msg);
	echo json_encode($miArray);

	$conexion->close();
?>