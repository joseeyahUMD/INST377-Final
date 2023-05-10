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
    console.log('refreshing data');
    const values = dropdown.value.toUpperCase();
    const jsonData = await getData(values);
    markerPlace(jsonData, pageMap);
  });
}

async function getIncidentTypesData() {
  const url = 'https://data.princegeorgescountymd.gov/resource/wb4e-w4nf.json';
  const request = await fetch(url);
  const json = await request.json();

  const incidentTypes = {};

  json.forEach((item) => {
    const incidentType = item.clearance_code_inc_type;
    if (incidentType === 'ACCIDENT' || incidentType === 'ACCIDENT WITH IMPOUND') {
      if (incidentTypes.hasOwnProperty(incidentType)) {
        incidentTypes[incidentType]++;
      } else {
        incidentTypes[incidentType] = 1;
      }
    }
  });

  return incidentTypes;
}

function loadPieChart(incidentTypesData) {
  const ctx = document.getElementById('incidentChart').getContext('2d');

  const labels = Object.keys(incidentTypesData);
  const data = Object.values(incidentTypesData);

  const chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: [
          // Add colors for each data point
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)'
        ],
        borderColor: [
          // Add border colors for each data point
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    },
  });
}

// Add this function call inside your mainEvent function
async function setupPieChart() {
  const loadChartButton = document.getElementById('loadChart');
  loadChartButton.addEventListener('click', async () => {
    const incidentTypesData = await getIncidentTypesData();
    loadPieChart(incidentTypesData);
  });
}

// Add this line inside your mainEvent function
setupPieChart();



document.addEventListener('DOMContentLoaded', async () => mainEvent());

