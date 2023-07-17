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

				echo  $ruta_fichero_final;
			}
			else {
				echo "Error al guardar ruta en la base de datos";
			}
		} else {
			echo "Error al mover fichero";
		}
	} else {
		echo "Formato de fichero no válido";
	}

	$conexion->close();
?>