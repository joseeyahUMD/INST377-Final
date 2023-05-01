const URL = "https://data.princegeorgescountymd.gov/resource/wb4e-w4nf.json";
let map;
let markerClusterGroup;

function initMap() {
  map = L.map("map").setView([38.8329, -76.8746], 11);
  L.tileLayer("https://tile.openstreetmap.org/%7Bz%7D/%7Bx%7D/%7By%7D.png", {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright%22%3EOpenStreetMap</a>',
  }).addTo(map);
}

async function fetchData(filterType) {
  try {
    const response = await fetch(URL);
    const data = await response.json();

    let accidents;

    if (filterType === "both") {
      accidents = data.filter(
        item =>
          item.clearance_code_inc_type === "ACCIDENT" ||
          item.clearance_code_inc_type === "ACCIDENT WITH IMPOUND"
      );
    } else {
      accidents = data.filter(item => item.clearance_code_inc_type === "ACCIDENT");
    }

    addMarkersToMap(accidents);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function addMarkersToMap(accidents) {
  if (markerClusterGroup) {
    map.removeLayer(markerClusterGroup);
  }

  const markers = [];

  accidents.forEach(accident => {
    const { latitude, longitude, street_address } = accident;
    const circle = L.circle([latitude, longitude], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 500
    }).addTo(map);
    circle.bindPopup(street_address);
    markers.push(circle);
  });

  markerClusterGroup = L.markerClusterGroup();
  markerClusterGroup.addLayers(markers);
  map.addLayer(markerClusterGroup);
}

function clearMarkers() {
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      layer.remove();
    }
  });
}

async function mainEvent() {
  initMap();

  document.getElementById("accident-only").addEventListener("click", () => fetchData("accident"));
  document.getElementById("both-accidents").addEventListener("click", () => fetchData("both"));
  document.getElementById("clear-markers").addEventListener("click", clearMarkers);
}

document.addEventListener("DOMContentLoaded", async () => mainEvent());
