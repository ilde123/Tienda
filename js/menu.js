var tabla = $('.container-fluid table');
var contenido = $('#contenidoFormularios');
contenido.hide();

$('#btnInsertarProducto').click(function (e) {
	e.preventDefault();

	// MOSTRAR Y CARGAR EL FORMULARIO PRODUCTOS
	cargarFormularioProducto();
});

$('#btnConsultarProducto').click(function (e) { 
	e.preventDefault();

	cargarFormularioProducto('consulta');
});

$('#btnOferta').click(function (e) { 
	e.preventDefault();

	cargarFormularioOferta();
});

$('#btnPedidos').click(function (e) { 
	e.preventDefault();

	cargarFormularioPedido();
});

$('#btnProveedores').click(function (e) { 
	e.preventDefault();

	cargarFormularioProveedores();
});

$('#btnSalir').click(function (e) { 
	e.preventDefault();

	close();
});

$('#btnFamilias').click(function (e) { 
	e.preventDefault();

	cargarFormularioFamilias();
});

$('#btnExistencias').click(function (e) { 
	e.preventDefault();

	cargarFormularioExistencias();
});

$('#btnCalculadora').click(function (e) { 
	e.preventDefault();

	// CREAR MODAL CALCULADORA
	$('#modalCalculadora').modal({
		backdrop: false
	});

	$('#btnCalc').fadeOut();
});

// BOTÓN MINIMIZAR CALCULADORA
$('button.close:nth-child(3)').click(function (e) { 
	e.preventDefault();

	$('#btnCalc').fadeIn();
});

//$('.barcodelector').slideUp();
$('#btnQr').click(function (e) { 
	e.preventDefault();

	$('.barcodelector').slideToggle();
});

$('#btnCalc').click(function (e) { 
	e.preventDefault();

	$('#modalCalculadora').modal("show");
	$(this).fadeOut();
});

// COPIAR MODAL CALCULADORA
$('#modalCalculadora i').click(function (e) {
	e.preventDefault();

	var copyText;
	/* Get the text field */
	if (document.getElementsByTagName('iframe')[0].contentDocument) {
		copyText = document.getElementsByTagName('iframe')[0].contentDocument.documentElement.querySelector('#display1');
	} else {
		copyText = document.getElementsByTagName('iframe')[0].contentWindow.document.querySelector('#display1');
	}

	/* Select the text field */
	copyText.select();
	copyText.setSelectionRange(0, 99999); /*For mobile devices*/
  
	/* Copy the text inside the text field */
	document.execCommand("copy");

	/* Alert the copied text */
	setTimeout(() => {
		$(this).tooltip("hide");
	}, 2000);
});

$('#modalCalculadora i.fa-copy').tooltip({title: "Copiado", trigger: "click", placement: "top"});

// MODAL CALCULADORA DRAGGABLE
$("#modalCalculadora .modal-header").mousedown(function (mousedownEvt) { 
	var $draggable = $(this);
	var x = mousedownEvt.pageX - $draggable.offset().left,
		y = mousedownEvt.pageY - $draggable.offset().top;
	$("body").on("mousemove.draggable", function(mousemoveEvt) {
		$draggable.closest(".modal-content").offset({
			"left": mousemoveEvt.pageX - x,
			"top": mousemoveEvt.pageY - y
		});
	});
	$("body").one("mouseup", function() {
		$("body").off("mousemove.draggable");
	});
	$draggable.closest(".modal").one("bs.modal.hide", function() {
		$("body").off("mousemove.draggable");
	});
});

