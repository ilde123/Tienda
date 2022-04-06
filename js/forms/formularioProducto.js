function cargarFormularioProducto(opciones) {
	if (opciones === "consulta") {
		$('#v-pills-profile-tab').click(); // Abrir pestaña consulta
	}

	// CREAR SPINNER INPUT NUMÉRICO
	$('#precioAgregar, #precioAgregarOferta, #precioConsultar, #precioModalProducto').inputSpinner();
	$('#stockAgregar, #stockMinAgregar, #stockConsultar, #stockMinConsultar, #stockModalProducto, #stockMinModalProducto').inputSpinner();

	getFamilias('#familiaAgregar, #familiaConsultar, #familiaModalProducto'); // Cargar datos familias
	getProveedores('#proveedorAgregar, #proveedorConsultar, #proveedorModalProducto'); // Cargar datos proveedores

	// BOTÓN AGREGAR PRODUCTO
	$('#btnAgregarProducto').click(function (e) {
		e.preventDefault();

		// COMPROBAR SI EL FORMULARIO ES VÁLIDO
		if (validarFormularioProducto('Agregar')) {
			let datos = $('form[name="formAgregarProducto"]').serializeArray();

			datos[2].value = numerosDecimales(formatNumber($('#precioAgregar').next().find('input').val()));

			insertarProducto(datos);
			limpiarFormularioProducto('Agregar');

			// ACTUALIZAR LOS PRODUCTOS DE LA TABLA VENTAS EN MOSTRADOR
			//$('tbody:first th input').trigger('change');
			actualizarTotal();
		}
		else {
			msg('Revise los campos', 'rojo');
		}
	});

	// BOTÓN CONSULTAR PRODUCTO
	$('#btnBuscarProducto').click(function (e) {
		e.preventDefault();

		// CAMBIAR CURSOR
		$('#btnBuscarProducto i').addClass('spinner-border spinner-border-sm');
		$('#btnBuscarProducto i').removeClass('fa-search');
		$('*').addClass('cursor-wait');

		let datos = $('form[name="formConsultarProducto"]').serializeArray();

		$.post("php/consultarProducto.php", datos,
			function (json, textStatus, jqXHR) {
				if (json.resultado == 'ok') {
					let productos = JSON.parse(json.json);

					$('#tablaProducto tbody').empty();

					$.each(productos, function (indexInArray, valueOfElement) {
						agregarFilaProducto(this);
					});

					$('#btnBuscarProducto i').removeClass('spinner-border spinner-border-sm');
					$('#btnBuscarProducto i').addClass('fa-search');
					$('*').removeClass('cursor-wait');

					menuContextualTablaConsultarProducto();
					// FILTRO PARA LA TABLA
					filtro("#descripcionConsultar, #codigoConsultar", "#tablaProducto tbody tr");

					// EVENTO MOSTRAR MODAL
					$('#modalProducto').on('show.bs.modal', function (event) {
						let button = $(event.relatedTarget); // Button that triggered the modal
						let json = button.parents('tr').data('producto'); // Extract info from data-* attributes


						// If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
						// Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
						let modal = $(this);

						// DESTRUIR SPINNER INPUT NUMÉRICO MODAL
						$('#precioModalProducto').inputSpinner("destroy");
						$('#stockModalProducto, #stockMinModalProducto').inputSpinner("destroy");

						formModalProducto.codigoModalProducto.value = json.codigo;
						formModalProducto.descripcionModalProducto.value = json.descripcion;
						formModalProducto.precioModalProducto.value = json.precio;
						formModalProducto.ivaModalProducto.value = json.iva;
						formModalProducto.stockModalProducto.value = json.stock;
						formModalProducto.stockMinModalProducto.value = json.stock_minimo;
						formModalProducto.familiaModalProducto.value = json.familia;
						formModalProducto.proveedorModalProducto.value = json.proveedor;

						// RECREAR SPINNER INPUT NUMÉRICO MODAL
						$('#precioModalProducto').inputSpinner();
						$('#stockModalProducto, #stockMinModalProducto').inputSpinner();

						$('#productoFavorito').click(function (e) {
							e.preventDefault();

							$(this).toggleClass('fa');
						});

						// BOTÓN EDITAR PRODUCTO
						$('#btnEditarProducto').off('click');
						$('#btnEditarProducto').on('click', function (e) {
							e.preventDefault();

							if (validarFormularioProducto('ModalProducto')) {
								let datos = $('form[name="formModalProducto"]').serializeArray();
								datos[2].value = numerosDecimales(formatNumber($('#precioModalProducto').next().find('input').val()));

								insertarProducto(datos);

								// ACTUALIZAR DATOS PRODUCTO EN FORMULARIO
								let jsonProducto = {
									codigo: datos[0].value,
									descripcion: datos[1].value,
									precio: datos[2].value,
									iva: datos[3].value,
									familia: datos[4].value,
									proveedor: datos[5].value,
									stock: datos[6].value,
									stock_minimo: datos[7].value
								};

								button.data('producto', jsonProducto);
								button.parents('tr').find('th').text(jsonProducto.codigo);
								button.parents('tr').find('a').text(jsonProducto.descripcion);

								// OCULTAR MODAL
								modal.modal('hide');
								limpiarFormularioProducto('ModalProducto');
							}
							else {
								msg('Revise los campos', 'rojo');
							}
						});
					});

					$('#modalProducto').on('hide.bs.modal', function (event) {
						limpiarFormularioProducto('ModalProducto');
						$('tbody:first th input').trigger('change');
					});

					$('#modalEliminarProducto').on('show.bs.modal', function (event) {
						let button = $(event.relatedTarget); // Button that triggered the modal
						let json = button.parents('tr').data('producto'); // Extract info from data-* attributes


						// If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
						// Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
						let modal = $(this);

						// BOTÓN ELIMINAR PRODUCTO
						$('#btnEliminarProducto').off('click');
						$('#btnEliminarProducto').on('click', function (e) {
							e.preventDefault();

							let datos = "codigo=" + json.codigo;

							$.post("php/eliminarProducto.php", datos,
								function (json, textStatus, jqXHR) {
									if (json.resultado == 'ok') {
										msg(json.msg, 'azul');
										button.parents('tr').fadeOut(function () {
											button.parents('tr').remove();
										});
									} else {
										msg(json.msg, 'rojo');
									}
								},
								"json"
							);

							// OCULTAR MODAL
							modal.modal('hide');
						});
					});


					// MOSTRAR TABLA PRODUCTOS
					$('div.contenido-oculto').slideDown();
				} else {
					msg('Error', 'rojo');
				}
			},
			"json"
		);
	});
}

