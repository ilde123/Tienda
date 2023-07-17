<?php
	require 'datosDB.php';

	if (($_FILES["img"]["type"] == "image/pjpeg") || ($_FILES["img"]["type"] == "image/png") || ($_FILES["img"]["type"] == "image/jpeg") || ($_FILES["img"]["type"] == "image/gif")) {
		$ruta_absoluta = "img/productos/";
		$ruta_relativa = "../img/productos/";
		$nombre_fichero = $_FILES['img']['name'];

		if (move_uploaded_file($_FILES["img"]["tmp_name"], $ruta_relativa.date('U').$nombre_fichero)) {
			$ruta_fichero_final = $ruta_absoluta.date('U').$nombre_fichero;
			$codigo = $_POST['codigo'];

			if ($stmt = $conexion->prepare("UPDATE producto SET url_imagen = ? WHERE codigo = ?;")) {

				$stmt->bind_param('ss', $ruta_fichero_final, $codigo);

				// ejecuta sentencias prepradas
				$stmt->execute();

				// cierra sentencia y conexión
				$stmt->close();

				$resultado = "ok";
				$msg = $ruta_fichero_final;
			} else {
//				$resultado = $conexion->errno;
				$resultado = 0;
				$msg = "(".$conexion->errno.") ".$conexion->error;
			}
		} else {
			$resultado = 1;
			$msg = "(".$conexion->errno.") ".$conexion->error;
		}
	} else {
		$resultado = 2;
		$msg = "(".$conexion->errno.") ".$conexion->error;
	}

	$respuesta = array("resultado"=>$resultado, "msg"=>$msg);
	echo json_encode($respuesta);

	$conexion->close();
?>