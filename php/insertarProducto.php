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

		$resultado = "ok";

		try {
			$stmt->bind_param('ssdiiiss', $codigo, $descripcion, $precio, $iva, $stock, $stockMin, $familia, $proveedor);
			$stmt->execute();
			$stmt->close();
			$msg = "Operación realizada con éxito.";
		}
		catch (mysqli_sql_exception $e) {
			if ($e->getCode() == 1062) {
				$resultado = "fallo";
				$msg = "Código de producto duplicado.";
			}
		}

	}
	else {
		$resultado = "fallo";
		$msg = "No se pudo realizar la operación el producto.";
	}

	$miArray = array("resultado"=>$resultado, "msg"=>$msg);
	echo json_encode($miArray);

	$conexion->close();
?>