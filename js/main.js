// TODO: COMO TENDRE LA INFORMACION GUARDADA, DEBO LLAMAR A ROUTING CON LA RUTA ALMACENADA
// _routeDone de L.Routing.OSRMv1
// this._routeSelected({route: selectedRoute, alternatives: routes});
// new L.Routing.Line(route)
/*
this._line = this.options.routeLine(routes.route,
	L.extend({
		addWaypoints: addWaypoints,
		extendToWaypoints: this.options.waypointMode === 'connect'
	}, this.options.lineOptions));
this._line.addTo(this._map);
this._hookEvents(this._line);

routingControl._selectedRoute <- aqui para recuperar la ruta generada y guardarla en mi db
o bien
EVENTO routesfound(waypoints, routes)

para pintarla, crear un L.LayerGroup y anadir una L.polyline por cada estilo, 
copiar L.Routing.Line

	L.LayerGroup.prototype.initialize.call(this, options);
	this._route = route;

	if (this.options.extendToWaypoints) {
		this._extendToWaypoints();
	}

	this._addSegment(
		route.coordinates,
		this.options.styles,
		this.options.addWaypoints);
		},


		_addSegment: function(coords, styles, mouselistener) {
			var i,
				pl;

			for (i = 0; i < styles.length; i++) {
				pl = L.polyline(coords, styles[i]);
				this.addLayer(pl);
				if (mouselistener) {
					pl.on('mousedown', this._onLineTouched, this);
				}
			}
		},

*/
// UTIL - SORTABLE
window.Ñ = window.Ñ || {};
window.Ñ.Sortable = (function () {
	var sortable = {};
	var draggedElm = null;
	sortable.add = function(elm) {
		elm.draggable = true;
		elm.style.cursor = "move";
		elm.addEventListener("dragstart", function (e) {
			e.dataTransfer.setData("text/plain", elm.dataset.ckey);
			draggedElm = this;
			e.dataTransfer.dropEffect = "move";
			window.setTimeout(function() { draggedElm.classList.add("dragged"); }, 0);
		});
		elm.addEventListener("dragend", function (e) {
			draggedElm = null;
			this.classList.remove("dragged");
		});
		elm.addEventListener("drop", function (e) {
			e.preventDefault();
		});
		elm.addEventListener("dragover", function (e) {
			e.preventDefault();
		 	e.dataTransfer.dropEffect = "move"
		});
		elm.addEventListener("dragenter", function (e) {
			if (draggedElm && this != draggedElm) {
				var file = Ñ.data(draggedElm, "file");
				file.swap(Ñ.data(this, "file"));
			}
		});
		elm.addEventListener("dragleave", function (e) {
			//this.classList.remove("dropenter");
		});
	};
	return sortable;
})();
// UTIL - DROPPABLE
window.Ñ = window.Ñ || {};
window.Ñ.Droppable = (function () {
	var droppable = {};
	droppable.add = function(elm, callback) {
		if (typeof elm == "string") {
			elm = document.getElementById(elm);
		}
		elm.addEventListener("drop", function (e) {
			e.preventDefault();
			callback(e);
		});
	};
	return droppable;
})();
// MAP
window.Ñ = window.Ñ || {};
window.Ñ.Map = (function () {
	var mapcls = {};
	var map;
	var layers = {
		locations: null
	}
	// NUEVO ICONO CON NUMERO DENTRO
	L.NumberedDivIcon = L.Icon.extend({
		options: {
			iconUrl: 'img/marker.png',
			number: "",
			shadowUrl: null,
			iconSize: new L.Point(34, 34),
			iconAnchor: new L.Point(17, 17),
			popupAnchor: new L.Point(0, -33),
			className: 'leaflet-div-icon'
		},
		createIcon: function () {
			var div = document.createElement("div");
			var img = this._createImg(this.options["iconUrl"]);
			var numdiv = document.createElement("div");
			numdiv.setAttribute("class", "number");
			numdiv.innerHTML = this.options['number'] || '';
			div.appendChild(img);
			div.appendChild(numdiv);
			this._setIconStyles(div, 'icon');
			return div;
		},
		//you could change this to add a shadow like in the normal marker if you really wanted
		createShadow: function () {
			return null;
		}
	});
	mapcls.init = function() {
		map = L.map('map').setView([42.81, -1.645], 13);
		ACCESS_TOKEN = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw';
		MB_ATTR = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>';
		MB_URL = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + ACCESS_TOKEN;
		OSM_URL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
		OSM_ATTRIB = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors';
		L.tileLayer(MB_URL, {attribution: MB_ATTR, id: 'mapbox.streets'}).addTo(map);
		layers.locations = L.featureGroup().addTo(map);
		addRoutingControl();
	};
	mapcls.addLocation = function(location) {
		layers.locations.addLayer(location);
	};
	mapcls.addLocationMarker = function(location, locationNumber) {
		return new L.Marker(location, {
			icon: new L.NumberedDivIcon({number: locationNumber}),
			draggable: true
		}).addTo(map);
	};
	mapcls.removeLocation = function(location) {
		map.removeLayer(location);
	};
	mapcls.containerPointToLatLng = function(point) {
		return map.containerPointToLatLng(point);
	};
	mapcls.centerOnLocations = function() {
		if (layers.locations.getLayers().length > 0) {
			map.fitBounds(layers.locations.getBounds());
		}
	};
	var routingControl;
	function addRoutingControl() {
		if (!routingControl) {
			routingControl = L.Routing.control({
				autoRoute: true,
				//waypoints: waypoints,
				router: new L.Routing.Mapbox("pk.eyJ1IjoibHVrZWdvdGhpYyIsImEiOiIxZThlZDdmOTNjOTQwYTI3ODM3NzBlZWZkZmZlNDM4OSJ9.gkhfsHPAN0Nnmcd7vqDWmQ", { 
					profile: "mapbox/walking", // driving, cycling
					routingOptions: {
						alternatives: false,
						steps: false,
						geometryOnly: true
					}
				}),
				createMarker: function() {
					return false;
				}
				//show: false,
				//waypointMode: "snap",
			}).addTo(map);
			routingControl.addEventListener("routesfound", function(e) {
				// TODO: MANDAR A BD
				console.log(e.routes);
			});
		}
	};
	mapcls.generateRoute = function() {
		var locationCount = Ñ.files.length;
		if (locationCount > 1) {
			var waypoints = [];
			for (var f = 0, file = Ñ.files[f]; f < Ñ.files.length; file = Ñ.files[++f]) {
				waypoints.push(file.marker.getLatLng());
			}
			routingControl.setWaypoints(waypoints);
		}
	};
	return mapcls;
})();
// UI
window.Ñ = window.Ñ || {};
window.Ñ.UI = (function () {
	var ui = {};
	var dropZone;
	function initDropZone() {
		var previewTemplate = document.getElementById("preview-template");
		var previewTemplateHTML = previewTemplate.innerHTML;
		previewTemplate.parentNode.removeChild(previewTemplate);
		dropZone = new Dropzone(document.body, { // Make the whole body a dropzone
			url: "server/store.php", // Set the url
			previewsContainer: ".preview-container",
			previewTemplate: previewTemplateHTML,
			acceptedFiles: "image/jpeg",
			thumbnailWidth: (document.body.clientWidth / 4),
			thumbnailHeight: null
			/*,
			renameFilename: function(name) { return name; },
			parallelUploads: 20,
			clickable: ".fileinput-button" // Define the element that should be used as click trigger to select files.
			*/
		});
		function initHooks(file) {
			var elm = file.previewElement;
			Ñ.data(elm, "file", file);
			Ñ.Sortable.add(elm);
			file.previewElementComponents = {
				name: elm.getElementsByClassName("name")[0],
				locationNumber: elm.getElementsByClassName("locationNumber")[0],
				buttons: {
					edit: elm.getElementsByClassName("edit")[0],
					remove: elm.getElementsByClassName("delete")[0]
				}
			};
			file.previewElementComponents.locationNumber.innerHTML = file.getLocationNumber();
			file.previewElementComponents.name.value = file.title;
			file.previewElementComponents.name.addEventListener("focus", function() {
				this.select();
			});
			file.previewElementComponents.name.addEventListener("keyup", function() {
				file.title = this.value;
			});
			file.previewElementComponents.buttons.edit.addEventListener("click", function() {
				nameElm.focus();
			});
			file.previewElementComponents.buttons.remove.addEventListener("click", function() {
				file.remove();
			});
		}
		dropZone.on("addedfile", function(file) {
			file.title = file.name.replace(/\.[^/.]+$/, "");
			file.getLocationNumber = function() {
				return Ñ.files.indexOf(this) + 1;
			};
			file.swap = function(other) {
				// cambiar files
				var thisIdx = Ñ.files.indexOf(this);
				var otherIdx = Ñ.files.indexOf(other);
				Ñ.files[otherIdx] = this;
				Ñ.files[thisIdx] = other;
				// cambiar thumbs
				other.previewElement.parentNode.insertBefore(this.previewElement, this.previewElement == other.previewElement.nextSibling ? other.previewElement : other.previewElement.nextSibling);
				// actualizar ui
				this.updateui();
				other.updateui();
			};
			file.updateui = function() {
				var locNumber = this.getLocationNumber();
				this.previewElementComponents.locationNumber.innerHTML = locNumber;
				if (this.marker) {
					this.marker.setIcon(new L.NumberedDivIcon({ number: locNumber }));
				}
			};
			file.remove = function() {
				var thisIdx = Ñ.files.indexOf(this);
				Ñ.files.splice(thisIdx, 1);
				this.previewElement.parentNode.removeChild(this.previewElement);
				Ñ.Map.removeLocation(this.marker);
				for (var f = 0, file = Ñ.files[f]; f < Ñ.files.length; file = Ñ.files[++f]) {
					file.updateui();
				}
			};
			initHooks(file);
		});
		dropZone.on("success", function(file, response) {
			var response = JSON.parse(response);
			// TODO: Generar y usar ID
			//file.id = response.id;
			file.dateTaken = response.date ? response.date : null;
			if (response.gps) {
				file.marker = Ñ.Map.addLocationMarker(response.gps, file.getLocationNumber());
				file.previewElementComponents.locationNumber.classList.add("hasMarker");
			}
		});
		dropZone.on("queuecomplete", function(file, response) {
			//reloadMap();
			Ñ.Map.centerOnLocations();
		});
	}
	ui.init = function() {
		initDropZone();
		shareButton.addEventListener("click", Ñ.Map.generateRoute);
		var map = document.getElementById("map");
		Ñ.Droppable.add(map, function(e) {
			var ckey = e.dataTransfer.getData("text/plain");
			if (ckey) {
				var file = Ñ.data(ckey, "file");
				var point = new L.Point(e.x - map.offsetLeft, e.y);
				var pointLatLng = Ñ.Map.containerPointToLatLng(point);
				if (file.marker) {
					file.marker.setLatLng(pointLatLng);
				} else {
					file.marker = Ñ.Map.addLocationMarker(pointLatLng, file.getLocationNumber());
					file.previewElementComponents.locationNumber.classList.add("hasMarker");
				}			
			}
		});
	};
	ui.getFiles = function() {
		return dropZone.files;
	};
	return ui;
})();
// MAIN CODE
window.Ñ = window.Ñ || {};
// TODO: PROMOCIONAR ESTAS FUNCION A UTILS
// OBTIENE DATOS EXTRA DE ELEMENTOS DOM
Ñ.getUID = function() {
	var time = new Date().getTime();
	while (time == new Date().getTime());
	return new Date().getTime();
};
Ñ.cache = {};
Ñ.data = function(elm, key, data) {
	if (!elm) {
		return;
	}
	var ckey;
	if (typeof elm == "string") {
		ckey = elm;
	} else {
		ckey = elm.dataset.ckey;
		if (!ckey) {
			ckey = Ñ.getUID();
			elm.dataset.ckey = ckey;
			Ñ.cache[ckey] = {};
		}
	}
	if (!key) {
		return Ñ.cache[ckey];
	} else {
		if (!data) {
			return Ñ.cache[ckey][key] || null;
		} else {
			Ñ.cache[ckey][key] = data;
			return elm;
		}
	}
};
// HASTA AQUI
Ñ.init = function() {
	Ñ.UI.init();
	Ñ.Map.init();
	Ñ.files = Ñ.UI.getFiles();
};
Ñ.init();