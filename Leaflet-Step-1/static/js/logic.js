// Create the map object with options
var map = L.map("map", {
    center: [36.35, -97.36],
    zoom: 5,
  });


// Create the tile layer that will be the background of our map
  L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/streets-v11",
    accessToken: "pk.eyJ1Ijoic3B1bmFzZSIsImEiOiJja2ZxNTA0dXkwM2QwMzJwdzduM2FwdmdsIn0.CsKrV-lkWUzXWOTt4Wd6kg"
  }).addTo(map);

    // Store our API endpoint
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//  GET color radius call to the query URL
d3.json(queryUrl, function(data) {
    function styleInfo(feature) {
      return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: getColor(feature.properties.mag),
        color: "#000000",
        radius: getRadius(feature.properties.mag),
        stroke: true,
        weight: 0.5
      };
    }

    // set different color from magnitude
    function getColor(magnitude) {
        switch (true) {
        case magnitude > 5:
          return "#ea2c2c";
        case magnitude > 4:
          return "#ea822c";
        case magnitude > 3:
          return "#ee9c00";
        case magnitude > 2:
          return "#eecc00";
        case magnitude > 1:
          return "#d4ee00";
        default:
          return "#98ee00";
        }
      }

      // set radiuss from magnitude
    function getRadius(magnitude) {
        if (magnitude === 0) {
          return 1;
        }
    
        return magnitude * 4;
      }
       // GeoJSON layer
    L.geoJson(data, {
        // Maken cricles
        pointToLayer: function(feature, latlng) {
          return L.circleMarker(latlng);
        },
        // cirecle style
        style: styleInfo,
        // popup for each marker
        onEachFeature: function(feature, layer) {
          layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }
      }).addTo(map);

// Set Up Legend
var legend = L.control({
     position: "bottomright" });
legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend"), 
    magnitudeLevels = [0, 1, 2, 3, 4, 5];
    var colors = [
        "#98ee00",
        "#d4ee00",
        "#eecc00",
        "#ee9c00",
        "#ea822c",
        "#ea2c2c"
      ];


    for (var i = 0; i < magnitudeLevels.length; i++) {
        div.innerHTML +=
            '<i style="background: ' + colors[i] + '"></i> ' +
            magnitudeLevels[i] + (magnitudeLevels[i + 1] ? '&ndash;' + magnitudeLevels[i + 1] + '<br>' : '+');
    }
    return div;
};
 // Add Legend to the Map
 legend.addTo(map);
});