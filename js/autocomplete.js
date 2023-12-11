function autocomplete(inp, arr) {
	/*the autocomplete function takes two arguments,
	the text field element and an array of possible autocompleted values:*/
	let currentFocus;
	/*execute a function when someone writes in the text field:*/
	inp.addEventListener("input", function (e) {
		if (inp.value.length > 2) {
			let listaElementos, elemento, val = this.value;
			/*close any already open lists of autocompleted values*/
			closeAllLists();
			if (!val) { return false; }
			currentFocus = -1;
			/*create a DIV element that will contain the items (values):*/
			listaElementos = document.createElement("div");
			listaElementos.setAttribute("id", this.id + "autocomplete-list");
			listaElementos.classList.add("autocomplete-items", "list-group");
			/*append the DIV element as a child of the autocomplete container:*/
			this.parentNode.appendChild(listaElementos);
			/*for each item in the array...*/
			let contador = 0;
			for (let i = 0; i < arr.length; i++) {
				/*check if the item starts with the same letters as the text field value:*/
				// Comprobamos si el valor de la lista de elementos es igual al valor del input
				if (arr[i].descripcion.toUpperCase().search(val.toUpperCase()) > -1) {
					let valorBuscado = (arr[i].descripcion.toUpperCase().search(val.toUpperCase())); //valor de la busqueda
					/*create a DIV element for each matching element:*/
					elemento = document.createElement("a"); // Creamos un div para cada elemento
					elemento.classList.add("autocomplete-item", "list-group-item", "cursor-pointer");
					/*make the matching letters bold:*/
					elemento.innerHTML = `<img src="${arr[i].url_imagen}" class="rounded w-10 me-2">`;
					elemento.innerHTML += `${arr[i].descripcion.substr(0, valorBuscado)}`;
					elemento.innerHTML += `<strong class="text-primary">${arr[i].descripcion.substr(valorBuscado, val.length)}</strong>`;
					elemento.innerHTML += `${arr[i].descripcion.substr((valorBuscado + val.length), arr[i].descripcion.length)}`;
//					elemento.innerHTML += `<p>${arr[i].codigo}</p>`;
	
					/*insert a input field that will hold the current array item's value:*/
					elemento.innerHTML += `<input type="hidden" value="${arr[i].codigo}">`;
					/*execute a function when someone clicks on the item value (DIV element):*/
					elemento.addEventListener("click", function (e) {
						/*insert the value for the autocomplete text field:*/
						inp.value = this.getElementsByTagName("input")[0].value;
						//inp.value = arr[i].codigo;
						/*close the list of autocompleted values,
						(or any other open lists of autocompleted values:*/
						closeAllLists();
	
						let event = new Event('change');
	
						setTimeout(() => {
							inp.dispatchEvent(event);
						}, 500);
					});
					listaElementos.appendChild(elemento);
					contador++;
				}
			}

			if (contador == 0) {
				elemento = document.createElement("a"); // Creamos un div para cada elemento
				elemento.classList.add("autocomplete-item", "list-group-item", "cursor-pointer");
				/*make the matching letters bold:*/
				elemento.innerHTML = `<img src="img/productos/carritoVacio.png" class="rounded w-10 me-2">`;
				elemento.innerHTML += "Ningún producto coincide con la busqueda";
				listaElementos.appendChild(elemento);
			} else {
				msg(`${contador} resultados coinciden con la descripción`, 'info');
			}
		}
	});
	/*execute a function presses a key on the keyboard:*/
	inp.addEventListener("keydown", function (e) {
		var x = document.getElementById(this.id + "autocomplete-list");
		if (x) x = x.getElementsByTagName("div");
		if (e.keyCode == 40) {
			/*If the arrow DOWN key is pressed,
			increase the currentFocus variable:*/
			currentFocus++;
			/*and and make the current item more visible:*/
			addActive(x);
		} else if (e.keyCode == 38) { //up
			/*If the arrow UP key is pressed,
			decrease the currentFocus variable:*/
			currentFocus--;
			/*and and make the current item more visible:*/
			addActive(x);
		}
		else if (e.keyCode == 13) {
			closeAllLists();
			//			/*If the ENTER key is pressed, prevent the form from being submitted,*/
			//			e.preventDefault();
			//			if (currentFocus > -1) {
			//				/*and simulate a click on the "active" item:*/
			//				if (x) x[currentFocus].click();
			//			}
			//		}
		}
	});
	inp.addEventListener("blur", function (e) {
		closeAllLists(e.target);
//		inp.value = "";
//		cerrarListaAutocomplete();
	});
	function addActive(x) {
		/*a function to classify an item as "active":*/
		if (!x) return false;
		/*start by removing the "active" class on all items:*/
		removeActive(x);
		if (currentFocus >= x.length) currentFocus = 0;
		if (currentFocus < 0) currentFocus = (x.length - 1);
		/*add class "autocomplete-active":*/
		x[currentFocus].classList.add("autocomplete-active");
	}
	function removeActive(x) {
		/*a function to remove the "active" class from all autocomplete items:*/
		for (var i = 0; i < x.length; i++) {
			x[i].classList.remove("autocomplete-active");
		}
	}
	function closeAllLists(elmnt) {
		/*close all autocomplete lists in the document,
		except the one passed as an argument:*/
		var x = document.getElementsByClassName("autocomplete-items");
		for (var i = 0; i < x.length; i++) {
			if (elmnt != x[i] && elmnt != inp) {
				x[i].parentNode.removeChild(x[i]);
			}
		}
	}

}

function cerrarListaAutocomplete() {
	$('.autocomplete-items').remove();
}