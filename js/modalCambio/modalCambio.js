// Evento mostrar modal cambio
$('#modalCambio').on('shown.bs.modal', () => {
	$('#entregaModalCambio').focus();
	

	let totalAPagar = formatNumber(TOTAL.val());

	// Mostrar el cambio
	let inputEntrega = $('#entregaModalCambio');
	let importe = formatNumber(inputEntrega.val());

	inputEntrega.keyup((e) => {
		// Tecla intro pulsada
		if (e.keyCode == 13) {
			// Disparar evento click
			$('#btnAceptarCambio').trigger('click');
		} else { // Ofrecer el cambio
			let imputCambio = $('#cambioModalCambio');

			importe = formatNumber(inputEntrega.val());
			inputEntrega.val(numerosDecimalesMostrar(importe));

			// COMPROBAR QUE LA CANTIDAD INSERTADA SUPERA EL TOTAL A PAGAR
			if (parseFloat(importe) >= parseFloat(totalAPagar)) {
				let aDevolver = numerosDecimales(importe - totalAPagar);
				imputCambio.val(numerosDecimalesMostrar(aDevolver));
			} else {
				imputCambio.val('');
			}
		}
	});

	// Evento aceptar cambio
	$('#btnAceptarCambio').click((e) => { 
		e.preventDefault();

		// COMPROBAR QUE LA CANTIDAD INSERTADA SUPERA EL TOTAL A PAGAR
		if (parseFloat(importe) >= parseFloat(totalAPagar)) {
			insertarPedido();
		} else {
			let falta = numerosDecimales(Math.abs(importe - totalAPagar));
			msg(`Faltan ${numerosDecimalesMostrar(falta.toString())} €`, 'rojo');
		}
	});

	function insertarPedido() {
		let datos = '';

		TBODY.children('tr').each((_index, element) => {
			let fila = $(element);
			let codigo = fila.find('th input').val();
			let unidades = fila.find('td.col-unidades input').val();
			let precio = fila.find('td.col-precio input').val();

			if (codigo != '' || unidades != '' || precio != '') {
				datos += `codigo[]=${codigo}&unidades[]=${unidades}&precio[]=${precio}&`;
			}
		});

		// Borrar el último carácter "&"
		datos = datos.substring(0, datos.length - 1);

		if (datos != '') {
			$.post("php/insertarPedido.php", datos,
				(json) => {
					if (json.resultado == 'ok') {
						//msg(json.msg, 'azul');
						$('#modalCambio').modal('hide');
						limpiarTabla();
					} else {
						msg(json.msg, 'rojo');
					}
				},
				"json"
			);
		}
	}
});

// Evento ocultar modal cambio
$('#modalCambio').on('show.bs.modal', () => {
	$('#modalCambio input').val('');
});