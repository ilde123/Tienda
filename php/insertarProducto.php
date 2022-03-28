<?php
	require 'datosDB.php';

	$codigo = trim($_POST['codigo']);
	$descripcion = trim($_POST['descripcion']);
	$precio = trim($_POST['precio']);
	$iva = trim($_POST['iva']);
	$stock = trim($_POST['stock']);
	$stockMin = trim($_POST['stockMin']);
	$familia = trim($_POST['familia']);
	$proveedor = trim($_POST['proveedor']);

	if ($stmt = $conexion->prepare("INSERT INTO producto(codigo, descripcion, precio, iva, stock, stock_minimo, familia, proveedor) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
									ON DUPLICATE KEY UPDATE codigo = VALUES(codigo), descripcion = VALUES(descripcion), precio = VALUES(precio), iva = VALUES(iva), stock = VALUES(stock), stock_minimo = VALUES(stock_minimo), familia = VALUES(familia), proveedor = VALUES(proveedor);")) {

		$stmt->bind_param('ssdiiiss', $codigo, $descripcion, $precio, $iva, $stock, $stockMin, $familia, $proveedor);

		// ejecuta sentencias prepradas
		$stmt->execute();

//		printf("%d Fila insertada.\n", $stmt->affected_rows);

		// cierra sentencia y conexión
		$stmt->close();

		$resultado = "ok";
		$msg = "Operación realizada con éxito.";
/*
		$datos = array(
			'codigo'=>$codigo,
			'descripcion'=>$descripcion,
			'precio'=>$precio,
			'iva'=>$iva,
			'stock'=>$stock,
			'stock_minimo'=>$stockMin,
			'familia'=>$familia,
			'proveedor'=>$proveedor
		);

		$json = json_encode($datos);*/
	}
	else {
		$resultado = "fallo";
		$msg = "No se pudo realizar la operación el producto.";
	}

	$miArray = array("resultado"=>$resultado, "msg"=>$msg);
	echo json_encode($miArray);

	$conexion->close();
?>