function cargarFormularioExistencias() {
	tabla.fadeOut(function () {
		contenido.load("html/frmExistencias.html", null, function (response, status, request) {
			// MOSTRAR FORMULARIO
			contenido.fadeIn();

			$('#btnConsultarExistencias').click(function (e) { 
				e.preventDefault();

				// MOSTRAR TABLA
				$('div.contenido-oculto').slideDown(function () {
					// FILTRO PARA LAS FILAS DE LA TABLA
					filtro("#filtroTablaExistencias", "#tablaExistencias tbody tr");
				});

				if ($(':checked').val() == 'todas') {
					$.post("php/consultarStock.php", null,
						function (json, textStatus, jqXHR) {
							var producto = JSON.parse(json.json);
							var tbody = $('#tablaExistencias tbody');
							tbody.empty();

							$.each(producto, function (indexInArray, valueOfElement) { 
								var fila = $("<tr>");
								fila.data('producto', producto);

								// PRIMERA CELDA
								var celda = $("<th>");
								celda.attr('scope', 'row').addClass('col-codigo').text(this.codigo);
								fila.append(celda);

								// SEGUNDA CELDA
								celda = $('<td>').addClass('col-descripcion').text(this.descripcion);
								fila.append(celda);

								// TERCERA CELDA
								celda = $('<td>');
								celda.attr('scope', 'row').addClass('col-existencias').text(this.stock);
								fila.append(celda);

								// CUARTA CELDA
								celda = $('<td>');
								celda.attr('scope', 'row').addClass('col-minimo').text(this.stock_minimo);
								fila.append(celda);

								// AGREGAR CELDAS
								tbody.append(fila);
							});
						},
						"json"
					);
				} else {
					$.post("php/consultarStockBajoMinimos.php", null,
						function (json, textStatus, jqXHR) {
							var producto = JSON.parse(json.json);
							var tbody = $('#tablaExistencias tbody');
							tbody.empty();

							$.each(producto, function (indexInArray, valueOfElement) { 
								var fila = $("<tr>");
								fila.data('producto', producto);

								// PRIMERA CELDA
								var celda = $("<th>");
								celda.attr('scope', 'row').addClass('col-codigo').text(this.codigo);
								fila.append(celda);

								// SEGUNDA CELDA
								celda = $('<td>').addClass('col-descripcion').text(this.descripcion);
								fila.append(celda);

								// TERCERA CELDA
								celda = $('<td>');
								celda.attr('scope', 'row').addClass('col-existencias').text(this.stock);
								fila.append(celda);

								// CUARTA CELDA
								celda = $('<td>');
								celda.attr('scope', 'row').addClass('col-minimo').text(this.stock_minimo);
								fila.append(celda);

								// QUINTA CELDA
								celda = $('<td>');
								celda.attr('scope', 'row').addClass('col-faltan').text(this.faltan);
								fila.append(celda);

								// AGREGAR CELDAS
								tbody.append(fila);
							});
						},
						"json"
					);
				}
			});

			btnVolver();
		});
	});
}

function cargarFormularioFamilias() {
	tabla.fadeOut(function () {
		contenido.load("html/frmFamilias.html", null, function (response, status, request) {
			// MOSTRAR FORMULARIO
			contenido.fadeIn();

			//	CARGAR DATOS FAMILIAS
			$.get("php/getFamilias.php", null,
				function (json, textStatus, jqXHR) {
					$('#familias').empty();

					$.each(json, function (indexInArray, valueOfElement) {
						var option = $('<option>');
						option.val(this.familia);
						option.text(this.familia);
						$('#familias').append(option);
					});
				},
				"json"
			);

			$('#btnAgregarFamilia').click(function (e) { 
				e.preventDefault();

				var familia = $('#familia').val();
				var datos = "familia=" + familia;

				$.post("php/insertarFamilia.php", datos,
					function (json, textStatus, jqXHR) {
						if (json.resultado == 'ok') {
							msg(json.msg, 'azul');

							var option = $('<option>');
							option.val(familia);
							option.text(familia);
							$('#familias').append(option);
							$('#familia').val('');
						} else {
							msg(json.msg, 'rojo');
						}
					},
					"json"
				);
			});

			$('#btnBorrarFamilia').click(function (e) { 
				e.preventDefault();

				var datos = "";

				$('#familias option:selected').each(function (index, element) {
					datos += 'familia[]=' + element.value + "&";
				});

				datos = datos.substring(0, datos.length - 1);

				$.post("php/eliminarFamilia.php", datos,
					function (json, textStatus, jqXHR) {
						if (json.resultado == 'ok') {
							msg(json.msg, 'azul');

							$('#familias option:selected').remove();
						} else {
							msg(json.msg, 'rojo');
						}
					},
					"json"
				);
			});

			btnVolver();
		});
	});
}

