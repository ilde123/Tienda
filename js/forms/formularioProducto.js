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

	getFamilias('#familiaAgregar, #familiaConsultar, #familiaModalProducto'); // Cargar datos familias
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

		$('#fileImgProducto').click();
	});

	modalProducto(); // Funcionalidad modal producto

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
			TBODY.find('th input').change(); // Actualizar filas
		});

		$('#fileImgProducto').change((e) => {
			e.preventDefault();
	
			msgConfirm('Cambiar imagen producto', 'Va a cambiar la imagen del producto ¿Desea continuar?', (respuesta) => {
				if (respuesta) {
					let formData = new FormData(document.getElementById("formModalProducto"));

					$.ajax({
						url: "php/setImgagenProducto.php",
						type: "post",
						dataType: "html",
						data: formData,
						fileName: "file",
						cache: false,
						contentType: false,
						processData: false
					}).done((url) => {
						if (url == 0) {
							msg('Fallo al guardar imagen', 'danger');
						} else if (url == 1) {
							msg('El fichero seleccionado no es una imagen', 'danger');
						} else {
							$('#imgProducto').attr('src', url);
							msg('Imagen guardada con éxito', 'primary');
							fila.data('producto').url_imagen = url;
						}
					});
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

		$.post("php/consultarProducto.php", datos,
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

	function insertarProducto(datos) {
		$.post("php/insertarProducto.php", datos,
			(json) => {
				if (json.resultado == 'ok') {
					msg(json.msg, 'success');

					actualizarAutocomplete();
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
			'data-bs-target': '#modalProducto'
		}).addClass('btn btn-warning');

		enlace.click((e) => {
			e.preventDefault();

			$(e.target).parents('td').next().find('button:first').click();
		});

		let icono = $('<i>').addClass('far fa-eye');
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