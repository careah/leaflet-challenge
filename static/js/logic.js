// Fetch the earthquake data from the URL provided
fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    // Create a Leaflet map centered on a specific location
    var myMap = L.map("map").setView([37.09, -95.71], 3);

    // Add the tile layer for the map background
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(myMap);

    // Create a fucntion that dermines the color of the marker based on the earthquakes depth
    function getColor(depth) {
      switch (true) {
        case depth > 90:
          return "red";
        case depth > 70:
          return "orangered";
        case depth > 50:
          return "orange";
        case depth > 30:
          return "gold";
        case depth > 10:
          return "yellow";
        default:
          return "lightgreen";
      }
    }

    // Loop through the earthquake data and create markers with popups
    data.features.forEach(function(feature) {
      var magnitude = feature.properties.mag;
      var depth = feature.geometry.coordinates[2];
      var coordinates = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];

      // Create a circle marker where the size and color are determined by the magnitude and depth
      var marker = L.circleMarker(coordinates, {
        radius: magnitude * 3,
        fillColor: getColor(depth),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(myMap);

      // Create a popup with additional information about the earthquake
      marker.bindPopup(
        `<h3>Magnitude: ${magnitude}</h3><h3>Depth: ${depth}</h3><p>Location: ${feature.properties.place}</p>`
      );
    });

    // Add a legend
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      div.style.backgroundColor = "white"; 
      var depths = [-10, 10, 30, 50, 70, 90];
      var labels = ["<strong>Depth</strong>"];

      for (var i = 0; i < depths.length; i++) {
        var color = getColor(depths[i] + 1);
        var icon = '<i style="background:' + color + '"></i>';
        var depthLabel = depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] : '+');

        labels.push(icon + ' ' + depthLabel);
      }

      div.innerHTML = labels.join("<br>");
      return div;
    };

    legend.addTo(myMap);
  });