function cargarFormularioProveedores() {
	tabla.fadeOut(function () {
		contenido.load("html/frmProveedores.html", null, function (response, status, request) {
			// MOSTRAR FORMULARIO
			contenido.fadeIn();

			// CARGAR DATOS PROVEEDORES
			$.get("php/getProveedores.php", null,
				function (json, textStatus, jqXHR) {
					$('#proveedores').empty();

					$.each(json, function (indexInArray, valueOfElement) {
						var option = $('<option>');
						option.val(this.descripcion);
						option.text(this.descripcion);
						$('#proveedores').append(option);
					});
				},
				"json"
			);

			$('#telefonoModalProveedor').change(function (e) {
				var telefono = $(this).val();
				var reg = /^[9|6|7]{1}([\d]{2}[-]*){3}[\d]{2}$/;

				if (!reg.test(telefono)) {
					$(this).val('');
					msg('Número de teléfono incorrecto', 'rojo')
				}
			});

			$('#btnAgregarProveedorModal').click(function (e) { 
				e.preventDefault();

				if (validarFormularioProveedor()) {
					var datos = $('form[name="formModalProveedor"]').serializeArray();

					$.post("php/insertarProveedor.php", datos,
						function (json, textStatus, jqXHR) {
							if (json.resultado = 'ok') {
								msg(json.msg, 'azul');

								var select = $('#proveedores')
								var option = $('<option>');
								option.val(datos[0].value);
								option.text(datos[1].value);
								select.append(option);
							}
							else {
								msg(json.msg, 'rojo');
							}

							return json;
						},
						"json"
					);
				} else {
					msg('Revise los campos', 'rojo');
				}
			});

			$('#btnBorrarProveedor').click(function (e) { 
				e.preventDefault();

				var datos = "";

				$('#proveedores').each(function (index, element) {
					// element == this
					datos += 'proveedores[]=' + element.value + "&";
				});

				datos = datos.substring(0, datos.length - 1);

				$.post("php/eliminarProveedor.php", datos,
					function (json, textStatus, jqXHR) {
						if (json.resultado == 'ok') {
							$('#proveedores option:selected').remove();
							msg(json.msg, 'azul');
						} else {
							msg(json.msg, 'rojo');
						}
					},
					"json"
				);
			});

			btnVolver();
		});
	});
}

