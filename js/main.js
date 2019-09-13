window.onload = function() {
	//Fetch current weather and update weather module
	let icon = document.getElementById("weather").getElementsByTagName("i")[0];
	let temp = document.getElementById("temp");
	let tempTooltip = document.getElementById("temp-tooltip");
	let city = document.getElementById("city");
	let cityTooltip = document.getElementById("city-tooltip");

	if ("geolocation" in navigator) { // Get user's location
		navigator.geolocation.getCurrentPosition((pos) => {
			let lat = pos.coords.latitude;
			let lon = pos.coords.longitude;
			fetchWeather(lat, lon);
		});
	} else {
		console.log("geolocation unavailable");
	}

	let fetchWeather = function(lat, lon) { // Make API call
		let req = new XMLHttpRequest();
		req.open("GET", "https://api.weatherbit.io/v2.0/current?" + "&lat=" + lat + "&lon=" + lon + "&key=" + config.WEATHER_KEY, true);
		req.onload = function() {
			if (req.status === 200) {
				let weatherData = JSON.parse(this.response).data[0];	
				icon.className = "wi " + iconMap[weatherData.weather.icon];
				temp.innerHTML = ((weatherData.temp * 9/5) + 32).toFixed(0) + "&deg";
				tempTooltip.innerHTML = weatherData.weather.description;
				city.innerHTML = weatherData.city_name
				cityTooltip.innerHTML = weatherData.city_name + ", " + weatherData.state_code + ", " + weatherData.country_code;
			} else {
				console.log("error")
			}
		}
		req.send();
	}
}