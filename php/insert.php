<?php
	require 'datosDB.php';

	$sql = "INSERT INTO producto
	(codigo, descripcion, precio, iva, stock, stock_minimo, familia, proveedor) VALUES 
	(8420947601887, 'ZUMO AYALA MELOCOTÓN PACK 6', 1.15, 10, 0, 0, 'Bebidas', 1), (8420947601894, 'ZUMO AYALA PIÑA PACK 6', 1.15, 10, 0, 0, 'Bebidas', 1), (8420947601900, 'ZUMO AYALA MELOCOTÓN 2 LITROS', 1.25, 10, 0, 0, 'Bebidas', 1), (8420947601917, 'AYALA ZUMO PIÑA', 1.35, 10, 0, 0, 'Bebidas', 1), (8420947601924, 'ZUMO AYALA NARANJA 2 LITROS', 1.35, 10, 0, 0, 'Bebidas', 1), (8420947602006, 'DEPORTISTAS AYALA 1,5L', 0.70, 10, 0, 0, 'Bebidas', 1), (8420947602013, 'BEBIDAS PARA DEPORTISTAS AYALA', 0.75, 10, 0, 0, 'Bebidas', 1), (8420947602020, 'GASEOSA BLANCA AYALA 1,5L', 0.40, 10, 0, 0, 'Bebidas', 1), (5000277000906, 'DEWARS WHITE LABEL 70CL', 13.20, 21, 0, 0, 'Bebidas', 1), (5000299605707, 'BEEFEATER', 15.50, 21, 0, 0, 'Bebidas', 1), (5010677044004, 'BACARDI LLIMON 70CL', 13.90, 21, 0, 0, 'Bebidas', 1), (7461323129237, 'RON BARCELO', 13.70, 21, 0, 0, 'Bebidas', 1), (8004160660304, 'FRANGELLICO', 12.80, 21, 0, 0, 'Bebidas', 1), (8410013101014, 'ROLDEN CAVA BRUT', 2.60, 21, 0, 0, 'Bebidas', 1), (8410045101877, 'BALLANTINES + COCACOLA', 13.99, 21, 0, 0, 'Bebidas', 1), (8410261103037, 'PLATINO', 2.15, 21, 0, 0, 'Bebidas', 1), (8410261141206, 'RIOJA ANTAÑO', 2.70, 21, 0, 0, 'Bebidas', 1), (8410261152417, 'DON SIMON TINTO VERANO LIMON 0,0 1,5L', 1.10, 21, 0, 0, 'Bebidas', 1), (8410302102432, 'TINTO ELEGIDO', 1.70, 21, 0, 0, 'Bebidas', 1), (8410302102746, 'TINTO MONTEFIEL', 1.75, 21, 0, 0, 'Bebidas', 1), (8410337219082, 'ANIS DEL MONO 70CL', 7.85, 21, 0, 0, 'Bebidas', 1), (8410414000466, 'VODKA ERISTOFF', 8.50, 21, 0, 0, 'Bebidas', 1), (8410484200018, 'PONCHE 501', 6.80, 21, 0, 0, 'Bebidas', 1), (8410490001043, 'RON NEGRITA 70CL', 8.10, 21, 0, 0, 'Bebidas', 1), (8410643001234, 'MARIE BRIZARD 100CL', 8.40, 21, 0, 0, 'Bebidas', 1), (8410655006173, 'SAN MIGUELL O,O PAC-6', 2.60, 21, 0, 0, 'Bebidas', 1), (8410863000154, 'BRANDY  DECANO', 6.20, 21, 0, 0, 'Bebidas', 1), (8411090101331, 'CRUZCAMPO LATA', 0.50, 21, 0, 0, 'Bebidas', 1), (8411090106251, 'CRUZCAMPO PAC-6', 2.60, 21, 0, 0, 'Bebidas', 1), (8411090306255, 'CRUZCAMPO SIN  PAC-6', 2.60, 21, 0, 0, 'Bebidas', 1), (8411090310139, 'CRUZCAMPO SIN LATA 33CL', 0.50, 21, 0, 0, 'Bebidas', 1), (8411090406252, 'SHANDY CRUZCAMPO LILMON PAC-6', 2.80, 21, 0, 0, 'Bebidas', 1), (8411144100303, 'ANIS CASTELLANA DULCE 70CL', 8.50, 21, 0, 0, 'Bebidas', 1), (8411389500036, 'SABERY MORA', 1.50, 21, 0, 0, 'Bebidas', 1), (8420417193621, 'MARTINEZ DULCE AMOROSO', 2.50, 21, 0, 0, 'Bebidas', 1), (8420417193638, 'MARTINEZ Nº2', 1.70, 21, 0, 0, 'Bebidas', 1), (8422453000062, 'SIERRRAPINO', 1.30, 21, 0, 0, 'Bebidas', 1), (8428566000234, 'ANIS HORIZONTE DULCE 1L', 6.95, 21, 0, 0, 'Bebidas', 1), (8480012007242, 'BLUE CAMALEON', 0.50, 10, 0, 0, 'Bebidas', 1), (8411090010107, 'CERVEZA CRUZCAMPO 1L', 1.45, 21, 0, 0, 'Bebidas', 1)";

	$resultado = $conexion->query($sql);
	$respuesta = "";

	if ($resultado) {
		$respuesta = "ok";
	} else {
		$respuesta = $conexion->error;
	}
	

	echo $respuesta;

	$conexion->close();
?>