function cargarFormularioPedido() {
	tabla.fadeOut(function () {
		contenido.load("html/frmPedido.html", null, function (response, status, request) {
			// MOSTRAR FORMULARIO
			contenido.fadeIn();
			btnVolver();

			var jsonHora = {
				locale: 'pt-br',
				mode: '24hr'
			};

			var fecha = new Date();
			var hoy = fecha.getDate() + '/' + (fecha.getMonth() + 1) + '/' + fecha.getFullYear();

			$('#fechaInicioPedido').datepicker({
				locale: 'es-es',
				format: 'dd/mm/yyyy',
				weekStartDay: 1,
				showOtherMonths: true,
				footer: false,
				modal: true,
				header: true,
				showOnFocus: true,
				showRightIcon: false,
				value: hoy,
				maxDate: function () {
					return $('#fechaFinPedido').val();
				}
			});
			$('#fechaFinPedido').datepicker({
				locale: 'es-es',
				format: 'dd/mm/yyyy',
				weekStartDay: 1,
				showOtherMonths: true,
				footer: false,
				modal: true,
				header: true,
				showOnFocus: true,
				showRightIcon: false,
				value: hoy,
				minDate: function () {
					return $('#fechaInicioPedido').val();
				}
			});

			$('#horaFin').timepicker(jsonHora);
			$('#horaInicio').timepicker(jsonHora);

			$('#btnConsultarPedido').click(function (e) {
				e.preventDefault();

				let fechaInicio = $('#fechaInicioPedido').val();
				let fechaFin = $('#fechaFinPedido').val();
				let horaInicio = $('#horaInicio').val();
				let horaFin = $('#horaFin').val();

				fechaInicio = formatoFecha(fechaInicio);
				fechaFin = formatoFecha(fechaFin);

				let datos = 'fechaInicio=' + fechaInicio + '&fechaFin=' + fechaFin + '&horaInicio=' + horaInicio + '&horaFin=' + horaFin;

				if ($('input[name=opcion]:checked').val() == 'producto') {
					$.post("php/consultarPedido.php", datos,
						function (json, textStatus, jqXHR) {
							let pedido = JSON.parse(json.json);
							let array = (pedido);

							$('#tablaPedido tbody').empty();

							$.each(pedido, function (indexInArray, valueOfElement) {
								$.each(this, function (indexInArray, valueOfElement) {
									agregarFilaPedido(this);
								});
								agregarSeparadorFilaPedido();
							});
				
						},
						"json"
					);
				} else {
					$.post("php/consultarPedidoPorDia.php", datos,
						function (json, textStatus, jqXHR) {
							let pedido = JSON.parse(json.json);
							let acumulado = 0;
				
							$('#tablaPedido tbody').empty();
							
							$.each(pedido, function (indexInArray, valueOfElement) {
								acumulado = acumulado + parseFloat(agregarFilaPedidoPorDia(this));
							});

							agregarFilaFinal(acumulado)

							console.log(acumulado);
				
						},
						"json"
					);
				}
				
				// MOSTRAR TABLA PRODUCTOS
				$('div.contenido-oculto').slideDown();
			});
		});
	});
}

function formatoFecha(fecha) {
	fecha = fecha.split('/');
	fecha = fecha.reverse();
	fecha = fecha.toString();
	fecha = fecha.replace(/,/g, "-");
	return fecha;
}

function cargarFormularioOferta(opciones) {
	tabla.fadeOut(function () {
		contenido.load("html/frmOferta.html", null, function (response, status, request) {
			// MOSTRAR FORMULARIO
			contenido.fadeIn();
			
			btnVolver();
		});
	});
}

