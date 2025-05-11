document.addEventListener('DOMContentLoaded', () => {
  const cityInput = localStorage.getItem('cityInput') || 'Abuja';
  fetchWeatherData(cityInput); // Actually fetch data for the initial city
});

//DOM ELEMENTS
const userGreeting = document.querySelector('.user-greeting');
const tempNum = document.querySelector('.temp-num');
const cityName = document.querySelector('.city-name');
const dayDate = document.querySelector('.day-date');
const time = document.querySelector('.time');
const weatherDescription = document.querySelector('.weather-description');
const iconImage = document.querySelector('.icon-image');
const searchBar = document.querySelector('.search-bar');
const searchButton = document.querySelector('.search-button');
const houstonButton = document.querySelector('.btn-1');
const abujaButton = document.querySelector('.btn-2');
const dubaiButton = document.querySelector('.btn-3');
const lagosButton = document.querySelector('.btn-4');
const currentLocationButton = document.querySelector('.current-location');
const humiditycontainer = document.querySelector('.humidity-figure');
const cloudContainer = document.querySelector('.cloud-figure');
const windContainer = document.querySelector('.windspeed-figure'); 
const tempToggle = document.querySelector('.temp-toggle'); 
const tempOption = document.querySelector('.temp-option');
const celsiusButton = document.querySelector('.celsius-btn');
const fahrenheitButton = document.querySelector('.fahrenheit-btn'); 
const forecastButton = document.querySelector('.forecast-btn')
const popUp = document.querySelector('.popup');
const popupContent = document.querySelector('.popup-content')
const closeButton = document.querySelector('.close-popup-btn');
let tempC;
let tempF;
let currentCityData = {}; // Store complete city data (name, country, coords if available)
const monthsArray = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];


