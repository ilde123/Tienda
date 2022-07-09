document.oncontextmenu = (e) => {
	e.preventDefault();
}

$.contextMenu({
	selector: '.context-menu-one',
	build: ($trigger, _e) => {
		let disabledDelete = false;
		let disabledEdit = false;

		if (TBODY.find('tr').length == 1) {
			disabledDelete = true;
		}

		if ($($trigger[0]).find('th input').val() == '') {
			disabledEdit = true;
		}

		return {
			callback: (key, options, _e) => {

				// Fila afectada
				let fila = $(options.$trigger[0]);

				switch (key) {
					case 'delete':
						fila.remove();
						actualizarTotal();
						contador--;
						actualizarContador();
						break;

					case 'limpiar':
						fila.find('input').val('');
						fila.find(`.${CLASE_DESCRIPCION}`).text('');
						fila.find('.col-codigo input').focus();
						actualizarTotal();
						break;

					case 'add':
						agregarFila();
						break;

					case 'copy':
						fila.find('th input').select();
						navigator.clipboard.writeText(fila.find('th input').val());
						break;

					case 'paste':
						fila.find(`th.${CLASE_CODIGO} input`).focus().select();

						navigator.clipboard.readText()
							.then(texto => { // Promesa
								let i = 0;
								let speed = 50;
								typeWriter();

								function typeWriter() {

									if (i < texto.length) {
										let textoAnterior = fila.find('th input').val();
										fila.find(`th.${CLASE_CODIGO} input`).val(`${textoAnterior}${texto[i]}`);
										i++;
										setTimeout(typeWriter, speed);
									} else {
										fila.find(`th.${CLASE_CODIGO} input`).focus().change();
									}
								}
							})
							.catch(error => {
								// Por si el usuario no da permiso u ocurre un error
								msg(`Hubo un error: ${error}`, 'danger');
							});
						break;

					case 'edit':
						let codigo = fila.find('th input').val();

						$('#btnConsultarProducto').click();

						// ABRIR CONSULTAR PRODUCTO
						setTimeout(() => {
							$('#codigoConsultar').val(codigo);

							$('#btnBuscarProducto').click();

							setTimeout(() => {
								$('.btn-warning').click();
							}, 500);
						}, 1000);
						break;

					case 'quit':
						limpiarTabla();
						break;

					default:
						break;
				}
			},
			items: {
				"add": { name: "Añadir", icon: "add", accesskey: 'a' },
				"edit": { name: "Modificar", icon: "edit", disabled: disabledEdit, accesskey: 'm' },
				copy: { name: "Copiar", icon: "copy", accesskey: 'c' },
				'paste': { name: "Pegar", icon: "paste", accesskey: 'p' },
				"limpiar": { name: "Limpiar", icon: "fa-eraser", accesskey: 'l' },
				"delete": { name: "Eliminar", icon: "delete", disabled: disabledDelete, accesskey: 'e' },
				"sep1": "---------",
				"quit": {
					name: "Cancelar", icon: () => {
						return 'context-menu-icon context-menu-icon-quit';
					}
				}
			}
		};
	}
});

$.contextMenu({
	// Opciones del menú contextual
	selector: '.fila-total',
	build: ($trigger, _e) => {
		return {
			callback: (key, options, _e) => {
				switch (key) {
					case 'cancel':
						BOTON_CANCELAR_PEDIDO.click();
						break;

					case 'acept':
						BOTON_ACEPTAR_PEDIDO.click();
						break;

					case 'print':
						BOTON_IMPRIMIR_PEDIDO.click();
						break;

					default:
						break;
				}
			},
			items: {
				"acept": { name: "Aceptar pedido", icon: "fa-check", accesskey: 'a' },
				"cancel": { name: "Cancelar pedido", icon: "fa-times", accesskey: 'c' },
				"print": { name: "Imprimir pedido", icon: "fa-print", accesskey: 'i' }
			}
		};
	}
});

function menuContextualTablaConsultarProducto() {
	document.oncontextmenu = (e) => {
		e.preventDefault();
	}

	$.contextMenu({
		selector: '.menu-producto',
		callback: (key, options, _e) => {

			// FILA AFECTADA
			let fila = $(options.$trigger[0]);

			switch (key) {
				case 'delete':
					fila.find('.btn-danger').click();
					break;

				case 'ver':
					fila.find('a').click();
					break;

				case 'copy':
					fila.find(`.${CLASE_CODIGO}`).select();
					navigator.clipboard.writeText(fila.find('th').text());
					break;

				default:
					break;
			}
		},
		items: {
			"ver": { name: "Ver/Modificar", icon: "fa-eye", accesskey: 'v' },
			"delete": { name: "Eliminar", icon: "delete", accesskey: 'e' },
			copy: { name: "Copiar", icon: "copy", accesskey: 'c' },
			"sep1": "---------",
			"quit": {
				name: "Cancelar", icon: () => {
					return 'context-menu-icon context-menu-icon-quit';
				}
			}
		}
	});
}