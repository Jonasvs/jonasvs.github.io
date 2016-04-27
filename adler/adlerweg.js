//Javascript = Wege der Adlerkarte
        window.onload = function() {

            var layers = { // http://www.basemap.at/wmts/1.0.0/WMTSCapabilities.xml
                geolandbasemap: L.tileLayer("http://{s}.wien.gv.at/basemap/geolandbasemap/normal/google3857/{z}/{y}/{x}.png", {
                    subdomains: ['maps', 'maps1', 'maps2', 'maps3', 'maps4'],
                    attribution: 'Datenquelle: <a href="http://www.basemap.at/">basemap.at</a>'
                }),
                bmapoverlay: L.tileLayer("http://{s}.wien.gv.at/basemap/bmapoverlay/normal/google3857/{z}/{y}/{x}.png", {
                    subdomains: ['maps', 'maps1', 'maps2', 'maps3', 'maps4'],
                    attribution: 'Datenquelle: <a href="http://www.basemap.at/">basemap.at</a>'
                }),
                bmapgrau: L.tileLayer("http://{s}.wien.gv.at/basemap/bmapgrau/normal/google3857/{z}/{y}/{x}.png", {
                    subdomains: ['maps', 'maps1', 'maps2', 'maps3', 'maps4'],
                    attribution: 'Datenquelle: <a href="http://www.basemap.at/">basemap.at</a>'
                }),
                bmaphidpi: L.tileLayer("http://{s}.wien.gv.at/basemap/bmaphidpi/normal/google3857/{z}/{y}/{x}.jpeg", {
                    subdomains: ['maps', 'maps1', 'maps2', 'maps3', 'maps4'],
                    attribution: 'Datenquelle: <a href="http://www.basemap.at/">basemap.at</a>'
                }),
                bmaporthofoto30cm: L.tileLayer("http://{s}.wien.gv.at/basemap/bmaporthofoto30cm/normal/google3857/{z}/{y}/{x}.jpeg", {
                    subdomains: ['maps', 'maps1', 'maps2', 'maps3', 'maps4'],
                    attribution: 'Datenquelle: <a href="http://www.basemap.at/">basemap.at</a>'
                })
            };


            var adlerKarte = L.map("adlerkarteDiv");
            var osmLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap contributors</a>'
            }).addTo(adlerKarte);
            adlerKarte.setView([47, 11], 10);
            var etappe01 = L.geoJson(etappe01json, {
                style: {
                    color: "#ff0000",
                    weight: 15
                }
            });
            adlerKarte.addLayer(etappe01);

            var etappe02 = L.geoJson(etappe02json, {
                style: {
                    color: "#FF00FF",
                    weight: 15
                }
            });
            adlerKarte.addLayer(etappe02);

            var etappe03 = L.geoJson(etappe03json, {
                style: {
                    color: "#0000FF",
                    weight: 15
                }
            });
            adlerKarte.addLayer(etappe03);

            var etappe04 = L.geoJson(etappe04json, {
                style: {
                    color: "#2E9AFE",
                    weight: 15
                }
            });
            adlerKarte.addLayer(etappe04);

            var etappenGruppe = L.featureGroup([etappe01, etappe02, etappe03, etappe04]);
            adlerKarte.addLayer(etappenGruppe);
            adlerKarte.fitBounds(etappenGruppe.getBounds());

            L.control.layers({
                "OSM": osmLayer,
                "geoland": layers.bmapoverlay
            }, {
                "Tracks": etappenGruppe
            }).addTo(adlerKarte);

            adlerKarte.fitBounds(etappe01.getBounds());

            etappe01.bindPopup("<b>Etappe 01</b>");
            etappe02.bindPopup("<b>Etappe 02</b>");
            etappe03.bindPopup("<b>Etappe 03</b>");
            etappe04.bindPopup("<b>Etappe 04</b>");


            var bounds = etappenGruppe.getBounds();
            var url = 'http://www.panoramio.com/map/get_panoramas.php?set=public&from=0&to=20' +
                '&minx=' + bounds.getWest() +
                '&miny=' + bounds.getSouth() +
                '&maxx=' + bounds.getEast() +
                '&maxy=' + bounds.getNorth() +
                '&size=mini_square&mapfilter=true&callback=zeigBilder';

            var script = document.createElement("script");
            script.src = url;
            document.getElementsByTagName('head')[0].appendChild(script);
            window.zeigBilder = function(data) {
                for (var i = 0; i < data.photos.length; i++) {
                    console.log("panoramio fertig geladen: ", i, data.photos[i].photo_title);
                    L.marker([data.photos[i].latitude, data.photos[i].longitude], {
                            icon: L.icon({
                                iconUrl: data.photos[i].photo_file_url
                            })
                        }).bindPopup("<h2>" + data.photos[i].photo_title + "</h2><a href='" + data.photos[i].photo_url + "'>Link zum Bild</a>")
                        .addTo(adlerKarte);
                }
            }
        };