//Api Fetching for normal weather data
async function fetchWeatherData(cityInput) {
  try {
    tempNum.innerHTML = 'Loading...';
    
    // Determine if cityInput has coords or a city name
    const url = typeof cityInput === 'object' && cityInput.latitude && cityInput.longitude 
      ? `https://api.weatherapi.com/v1/current.json?key=92b9f4d4665840139e9183605250505&q=${cityInput.latitude},${cityInput.longitude}`
      : `https://api.weatherapi.com/v1/current.json?key=92b9f4d4665840139e9183605250505&q=${cityInput}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error('API Error:', data.error);
      tempNum.innerHTML = `City "${cityInput}" not found. Please check spelling.`;
      return;
    }

    // Store the current city data for use in forecast
    currentCityData = {
      name: data.location.name,
      country: data.location.country,
      input: cityInput // Store the original input format for API calls
    };

    // Store current city data in localStorage
    localStorage.setItem('currentCityData', JSON.stringify(currentCityData));

    tempC = data.current.temp_c; // Access the temperature in Celsius
    tempF = data.current.temp_f;
    const wind_mph = data.current.wind_mph;
    const wind_kph = data.current.wind_kph;
    let dateAndTime = data.location.localtime; // Access the local time and date
    let datePart = dateAndTime.split(" ")[0];
    let year = datePart.split("-")[0];
    let month = datePart.split("-")[1];
    let monthName = monthsArray[Number(month) - 1]; // Convert month to a number and get the month name
    let day = datePart.split("-")[2];
    let readableDate = `${monthName} ${day}, ${year}`; // Format the date as "Month Day, Year"
    let localtime = dateAndTime.split(" ")[1];
    const weatherCond = data.current.condition.text;
    const weatherIcon = "https:" + data.current.condition.icon;
    const humidity = data.current.humidity;
    const cloud = data.current.cloud;
    const locationName = data.location.name;
    const countryName = data.location.country;

    //To display on the page
    weatherDescription.innerHTML = weatherCond;
    dayDate.innerHTML = readableDate; // Update the date in the HTML
    time.innerHTML = localtime;
    iconImage.src = weatherIcon; // Update the icon image source
    tempNum.innerHTML = `${tempC}°C`;
    cityName.innerHTML = `${locationName}, ${countryName}`;
    humiditycontainer.innerHTML = `${humidity} %`;
    cloudContainer.innerHTML = `${cloud} %`;
    windContainer.innerHTML = `${wind_mph} mph || ${wind_kph} kmh`;

    //Add Event Listener to Celcius/Fahrenheit
    celsiusButton.addEventListener('click', () => {
      tempNum.classList.add('fade-out');
      setTimeout(() => {
        tempNum.innerHTML = `${tempC}°C`; 
        tempNum.classList.remove('fade-out');
      }, 500); // Wait for the fade-out animation to finish
      celsiusButton.classList.add('active');
      fahrenheitButton.classList.remove('active');
    });

    fahrenheitButton.addEventListener('click', () => {
      tempNum.classList.add('fade-out');
      setTimeout(() => {
        tempNum.innerHTML = `${tempF}°F`;
        tempNum.classList.remove('fade-out');
      }, 500);
      fahrenheitButton.classList.add('active');
      celsiusButton.classList.remove('active');
    });

  } catch (error) {
    console.error('Error fetching weather data:', error); // error stands for the actual error object
    tempNum.innerHTML = "Error fetching weather data, Please try again." 
  }
};

//function updateCityInput 
function updateCityInput(cityInput) {
  localStorage.setItem('cityInput', typeof cityInput === 'object' ? JSON.stringify(cityInput) : cityInput);
}

//EVENT LISTENER FOR ENTER KEY ON THE SEARCH BAR
searchBar.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault(); // Prevent form submission if in a form
    
    const cityInput = searchBar.value.trim();
    searchBar.value = '';
    
    if (cityInput) {
      updateCityInput(cityInput);
      fetchWeatherData(cityInput);
    } else {
      tempNum.innerHTML = 'Please enter a valid city name';
    }
  }
});

//EVENT LISTENER FOR SEARCH BUTTON
searchButton.addEventListener('click', () => {
  const cityInput = searchBar.value.trim();
  searchBar.value = '';
  
  if (cityInput) {
    updateCityInput(cityInput);
    fetchWeatherData(cityInput); // Call the function with the updated cityInput
  } else {
    tempNum.innerHTML = 'Please enter a valid city name';
  }
});

// Add an event listener to the suggested cities
function handleCityButtonClick(button, otherButtons) {
  const cityInput = button.dataset.cityInput;
  if (cityInput) {
    updateCityInput(cityInput);
    fetchWeatherData(cityInput);
    setTimeout(() => {
      button.classList.remove('active');
    }, 1200);
    button.classList.add('active');
    otherButtons.forEach(btn => btn.classList.remove('active'));
  } 
} 

houstonButton.addEventListener('click', () => {
  handleCityButtonClick(houstonButton, [abujaButton, dubaiButton, lagosButton, currentLocationButton]);
});

abujaButton.addEventListener('click', () => {
  handleCityButtonClick(abujaButton, [houstonButton, dubaiButton, lagosButton, currentLocationButton]);
});

dubaiButton.addEventListener('click', () => {
  handleCityButtonClick(dubaiButton, [houstonButton, abujaButton, lagosButton, currentLocationButton]);
});

lagosButton.addEventListener('click', () => {
  handleCityButtonClick(lagosButton, [houstonButton, abujaButton, dubaiButton, currentLocationButton]);
});

//FUNCTION TO HANDLE CURRENT LOCATION
function handleCurrentLocation() {
  navigator.geolocation.getCurrentPosition(
    function success(currentPosition) { //SUCCESS CALLBACK
      let lat = currentPosition.coords.latitude;
      let long = currentPosition.coords.longitude;
      let currentPositionData = {latitude: lat, longitude: long};

      // Update current location data and fetch weather with it
      updateCityInput(currentPositionData);
      fetchWeatherData(currentPositionData);
    },
    function callBack(error) { //ERROR CALLBACK
      tempNum.innerHTML = `Error getting location, Please try again.`;
      console.error('Geolocation error:', error);
    }
  );
}

//HANDLING THE BUTTON AND ITS IMPLEMENTATION
window.onload = function () {
  if (currentLocationButton) {
    currentLocationButton.addEventListener('click', () => {
      handleCurrentLocation();
      setTimeout(() => {
        currentLocationButton.classList.remove('active');
      }, 1200);
      currentLocationButton.classList.add('active');
      // Use an array for cleaner code
      [houstonButton, abujaButton, dubaiButton, lagosButton].forEach(btn => 
        btn.classList.remove('active')
      );
    });
  } else {
    console.error('Error: .current-location button not found in the DOM.');
  }
};

//FUNCTION TO HANDLE WEATHER FORECAST
forecastButton.addEventListener('click', async() => {
  // Get the current city data from localStorage
  const cityDataString = localStorage.getItem('currentCityData');
  
  if (!cityDataString) { //SO iF THERES ALREADY A CITY THERE IT WILL CHECK ELSE IT WILL THROW NULL
    console.error('No city data available');
    return;
  }
  
  const cityData = JSON.parse(cityDataString);
  
  popUp.style.display = 'block';
  popupContent.innerHTML = `
    <h2>Weather Forecast for ${cityData.name}, ${cityData.country}</h2>
    <div class="loading">Loading forecast data...</div>`;
  
  // Use the stored input format for the API call
  await fetchForecastData(cityData.input);
});

//Function to Fetch forecast data for the next 3 days
async function fetchForecastData(cityInput) {
  try {
    // Get city data for display purposes
     const cityData = JSON.parse(localStorage.getItem('currentCityData'));
    
    // Use the correct endpoint for forecast data
    const url = typeof cityInput === 'object' && cityInput.latitude && cityInput.longitude 
      ? `https://api.weatherapi.com/v1/forecast.json?key=92b9f4d4665840139e9183605250505&q=${cityInput.latitude},${cityInput.longitude}&days=3`
      : `https://api.weatherapi.com/v1/forecast.json?key=92b9f4d4665840139e9183605250505&q=${cityInput}&days=3`;

    const response = await fetch(url);
    const data = await response.json();
    console.log(data); // Log the data for debugging

    // Display the forecast data in the popup
    if(popUp) {
      popUp.style.display = 'block';
      document.querySelector('.popup-content').innerHTML =
      
      ` <h2>Weather Forecast for ${cityData.name}, ${cityData.country}</h2>
        <p style="font-size: 1rem; font-style: italic;">${data.forecast.forecastday[0].date}</p>
        <p>Max Temp: ${data.forecast.forecastday[0].day.maxtemp_c}°C</p>
        <p>Min Temp: ${data.forecast.forecastday[0].day.mintemp_c}°C</p>
        <p>Condition: ${data.forecast.forecastday[0].day.condition.text}</p>
        
        <p style="font-size: 1rem; font-style: italic;">${data.forecast.forecastday[1].date}</p>
        <p>Max Temp: ${data.forecast.forecastday[1].day.maxtemp_c}°C</p>
        <p>Min Temp: ${data.forecast.forecastday[1].day.mintemp_c}°C</p>
        <p>Condition: ${data.forecast.forecastday[1].day.condition.text}</p>
        
        <p style="font-size: 1rem; font-style: italic;">${data.forecast.forecastday[2].date}</p>
        <p>Max Temp: ${data.forecast.forecastday[2].day.maxtemp_c}°C</p>
        <p>Min Temp: ${data.forecast.forecastday[2].day.mintemp_c}°C</p>
        <p>Condition: ${data.forecast.forecastday[2].day.condition.text}</p>`;
      
      // Handle the close button for the popup
      const closeButton = document.querySelector('.close-popup-btn');
      if (closeButton) {
        closeButton.addEventListener('click', () => {
          popUp.style.display = 'none';
        });
      } else {
        console.error('Close button not found in the DOM.');
      }
    } else {
      console.error('Popup element not found in the DOM.');
    }
  } catch(error) {
    console.error('Error fetching forecast data:', error);
 
    // Handle errors by displaying a message in the popup
    const popUp = document.querySelector('.popup');
    if (popUp) {
      popUp.style.display = 'block';
      document.querySelector('.popup-content').innerHTML = `
        <h2>Error</h2>
        <p>Unable to fetch forecast data. Please try again later.</p>
      `;

      const closeButton = document.querySelector('.close-popup-btn');
      if (closeButton) {
        closeButton.addEventListener('click', () => {
          popUp.style.display = 'none';
        });
      }
    }
  }
}
