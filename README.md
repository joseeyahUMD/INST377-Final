# INST377-Final
## Accident Prevention in Prince George's County
https://joseeyahumd.github.io/INST377-Final/


### Description of Target Browsers:
    Google Chrome: This is the main browser I worked on. Version: 112.0.5615.138
    
    Android Chrome: I checked the website from here and it also seemed ok for displaying the data. Although, it could stand to have a greater height. Version: 113.0.5672.76



# Documentation
### visualization.html:


This file is responsible for displaying an interactive map that visualizes accident data. 


* It includes a header, a dropdown menu to select the type of accident data to view, and buttons to submit the selection and to refresh the data. 


* The map is contained within a `div` element with the id "map".


* Leaflet CSS and JavaScript libraries are linked in the file to provide mapping functionalities. 


* The associated JavaScript file `script.js` is also linked at the end of the file.


### index.html:


This file serves as the main page for the Accident Prevention project.


* It includes a header, a description of the issue and story, an explanation of how the dataset works, and a link to the data visualization page.


* There's also a button to load a chart that represents the incident types data. 


* Chart.js library is linked for charting functionalities.


* The associated JavaScript file `script.js` is also linked at the end of the file.


### script.js:


Contains all the functions necessary for the interactivity and functionality of the project.


* `initMap()` initializes and returns a map centered at a specific coordinate with a designated zoom level.


* `markerPlace(array, map)` places circle markers on the map for each location in the provided array.


* `getData(typeofaccident)` fetches accident data from the API, filters it based on the type of accident, and returns the filtered data.


* `refreshData()` fetches and refreshes the accident data stored in the local storage.


* `mainEvent()` is the main function. sets up event listeners for the submit and refresh buttons, and calls the necessary functions when these buttons are clicked.


* `getIncidentTypesData()` fetches accident data, counts the incidents of each type, and returns an object with the counts.


* `loadPieChart(incidentTypesData)` creates a pie chart using Chart.js with the data provided.


* `setupPieChart()` sets up an event listener for the "Load Chart" button and calls the necessary functions to load the pie chart when this button is clicked.


* The final line of the file adds an event listener to call the `mainEvent()` function when the DOM content is loaded.



