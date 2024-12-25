const apiKey = '8e12681dd430e593a989f0fe26c3fa3d'; 
const locationInput = document.getElementById('location-input');
const searchButton = document.getElementById('search-button');
const weatherResult = document.getElementById('weather-result');
const autocompleteList = document.getElementById('autocomplete-list');

async function fetchLocations(query) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/find?q=${query}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    return data.list.map(location => location.name);
}

function autocomplete() {
    locationInput.addEventListener('input', async function() {
        const inputValue = this.value;
        autocompleteList.innerHTML = '';

        if (!inputValue) return;

        const locations = await fetchLocations(inputValue); // Fetch locations based on input

        locations.forEach(location => {
            const item = document.createElement('div');
            item.innerHTML = `<strong>${location.substr(0, inputValue.length)}</strong>${location.substr(inputValue.length)}`;
            item.addEventListener('click', function() {
                locationInput.value = location; // Set the selected location in the input
                autocompleteList.innerHTML = ''; // Clear the autocomplete list
            });
            autocompleteList.appendChild(item);
        });
    });
}

function getWeather(location) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Location not found');
            }
            return response.json();
        })
        .then(data => {
            const { main, weather, name } = data;
            const output = `
                <h2>${name}</h2>
                <p>Temperature: ${main.temp}°C</p>
                <p>Weather: ${weather[0].description}</p>
            `;
            weatherResult.innerHTML = output;
        })
        .catch(error => {
            weatherResult.innerHTML = `<p>${error.message}</p>`;
        });
}

searchButton.addEventListener('click', function() {
    const location = locationInput.value;
    if (location) {
        getWeather(location); // Fetch weather for the selected location
    } else {
        weatherResult.innerHTML = `<p>Please enter a location</p>`;
    }
});

autocomplete(); // Initialize autocomplete feature
