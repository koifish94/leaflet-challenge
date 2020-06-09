//01-10 geo-json
var queryurl =
  'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

d3.json(queryurl, function (data) {
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  var earthquakes = L.geoJson(earthquakeData, {
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        '<h3>' +
          feature.properties.place +
          '<br> Magnitude: ' +
          feature.properties.mag +
          '</h3><hr><p>' +
          new Date(feature.properties.time) +
          '</p>'
      );
    },
    //https://leafletjs.com/examples/geojson/
    pointToLayer: function (feature, latlng) {
      return new L.circle(latlng, {
        radius: getRadius(feature.properties.mag),
        fillColor: getColor(feature.properties.mag),
        fillOpacity: 0.75,
        stroke: true,
        color: 'black',
        weight: 0.75,
      });
    },
  });

  createMap(earthquakes);
}

function getColor(magnitude) {
    if (magnitude > 5) {
        return 'red'
    } else if (magnitude > 4) {
        return 'blue'
    } else if (magnitude > 3) {
        return 'tan'
    } else if (magnitude > 2) {
        return 'yellow'
    } else if (magnitude > 1) {
        return 'darkgreen'
    } else {
        return 'lightgreen'
    }
};

function createMap(earthquakes) {
  // Define map
  var streetmap = L.tileLayer(
    'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/light-v10',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: API_KEY,
    }
  );

  var baseMaps = {
    "Street Map": streetmap
};
  var overlayMaps = {
    Earthquakes: earthquakes,
  };

  var myMap = L.map('map', {
    center: [40.7128, -74.0059],
    zoom: 4,
    layers: [streetmap, earthquakes]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


  // Create legend
  var legend = L.control({position: 'bottomright' });

  legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'legend'),
          magnitude = [0, 1, 2, 3, 4, 5],
          labels = [];

      for (var i = 0; i < magnitude.length; i++) {
          div.innerHTML +=
              '<i style="background:' + Color(magnitude[i] + 1) + '"></i> ' +
              magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
      }

      return div;
  };
  legend.addTo(myMap);
}


function getRadius(value) {
    return value * 35000;
  }


