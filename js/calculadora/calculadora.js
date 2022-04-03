// Botón calculadora menú
$('#btnCalculadora').click((e) => {
	e.preventDefault();

	// Crear modal calculadora
	$('#modalCalculadora').modal({
		backdrop: false // Fondo oscuro
	});

	// Botón mostrar/ocultar calculadora
	$('#btnCalc').fadeOut();
});

// Botón minimizar calculadora
$('button.close:nth-child(3)').click((e) => {
	e.preventDefault();

	// Botón mostrar/ocultar calculadora
	$('#btnCalc').fadeIn();
});

// Botón mostrar/ocultar calculadora
$('#btnCalc').click(function (e) { 
	e.preventDefault();

	$('#modalCalculadora').modal("show"); // Mostrar modal
	$(this).fadeOut(); // Ocultar botón
});

// COPIAR MODAL CALCULADORA
$('#modalCalculadora i').click((e) => {
	e.preventDefault();

	let copyText;
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
	navigator.clipboard.writeText(copyText.value)
		.then(() => { // Promesa
			/* Alert the copied text */
			setTimeout(() => {
				$(this).tooltip("hide");
			}, 2000);
		})
		.catch(error => {
			// Por si el usuario no da permiso u ocurre un error
			msg(`Error al copiar: ${error}`, 'rojo');
		});

});

// TOOLTIP MODAL CALCULADORA
$('#modalCalculadora i.fa-copy').tooltip({title: "Copiado", trigger: "click", placement: "top"});

// MODAL CALCULADORA DRAGGABLE
$("#modalCalculadora .modal-header").mousedown(function (mousedownEvt) {
	let $draggable = $(this);
	let x = mousedownEvt.pageX - $draggable.offset().left,
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