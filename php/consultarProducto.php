<?php
	require 'datosDB.php';

	$codigo = trim($_POST['codigo']);
	$descripcion = "";
	
	if (isset($_POST['descripcion'])) {
		$descripcion = trim($_POST['descripcion']);
	}

/*	$familia = trim($_POST['familia']);
	$precio = trim($_POST['precio']);
	$iva = trim($_POST['iva']);
	$stock = trim($_POST['stock']);
	$stockMin = trim($_POST['stockMin']);
	$proveedor = trim($_POST['proveedor']);
*/

	$param = "";

	if ($codigo == '') {
		$sql = "SELECT * FROM producto
				WHERE descripcion LIKE CONCAT('%',?,'%') ORDER BY codigo;";

		$param = $descripcion;
	} else if ($descripcion == '') {
		$sql = "SELECT * FROM producto
					WHERE codigo = ? ORDER BY codigo;";

		$param = $codigo;
	}

	$datos = [];

	if ($stmt = $conexion->prepare($sql)) {

		$stmt->bind_param('s', $param);

		// ejecuta sentencias prepradas
		$stmt->execute();

		/* ligar variables de resultado */
//		$stmt->bind_result($cod, $desc, $pre, $iva, $stock, $stockMin, $familia, $proveedor);

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