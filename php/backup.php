<?php
	require 'datosDB.php';

	$sentenciaBackup = "";
	define("RUTA", "../backup/");

	// TABLA FAMILIA
	$sql = "SELECT familia FROM familia ORDER BY familia;";
	$resultado = $conexion->query($sql);
	$n_filas = $resultado->num_rows;

	if ($n_filas > 0) {		
		
		while ($fila = $resultado->fetch_assoc()) {
			$sentenciaBackup .= "INSERT INTO familia(familia) VALUES ";
			$sentenciaBackup .= "('".$fila['familia']."') ";
			$sentenciaBackup .= "ON DUPLICATE KEY UPDATE familia = familia;";
		}
	}

	// TABLA LPEDIDO
	$sql = "SELECT npedido, nlinea, codigo, unidades, precio FROM lpedido";
	$resultado = $conexion->query($sql);
	$n_filas = $resultado->num_rows;

	if ($n_filas > 0) {		
		
		while ($fila = $resultado->fetch_assoc()) {
			$sentenciaBackup .= "INSERT INTO lpedido (npedido, nlinea, codigo, unidades, precio) VALUES ";
			$sentenciaBackup .= "(".$fila['npedido'].", ".$fila['nlinea'].", '".$fila['codigo']."', ".$fila['unidades'].", ".$fila['precio'].") ";
			$sentenciaBackup .= "ON DUPLICATE KEY UPDATE npedido = npedido, nlinea = nlinea, codigo = codigo, unidades = unidades, precio = precio;";
		}
	}

	// TABLA PEDIDO
	$sql = "SELECT npedido, fecha, nombre_cliente FROM pedido";
	$resultado = $conexion->query($sql);
	$n_filas = $resultado->num_rows;

	if ($n_filas > 0) {		
		
		while ($fila = $resultado->fetch_assoc()) {
			$sentenciaBackup .= "INSERT INTO pedido(npedido, fecha, nombre_cliente) VALUES ";
			$nombreCliente = "";

			if (is_null($fila['nombre_cliente'])) {
				$nombreCliente = "NULL";
			} else {
				$nombreCliente = "'".$fila['nombre_cliente']."'";
			}

			$sentenciaBackup .= "(".$fila['npedido'].", '".$fila['fecha']."', ".$nombreCliente.") ";
			$sentenciaBackup .= "ON DUPLICATE KEY UPDATE npedido = npedido, fecha = fecha, nombre_cliente = nombre_cliente;";
		}
	}

	// TABLA PRODUCTO
	$sql = "SELECT codigo, descripcion, precio, iva, stock, stock_minimo, familia, proveedor FROM producto ORDER BY descripcion;";
	$resultado = $conexion->query($sql);
	$n_filas = $resultado->num_rows;

	if ($n_filas > 0) {		
		
		while ($fila = $resultado->fetch_assoc()) {
			$sentenciaBackup .= "INSERT INTO producto(codigo, descripcion, precio, iva, stock, stock_minimo, familia, proveedor) VALUES ";
			$sentenciaBackup .= "('".$fila['codigo']."', '".$fila['descripcion']."', ".$fila['precio'].", ".$fila['iva'].", ".$fila['stock'].", ".$fila['stock_minimo'].", '".$fila['familia']."', '".$fila['proveedor']."') ";
			$sentenciaBackup .= "ON DUPLICATE KEY UPDATE codigo = codigo, descripcion = descripcion, precio = precio, iva = iva, stock = stock, stock_minimo = stock_minimo, familia = familia, proveedor = proveedor;";
		}
	}

	$sentenciaBackup = substr($sentenciaBackup, 0, -1); // Eleiminar último carácter
	$sentenciaBackup .= ";"; // Añadir ; al final

	// TABLA PROVEEDOR
	$sql = "SELECT descripcion, direccion, telefono FROM proveedor;";
	$resultado = $conexion->query($sql);
	$n_filas = $resultado->num_rows;

	if ($n_filas > 0) {		
		
		while ($fila = $resultado->fetch_assoc()) {
			$sentenciaBackup .= "INSERT INTO proveedor(descripcion, direccion, telefono) VALUES ";
			$sentenciaBackup .= "('".$fila['descripcion']."', '".$fila['direccion']."', ".$fila['telefono'].") ";
			$sentenciaBackup .= "ON DUPLICATE KEY UPDATE descripcion = descripcion, direccion = direccion, telefono = telefono;";
		}
	}

	$sentenciaBackup = substr($sentenciaBackup, 0, -1); // Eleiminar último carácter
	$sentenciaBackup .= ";"; // Añadir ; al final

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