<?php
	require("fpdf/fpdf.php");

	class Ticket extends FPDF {
		function Header() {
			$this->SetFont('Arial', 'BI', 12);
			# $this->Image('../img/logo.png', null, null, 25, 25, 'PNG');
			$this->Text(17, 5, utf8_decode("AUTOSERVICIO ROCHA"));

			$this->SetFont('Arial', 'B', 10);
			$this->Text(25, 15, utf8_decode("TLF: 954 875 119"));

			$this->SetFont('Arial', '', 7);
			$this->Text(3, 10, utf8_decode("Callejón del Tomate, nº 4"));
			$this->Text(50, 10, utf8_decode("Montellano (Sevilla)"));
		}

		function Footer() {
			$this->SetFont('Arial', 'B', 10);
			$this->SetY(-40);
			# $this->Image('../img/logo.png', null, null, 22, 40, 'PNG');
			# Posiciona el pie a 1 cm del final
			$this->SetY(-10);
			$this->SetFont('Arial', 'I', 7);
			//$this->Cell(0, 10, utf8_decode('¡Gracias por su compra!'), 0, 0, 'C');
			$y = $this->GetPageHeight() - 3;
			$this->Text(26, $y, utf8_decode("¡Gracias por su compra!"));

			# Imprime el número actual de la página
			# $this->Cell(0, 10, utf8_decode('Página ').$this->PageNo().'/{nb}', 0, 0, 'C');
		}

		function CrearTablaTicket($header, $data) {
			$this->SetX(3);
			$this->SetFont('Arial', '', 7);
			// Anchuras de las columnas
			$w = array(8, 45, 9, 9);
			// Cabeceras
			for ($i=0; $i < count($header); $i++) {
				$this->Cell($w[$i], 6, utf8_decode($header[$i]), 1, 0, 'C');
			}

			$this->Ln();
			$this->SetFillColor(240, 240, 240);
			$total = 0;

			// Datos
			$fill = true;
			foreach ($data as $row) {
				$this->SetX(3);
				$h = 5;

				$total = number_format($total + $row[3], 2);

				$this->CellFitSpace($w[0], $h, utf8_decode($row[0]), 'LR', 0, 'L', $fill);
				$this->CellFitSpace($w[1], $h, utf8_decode($row[1]), 'LR', 0, 'L', $fill);
				$this->CellFitSpace($w[2], $h, utf8_decode($row[2]), 'LR', 0, 'L', $fill);
				$this->CellFitSpace($w[3], $h, number_format($row[3], 2), 'LR', 0, 'L', $fill);
				$this->Ln();
				$fill = !$fill;
			}

			// Línea de cierre
			$this->SetX(3);
			$this->Cell(array_sum($w), 0, '', 'T');

			$y = $this->GetY() + 5;
			$this->SetFont('Arial', 'B', 10);
			$this->Text(40, $y, utf8_decode("TOTAL... ".$total));
		}
	}

	class PDF extends FPDF {
		function Footer()
		{
			$pageNo = 'Página '.$this->PageNo().'/{nb}'; // '{nb}' is a special tag for total number of pages
			$this->SetX(10);
			$this->SetY($this->GetY() + 5);
			// Select Arial italic 8
			$this->SetFont('Arial', 'I', 8);
			// Print current and total page numbers
			$this->Cell(0, 10, utf8_decode($pageNo), 0, 0, 'C');
		}

		function CrearTablaPedidos($header, $data) {
			$margenIzquierda = 3; // 3 mm
			$euro = "\xc2\x80"; // Símbolo del euro

			$this->SetX($margenIzquierda);
			$this->SetFont('Arial', 'B', 12);
			// Anchuras de las columnas
			$w = array(35.5, 35.5);

			$mesAnterior = explode("/", $data[0][0])[1];
			$year = explode("/", $data[0][0])[2]; // año

			$this->SetFillColor(240, 240, 240);

			// Nombrar mes español
			setlocale(LC_ALL, 'es_es'); // Establecer el lenguaje a español
			$dateObj = DateTime::createFromFormat('!m', $mesAnterior); // Crear objeto de fecha
			$monthName = strftime('%B', $dateObj->getTimestamp()); // Obtener el nombre del mes
			$this->Cell(array_sum($w), 6, utf8_decode(ucfirst($monthName.' '.$year)), 1, 0, 'C', true); // Imprimir el nombre del mes

			$this->SetY($this->GetY() + 6); // Bajar celda
			$this->SetX($margenIzquierda);

			$this->SetFont('Arial', 'B', 11); // Cambiar fuente

			// Cabeceras
			for ($i=0; $i < count($header); $i++) {
				$this->Cell($w[$i], 6, utf8_decode($header[$i]), 1, 0, 'C');
			}

			$this->SetFont('Arial', '', 11);

			$this->Ln();

			$x = $this->GetX();
			$fill = true;
			
			$this->SetX($margenIzquierda);
			$h = 5;

			$totalAcumulado = 0;

			// Datos
			foreach ($data as $row) {
				$dia = explode("/", $row[0])[0]; // dia

				$mes = explode("/", $row[0])[1]; // mes

				$year = explode("/", $row[0])[2]; // año

				if ($mes == $mesAnterior) { // Si el mes es el mismo que el anterior
					$this->SetX($margenIzquierda); // Se posiciona al mismo nivel
				} else { // Cambiar tabla
					// Línea de cierre
					$this->SetX($margenIzquierda);
					$this->Cell(array_sum($w), 0, '', 'T');
					
					$this->SetX($margenIzquierda);

					$this->SetFont('Arial', 'B', 11); // Cambiar fuente

					// Fila de totales
					$this->CellFitSpace($w[0], $h, utf8_decode('Total mes'), 'LR', 0, 'C');
					$this->CellFitSpace($w[1], $h, utf8_decode(number_format($totalAcumulado, 2, ',', '.'). " ".$euro), 'LR', 0, 'C');

					$this->SetY($this->GetY() + 5); // Bajar celda

					$this->SetFont('Arial', '', 11); // Cambiar fuente

					// Línea de cierre
					$this->SetX($margenIzquierda);
					$this->Cell(array_sum($w), 0, '', 'T');

					$totalAcumulado = 0; // Reiniciar total acumulado

					// Añadir nueva página
					$this->AddPage('p', array(80, 210));
					$this->SetX($margenIzquierda);
					$fill = true;

					// Nombrar mes español
					$this->SetFont('Arial', 'B', 12);
					$dateObj = DateTime::createFromFormat('!m', $mes);
					$monthName = strftime('%B', $dateObj->getTimestamp());
					$this->Cell(array_sum($w), 6, utf8_decode(ucfirst($monthName.' '.$year)), 1, 0, 'C', true);

					$this->SetY($this->GetY() + 6); // Bajar celda
					$this->SetX($margenIzquierda); // Margen izquierdo

					$this->SetFont('Arial', 'B', 11);

					// Pintar cabecera
					$this->SetX($margenIzquierda);
					for ($i=0; $i < count($header); $i++) {
						$this->Cell($w[$i], 6, utf8_decode($header[$i]), 1, 0, 'C');
					}

					$this->SetFont('Arial', '', 11);

					$this->SetY($this->GetY() + 5.5); // Bajar celda
					$this->SetX($margenIzquierda); // Margen izquierdo

					$mesAnterior = $mes;
				}

				// Pintar celdas

				$fecha = intval($dia).'/'.intval($mes).'/'.$year; // Fecha
				$total = number_format($row[1], 2, ',', '.'). " ".$euro; // Formatear divisa
				$totalAcumulado += $row[1]; // Acumular total

				$this->CellFitSpace($w[0], $h, utf8_decode($fecha), 'LR', 0, 'C', $fill);
				$this->CellFitSpace($w[1], $h, utf8_decode($total), 'LR', 0, 'C', $fill);

				$this->SetY($this->GetY() + 5); // Bajar celda

				$x = $this->GetX();
				$fill = !$fill;
			}

			// Línea de cierre
			$this->SetX($x - 6.75);
			$this->Cell(array_sum($w), 0, '', 'T');

			$this->SetX($margenIzquierda);

			$this->SetFont('Arial', 'B', 11); // Cambiar fuente

			// Fila de totales
			$this->CellFitSpace($w[0], $h, utf8_decode('Total mes'), 'LR', 0, 'C', $fill);
			$this->CellFitSpace($w[1], $h, utf8_decode(number_format($totalAcumulado, 2, ',', '.'). " ".$euro), 'LR', 0, 'C', $fill);

			$this->SetY($this->GetY() + 5); // Bajar celda

			$this->SetFont('Arial', '', 11); // Cambiar fuente
			// Línea de cierre
			$this->SetX($x - 6.75);
			$this->Cell(array_sum($w), 0, '', 'T');
		}
	}
?>