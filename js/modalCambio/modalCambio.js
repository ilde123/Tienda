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
		BOTON_ACEPTAR.trigger('click');
	} else { // Ofrecer el cambio
		let totalAPagar = formatNumber(TOTAL.val());
		let importe = formatNumber(INPUT_ENTREGA.val());
		let imputCambio = $('#cambioModalCambio');

		importe = formatNumber(INPUT_ENTREGA.val());
		INPUT_ENTREGA.val(numerosDecimalesMostrar(importe));

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
	datos = datos.slice(0, -1);

	if (datos != '') {
		$.post("php/insertarPedido.php", datos,
			(json) => {
				if (json.resultado == 'ok') {
					//msg(json.msg, 'azul');
					MODAL_CAMBIO.modal('hide');
					limpiarTabla();
				} else {
					msg(json.msg, 'rojo');
				}
			},
			"json"
		);
	}
}

// Evento ocultar modal cambio
MODAL_CAMBIO.on('show.bs.modal', () => {
	MODAL_CAMBIO.find('input').val('');
});