function cargarFormularioProducto(opciones) {
	const TABLA_PRODUCTOS = $('#tablaProducto'); // Tabla productos
	const TBODY_TABLA_PRODUCTOS = TABLA_PRODUCTOS.find('tbody'); // Tbody tabla productos
	const FORMULARIO_AGREGAR_PRODUCTO = 'Agregar'; // Clase formulario agregar producto
	const FORMULARIO_CONSULTAR_PRODUCTO = 'ModalProducto'; // Clase formulario agregar producto
	const RUTA_IMAGEN_PRODUCTO_DEFECTO = 'img/productos/img_defecto.png'; // Foto por defecto para el producto
	
	if (opciones === "consulta") {
		document.querySelector('#v-pills-profile-tab').click();
	}

	// CREAR SPINNER INPUT NUMÉRICO
	crearNumbersSpinners();

	// Crear picker input range
	crearPickerRange();

	getFamilias('#familiaAgregar, #familiaConsultar, #familiaModalProducto, #familias'); // Cargar datos familias
	getProveedores('#proveedorAgregar, #proveedorConsultar, #proveedorModalProducto'); // Cargar datos proveedores

	// BOTÓN AGREGAR PRODUCTO
	$('#btnAgregarProducto').click((e) => {
		e.preventDefault();

		if (validarFormularioProducto(FORMULARIO_AGREGAR_PRODUCTO)) { // Validar formulario agregar producto
			let datos = $('form[name="formAgregarProducto"]').serializeArray(); // Obtener datos del formulario

			insertarProducto(datos); // Insertar producto
			limpiarFormularioProducto(FORMULARIO_AGREGAR_PRODUCTO); // Limpiar formulario agreagar producto

			actualizarTotal(); // Actualizar total tabla
		}
		else {
			msg('Revise los campos', 'danger');
		}
	});

	// BOTÓN CONSULTAR PRODUCTO
	$('#btnBuscarProducto').click((e) => {
		e.preventDefault();

		consultarProductoFormulario();
	});

	$('#imgProducto').click((e) => { 
		e.preventDefault();

		msgConfirm('Cambiar imagen producto', 'Va a cambiar la imagen del producto ¿Desea continuar?', (respuesta) => {
			if (respuesta) {
				$('#fileImgProducto').click();
			}
		});
	});

	modalProducto(); // Funcionalidad modal producto

	$('#modalHistorialProducto').on('show.bs.modal', (event) => {
		let button = $(event.relatedTarget); // Botón que activó el modal
		let fila = button.parents('tr'); // Fila que contiene el botón
		let json = fila.data('producto'); // Datos del producto

		let fechas = [];
		let precios = [];
		let descripcion = json.descripcion;

		$.get("php/getHistorialProducto.php", `codigo=${json.codigo}`,
			(respuesta) => {
				let precioActual = 0;

				$.each(respuesta, (_index, producto) => { 
					fechas.push(producto.fecha);
					precios.push(producto.precio);
					precioActual = producto.precio;
				});

				fechas.push('Ahora');
				precios.push(precioActual);
			},
			"json"
		);

		let ctx = document.getElementById('grafica');

		window.grafica = new Chart(ctx, {
			type: 'line',
			data: {
				labels: fechas,
				datasets: [{
					label: descripcion,
					data: precios,
					fill: false,
					tension: 0.1
				}]
			  },
			options: {
				responsive: true,
				scales: {
					y: {
						title: {
							display: true,
							text: 'Precios',
							color: '#36a2eb',
							font: {
								family: 'Comic Sans MS',
								weight: 'bold',
								lineHeight: 1.2
							}
						},
						beginAtZero: true,
						ticks: {
							align: 'center'
						}
					},
					x: {
						title: {
							display: true,
							text: 'Fechas',
							color: '#36a2eb',
							font: {
								family: 'Comic Sans MS',
								weight: 'bold',
								lineHeight: 1.2
							}
						},
						ticks: {
							align: 'center'
						}
					}
				}
			}
		});
	});

	$('#modalHistorialProducto').on('hide.bs.modal', (event) => {
		window.grafica.clear();
		window.grafica.destroy();
	});

	function modalProducto() {
		let fila;

		$('#modalProducto').on('show.bs.modal', (event) => {
			let button = $(event.relatedTarget); // Botón que activó el modal
			fila = button.parents('tr'); // Fila que contiene el botón
			let json = fila.data('producto'); // Datos del producto

			let modal = $(event.target); // Modal

			// Datos del formulario
			setDatosFormularioModalProducto(json);

			destruirNumberSpinnerModal(); // Destruir spinner input numérico modal
			crearNumberSpinnerModal(); // Crear spinner input numérico modal

			$('#btnEditarProducto').off('click'); // Eliminar evento click
			$('#btnEditarProducto').on('click', (e) => { // Agregar evento click
				e.preventDefault();

				if (validarFormularioProducto(FORMULARIO_CONSULTAR_PRODUCTO)) { // Validar formulario modal producto
					let datos = $('form[name="formModalProducto"]').serializeArray();

					insertarProducto(datos); // Editar producto

					// ACTUALIZAR DATOS PRODUCTO EN FORMULARIO
					let jsonProducto = getDatosFormularioModalProducto(datos); // Obtener datos del formulario modal producto

					fila.data('producto', jsonProducto);
					fila.find('th').text(jsonProducto.codigo);
					fila.find('a').text(jsonProducto.descripcion);

					// OCULTAR MODAL
					modal.modal('hide');
					limpiarFormularioProducto(FORMULARIO_CONSULTAR_PRODUCTO); // Limpiar formulario modal producto
				}
				else {
					msg('Revise los campos', 'danger');
				}
			});
		});

		$('#modalProducto').on('hide.bs.modal', () => {
			limpiarFormularioProducto('ModalProducto'); // Limpiar formulario modal producto
//			TBODY.find('th input').change(); // Actualizar filas
		});

		$('#fileImgProducto').change((e) => {
			e.preventDefault();
	
			let formData = new FormData(document.getElementById("formModalProducto"));

			$.ajax({
				url: "php/setImagenProducto.php",
				type: "post",
				dataType: "html",
				data: formData,
				fileName: "file",
				cache: false,
				contentType: false,
				processData: false
			}).done((res) => {
				let respuesta = JSON.parse(res);
				if (respuesta.resultado == 0) {
					msg('Error al guardar ruta en la base de datos', 'danger');
				} else if (respuesta.resultado == 1) {
					msg('Error al mover fichero', 'danger');
				} else if(respuesta.resultado == 2) {
					msg('El fichero seleccionado no es una imagen', 'danger');
				} else {
					let url = respuesta.msg;
					msg('Imagen guardada con éxito', 'primary');
					fila.data('producto').url_imagen = respuesta.msg;
					$('#imgProducto').attr('src', url);
				}
			});
		});

		function destruirNumberSpinnerModal() {
			$('#precioModalProducto').inputSpinner("destroy");
			$('#stockModalProducto, #stockMinModalProducto').inputSpinner("destroy");
		}

		function crearNumberSpinnerModal() {
			$('#precioModalProducto').inputSpinner();
			$('#stockModalProducto, #stockMinModalProducto').inputSpinner();
		}

		function getDatosFormularioModalProducto(datos) {
			return {
				codigo: datos[0].value,
				descripcion: datos[1].value,
				precio: datos[2].value,
				iva: datos[3].value,
				familia: datos[4].value,
				proveedor: datos[5].value,
				stock: datos[6].value,
				stock_minimo: datos[7].value
			};
		}

		function setDatosFormularioModalProducto(json) {
			formModalProducto.codigoModalProducto.value = json.codigo;
			formModalProducto.descripcionModalProducto.value = json.descripcion;
			formModalProducto.precioModalProducto.value = json.precio;
			formModalProducto.ivaModalProducto.value = json.iva;
			formModalProducto.stockModalProducto.value = json.stock;
			formModalProducto.stockMinModalProducto.value = json.stock_minimo;
			formModalProducto.familiaModalProducto.value = json.familia;
			formModalProducto.proveedorModalProducto.value = json.proveedor;
			if (isEmpty(json.url_imagen)) {
				formModalProducto.imgProducto.src = RUTA_IMAGEN_PRODUCTO_DEFECTO;
			} else {
				formModalProducto.imgProducto.src = json.url_imagen;
			}
		}
	}

	function limpiarTablaConsultarProducto() {
		TBODY_TABLA_PRODUCTOS.empty();
	}

	function crearNumbersSpinners() {
		$('#precioAgregar, #precioAgregarOferta, #precioConsultar, #precioModalProducto').inputSpinner();
		$('#stockAgregar, #stockMinAgregar, #stockConsultar, #stockMinConsultar, #stockModalProducto, #stockMinModalProducto').inputSpinner();
	}

	function consultarProductoFormulario() {
		cursorSpinner('#btnBuscarProducto i');

		let datos = $('form[name="formConsultarProducto"]').serializeArray();

		$.get("php/consultarProducto.php", datos,
			(json) => {
				if (json.resultado == 'ok') {
					let productos = JSON.parse(json.json);

					if (productos.length > 0) {
						limpiarTablaConsultarProducto();

						$.each(productos, (_index, producto) => {
							agregarFilaProducto(producto);
						});

						menuContextualTablaConsultarProducto(); // Crear menu contextual tabla consultar producto
						filtro("#descripcionConsultar", "#codigoConsultar", "#tablaProducto tbody tr"); // Crear filtro
						$('div.contenido-oculto').slideDown(); // Mostrar tabla productos
					} else {
						limpiarTablaConsultarProducto();
						msg('No se encontraron productos', 'info');
					}

					eliminarCursorSpinner('#btnBuscarProducto i');
				} else {
					msg('Error', 'danger');
				}
			},
			"json"
		);
	}

	function getPrecioMax() {
		$.get("php/getPrecioMax.php", null,
			function (res) {
				const fromSlider = document.querySelector('#fromSlider');
				const toSlider = document.querySelector('#toSlider');
				const fromInput = document.querySelector('#fromInput');
				const toInput = document.querySelector('#toInput');
				let precio = parseInt(res) + 1;

				toInput.value = `${numerosDecimalesMostrar(precio)} €`;
				toSlider.max = precio;
				fromSlider.max = precio;
				toSlider.value = precio;
				fromInput.value = `${numerosDecimalesMostrar(fromInput.value)} €`;
			},
			"text"
		);
	}

	function insertarProducto(datos) {
		$.post("php/insertarProducto.php", datos,
			(json) => {
				if (json.resultado == 'ok') {
					msg(json.msg, 'success');

					actualizarAutocomplete();
					getPrecioMax();
				} else {
					msg(json.msg, 'danger');
				}
			},
			"json"
		);
	}

	function actualizarAutocomplete() {
		TBODY.find(`th.${CLASE_CODIGO} input`).each((_index, elemento) => {
			getProductos(elemento);
		});
	}

	function agregarFilaProducto(producto) {
		let fila = $("<tr>");
		fila.data('producto', producto).addClass('menu-producto');

		// PRIMERA CELDA
		let celda = $("<th>");
		celda.attr('scope', 'row').addClass(CLASE_CODIGO).text(producto.codigo);
		fila.append(celda);

		// SEGUNDA CELDA
		celda = $('<td>');
		let enlace = $('<a>').text(producto.descripcion).attr({
			'href': '#'
		});

		celda.addClass(CLASE_DESCRIPCION).append(enlace);
		fila.append(celda);

		// TERCERA CELDA
		celda = $('<td>');

		// GRUPO
		let buttonGroup = $('<div>').addClass('btn-group');

		// BOTÓN EDITAR/VISUALIZAR
		let boton = $('<button>').attr({
			type: 'button',
			'data-bs-toggle': 'modal',
			'backdrop': "static",
			'data-bs-target': '#modalHistorialProducto'
		}).addClass('btn btn-info');

		let icono = $('<i>').addClass('fa fa-history');
		boton.append(icono);
		buttonGroup.append(boton);

		// BOTÓN EDITAR/VISUALIZAR
		boton = $('<button>').attr({
			type: 'button',
			'data-bs-toggle': 'modal',
			'backdrop': "static",
			'data-bs-target': '#modalProducto'
		}).addClass('btn btn-warning btn-ver-producto');

		enlace.click((e) => {
			e.preventDefault();

			$(e.target).parents('td').next().find('.btn-ver-producto').click();
		});

		icono = $('<i>').addClass('far fa-eye');
		boton.append(icono);
		buttonGroup.append(boton);

		// BOTÓN ELIMINAR
		boton = $('<button>').attr({
			type: 'button'
		}).addClass('btn btn-danger btn-eliminar-producto').click((e) => {
			e.preventDefault();

			msgConfirm('Eliminar producto', '¿Desea eliminar el producto?', (respuesta) => {
				if (respuesta) {
					eliminarProducto(producto.codigo, fila);
				} else {
					msg('Operación cancelada', 'info');
				}
			});
		});

		icono = $('<i>').addClass('fas fa-trash');
		boton.append(icono);
		buttonGroup.append(boton);
		celda.addClass('col-opciones').append(buttonGroup);
		fila.append(celda);

		// AGREGAR CELDAS
		TBODY_TABLA_PRODUCTOS.append(fila);
	}

	function eliminarProducto(codigo, fila) {
		let datos = `codigo=${codigo}`;

		$.post("php/eliminarProducto.php", datos,
			function (json) {
				if (json.resultado == 'ok') {
					msg(json.msg, 'success');

					fila.fadeOut(() => { // Ocultar fila
						fila.remove(); // Eliminar fila
						actualizarAutocomplete();
					});
				} else {
					msg(json.msg, 'danger');
				}
			},
			"json"
		);
	}

	function crearPickerRange() {
		let colorPrimario = '#387bbe';
		let colorSecundario = '#C6C6C6';

		function controlFromInput(fromSlider, fromInput, toInput, controlSlider) {
			const [from, to] = getParsed(fromInput, toInput);
			fillSlider(fromInput, toInput, colorSecundario, colorPrimario, controlSlider);

			if (from > to) {
				fromSlider.value = to;
				fromInput.value = `${numerosDecimalesMostrar(to)} €`;
			} else {
				fromSlider.value = from;
			}

			fromInput.value = `${numerosDecimalesMostrar(fromSlider.value)} €`;
		}

		function controlToInput(toSlider, fromInput, toInput, controlSlider) {
			const [from, to] = getParsed(fromInput, toInput);
			fillSlider(fromInput, toInput, colorSecundario, colorPrimario, controlSlider);
			setToggleAccessible(toInput);

			if (from <= to) {
				toSlider.value = to;
				toInput.value = `${numerosDecimalesMostrar(to)} €`;
			} else {
				toInput.value = `${numerosDecimalesMostrar(from)} €`;
			}

			toInput.value = `${numerosDecimalesMostrar(toSlider.value)} €`;
		}

		function controlFromSlider(fromSlider, toSlider, fromInput) {
			const [from, to] = getParsed(fromSlider, toSlider);
			fillSlider(fromSlider, toSlider, colorSecundario, colorPrimario, toSlider);

			if (from > to) {
				fromSlider.value = to;
				fromInput.value = `${numerosDecimalesMostrar(to)} €`;
			} else {
				fromInput.value = `${numerosDecimalesMostrar(from)} €`;
			}
		}

		function controlToSlider(fromSlider, toSlider, toInput) {
			const [from, to] = getParsed(fromSlider, toSlider);
			fillSlider(fromSlider, toSlider, colorSecundario, colorPrimario, toSlider);
			setToggleAccessible(toSlider);

			if (from <= to) {
				toSlider.value = to;
				toInput.value = `${numerosDecimalesMostrar(to)} €`;
			} else {
				toInput.value = `${numerosDecimalesMostrar(from)} €`;
				toSlider.value = from;
			}
		}

		function getParsed(currentFrom, currentTo) {
			const from = parseFloat(numerosDecimales(currentFrom.value));
			const to = parseFloat(numerosDecimales(currentTo.value));
			return [from, to];
		}

		function fillSlider(from, to, sliderColor, rangeColor, controlSlider) {
			const rangeDistance = to.max - to.min;
			const fromPosition = from.value - to.min;
			const toPosition = to.value - to.min;
			controlSlider.style.background = `linear-gradient(
			  to right,
			  ${sliderColor} 0%,
			  ${sliderColor} ${(fromPosition)/(rangeDistance)*100}%,
			  ${rangeColor} ${((fromPosition)/(rangeDistance))*100}%,
			  ${rangeColor} ${(toPosition)/(rangeDistance)*100}%, 
			  ${sliderColor} ${(toPosition)/(rangeDistance)*100}%, 
			  ${sliderColor} 100%)`;
		}

		function setToggleAccessible(currentTarget) {
			const toSlider = document.querySelector('#toSlider');

			if (Number(currentTarget.value) <= 0 ) {
				toSlider.style.zIndex = 2;
			} else {
				toSlider.style.zIndex = 0;
			}
		}

		const fromSlider = document.querySelector('#fromSlider');
		const toSlider = document.querySelector('#toSlider');
		const fromInput = document.querySelector('#fromInput');
		const toInput = document.querySelector('#toInput');

		getPrecioMax();

		fillSlider(fromSlider, toSlider, colorSecundario, colorPrimario, toSlider);
		setToggleAccessible(toSlider);

		fromSlider.oninput = () => controlFromSlider(fromSlider, toSlider, fromInput);
		toSlider.oninput = () => controlToSlider(fromSlider, toSlider, toInput);
		fromInput.oninput = () => controlFromInput(fromSlider, fromInput, toInput, toSlider);
		toInput.oninput = () => controlToInput(toSlider, fromInput, toInput, toSlider);
	}	

	function validarFormularioProducto(clase) {
		let campoValido = true;
		let isValid = true;

		// CAMPO CÓDIGO
		let codigo = $(`#codigo${clase}`);
		let eReg = /^[0-9]+$/;

		codigo.keyup(() => {
			campoValido = validarInputExReg(codigo, eReg);

			if (!campoValido) {
				isValid = false;
			}
		}).keyup();

		let descripcion = $(`#descripcion${clase}`);

		descripcion.keyup(() => {
			campoValido = validarInputVacio(descripcion);

			if (!campoValido) {
				isValid = false;
			}
		}).keyup();

		let precio = $(`#precio${clase}`);

		precio.keyup(() => {
			campoValido = validarInputVacio(precio);

			if (!campoValido) {
				isValid = false;
			}
		}).keyup();

		let iva = $(`#iva${clase}`);

		iva.keyup(() => {
			campoValido = validarInputVacio(iva);

			if (!campoValido) {
				isValid = false;
			}
		}).keyup();

		let familia = $(`#familia${clase}`);

		familia.keyup(() => {
			campoValido = validarInputVacio(familia);

			if (!campoValido) {
				isValid = false;
			}
		}).keyup();

		let proveedor = $(`#proveedor${clase}`);

		proveedor.keyup(() => {
			campoValido = validarInputVacio(proveedor);

			if (!campoValido) {
				isValid = false;
			}
		}).keyup();

		let stock = $(`#stock${clase}`);

		stock.keyup(() => {
			campoValido = validarInputVacio(stock);

			if (!campoValido) {
				isValid = false;
			}
		}).keyup();

		let stockMin = $(`#stockMin${clase}`);

		stockMin.keyup(() => {
			campoValido = validarInputVacio(stockMin);

			if (!campoValido) {
				isValid = false;
			}
		}).keyup();

		return isValid;
	}

	function limpiarFormularioProducto(clase) {
		let codigo = $(`#codigo${clase}`);
		codigo.removeClass('is-valid is-invalid').val('');

		let descripcion = $(`#descripcion${clase}`);
		descripcion.removeClass('is-valid is-invalid').val('');

		let precio = $(`#precio${clase}`);
		precio.removeClass('is-valid is-invalid').val(0);

		let iva = $(`#iva${clase}`);
		iva.removeClass('is-valid is-invalid').prop('selectedIndex', 0);

		let familia = $(`#familia${clase}`);
		familia.removeClass('is-valid is-invalid').prop('selectedIndex', 0);

		let proveedor = $(`#proveedor${clase}`);
		proveedor.removeClass('is-valid is-invalid').prop('selectedIndex', 0);

		let stock = $(`#stock${clase}`);
		stock.removeClass('is-valid is-invalid').val(0);

		let stockMin = $(`#stockMin${clase}`);
		stockMin.removeClass('is-valid is-invalid').val(0);
	}
}