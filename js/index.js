
var contador = 1;
$(function () {
	var tabla = $('#tabla');
	var thead = tabla.find('thead');
	var tbody = tabla.find('tbody:first');
	var productos;

	// $('#qrCanvas').WebCodeCam();

	$.post("php/getProductos.php", null,
		function (json, textStatus, jqXHR) {
			productos = json;
			console.log('productos '+json);

			// AUTOCOMPLETAR
			autocomplete(document.querySelector('tbody th input'), json);
		},
		"json"
	);

	// EVENTOS PARA NAVEGAR POR LA TABLA
	eventoCeldas();
	limpiarTabla();

	// MENU CONTEXTUAL
	menuContextualTablaPedidos();

	// SCRIPT PARA EL MENÚ
	$.getScript("js/menu.js");

	$('html').keydown(function (e) {
		consola('keyCode: ' + e.keyCode);
		// FLECHA ABAJO
		if (e.keyCode == 40) {
			// COMPRUEBA LAS FILAS VACIAS

			var filaActual = $('input:focus').parents('tr');
			var ultimaFila = tbody.find('tr:last');

			if (filaActual.is(ultimaFila)) {
				agregarFila();
				
				// PONER EL FOCO EN EL CAMPO CÓDIGO
				tbody.find('tr:last input:first').focus();
			}

			// LOCALIZAR CELDA DE ABAJO
			localizarCeldaVertical('abajo');
		}
		// FLECHA DERECHA
		else if (e.keyCode == 39) {
			localizarCeldaHorizontal('derecha', e.target);
		}
		// FLECHA ARRIBA
		else if(e.keyCode == 38) {
			// COMPRUEBA SI EXISTE MÁS DE UNA FILA
			if (tbody.find('tr').length > 1) {
				// COMPRUEBA LAS FILAS VACIAS
				if (tbody.find('tr:last input').val() == "") {
					eliminarFila();
				}
				else {
					// LOCALIZAR CELDA DE ARRIBA
					localizarCeldaVertical('arriba');
				}
			}
		}
		// FLECHA IZQUIERDA
		else if (e.keyCode == 37) {
			localizarCeldaHorizontal('izquierda', e.target);
		}
		// BOTÓN INSERTAR
		else if (e.keyCode == 45) {
			$('#btnAceptarPedido').trigger('click');
		}
		// BOTÓN ESCAPE
		else if (e.keyCode == 27) {
			$('#btnCancelarPedido').trigger('click');
		}
	});
/*
	$('#btnTicket').click(function (e) {
		e.preventDefault();

		actualizarTicket();
	});
*/
	$('#btnAceptarTicket').click(function (e) {
		e.preventDefault();

		actualizarTicket();
	});

	$('#btnCancelarPedido').click(function (e) {
		e.preventDefault();

		$('tbody:first tr:not(tr:first)').remove();
		$('tbody:first tr:first input').val('');
		$('tbody:first tr:first td.col-descripcion').text('');
		actualizarTotal();
		$('tbody:first th input').select();
		reiniciarContador();
	});

	// EVENTO MOSTRAR MODAL CAMBIO
	$('#modalCambio').on('shown.bs.modal', function (event) {
		$('#entregaModalCambio').focus();
	});

	// EVENTO OCULTAR MODAL CAMBIO
	$('#modalCambio').on('show.bs.modal', function (event) {
		$('#modalCambio input').val('');
	});

	// EVENTO PARA MOSTRAR EL CAMBIO
	$('#entregaModalCambio').keyup(function (e) {
		// TECLA INTRO PRESIONADA
		if (e.keyCode == 13) {
			$('#btnAceptarCambio').trigger('click');
		}
		else {
			let entrega = $(this);
			let cambio = $('#cambioModalCambio');
	
			let valor = Numeros(entrega.val());
			let total = Numeros($('#total').val());
			let aDevolver = numerosDecimales(valor - total);
	
			// COMPROBAR QUE LA CANTIDAD INSERTADA SUPERA EL TOTAL A PAGAR
			if (parseFloat(valor) >= parseFloat(total)) {
				entrega.val(numerosDecimalesMostrar(valor));
				cambio.val(numerosDecimalesMostrar(aDevolver));
			}
			else {
				cambio.val('');
			}
		}
	});

	// EVENTO ACEPTAR CAMBIO
	$('#btnAceptarCambio').click(function (e) { 
		e.preventDefault();

		var valor = Numeros($('#entregaModalCambio').val());
		var total = Numeros($('#total').val());

		// COMPROBAR QUE LA CANTIDAD INSERTADA SUPERA EL TOTAL A PAGAR
		if (parseFloat(valor) >= parseFloat(total)) {

			insertarPedido();
		}
		else {
			msg('Faltan ' + Math.abs(valor - total).toFixed(2) + ' €', 'rojo');
		}
	});

	function insertarPedido() {
		var datos = '';

		$('tbody:first tr').each(function (index, element) {
			var fila = $(this);
			var codigo = fila.find('th input').val();
			var unidades = fila.find('td.col-unidades input').val();
			var precio = fila.find('td.col-precio input').val();

			if (codigo != '' || unidades != '' || precio != '') {
				datos += 'codigo[]=' + codigo + '&unidades[]=' + unidades + "&precio[]=" + precio + "&";
			}
		});

		datos = datos.substring(0, datos.length - 1);

		if (datos != '') {
			$.post("php/insertarPedido.php", datos,
				function (json, textStatus, jqXHR) {
					if (json.resultado == 'ok') {
						// msg(json.msg, 'azul');
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

	function borrarFilasVacias() {
		tbody.find('tr:not(:first)').each(function (index, element) {
			// element == this
			let fila = $(this);
			if (fila.find('input').val() == '') {
				fila.remove();
			}
		});

		$('tbody:first tr:last').focus();
	}

	function menuContextualTablaPedidos() {
		document.oncontextmenu = function(e) {
			e.preventDefault();
		}

		$.contextMenu({
			selector: '.context-menu-one',
			build: function($trigger, e) {
				var disabledDelete = false;
				var disabledEdit = false;

				if ($('#tabla tbody:first tr').length == 1) {
					disabledDelete = true;
				}

				if ($($trigger[0]).find('th input').val() == '') {
					disabledEdit = true;
				}

				return {
					callback: function (key, options, e) {
						var m = "clicked: " + key;
						//window.console && console.log(o) || alert(o);

						// FILA AFECTADA
						var fila = $(options.$trigger[0]);

						switch (key) {
							case 'delete':
								fila.remove();
								actualizarTotal();
								contador--;
								actualizarContador();
								/*$(options.$trigger[0]).fadeOut(500, function () {
									$(this).remove();
								});*/
								break;
	
							case 'limpiar':
								fila.find('input').val('');
								fila.find('.col-descripcion').text('');
								actualizarTotal();
								break;

							case 'add':
								agregarFila();
								break;

							case 'copy':
								fila.find('th input').select();
								document.execCommand('copy');
								break;

							case 'paste':
								fila.find('th.col-codigo input').focus().select();
								document.execCommand('paste');
								break;

							case 'edit':
								var codigo = fila.find('th input').val();

								$('#btnConsultarProducto').trigger('click');

								// ABRIR CONSULTAR PRODUCTO
								setTimeout(() => {
									$('#codigoConsultar').val(codigo);

									$('#btnBuscarProducto').trigger('click');

									setTimeout(() => {
										$('.btn-warning').trigger('click');
									}, 500);
								}, 1000);

								// consola(codigo);
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
							name: "Cancelar", icon: function () {
								return 'context-menu-icon context-menu-icon-quit';
							}
						}
					}
				};
			}
		});
	}

	function agregarFila() {
		contador++;
		var fila = $("<tr>");
		fila.addClass('context-menu-one');

		// PRIMERA CELDA
		var celda = $("<th>");
		celda.attr('scope', 'row').addClass('col-codigo');
		var input = $('<input>');
		input.attr({type: 'text', id: contador}).addClass('form-control');
		celda.append(input);
		celda.focus();
		fila.append(celda);

		// AUTOCOMPLETAR
		$.post("php/getProductos.php", null,
			function (json, textStatus, jqXHR) {
				productos = json;
				console.log('productos '+input);

				// AUTOCOMPLETAR
				autocomplete(input[0], json);
			},
			"json"
		);

		// SEGUNDA CELDA
		celda = $('<td>');
		celda.addClass('col-descripcion');
		fila.append(celda);

		// TERCERA CELDA
		celda = $('<td>');
		celda.addClass('col-unidades');
		input = $('<input>');
		input.attr({type: 'text', id: contador}).addClass('form-control');
		celda.append(input);
		fila.append(celda);

		// CUARTA CELDA
		celda = $('<td>');
		celda.addClass('col-precio');
		input = $('<input>');
		input.attr({type: 'text', id: contador}).addClass('form-control');
		celda.append(input);

		// AGREGAR CELDAS
		fila.append(celda);
		tbody.append(fila);

		// EVENTOS CELDAS
		eventoCeldas();
		actualizarContador();
	}

	function eliminarFila() {
		contador--;
		// LOCALIZAR CELDA DE ARRIBA
		localizarCeldaVertical('arriba');

		// BORRAR FILA
		tbody.find('tr:last').remove();
		actualizarContador();
	}

	function localizarCeldaVertical(direccion) {
		// LOCALIZAR CELDA
		let filaActual = $('input:focus').parents('tr');
		let celdaActual = $('input:focus').parent();
		let celdaAux;

		if (direccion == 'arriba') {
			celdaAux = filaActual.prev().find('.' + celdaActual.attr('class'));
		}
		else {
			celdaAux = filaActual.next().find('.' + celdaActual.attr('class'));
//			celdaAux = filaActual.next().find('.col-codigo');
		}

		// ASIGNAR FOCO
		setTimeout(function () {
			celdaAux.find('input').focus().select();
		}, 10);
	}

	function localizarCeldaHorizontal(direccion, target) {
		var i;
		var inputs = $('#tabla tbody:first input');

		// BUSCAR INDEX
		inputs.each(function (index, element) {
			if ($(this).is(target)) {
				i = parseInt(index);
			}
		});

		if (direccion == 'derecha') {
			i++;

			if (i == inputs.length) {
				i = 0;
			}
		}
		else {
			i = i - 1;

			if (i == -1) {
				i = inputs.length - 1;
			}
		}

		// ASIGNAR FOCO
		setTimeout(function () {
			inputs.get(i).focus();
			inputs.get(i).select();
		}, 10);
	}

	// BORRAR LOADER
	$('body').removeClass('overflow-hidden');
	$('#loader').remove();

	// BOTÓN TOTOP
	$('#toTop').click(function (e) { 
		e.preventDefault();

		$('html').animate({
			scrollTop: 0
		}, 800);

		$('#btnCalc').animate({right: '4em'});
	});

	$(window).scroll(function () {
		if ($('body').scrollTop() > 20 || $('html').scrollTop() > 20) {
			$('#toTop').fadeIn(500, function () {
				$('#btnCalc, #btnAddRow').animate({right: '4em'});
			});
		}
		else {
			$('#toTop').fadeOut(500, function () {
				$('#btnCalc, #btnAddRow').animate({right: '1em'});
			});
		}
	});

	$('#btnAddRow').click(function (e) { 
		e.preventDefault();

		agregarFila();
	});

	
});

function Numeros(string) {//Solo numeros
	var out = '';
	var filtro = '1234567890.,';//Caracteres validos
	
	//Recorrer el texto y verificar si el caracter se encuentra en la lista de validos 
	for (var i=0; i < string.length; i++) {
		if (filtro.indexOf(string.charAt(i)) != -1) {
			//Se añaden a la salida los caracteres validos
			out += string.charAt(i);
		}
	}

	//Retornar valor filtrado
	return out.split(",").join(".");
}

function limpiarTabla() {
	$('tbody:first tr:not(tr:last)').remove();
	$('tbody input').val('');
	$('tbody:first td.col-descripcion').text('');

	setTimeout(() => {
		$('tbody:first input:first').focus();
	}, 500);

	reiniciarContador();
}

function actualizarContador() {
	$('thead:first th:first').text(contador);
}

function reiniciarContador() {
	contador = 1;
	actualizarContador();
}

function eventoCeldas() {
	// EVENTO CELDA CÓDIGO
	$('tbody:first th input:not([evento=true])').each(function (index, element) {
		// element == this
		
		var celda = $(this);
		var fila = celda.parents('tr');
		
		$(this).change(function (e) {
			e.preventDefault();

			var codigo = $(this).val();

			if (!codigo == '') {
				var datos = "codigo=" + codigo;
				var estaEnTabla = false;
				var celdaUnidades;

				// COMPRUEBA SI EL PRODUCTO YA ESTÁ EN LA TABLA
				$('tbody:first tr').each(function (index, element) {
					if (codigo == $(this).find('.col-codigo input').val() && !fila.is($(this)) && parseInt(codigo) > 5) {
						celdaUnidades = $(this).find('.col-unidades input');
						estaEnTabla = true;
					}
				});

				if (estaEnTabla) {
					celdaUnidades.val(parseInt(celdaUnidades.val()) + 1);
					$(this).val("");

					actualizarTotal();
				}
				else if (isNaN(parseInt(codigo))) {
					
				} else {
					$.post("php/consultarProducto.php", datos,
						function (json, textStatus, jqXHR) {
							if (json.resultado == 'ok') {
								var producto = JSON.parse(json.json)[0];

								if (producto != undefined) {
									fila.find('.col-descripcion').text(producto.descripcion);

									if (fila.find('.col-unidades input').val() == '') {
										fila.find('.col-unidades input').val('1').focus().select();
									}

									if (parseInt(codigo) < 5) {
										if (fila.find('.col-precio input').val() === "") {
											fila.find('.col-precio input').val(numerosDecimales(0)).focus().select();
										}
									}
									else {
										fila.find('.col-precio input').val(numerosDecimales(producto.precio));
									}

									actualizarTotal();
								}
								else {
									// msg('El producto no existe', 'rojo');
									// SI EL PRODUCTO NO EXISTE, MOSTRAR OPCION DE AGREGARLO
									fila.find('.col-descripcion').text('');
									fila.find('.col-precio input').val(0);
									fila.find('.col-unidades input').val('1');
									actualizarTotal();

									$('#modalAgregarProducto').modal('show');

									$('#modalAgregarProducto button.btn-success').off('click');
									$('#modalAgregarProducto button.btn-success').on('click', function (e) {
										$('#btnInsertarProducto').trigger('click');

										var codigo = fila.find('.col-codigo input').val();
										var precio = fila.find('.col-precio input').val();

										setTimeout(() => {
											$('#codigoAgregar').val(codigo);
											$('#precioAgregar').val(precio);
											$('#descripcionAgregar').focus();
										}, 1000);
									});

									$('#modalAgregarProducto button.btn-danger').off('click');
									$('#modalAgregarProducto button.btn-danger').on('click', function (e) {
										fila.find('input').val('');
										fila.find('.col-descripcion').text('');
										actualizarTotal();
									});
								}
							} else {
								msg(json.msg, 'rojo');
							}
						},
						"json"
					);
				}
			}
			else {
				fila.find('.col-descripcion').text('');
				fila.find('.col-precio input').val(numerosDecimales(0));
				fila.find('.col-unidades input').val(1);

				actualizarTotal();
			}
		}).attr('evento', true);
	});

	// EVENTO CELDA UNIDADES
	$('tbody:first td:nth-child(3) input:not([evento=true])').each(function (index, element) {
		// element == this

		$(this).change(function (e) {
			e.preventDefault();

			// consola('EVENTO CELDA UNIDADES');
			var celdaCodigo = $(this).parents('tr').find('th input');
			$(this).val(parseInt($(this).val()));

			if (isNaN($(this).val())) {
				$(this).val('1');
			}

			actualizarTotal();
		}).attr('evento', true);
	});

	// EVENTO CELDA PRECIO
	$('tbody:first td:last input:not([evento=true])').each(function (index, element) {
		// element == this

		$(this).change(function (e) {
			e.preventDefault();

			// consola('EVENTO CELDA PRECIO');

			// ACTUALIZAR PRECIO AL MODIFICARLO EN LA TABLA
			var celda = $(this);
			var fila = celda.parents('tr');
			var codigo = fila.find('.col-codigo input').val();
			var precio = fila.find('.col-precio input').val();

			var datos = 'codigo=' + codigo + '&precio=' + numerosDecimales(precio);

			if (parseInt(codigo) > 5) {
				$.post("php/actualizarPrecio.php", datos,
					function (json, textStatus, jqXHR) {
						if (json.resultado == 'ok') {
							msg(json.msg, 'azul');
						} else {
							msg(json.msg, 'rojo');
						}
					},
				"json"
				);
			}

			actualizarTotal();
			// PRECIO CON DOS DECIMALES
			if (isNaN(numerosDecimales(celda.val()))) {
				celda.val('0.00');
			}
			else {
				celda.val(numerosDecimales(celda.val()));
			}
		}).attr('evento', true);
	});

	// EVENTO CLICK SOBRE INPUT
	$('tbody input').click(function (e) { 
		e.preventDefault();

		$(this).select();
	});

	$.post("php/getProductos.php", null,
		function (json, textStatus, jqXHR) {
			productos = json;
			console.log('productos '+json);

			// AUTOCOMPLETAR
			autocomplete(document.querySelector('tbody tr:last-child th input'), json);
		},
		"json"
	);
}

function actualizarTotal() {
	var unidades = $('.col-unidades input');
	var precio = $('.col-precio input');
	var total = 0;

	for (let i = 0; i < unidades.length; i++) {
		total += precio[i].value * unidades[i].value;
	}

	if (isNaN(numerosDecimales(total))) {
		total = 0;
	}

	$('#total').val(numerosDecimales(total));
}

function actualizarTicket() {
	var href = "php/ticket.php?";

	let nombre = $('#modalNombre').val();
	let telefono = $('#modalTelefono').val();

	href += 'nombre=' + nombre +'&';
	href += 'telefono=' + telefono +'&';

	$('tbody:first tr').each(function (index, element) {
		if ($(this).find('input').val() != '' && $(this).text() != '') {

			var descripcion = $(this).find('td.col-descripcion').text();
			var unidades = $(this).find('td.col-unidades input').val();
			var precio = $(this).find('td.col-precio input').val();
			var total = precio * unidades;

			href += 'unidades[]=' + unidades + "&";
			href += 'descripcion[]=' + descripcion + "&";
			href += 'precio[]=' + precio + "&";
			href += 'total[]=' + total + "&";
		}
	});

	href = href.substring(0, href.length - 1);
	var ventana = window.open(href, '_blank');

	$('#myModal').modal('hide');
	$('#modalNombre').val('');
	$('#modalTelefono').val('');
	$('#btnAceptarPedido').trigger('click');

	ventana.print();

	if ('matchMedia' in window) {
		window.matchMedia('print').addEventListener(function (media) {
			ventana.close();
			// consola(media);
		});
	} else {
		ventana.onbeforeprint = function() {
			ventana.close();
		}
	}
}

function numerosDecimales(valor) {
	return Number.parseFloat(valor).toFixed(2);
}

function numerosDecimalesMostrar(valor) {
	return valor.split(".").join(",");
}

function ocultarAlert() {
	$('.alert').css('transform', '');
	$('.alert').fadeOut(200, function () {
		$('.alert').remove();
	});
}

function msg(txt, color, opcion) {
	ocultarAlert();

	var clase = "";

	switch (color) {
		case 'verde':
			clase = "alert-success";
			break;

		case 'rojo':
			clase = "alert-danger";
			break;

		case 'azul':
			clase = "alert-primary";
			break;

		case 'cyan':
			clase = "alert-info";
			break;

		case 'amarillo':
			clase = "alert-warning";
			break;

		case 'naranja':
			clase = "alert-naranja";
			break;

		case 'morado':
			clase = "alert-morado";
			break;

		case 'rosa':
			clase = "alert-rosa";
			break;

		case 'marron':
			clase = "alert-marron";
			break;

		default:
			clase = "alert-success";
			break;
	}

	setTimeout(() => {
		var alert = $('<div>');
		var texto = $('<strong>');
		texto.text(txt);
		var boton = $('<button type="button" class="close">');
		boton.append('<i class="fas fa-times negro">');

		alert.addClass('alert '+clase+ ' shadow');
		alert.append(texto);
		alert.css('z-index', 2000);

		$('body').append(alert);
		alert.append(boton);

		$('.alert').css('transform', 'translateY(10em)');
		$('.alert').hide();
		$('.alert').fadeIn();

		if (opcion == 'pregunta') {
			var hr = $('<hr>');
			var icono = $('<i>');
			icono.addClass('fa fa-check');
			boton = $('<button>');
			boton.addClass('btn btn-success mr-1').append(icono).click(function (e) { 
				e.preventDefault();

				return true;
			});

			alert.append(hr);
			alert.append(boton);

			icono = $('<i>');
			icono.addClass('fa fa-times');
			boton = $('<button>');
			boton.addClass('btn btn-danger').append(icono).click(function (e) { 
				e.preventDefault();

				return false;
			});

			alert.append(boton);
		}
		else {
			var timeOut = setTimeout(() => {
				$('.alert').css('transform', '');
				$('.alert').fadeOut();
			}, 2500);
		}

/*
		var timeOut = setTimeout(() => {
			$('.alert').css('transform', '');
			$('.alert').fadeOut();
		}, 2500);
*/
		$('.close').click(function (e) {
			e.preventDefault();
	
			$('.alert').css('transform', '');
			$('.alert').fadeOut();
			clearTimeout(timeOut);
		});

	}, 500);
}

function filtro(selectorInput, selectorContenido) {
	$(selectorInput).on("keyup", function() {
		var value = $(this).val().toLowerCase();
		$(selectorContenido).filter(function() {
			$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
		});
	});
}

function consola(txt) {
	console.log(txt);
}