function cargarFormularioProducto(opciones) {
	tabla.fadeOut(function () {
		contenido.load("html/frmProducto.html", null, function (response, status, request) {
			if (opciones == "consulta") {
				$('#v-pills-profile-tab').trigger('click');
			}

			// CREAR SPINNER INPUT NUMÉRICO
			$('#precioAgregar, #precioAgregarOferta, #precioConsultar, #precioModalProducto').inputSpinner();
			$('#stockAgregar, #stockMinAgregar, #stockConsultar, #stockMinConsultar, #stockModalProducto, #stockMinModalProducto').inputSpinner();

			// CARGAR DATOS SELECT
			//		FAMILIAS
			$.get("php/getFamilias.php", null,
				function (json, textStatus, jqXHR) {
					$('#familiaAgregar, #familiaConsultar, #familiaModalProducto').empty();

					$.each(json, function (indexInArray, valueOfElement) {
						var option = $('<option>');
						option.val(this.familia);
						option.text(this.familia);
						$('#familiaAgregar, #familiaConsultar, #familiaModalProducto').append(option);
					});
				},
				"json"
			);

			//		PROVEEDORES
			$.get("php/getProveedores.php", null,
				function (json, textStatus, jqXHR) {
					$('#proveedorAgregar, #proveedorConsultar, #proveedorModalProducto').empty();

					$.each(json, function (indexInArray, valueOfElement) {
						var option = $('<option>');
						option.val(this.descripcion);
						option.text(this.descripcion);
						$('#proveedorAgregar, #proveedorConsultar, #proveedorModalProducto').append(option);
					});
				},
				"json"
			);

			// MOSTRAR FORMULARIO
			contenido.fadeIn();
			btnVolver();

			// BOTÓN AGREGAR PRODUCTO
			$('#btnAgregarProducto').click(function (e) {
				e.preventDefault();

				// COMPROBAR SI EL FORMULARIO ES VÁLIDO
				if (validarFormularioProducto('Agregar')) {
					var datos = $('form[name="formAgregarProducto"]').serializeArray();
					
					datos[2].value = numerosDecimales(Numeros($('#precioAgregar').next().find('input').val()));

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

				var datos = $('form[name="formConsultarProducto"]').serializeArray();

				$.post("php/consultarProducto.php", datos,
					function (json, textStatus, jqXHR) {
						if (json.resultado == 'ok') {
							var productos = JSON.parse(json.json);

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
								var button = $(event.relatedTarget); // Button that triggered the modal
								var json = button.parents('tr').data('producto'); // Extract info from data-* attributes
								// If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
								// Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
								var modal = $(this);

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
										var datos = $('form[name="formModalProducto"]').serializeArray();
										datos[2].value = numerosDecimales(Numeros($('#precioModalProducto').next().find('input').val()));
					
										insertarProducto(datos);

										// ACTUALIZAR DATOS PRODUCTO EN FORMULARIO
										var jsonProducto = {
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
								var button = $(event.relatedTarget); // Button that triggered the modal
								var json = button.parents('tr').data('producto'); // Extract info from data-* attributes
								// If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
								// Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
								var modal = $(this);

								// BOTÓN ELIMINAR PRODUCTO
								$('#btnEliminarProducto').off('click');
								$('#btnEliminarProducto').on('click', function (e) {
									e.preventDefault();

									var datos = "codigo=" + json.codigo;

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
		});
	});
}

function menuContextualTablaConsultarProducto() {
	document.oncontextmenu = function(e) {
		e.preventDefault();
	}

	$.contextMenu({
		selector: '.menu-producto',
		callback: function (key, options, e) {
			var m = "clicked: " + key;
			//window.console && console.log(o) || alert(o);

			// FILA AFECTADA
			var fila = $(options.$trigger[0]);

			switch (key) {
				case 'delete':
					fila.find('.btn-danger').trigger('click');
					break;

				case 'ver':
					fila.find('a').trigger('click');
					break;

				case 'copy':
					fila.find('.col-codigo').select();
					document.execCommand("copy");
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
				name: "Cancelar", icon: function () {
					return 'context-menu-icon context-menu-icon-quit';
				}
			}
		}
	});
}

function insertarProducto(datos) {
	$.post("php/insertarProducto.php", datos,
		function (json, textStatus, jqXHR) {
			if (json.resultado = 'ok') {
				msg(json.msg, 'azul');
			}
			else {
				msg(json.msg, 'rojo');
			}

			return json;
		},
		"json"
	);
}

function agregarFilaPedidoPorDia(pedido) {
	let tbody = $('#tablaPedido tbody');
	let fila = $("<tr>");
	let total = numerosDecimales(pedido.total);

	fila.data('pedido', pedido);

	// PRIMERA CELDA
	let celda = $("<th>");
	celda.attr('scope', 'row').addClass('col-codigo').text(pedido.fecha);
	fila.append(celda);

	// SEGUNDA CELDA
	celda = $('<td>');
	celda.attr('scope', 'row').addClass('col-unidades').text(numerosDecimalesMostrar(total) + " €");
	fila.append(celda);

	// AGREGAR CELDAS
	tbody.append(fila);
	return total;
}

function agregarFilaFinal(acumulado) {
	let tbody = $('#tablaPedido tbody');
	let fila = $("<tr>");

	// PRIMERA CELDA
	let celda = $("<th>");
	celda.attr('scope', 'row').addClass('col-codigo').text("Total");
	fila.append(celda);

	// SEGUNDA CELDA
	celda = $('<td>');
	celda.attr('scope', 'row').addClass('col-unidades').text(acumulado.toFixed(2) + " €");
	fila.append(celda);

	// AGREGAR CELDAS
	tbody.append(fila);

}

function agregarSeparadorFilaPedido() {
	let tbody = $('#tablaPedido tbody');
	let fila = $("<tr>");

	fila.addClass('border-primary').css('border-style', 'solid');

	tbody.prepend(fila);
}

function agregarFilaPedido(pedido) {
	let tbody = $('#tablaPedido tbody');
	let fila = $("<tr>");

	fila.data('pedido', pedido);

	// PRIMERA CELDA
	let celda = $("<th>");
	celda.attr('scope', 'row').addClass('col-codigo').text('Pedido nº' + pedido.npedido);
	fila.append(celda);

	// SEGUNDA CELDA
	celda = $('<td>');
	let enlace = $('<a>').text(pedido.descripcion).attr({
		'href': '#'
	});

	celda.addClass('col-descripcion').append(enlace);
	fila.append(celda);

	// TERCERA CELDA
	celda = $('<td>');
	celda.attr('scope', 'row').addClass('col-unidades').text(pedido.unidades);
	fila.append(celda);

	// CUARTA CELDA
	celda = $('<td>');
	celda.attr('scope', 'row').addClass('col-precio').text(numerosDecimalesMostrar(numerosDecimales(pedido.precio)) + " €");
	fila.append(celda);

	// AGREGAR CELDAS
	tbody.prepend(fila);
}

function agregarFilaProducto(producto) {
	let tbody = $('#tablaProducto tbody');
	let fila = $("<tr>");
	fila.data('producto', producto).addClass('menu-producto');

	// PRIMERA CELDA
	let celda = $("<th>");
	celda.attr('scope', 'row').addClass('col-codigo').text(producto.codigo);
	fila.append(celda);

	// SEGUNDA CELDA
	celda = $('<td>');
	let enlace = $('<a>').text(producto.descripcion).attr({
		'href': '#'
	});

	celda.addClass('col-descripcion').append(enlace);
	fila.append(celda);

	// TERCERA CELDA
	celda = $('<td>');

	// GRUPO
	var buttonGroup = $('<div>').addClass('btn-group');

	// BOTÓN EDITAR/VISUALIZAR
	var boton = $('<button>').attr({
		type: 'button',
		'data-toggle': 'modal',
		'backdrop': "static",
		'data-target': '#modalProducto'
	}).addClass('btn btn-warning');

	enlace.click(function (e) { 
		e.preventDefault();

		$(this).parents('td').next().find('button:first').trigger('click');
	});

	var icono = $('<i>').addClass('far fa-eye');
	boton.append(icono);
	buttonGroup.append(boton);

	// BOTÓN ELIMINAR
	boton = $('<button>').attr({
		type: 'button',
		'data-toggle': 'modal', 
		'data-target': '#modalEliminarProducto'
	}).addClass('btn btn-danger btn-eliminar-producto');

	icono = $('<i>').addClass('fas fa-trash');
	boton.append(icono);
	buttonGroup.append(boton);
	celda.addClass('col-opciones').append(buttonGroup);
	fila.append(celda);

	// AGREGAR CELDAS
	tbody.append(fila);
}

function btnVolver() {
	$('.btn-volver').click(function (e) { 
		e.preventDefault();

		contenido.fadeOut(function () {
			tabla.fadeIn(function () {
				contenido.empty();
				setTimeout(() => {
					$('tbody:first th input').trigger('change').select();
				}, 500);
			});
		});
	});
}
/*
function validar() {
	var valido = true;

	// Fetch all the forms we want to apply custom Bootstrap validation styles to
	var forms = document.getElementsByName('formAgregarProducto');
	// Loop over them and prevent submission
	Array.prototype.filter.call(forms, function(form) {
		if (form.checkValidity() === false) {
			event.preventDefault();
			event.stopPropagation();
			valido = false;
		}
		form.classList.add('was-validated');
	});

	return valido;
}
*/

function validarFormularioProveedor() {
	var valido = true;

	var descripcion = $('#descripcionModalProveedor');

	descripcion.keyup(function (e) { 
		if ($(this).val() != '') {
			$(this).addClass('is-valid').removeClass('is-invalid');
			descripcion.next().next().text('Rellene este campo');

			$('#proveedores option').each(function (index, element) {
				if ($(this).text().toLowerCase() == descripcion.val().toLowerCase()) {
					descripcion.addClass('is-invalid').removeClass('is-valid');
					descripcion.next().next().text('El proveedor ya existe');
				}
			});
		} else {
			$(this).addClass('is-invalid').removeClass('is-valid');
			valido = false;
		}
	}).trigger('keyup');

	var direccion = $('#direccionModalProveedor').addClass('is-valid');
	direccion.keyup(function (e) { 
		if ($(this).val() != '') {
			$(this).addClass('is-valid').removeClass('is-invalid');
		} else {
			$(this).addClass('is-invalid').removeClass('is-valid');
			valido = false;
		}
	}).trigger('keyup');

	var telefono = $('#telefonoModalProveedor').addClass('is-valid');
	var eReg = /^[9|6|7]{1}([\d]{2}[-]*){3}[\d]{2}$/;

	telefono.keyup(function (e) { 
		if (eReg.test(telefono.val())) {
			$(this).addClass('is-valid').removeClass('is-invalid');
		} else {
			$(this).addClass('is-invalid').removeClass('is-valid');
			valido = false;
		}
	}).trigger('keyup');

	return valido;
}

function validarFormularioProducto(clase) {
	var valido = true;

	// CAMPO CÓDIGO
	var codigo = $('#codigo' + clase);
	var reg = /^[0-9]+$/;

	codigo.keyup(function (e) { 
		if (reg.test(codigo.val())) {
			codigo.addClass('is-valid').removeClass('is-invalid');
		} else {
			codigo.addClass('is-invalid').removeClass('is-valid');
			valido = false;
		}
	}).trigger('keyup');

	var descripcion = $('#descripcion' + clase);

	descripcion.keyup(function (e) { 
		if ($(this).val() != '') {
			$(this).addClass('is-valid').removeClass('is-invalid');
		} else {
			$(this).addClass('is-invalid').removeClass('is-valid');
			valido = false;
		}
	}).trigger('keyup');

	var precio = $('#precio' + clase).addClass('is-valid');
	var iva = $('#iva' + clase).addClass('is-valid');
	var familia = $('#familia' + clase).addClass('is-valid');
	var proveedor = $('#proveedor' + clase).addClass('is-valid');
	var stock = $('#stock' + clase).addClass('is-valid');
	var stockMin = $('#stockMin' + clase).addClass('is-valid');

	return valido;
}

function limpiarFormularioProducto(clase) {
	var codigo = $('#codigo' + clase);
	codigo.removeClass('is-valid is-invalid').val('');

	var descripcion = $('#descripcion' + clase);
	descripcion.removeClass('is-valid is-invalid').val('');

	var precio = $('#precio' + clase);
	precio.removeClass('is-valid is-invalid').val(0);

	var iva = $('#iva' + clase);
	iva.removeClass('is-valid is-invalid').prop('selectedIndex', 0);

	var familia = $('#familia' + clase);
	familia.removeClass('is-valid is-invalid').prop('selectedIndex', 0);

	var proveedor = $('#proveedor' + clase);
	proveedor.removeClass('is-valid is-invalid').prop('selectedIndex', 0);

	var stock = $('#stock' + clase);
	stock.removeClass('is-valid is-invalid').val(0);

	var stockMin = $('#stockMin' + clase);
	stockMin.removeClass('is-valid is-invalid').val(0);
}