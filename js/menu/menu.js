const CONTENIDO = $('#contenidoFormularios');
CONTENIDO.hide();

$('#btnInsertarProducto').click((e) => {
	e.preventDefault();

	// MOSTRAR Y CARGAR EL FORMULARIO PRODUCTOS
	cargarFormulario("html/frmProducto.html", cargarFormularioProducto); // Cargar formulario
});

$('#btnConsultarProducto').click((e) => { 
	e.preventDefault();

	cargarFormulario("html/frmProducto.html", cargarFormularioProducto); // Cargar formulario
});

$.getScript("js/forms/formularioProducto.js");

$('#btnOferta').click((e) => { 
	e.preventDefault();

	cargarFormularioOferta();
});

// Formulario Pedidos
$('#btnPedidos').click((e) => { 
	e.preventDefault();

	cargarFormulario("html/frmPedido.html", cargarFormularioPedido); // Cargar formulario
});

// Script cargarFormularioPedido
$.getScript("js/forms/formularioPedidos.js");

// Formulario proveedores
$('#btnProveedores').click((e) => { 
	e.preventDefault();

	cargarFormulario("html/frmProveedores.html", cargarFormularioProveedores); // Cargar formulario
});

// Script cargarFormularioProveedores
$.getScript("js/forms/formularioProveedores.js");

$('#btnFamilias').click((e) => {
	e.preventDefault();
	
	cargarFormulario("html/frmFamilias.html", cargarFormularioFamilias); // Cargar formulario
});

// Formulario familias
$.getScript("js/forms/formularioFamilias.js");

$('#btnExistencias').click((e) => {
	e.preventDefault();
	
	cargarFormulario("html/frmExistencias.html", cargarFormularioExistencias); // Cargar formulario
});

// Script cargarFormularioExistencias
$.getScript("js/forms/formularioExistencias.js");

$('#btnSalir').click((e) => { 
	e.preventDefault();

	close();
});

$('#btnQr').click(function (e) { 
	e.preventDefault();

	$('.barcodelector').slideToggle();
});

// Script calculadora
$.getScript("js/calculadora/calculadora.js");

//	Cargar datos familias
function getFamilias(selector) {
	$.get("php/getFamilias.php", null,
		(json) => {
			$('#familias').empty();

			$.each(json, (_index, element) => {
				let option = $('<option>');
				let familia = element.familia;

				option.val(familia);
				option.text(familia);
				$(selector).append(option);
			});
		},
		"json"
	);
}

function getProveedores(selector) {
	$.get("php/getProveedores.php", null,
		(json) => {
			$(selector).empty(); // Vaciar el input select

			$.each(json, (_index, proveedor) => {
				let option = $('<option>');
				option.val(proveedor.descripcion);
				option.text(proveedor.descripcion);
				$(selector).append(option);
			});
		},
		"json"
	);
}

function cargarFormularioOferta(opciones) {
	TABLA.fadeOut(function () {
		CONTENIDO.load("html/frmOferta.html", null, function (response, status, request) {
			// MOSTRAR FORMULARIO
			CONTENIDO.fadeIn();
			
			btnVolver();
		});
	});
}

function cargarFormulario(url, callback) {
	TABLA.fadeOut(() => { // Ocultar tabla
		CONTENIDO.load(url, null , () => { // Cargar formulario
			CONTENIDO.fadeIn(); // Mostrar formulario

			callback(); // Llamar a la función
			btnVolver();
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
			let m = "clicked: " + key;
			//window.console && console.log(o) || alert(o);

			// FILA AFECTADA
			let fila = $(options.$trigger[0]);

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
	let buttonGroup = $('<div>').addClass('btn-group');

	// BOTÓN EDITAR/VISUALIZAR
	let boton = $('<button>').attr({
		type: 'button',
		'data-toggle': 'modal',
		'backdrop': "static",
		'data-target': '#modalProducto'
	}).addClass('btn btn-warning');

	enlace.click(function (e) { 
		e.preventDefault();

		$(this).parents('td').next().find('button:first').trigger('click');
	});

	let icono = $('<i>').addClass('far fa-eye');
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
	$('.btn-volver').click((e) => { 
		e.preventDefault();

		ocultarContenidoFormularios();
	});
}

function ocultarContenidoFormularios() {
	CONTENIDO.fadeOut(() => {
		TABLA.fadeIn(() => {
			CONTENIDO.empty();
			setTimeout(() => {
				TBODY.find('th input').trigger('change').select();
			}, 500);
		});
	});
}

// Validaciones

function campoValido(input) {
	input.addClass('is-valid').removeClass('is-invalid');
	return true;
}

function campoNoValido(input) {
	input.addClass('is-invalid').removeClass('is-valid');
	return false;
}

function validarInputVacio(input) { // Validar campo vacío
	if (input.val() != '') {
		return campoValido(input); // return true
	} else {
		return campoNoValido(input); // return false
	}
}

function validarInputExReg(input, eReg) { // Validar campo mediante expresión regular
	if (eReg.test(input.val())) {
		return campoValido(input); // return true
	} else {
		return campoNoValido(input); // return false
	}
}

function filtro(selectorInput, selectorContenido) {
	$(selectorInput).on("keyup", function() {
		let value = $(this).val().toLowerCase();
		$(selectorContenido).filter(function() {
			$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
		});
	});
}