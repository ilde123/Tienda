<?php
	require 'datosDB.php';

	$codigo = $_POST['codigo'];
	$unidades = $_POST['unidades'];
	$precio = $_POST['precio'];

	$conexion->autocommit(false);
	$resultado = "";
	$msg = "";

	try {
		$resultado = $conexion->query("INSERT INTO pedido(npedido, fecha) VALUES (DEFAULT, DEFAULT);");

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
				$msg = "Pedido insertado    ";
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