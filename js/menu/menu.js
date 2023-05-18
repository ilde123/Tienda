const CONTENIDO = $('#contenidoFormularios');

const FORM_PROVEEDORES = "html/frmProveedores.html";
const JS_PROVEEDORES = "js/forms/formularioProveedores.js";

const FORM_FAMILIAS = "html/frmFamilias.html";
const JS_FAMILIAS = "js/forms/formularioFamilias.js";

const FORM_PRODUCTO = "html/frmProducto.html";
const JS_PRODUCTO = "js/forms/formularioProducto.js";

const FORM_PEDIDO = "html/frmPedido.html";
const JS_PEDIDO = "js/forms/formularioPedidos.js";

const FORM_EXISTENCIAS = "html/frmExistencias.html";
const JS_EXISTENCIAS = "js/forms/formularioExistencias.js";

const FORM_CONFIGURACION = "html/frmConfiguracion.html";
const JS_CONFIGURACION = "js/forms/formularioConfiguracion.js";

CONTENIDO.hide();

// Formulario proveedores
$('#btnProveedores').click((e) => { 
	e.preventDefault();

	cargarFormulario(FORM_PROVEEDORES, cargarFormularioProveedores); // Cargar formulario
});

// Script cargarFormularioProveedores
$.getScript(JS_PROVEEDORES);

$('#btnFamilias').click((e) => {
	e.preventDefault();

	cargarFormulario(FORM_FAMILIAS, cargarFormularioFamilias); // Cargar formulario
});

// Formulario familias
$.getScript(JS_FAMILIAS);

$('#btnInsertarProducto').click((e) => {
	e.preventDefault();

	// MOSTRAR Y CARGAR EL FORMULARIO PRODUCTOS
	cargarFormulario(FORM_PRODUCTO, cargarFormularioProducto); // Cargar formulario
});

$('#btnConsultarProducto').click((e) => { 
	e.preventDefault();

	cargarFormulario(FORM_PRODUCTO, cargarFormularioProducto, 'consulta'); // Cargar formulario
});

$.getScript(JS_PRODUCTO);

$('#btnOferta').click((e) => { 
	e.preventDefault();

	cargarFormularioOferta();
});

$('#btnConfiguración').click((e) => { 
	e.preventDefault();

	cargarFormulario(FORM_CONFIGURACION, cargarFormularioConfiguracion);
});

$.getScript(JS_CONFIGURACION);

// Formulario Pedidos
$('#btnPedidos').click((e) => { 
	e.preventDefault();

	cargarFormulario(FORM_PEDIDO, cargarFormularioPedido); // Cargar formulario
});

// Script cargarFormularioPedido
$.getScript(JS_PEDIDO);

$('#btnExistencias').click((e) => {
	e.preventDefault();

	cargarFormulario(FORM_EXISTENCIAS, cargarFormularioExistencias); // Cargar formulario
});

// Script cargarFormularioExistencias
$.getScript(JS_EXISTENCIAS);

$('#btnSalir').click((e) => { 
	e.preventDefault();

	close(); // Cerrar navegador
});

$.getScript('js/menu/submenu.js');

$('#btnQr').click(function (e) { 
	e.preventDefault();

	$('.barcodelector').slideToggle();
});

// Script calculadora
$.getScript("js/calculadora/calculadora.js");

function cargarFormularioOferta() {
	TABLA.fadeOut(() => {
		CONTENIDO.load("html/frmOferta.html", null, () => {
			// MOSTRAR FORMULARIO
			CONTENIDO.fadeIn();

			btnVolver();
		});
	});
}

function cargarFormulario(url, callback, datos) {
	TABLA.fadeOut(() => { // Ocultar tabla
		CONTENIDO.load(url, null , () => { // Cargar formulario
			CONTENIDO.fadeIn(); // Mostrar formulario
			$('#botonBurger').click(); // Ocultar menú versión móvil

			callback(datos); // Llamar a la función
			btnVolver();
		});
	});
}

function mostrarTablaFormulario() {
	$('div.contenido-oculto').slideDown();
}

function ocultarTablaFormulario() {
	$('div.contenido-oculto').slideUp();
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
				TBODY.find('th input').change().select();
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