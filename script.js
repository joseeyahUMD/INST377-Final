//https://data.princegeorgescountymd.gov/resource/wb4e-w4nf.json

const URL = "https://data.princegeorgescountymd.gov/resource/wb4e-w4nf.json";


async function fetchData() {
  try {
    const response = await fetch(URL);
    const data = await response.json();
    // Filter data 
    const accidents = data.filter(item => item.clearance_code_inc_type === "ACCIDENT");
    // Create a Leaflet map
    const map = L.map('map').setView([38.8329, -76.8746], 11);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    // Create an marker array
    const markers = [];
    // Loop through filtered data + create markers
    accidents.forEach(accident => {
      const { latitude, longitude, street_address } = accident;
      const marker = L.marker([latitude, longitude]).addTo(map);
      marker.bindPopup(street_address);
      markers.push(marker);
    });
    const markerClusterGroup = L.markerClusterGroup();
    markerClusterGroup.addLayers(markers);
    map.addLayer(markerClusterGroup);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Call the fetchData function to fetch and display the filtered data on the map
fetchData();
