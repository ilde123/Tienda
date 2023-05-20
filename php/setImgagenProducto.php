<?php
	require 'datosDB.php';

	if (($_FILES["img"]["type"] == "image/pjpeg") || ($_FILES["img"]["type"] == "image/png") || ($_FILES["img"]["type"] == "image/jpeg") || ($_FILES["img"]["type"] == "image/gif")) {
		$ruta_absoluta = "img/productos/";
		$ruta_relativa = "../img/productos/";
		$nombre_fichero = $_FILES['img']['name'];
		
		if (move_uploaded_file($_FILES["img"]["tmp_name"], $ruta_relativa.date('U').$nombre_fichero)) {
			$ruta_fichero_final = $ruta_absoluta.date('U').$nombre_fichero;

			if ($stmt = $conexion->prepare("UPDATE producto SET url_imagen = ?;")) {

				$stmt->bind_param('s', $ruta_fichero_final);

				// ejecuta sentencias prepradas
				$stmt->execute();

				// cierra sentencia y conexión
				$stmt->close();

				echo  $ruta_fichero_final;
			}
			else {
				echo 0;
			}
		} else {
			echo 0;
		}
	} else {
		echo 1;
	}

	$conexion->close();
?>