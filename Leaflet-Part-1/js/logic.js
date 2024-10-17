// Creating the map object
var myMap = L.map("map", {
    center: [37.09, -95.71], // Centered in the US
    zoom: 5
  });
  
  // Creating the tile layer that will be in the background of the map.
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© Mapbox © OpenStreetMap Improve this map"
  }).addTo(myMap);
  
// Loading the GeoJSON data.
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
// Getting the data with d3.
d3.json(url).then(function(data) {
    createFeatures(data.features);
  });
      // Binding a popup to each layer
  function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]} km</p>`);
    }
  
    function markerOptions(feature) {
      return {
        radius: feature.properties.mag * 4, // Scale radius with magnitude
        fillColor: getColor(feature.geometry.coordinates[2]), // Color based on depth
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };
    }
  
    // Creating the GeoJSON layer and adding on top of the map
    L.geoJson(earthquakeData, {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, markerOptions(feature));
      },
      onEachFeature: onEachFeature
    }).addTo(myMap);
  }
  
  // Function to determine marker color based on earthquake depth
  function getColor(depth) {
    if (depth > 90) return "#ff5f65";
    else if (depth > 70) return "#fca35d";
    else if (depth > 50) return "#fdb72a";
    else if (depth > 30) return "#f7db11";
    else if (depth > 10) return "#dcf400";
    else return "#a3f600";
  }
  
  // Setting the legend
  var legend = L.control({ position: "bottomright" });
  
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend"),
      depthLevels = [0, 10, 30, 50, 70, 90],
    //   let colors = geojson.options.colors;
        colors = ["#a3f600", "#dcf400", "#f7db11", "#fdb72a", "#fca35d", "#ff5f65"];
  
    // Loop through depth levels and generate a label with color
    for (var i = 0; i < depthLevels.length; i++) {
      div.innerHTML +=
        `<i style="background:${colors[i]}"></i> ${depthLevels[i]}${depthLevels[i + 1] ? "&ndash;" + depthLevels[i + 1] + "<br>" : "+"}`;
    }
  
    return div;
  };
  
// Adding the legend to the map  
legend.addTo(myMap);

  