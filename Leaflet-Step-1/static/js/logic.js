var earthquake_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create an initial map object
// Set the longitude, latitude, and the starting zoom level
var myMap = L.map("map").setView([37.09, -95.71], 5);

// Add a tile layer (the background map image) to our map
// Use the addTo method to add objects to our map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

function chooseColor(mag) {
    if (mag <= 1) {
        return 'lime';
    }
    else if (mag <= 2) {
        return 'greenyellow';
    }
    else if (mag <= 3) {
        return 'gold';
    }
    else if (mag <= 4) {
        return 'darkgoldenrod';
    }
    else if (mag <= 5) {
        return 'saddlebrown';
    }
    else {
        return 'red';
    }
}

d3.json(earthquake_url, function(response) {

    console.log(response);
    var data = response.features;
  
    for (var i = 0; i < data.length; i++) {
      var location = data[i].geometry.coordinates;
  
      var mag_radius = data[i].properties.mag*10000;
      var mag_color = chooseColor(data[i].properties.mag);
      console.log(mag_radius);
      
      if (location) {
        L.circle([location[1], location[0]], {
            color: mag_color,
            fillColor: mag_color,
            fillOpacity: 0.75,
            radius: mag_radius,
        }).bindPopup("Location: " + data[i].properties.place + "<br>Magnitude: " + data[i].properties.mag + "<br>Time: " + Date(data[i].properties.time)).addTo(myMap);
      }
    }

    // Set up the legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var limits = ['0-1', '1-2', '2-3', '3-4', '4-5', '5+'];
        var colors = ['lime', 'greenyellow', 'gold', 'darkgoldenrod', 'saddlebrown', 'red'];
        var labels = [];

        // // Add min & max
        var legendInfo = "<h1>Magnitude</h1>" +
        "<div class=\"labels\">" +
        "</div>";

        div.innerHTML = legendInfo;

        limits.forEach(function(limit, index) {
            labels.push("<li style=\"background-color: " + colors[index] + "\">" + limits[index] + "</li>");
        });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };

    // Adding legend to the map
    legend.addTo(myMap);
  
});

