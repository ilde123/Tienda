<?php
	require 'datosDB.php';
	require('pdf.php');

	$header = array('CANT.', 'DESCRIPCIÓN', 'P.UNIT', 'TOT');
	$unidades = $_REQUEST['unidades'];
	$descripcion = $_REQUEST['descripcion'];
	$precio = $_REQUEST['precio'];
	$total = $_REQUEST['total'];
	$nombre = $_REQUEST['nombre'];
	$telefono = $_REQUEST['telefono'];

	$data = array();

	for ($i=0; $i < count($unidades); $i++) { 

		$array = array(
			$unidades[$i],
			$descripcion[$i],
			$precio[$i],
			$total[$i]
		);

		array_push($data, $array);
	}

	$height = 80;
	$height += count($data) * 3.2;

	$pdf = new PDF();
	$pdf->AliasNbPages();
	$pdf->AddPage('p' ,array(80, $height));

	$fecha = date('j/n/Y');

	$pdf->SetFont('Arial', '', 7);
	$pdf->Text(3, 20, $fecha);

	if ($nombre != '') {
		$pdf->SetFont('Arial', 'B', 8);
		$pdf->Text(15, 20, 'Nombre: '.utf8_decode($nombre).' TLF. '.$telefono);
		$pdf->SetFont('Arial', '', 7);
	}

	$pdf->SetY(23);

	$pdf->CrearTablaTicket($header, $data);

	echo $pdf->Output('I', 'ticket'.date('dmY.His'));
	$conexion->close();
?>