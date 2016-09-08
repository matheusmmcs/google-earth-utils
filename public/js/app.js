
(function($){
	$(document).ready(function(){


		$('#generate-coordinates').on('click', function(e){
			e.preventDefault();
			
			var name = trimInitEnd($('#name').val());
			var coordinates = trimInitEnd($('#coordinates').val());
			var height = trimInitEnd($('#height').val());
			var valid = validateForm(name, height, coordinates);

			if (valid) {
				coordinates = normalizeCoords(coordinates, height);
				if (coordinates) {
					var xml = generateKML(name, coordinates);
					var typeDownload = $('input[name=download-type]:checked').val();
					if (typeDownload == 0) {
						download(name, xml);
						//renderButtonDownload(xml);
					} else {
						generateNewTab(xml);
					}
				}
			}
			
		});

		function validateForm(name, height, coordinates) {
			var valid = true;
			if (!height || !isNumeric(height)) {
				alert('Preencha a altura do Polígono em formato numérico.');
				valid = false;
			}
			if (!name) {
				alert('Preencha o nome do Polígono.');
				valid = false;
			}
			if (!coordinates) {
				alert('Preencha as coordenadas do Polígono.');
				valid = false;
			}
			return valid;
		}

		function normalizeCoords(coordinates, height) {
			var arrCoords = coordinates.split('\n'), newCoord = '';
			for (var i = 0; i < arrCoords.length; i++) {
				newCoord = arrCoords[i].replace(/\s/g, '');
				if (newCoord.length == 0) {
				} else if (/^(\-?[|\d\.]+)\,(\-?[\d|\.]+)$/g.test(newCoord)) {
					arrCoords[i] = newCoord+','+height;
				} else {
					alert('Coordenadas incorretas para o Polígono.');
					return null;
				}
			}
			if (arrCoords[0] != arrCoords[arrCoords.length-1]) {
				console.log('append');
				arrCoords.push(arrCoords[0]);
			}
			return arrCoords.join('\n');
		}


		function generateKML(name, coordinates) {
			var str = '';
			str += '<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2">';
			str += '<Document><Style id="transBluePoly"><LineStyle><width>2.5</width></LineStyle><PolyStyle><color>30ffffff</color></PolyStyle></Style>';
			//str += '<Style id="style1"><LineStyle><color>996173ff</color></LineStyle><PolyStyle><color>8058ff7d</color></PolyStyle></Style>';
			str += '<Placemark><name>';
			str += name;
			str += '</name><styleUrl>#transBluePoly</styleUrl><Polygon><extrude>1</extrude><altitudeMode>relativeToGround</altitudeMode><outerBoundaryIs><LinearRing><coordinates>';
			str += coordinates;
			str += '</coordinates></LinearRing></outerBoundaryIs></Polygon></Placemark></Document></kml>';
			return str;
		}

		function renderButtonDownload(data){
			$('#generate-coordinates').after('<a id="btn-download-tempx" target="_blank" href="data:application/xml/octet-stream;charset=utf-16le;base64,' + btoa(data) + '" class="btn btn-primary btn-mgn-left">Baixar Polígono</a>');

			setTimeout(function(){
				console.log($('#btn-download-tempx'));
			}, 500);
			
			//$('#btn-download-tempx').remove();

		}

		function download(filename, text) {
			var element = document.createElement('a');
			element.setAttribute('href', 'data:application/xml;charset=utf-8,' + encodeURIComponent(text));
			element.setAttribute('download', filename);
			element.style.display = 'none';
			document.body.appendChild(element);
			element.click();
			document.body.removeChild(element);
		}

		function generateNewTab(xml) {
			newindow = window.open("data:application/xml;charset=utf-8," + encodeURIComponent(xml), "TESTE", "_blank", "width=300,height=300");
			newindow.focus();
		}

		function trimInitEnd (str) {
		    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
		}

		function isNumeric(n) {
		  return !isNaN(parseFloat(n)) && isFinite(n);
		}

	});
})(jQuery);