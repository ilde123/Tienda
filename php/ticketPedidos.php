<?php
	require 'datosDB.php';
	require('pdf.php');

	$header = array('Fecha', 'Total');

	$fecha = $_REQUEST['fecha'];
	$total = $_REQUEST['total'];
	$data = array();

	for ($i=0; $i < count($fecha); $i++) { 

		$array = array(
			$fecha[$i],
			$total[$i]
		);

		array_push($data, $array);
	}

	$height = 80;
	$height += count($data) * 3.2;

	$pdf = new PDF();
	$pdf->AddPage('p' ,array(80, 200));

	$pdf->SetFont('Arial', '', 7);
	$pdf->SetY(5);

	$pdf->CrearTablaPedidos($header, $data);

	$pdf->AliasNbPages();

	echo $pdf->Output('I', 'ticket'.date('dmY.His'));
	$conexion->close();
?>