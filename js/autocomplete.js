const DEFAULTS = {
	threshold: 1,
	maximumItems: 15,
	highlightTyped: true,
	highlightClass: 'text-primary',
	label: 'label',
	value: 'value',
	showValue: false,
	showValueBeforeLabel: false,
};

class Autocomplete {
	constructor(field, options) {
		this.field = field;
		this.options = Object.assign({}, DEFAULTS, options);
		this.dropdown = null;

		field.parentNode.classList.add('dropdown');
		field.parentNode.classList.add('form-group');
		field.setAttribute('data-bs-toggle', 'dropdown');
		field.classList.add('dropdown-toggle');

		const dropdown = ce(`<div class="dropdown-menu"></div>`);
		if (this.options.dropdownClass)
			dropdown.classList.add(this.options.dropdownClass);

		insertAfter(dropdown, field);

		this.dropdown = new bootstrap.Dropdown(field, this.options.dropdownOptions);
		consola(this.dropdown)

		field.addEventListener('click', (e) => {
			if (this.createItems() === 0) {
				e.stopPropagation();
				this.dropdown.hide();
			}
		});

		field.addEventListener('input', () => {
			if (this.options.onInput)
				this.options.onInput(this.field.value);
			this.renderIfNeeded();
		});

		field.addEventListener('keydown', (e) => {
			e.stopPropagation();

			if (e.keyCode === 27) {
				this.dropdown.hide();
				return;
			}
			if (e.keyCode === 40) {
				this.dropdown._menu.children[0]?.focus();
				return;
			}
		});
	}

	setData(data) {
		this.options.data = data;
		this.renderIfNeeded();
	}

	renderIfNeeded() {
		if (this.createItems() > 0)
			this.dropdown.show();
		
	}

	createItem(lookup, item) {
		let label;
		if (this.options.highlightTyped) {
			const idx = removeDiacritics(item.label)
					.toLowerCase()
					.indexOf(removeDiacritics(lookup).toLowerCase());
			const className = Array.isArray(this.options.highlightClass) ? this.options.highlightClass.join(' ')
				: (typeof this.options.highlightClass == 'string' ? this.options.highlightClass : '');
			label = item.label.substring(0, idx)
				+ `<span class="${className}">${item.label.substring(idx, idx + lookup.length)}</span>`
				+ item.label.substring(idx + lookup.length, item.label.length);
		} else {
			label = item.label;
		}

		if (this.options.showValue) {
			if (this.options.showValueBeforeLabel) {
				label = `${item.value} ${label}`;
			} else {
				label += ` ${item.value}`;
			}
		}

		return ce(`<button type="button" class="dropdown-item" data-label="${item.label}" data-value="${item.value}">${label}</button>`);
	}

	createItems() {
		const lookup = this.field.value;
		if (lookup.length < this.options.threshold) {
			this.dropdown.hide();
			return 0;
		}

		const items = this.field.nextSibling;
		items.innerHTML = '';

		const keys = Object.keys(this.options.data);

		let count = 0;
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			const entry = this.options.data[key];
			const item = {
					label: this.options.label ? entry[this.options.label] : key,
					value: this.options.value ? entry[this.options.value] : entry
			};

			if (removeDiacritics(item.label).toLowerCase().indexOf(removeDiacritics(lookup).toLowerCase()) >= 0) {
				items.appendChild(this.createItem(lookup, item));
				if (this.options.maximumItems > 0 && ++count >= this.options.maximumItems)
					break;
			}
		}

		this.field.nextSibling.querySelectorAll('.dropdown-item').forEach((item) => {
			item.addEventListener('click', (e) => {
				let dataLabel = e.target.getAttribute('data-label');
				let dataValue = e.target.getAttribute('data-value');

				this.field.value = dataValue;
				this.field.dispatchEvent(new Event('change'));

				if (this.options.onSelectItem) {
					this.options.onSelectItem({
						value: dataValue,
						label: dataLabel
					});
				}

				this.dropdown.hide();
			})
		});

		return items.childNodes.length;
	}
}

/**
 * @param html
 * @returns {Node}
 */
function ce(html) {
	let div = document.createElement('div');
	div.innerHTML = html;
	return div.firstChild;
}

/**
 * @param elem
 * @param refElem
 * @returns {*}
 */
function insertAfter(elem, refElem) {
	return refElem.parentNode.insertBefore(elem, refElem.nextSibling);
}

/**
 * @param {String} str
 * @returns {String}
 */
function removeDiacritics(str) {
	return str
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '');
}



function autocomplete(inp, arr) {
	/*the autocomplete function takes two arguments,
	the text field element and an array of possible autocompleted values:*/
	var currentFocus;
	/*execute a function when someone writes in the text field:*/
	inp.addEventListener("input", function (e) {
		var a, b, i, val = this.value;
		/*close any already open lists of autocompleted values*/
		closeAllLists();
		if (!val) { return false; }
		currentFocus = -1;
		/*create a DIV element that will contain the items (values):*/
		a = document.createElement("DIV");
		a.setAttribute("id", this.id + "autocomplete-list");
		a.setAttribute("class", "autocomplete-items");
		/*append the DIV element as a child of the autocomplete container:*/
		this.parentNode.appendChild(a);
		/*for each item in the array...*/
		for (i = 0; i < arr.length; i++) {
			/*check if the item starts with the same letters as the text field value:*/
			//if (arr[i].descripcion.toUpperCase().search(val.toUpperCase()) > -1) {
			if (arr[i].descripcion.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
				/*create a DIV element for each matching element:*/
				b = document.createElement("DIV");
				b.classList.add('autocomplete-item');
				/*make the matching letters bold:*/
				b.innerHTML = '<strong class="text-primary">' + arr[i].descripcion.substr(0, val.length) + "</strong>";
				b.innerHTML += arr[i].descripcion.substr(val.length);
				/*insert a input field that will hold the current array item's value:*/
				b.innerHTML += "<input type='hidden' value='" + arr[i].codigo + "'>";
				/*execute a function when someone clicks on the item value (DIV element):*/
				b.addEventListener("click", function (e) {
					/*insert the value for the autocomplete text field:*/
					inp.value = this.getElementsByTagName("input")[0].value;
					//inp.value = arr[i].codigo;
					/*close the list of autocompleted values,
					(or any other open lists of autocompleted values:*/
					closeAllLists();
					//inp.change();

					let event = new Event('change');

					setTimeout(() => {
						inp.dispatchEvent(event);
					}, 500);
				});
				a.appendChild(b);
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
	/*execute a function when someone clicks in the document:*/
	document.addEventListener("click", function (e) {
	closeAllLists(e.target);
	});
}