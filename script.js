function initMap() {
  console.log('initMap');
  const map = L.map('map').setView([38.9897, -76.9378], 15);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  L.control.scale().addTo(map);
  return map;
}

function markerPlace(array, map) {
  map.eachLayer((layer) => {
    if (layer instanceof L.CircleMarker) {
      layer.remove();
    }
  });

  array.forEach((item, index) => {
    const combined = [item.location.longitude, item.location.latitude];
    const circleMarker = L.circleMarker([combined[1], combined[0]], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 20
    });
    circleMarker.addTo(map);
    if (index === 0) {
      map.setView([combined[1], combined[0]], 10);
    }
  });
}

async function getData(typeofaccident) {
  let json = JSON.parse(localStorage.getItem('accidentData'));
  if (!json) {
    const url = 'https://data.princegeorgescountymd.gov/resource/wb4e-w4nf.json';
    const request = await fetch(url);
    json = await request.json();
    localStorage.setItem('accidentData', JSON.stringify(json));
  }

  if (typeofaccident.includes("|")) {
    console.log("Contains |");
    const split = typeofaccident.split("|");
    const reply2 = json.filter((item) => item.clearance_code_inc_type === split[0]);
    const reply3 = json.filter((item) => item.clearance_code_inc_type === split[1]);
    return reply2.concat(reply3);
  }
  const reply = json.filter((item) => item.clearance_code_inc_type === typeofaccident);
  return reply;
}

async function refreshData() {
  const url = 'https://data.princegeorgescountymd.gov/resource/wb4e-w4nf.json';
  const request = await fetch(url);
  const json = await request.json();
  localStorage.setItem('accidentData', JSON.stringify(json));
}

async function mainEvent() {
  const pageMap = initMap();
  const dropdown = document.getElementById('dropdown');
  const submits = document.querySelector('#button');
  const refreshButton = document.getElementById('refresh');

  console.log(submits);

  submits.addEventListener('click', async (submitEvent) => {
    submitEvent.preventDefault();
    const values = dropdown.value.toUpperCase();
    const jsonData = await getData(values);
    markerPlace(jsonData, pageMap);
  });

  refreshButton.addEventListener('click', async () => {
    await refreshData();
    console.log('refreshing data')
    const values = dropdown.value.toUpperCase();
    const jsonData = await getData(values);
    markerPlace(jsonData, pageMap);
  });
}

document.addEventListener('DOMContentLoaded', async () => mainEvent());

