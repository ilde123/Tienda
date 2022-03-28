<?php
	require("fpdf/fpdf.php");

	class PDF extends FPDF {
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


		function TextWithDirection($x, $y, $txt, $direction='R')
		{
			if ($direction=='R')
				$s=sprintf('BT %.2F %.2F %.2F %.2F %.2F %.2F Tm (%s) Tj ET',1,0,0,1,$x*$this->k,($this->h-$y)*$this->k,$this->_escape($txt));
			elseif ($direction=='L')
				$s=sprintf('BT %.2F %.2F %.2F %.2F %.2F %.2F Tm (%s) Tj ET',-1,0,0,-1,$x*$this->k,($this->h-$y)*$this->k,$this->_escape($txt));
			elseif ($direction=='U')
				$s=sprintf('BT %.2F %.2F %.2F %.2F %.2F %.2F Tm (%s) Tj ET',0,1,-1,0,$x*$this->k,($this->h-$y)*$this->k,$this->_escape($txt));
			elseif ($direction=='D')
				$s=sprintf('BT %.2F %.2F %.2F %.2F %.2F %.2F Tm (%s) Tj ET',0,-1,1,0,$x*$this->k,($this->h-$y)*$this->k,$this->_escape($txt));
			else
				$s=sprintf('BT %.2F %.2F Td (%s) Tj ET',$x*$this->k,($this->h-$y)*$this->k,$this->_escape($txt));
			if ($this->ColorFlag)
				$s='q '.$this->TextColor.' '.$s.' Q';
			$this->_out($s);
		}

		//***** Aquí comienza código para ajustar texto *************
		//***********************************************************
		function CellFit($w, $h=0, $txt='', $border=0, $ln=0, $align='', $fill=false, $link='', $scale=false, $force=true)
		{
			//Get string width
			$str_width=$this->GetStringWidth($txt);
	
			//Calculate ratio to fit cell
			if($w==0)
				$w = $this->w-$this->rMargin-$this->x;
			$ratio = ($w-$this->cMargin*2)/$str_width;
	
			$fit = ($ratio < 1 || ($ratio > 1 && $force));
			if ($fit)
			{
				if ($scale)
				{
					//Calculate horizontal scaling
					$horiz_scale=$ratio*100.0;
					//Set horizontal scaling
					$this->_out(sprintf('BT %.2F Tz ET',$horiz_scale));
				}
				else
				{
					//Calculate character spacing in points
					$char_space=($w-$this->cMargin*2-$str_width)/max($this->MBGetStringLength($txt)-1,1)*$this->k;
					//Set character spacing
					$this->_out(sprintf('BT %.2F Tc ET',$char_space));
				}
				//Override user alignment (since text will fill up cell)
				$align='';
			}
	
			//Pass on to Cell method
			$this->Cell($w,$h,$txt,$border,$ln,$align,$fill,$link);
	
			//Reset character spacing/horizontal scaling
			if ($fit)
				$this->_out('BT '.($scale ? '100 Tz' : '0 Tc').' ET');
		}
	
		function CellFitSpace($w, $h=0, $txt='', $border=0, $ln=0, $align='', $fill=false, $link='')
		{
			$this->CellFit($w,$h,$txt,$border,$ln,$align,$fill,$link,false,false);
		}
	
		//Patch to also work with CJK double-byte text
		function MBGetStringLength($s)
		{
			if($this->CurrentFont['type']=='Type0')
			{
				$len = 0;
				$nbbytes = strlen($s);
				for ($i = 0; $i < $nbbytes; $i++)
				{
					if (ord($s[$i])<128)
						$len++;
					else
					{
						$len++;
						$i++;
					}
				}
				return $len;
			}
			else
				return strlen($s);
		}
		//************** Fin del código para ajustar texto *****************
		//******************************************************************
	}
?>