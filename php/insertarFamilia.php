<?php
	require 'datosDB.php';

	$familia = trim($_POST['familia']);

	if ($stmt = $conexion->prepare("INSERT INTO familia(familia) VALUES (?);")) {
		$resultado = "ok";

		try {
			$stmt->bind_param('s', $familia);
			$stmt->execute();
			$stmt->close();
			
			$resultado = "ok";
			$msg = "Familia insertada.";
		}
		catch (mysqli_sql_exception $e) {
			if ($e->getCode() == 1062) {
				$resultado = "fallo";
				$msg = "Familia duplicada.";
			}
		}
		catch (Exception $e) {
			$resultado = "fallo";
			$msg = "No se pudo insertar la familia.";
		}

	}
	else {
		$resultado = "fallo";
		$msg = "No se pudo realizar la operación.";
	}

	$miArray = array("resultado"=>$resultado, "msg"=>$msg);
	echo json_encode($miArray);

	$conexion->close();
?>