function validarFormularioProducto(clase) {
	let valido = true;

	// CAMPO CÓDIGO
	let codigo = $('#codigo' + clase);
	let eReg = /^[0-9]+$/;

	codigo.keyup(function () { 
		if (eReg.test(codigo.val())) {
			codigo.addClass('is-valid').removeClass('is-invalid');
		} else {
			codigo.addClass('is-invalid').removeClass('is-valid');
			valido = false;
		}
	}).trigger('keyup');

	let descripcion = $('#descripcion' + clase);

	descripcion.keyup(function (e) { 
		if ($(this).val() != '') {
			$(this).addClass('is-valid').removeClass('is-invalid');
		} else {
			$(this).addClass('is-invalid').removeClass('is-valid');
			valido = false;
		}
	}).trigger('keyup');

	let precio = $('#precio' + clase).addClass('is-valid');
	let iva = $('#iva' + clase).addClass('is-valid');
	let familia = $('#familia' + clase).addClass('is-valid');
	let proveedor = $('#proveedor' + clase).addClass('is-valid');
	let stock = $('#stock' + clase).addClass('is-valid');
	let stockMin = $('#stockMin' + clase).addClass('is-valid');

	return valido;
}

function limpiarFormularioProducto(clase) {
	let codigo = $('#codigo' + clase);
	codigo.removeClass('is-valid is-invalid').val('');

	let descripcion = $('#descripcion' + clase);
	descripcion.removeClass('is-valid is-invalid').val('');

	let precio = $('#precio' + clase);
	precio.removeClass('is-valid is-invalid').val(0);

	let iva = $('#iva' + clase);
	iva.removeClass('is-valid is-invalid').prop('selectedIndex', 0);

	let familia = $('#familia' + clase);
	familia.removeClass('is-valid is-invalid').prop('selectedIndex', 0);

	let proveedor = $('#proveedor' + clase);
	proveedor.removeClass('is-valid is-invalid').prop('selectedIndex', 0);

	let stock = $('#stock' + clase);
	stock.removeClass('is-valid is-invalid').val(0);

	let stockMin = $('#stockMin' + clase);
	stockMin.removeClass('is-valid is-invalid').val(0);
}