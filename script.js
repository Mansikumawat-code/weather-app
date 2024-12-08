const apiKey = "0ce8eb6fae9aef3c14578c86b9614796"; // Replace with your actual OpenWeatherMap API key

document.getElementById("getWeather").addEventListener("click", async () => {
    const locationInput = document.getElementById("location");
    const helpText = document.querySelector(".help-text");
    const location = locationInput.value.trim();

    if (!location) {
        alert("Please enter a location.");
        return;
    }

    try {
        // Geocoding API to resolve city and country
        const geoResponse = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
                location
            )}&limit=1&appid=${apiKey}`
        );
        const geoData = await geoResponse.json();

        if (geoData.length === 0) {
            throw new Error(
                "Location not found. Try adding a country code (e.g., 'Delhi, IN')."
            );
        }

        const { lat, lon, name, country } = geoData[0];

        // Fetch weather using coordinates
        const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );
        const weatherData = await weatherResponse.json();

        // Display weather data
        document.getElementById("cityName").textContent = `${name}, ${country}`;
        document.getElementById(
            "temperature"
        ).textContent = `Temperature: ${weatherData.main.temp}°C`;
        document.getElementById(
            "humidity"
        ).textContent = `Humidity: ${weatherData.main.humidity}%`;
        document.getElementById(
            "windSpeed"
        ).textContent = `Wind Speed: ${weatherData.wind.speed} m/s`;

        // Determine the appropriate icon based on temperature range
        const temp = weatherData.main.temp;
        let iconPath;

        if (temp <= 0) {
            iconPath = 'cold.png'; // Cold weather icon
        } else if (temp <= 15) {
            iconPath = 'mild.png'; // Mild weather icon
        } else if (temp <= 30) {
            iconPath = 'warm.png'; // Warm weather icon
        } else {
            iconPath = 'hot.png'; // Hot weather icon
        }

        // Set the icon source
        document.getElementById("weatherIcon").src = iconPath;
        document.getElementById("weatherInfo").classList.remove("hidden");
    } catch (error) {
        console.error(error.message);
        alert(error.message);
    }
});

// Add dynamic input help
const locationInput = document.getElementById("location");
locationInput.addEventListener("input", () => {
    const input = locationInput.value.trim();
    const helpText = document.querySelector(".help-text");

    if (input && !input.includes(",")) {
        helpText.textContent =
            "Consider adding a country code (e.g., 'New York, US') for better results.";
    } else {
        helpText.textContent =
            "Tip: Include the country code for better results (e.g., 'Paris, FR').";
    }
});


