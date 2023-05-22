<?php
	require 'datosDB.php';

	echo '--'.date('j/n/Y G:i:s')."\r\n";
	$sentenciaBackup = "DELETE FROM familia;\r\nDELETE FROM lpedido;\r\nDELETE FROM pedido;\r\nDELETE FROM producto;\r\nDELETE FROM proveedor;\r\n";

	define("RUTA", "../backup/");

	// TABLA FAMILIA
	$sql = "SELECT familia FROM familia ORDER BY familia;";
	$resultado = $conexion->query($sql);
	$n_filas = $resultado->num_rows;

	if ($n_filas > 0) {		
		$sentenciaBackup .= "INSERT INTO familia(familia) VALUES \r\n";

		while ($fila = $resultado->fetch_assoc()) {
			$sentenciaBackup .= '("'.$fila['familia'].'")'.",\r\n";
//			$sentenciaBackup .= "ON DUPLICATE KEY UPDATE familia = familia;";
		}

		$sentenciaBackup = substr($sentenciaBackup, 0, -3); // Eleiminar últimos caracteres
		$sentenciaBackup .= ";\r\n"; // Añadir ; al final
	}

	// TABLA LPEDIDO
	$sql = "SELECT npedido, nlinea, codigo, unidades, precio FROM lpedido";
	$resultado = $conexion->query($sql);
	$n_filas = $resultado->num_rows;

	if ($n_filas > 0) {		
		$sentenciaBackup .= "INSERT INTO lpedido (npedido, nlinea, codigo, unidades, precio) VALUES \r\n";
		
		while ($fila = $resultado->fetch_assoc()) {
			$sentenciaBackup .= "(".$fila['npedido'].", ".$fila['nlinea'].", '".$fila['codigo']."', ".$fila['unidades'].", ".$fila['precio']."),\r\n";
//			$sentenciaBackup .= "ON DUPLICATE KEY UPDATE npedido = npedido, nlinea = nlinea, codigo = codigo, unidades = unidades, precio = precio;";
		}
		
		$sentenciaBackup = substr($sentenciaBackup, 0, -3); // Eleiminar último carácter
		$sentenciaBackup .= ";\r\n"; // Añadir ; al final
	}

	// TABLA PEDIDO
	$sql = "SELECT npedido, fecha, nombre_cliente FROM pedido";
	$resultado = $conexion->query($sql);
	$n_filas = $resultado->num_rows;

	if ($n_filas > 0) {
		$sentenciaBackup .= "INSERT INTO pedido(npedido, fecha, nombre_cliente) VALUES \r\n";
		
		while ($fila = $resultado->fetch_assoc()) {
			$nombreCliente = "";

			if (is_null($fila['nombre_cliente'])) {
				$nombreCliente = "NULL";
			} else {
				$nombreCliente = "'".$fila['nombre_cliente']."'";
			}

			$sentenciaBackup .= "(".$fila['npedido'].", '".$fila['fecha']."', ".$nombreCliente."),\r\n";
//			$sentenciaBackup .= "ON DUPLICATE KEY UPDATE npedido = npedido, fecha = fecha, nombre_cliente = nombre_cliente;";
		}
		
		$sentenciaBackup = substr($sentenciaBackup, 0, -3); // Eleiminar último carácter
		$sentenciaBackup .= ";\r\n"; // Añadir ; al final
	}

	// TABLA PRODUCTO
	$sql = "SELECT codigo, descripcion, precio, iva, stock, stock_minimo, familia, proveedor, url_imagen FROM producto ORDER BY descripcion;";
	$resultado = $conexion->query($sql);
	$n_filas = $resultado->num_rows;

	if ($n_filas > 0) {		
		$sentenciaBackup .= "INSERT INTO producto(codigo, descripcion, precio, iva, stock, stock_minimo, familia, proveedor, url_imagen) VALUES \r\n";
		
		while ($fila = $resultado->fetch_assoc()) {
			$sentenciaBackup .= '("'.$fila['codigo'].'", "'.$fila['descripcion'].'", '.$fila['precio'].", ".$fila['iva'].", ".$fila['stock'].", ".$fila['stock_minimo'].', "'.$fila['familia'].'", "'.$fila['proveedor'].'", '.$fila['url_imagen'].')'.",\r\n";
//			$sentenciaBackup .= "ON DUPLICATE KEY UPDATE codigo = codigo, descripcion = descripcion, precio = precio, iva = iva, stock = stock, stock_minimo = stock_minimo, familia = familia, proveedor = proveedor;";
		}

		$sentenciaBackup = substr($sentenciaBackup, 0, -3); // Eleiminar último carácter
		$sentenciaBackup .= ";\r\n"; // Añadir ; al final
	}

	// TABLA PROVEEDOR
	$sql = "SELECT descripcion, direccion, telefono FROM proveedor;";
	$resultado = $conexion->query($sql);
	$n_filas = $resultado->num_rows;

	if ($n_filas > 0) {		
		$sentenciaBackup .= "INSERT INTO proveedor(descripcion, direccion, telefono) VALUES \r\n";
		
		while ($fila = $resultado->fetch_assoc()) {
			$sentenciaBackup .= '("'.$fila['descripcion'].'", "'.$fila['direccion'].'", '.$fila['telefono']."),\r\n";
//			$sentenciaBackup .= "ON DUPLICATE KEY UPDATE descripcion = descripcion, direccion = direccion, telefono = telefono;";
		}
		
		$sentenciaBackup = substr($sentenciaBackup, 0, -3); // Eleiminar último carácter
		$sentenciaBackup .= ";\r\n"; // Añadir ; al final
	}

	// TABLA HISTORIAL PRODUCTO
	$sql = "SELECT codigo, fecha, precio FROM historial_producto;";
	$resultado = $conexion->query($sql);
	$n_filas = $resultado->num_rows;

	if ($n_filas > 0) {		
		$sentenciaBackup .= "INSERT INTO historial_producto(codigo, fecha, precio) VALUES \r\n";
		
		while ($fila = $resultado->fetch_assoc()) {
			$sentenciaBackup .= '("'.$fila['codigo'].'", "'.$fila['fecha'].'", '.$fila['precio']."),\r\n";
//			$sentenciaBackup .= "ON DUPLICATE KEY UPDATE descripcion = descripcion, direccion = direccion, telefono = telefono;";
		}
		
		$sentenciaBackup = substr($sentenciaBackup, 0, -3); // Eleiminar último carácter
		$sentenciaBackup .= ";\r\n"; // Añadir ; al final
	}

	echo $sentenciaBackup;

/*	$archivo  = fopen(RUTA."datos.sql", "w");

	if($archivo == false) {
		echo "Error al crear el archivo";
	} else {

		fwrite($archivo, $sentenciaBackup);
	}


	fclose($archivo);   // Cerrar el archivo
*/
	$conexion->close();
?>