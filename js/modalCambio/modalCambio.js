const INPUT_ENTREGA = $('#entregaModalCambio');
const BOTON_ACEPTAR = $('#btnAceptarCambio');
const MODAL_CAMBIO = $('#modalCambio');

// Evento mostrar modal cambio
MODAL_CAMBIO.on('shown.bs.modal', () => {
	INPUT_ENTREGA.focus();
});

INPUT_ENTREGA.keyup((e) => {
	// Tecla intro pulsada
	if (e.keyCode == 13) {
		// Disparar evento click
		BOTON_ACEPTAR.click();
	} else { // Ofrecer el cambio
		let totalAPagar = formatNumber(TOTAL.val());
		let importe = formatNumber(INPUT_ENTREGA.val());
		let imputCambio = $('#cambioModalCambio');

		importe = formatNumber(INPUT_ENTREGA.val());
		INPUT_ENTREGA.val(importe);

		// COMPROBAR QUE LA CANTIDAD INSERTADA SUPERA EL TOTAL A PAGAR
		if (parseFloat(importe) >= parseFloat(totalAPagar)) {
			let aDevolver = numerosDecimales(importe - totalAPagar);
			imputCambio.val(numerosDecimalesMostrar(aDevolver));
		} else {
			imputCambio.val('');
		}
	}
});

BOTON_ACEPTAR.click((e) => { // Evento aceptar cambio
	e.preventDefault();

	let importe = formatNumber(INPUT_ENTREGA.val());
	let totalAPagar = formatNumber(TOTAL.val());

	if (parseFloat(importe) >= parseFloat(totalAPagar) && !isNaN(parseFloat(totalAPagar))) { // Si es mayor o igual que el total a pagar
		insertarPedido();
	} else { // Si no es mayor o igual que el total a pagar
		let falta = numerosDecimales(Math.abs(importe - totalAPagar));
		msg(`Faltan ${numerosDecimalesMostrar(falta.toString())} €`, 'danger');
	}
});

function insertarPedido() {
	let nombre = NOMBRE_CLIENTE_MODAL_CAMBIO.val();
	let datos = `nombre=${nombre}&`;

	TBODY.children('tr').each((_index, element) => {
		let fila = $(element);
		let codigo = fila.find('th input').val();
		let unidades = fila.find(`td.${CLASE_UNIDADES} input`).val();
		let precio = numerosDecimales(fila.find(`td.${CLASE_PRECIO} input`).val());

		if (codigo != '' && unidades != '' && precio != '' && numerosDecimales(precio) > 0) { // Si no están vacíos y precio es mayor que 0
			datos += `codigo[]=${codigo}&unidades[]=${unidades}&precio[]=${precio}&`;

			// Borrar el último carácter "&"
			datos = datos.slice(0, -1);
		
			$.post("php/insertarPedido.php", datos,
				(json) => {
					if (json.resultado == 'ok') {
						MODAL_CAMBIO.modal('hide');
						limpiarTabla();
					} else {
						msg(json.msg, 'danger');
					}
				},
				"json"
			);
		}
	});

}

// Evento mostrar modal cambio
MODAL_CAMBIO.on('hide.bs.modal', () => {
	MODAL_CAMBIO.find('input').val('');
	COLLAPSE_NOMBRE_CLIENTE_MODAL_CAMBIO.removeClass('show');
});