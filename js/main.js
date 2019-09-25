window.onload = function() {
	//Prompt user for name
	let content = document.getElementsByTagName("main")[0];
	let prompt = document.getElementsByClassName("prompt")[0];

	content.style.visibility = "hidden";
	prompt.style.visibility = "visible";
	setTimeout(() => {
		prompt.style.opacity = "1";
	}, 500);

	//Get and store user name input
	let userName;
	let userInput = prompt.getElementsByTagName("input")[0]
	userInput.addEventListener("keyup", (e) => {
		if (e.keyCode === 13) {
			if (userInput.value.replace(/\s/g, "").length) {
				userName = userInput.value;
				updateClock();
				prompt.style.opacity = "0";
				setTimeout(() => {
					prompt.style.display = "none";
					content.style.opacity = "0";
					userInput.value = "";
				}, 1000);
				setTimeout(() => {
					content.style.visibility = "visible";
					content.style.opacity = "1";
				}, 1500)
			}
		}
	});

	//Update clock time and update greeting based on hour
	let clock = document.getElementsByClassName("time")[0];
	let welcome = document.getElementsByClassName("welcome")[0]

	let updateClock = function() {
		let time = new Date();
		let hours = time.getHours();
		let partOfDay = (hours >= 5 && hours < 12) ? "morning" : 
						(hours >= 12 && hours < 17) ? "afternoon" :
						(hours >= 17 && hours < 21) ? "evening" :
						(hours >= 21 || hours < 5) ? "night" : "day";
		hours = (hours === 0) ? 12 : (hours > 12) ? hours - 12 : hours;
		let minutes = time.getMinutes();
		minutes = (minutes < 10) ? "0" + minutes.toString() : minutes
		clock.innerHTML = hours + ":" + minutes;
		welcome.innerHTML = "Good " + partOfDay + ", " + userName;
	};
	setInterval(updateClock, 500);

	//Translate user search bar input into valid Google search query
	let search = document.getElementsByClassName("search")[0].getElementsByTagName("input")[0];
	search.addEventListener("keyup", (e) => {
		if (e.keyCode === 13) {
			if (search.value.replace(/\s/g, "").length) {
				location.href = "https://www.google.com/search?q=" + search.value;
				search.value = "";
			}
		}
	})

	//Keep search bar visible if there is user-inputted text (including just spaces) in it
	let searchIcon = document.getElementsByClassName("fa-search")[0];
	let googleIcon = document.getElementsByClassName("fa-google")[0];
	search.addEventListener("focusout", (e) => {
		if (search.value) {
			search.style.opacity = "1";
			googleIcon.style.opacity = "1";
			searchIcon.style.color = "rgba(255, 255, 255, 1)";
		} else {
			search.style.opacity = "";
			googleIcon.style.opacity = "";
			searchIcon.style.color = "";
		}
	})

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

	//Implement to do list transitions
	let todoSection = document.getElementById("todo");
	let todoToggle = todoSection.getElementsByClassName("focus")[0];
	let todoBox = todoSection.getElementsByClassName("popup")[0];
	let todoStart = todoBox.getElementsByTagName("div")[0];
	let todoNew = todoStart.getElementsByTagName("button")[0];
	let todoInput = todoSection.getElementsByTagName("input")[0];
	let todoList = todoBox.getElementsByTagName("ul")[0];

	//Toggle to do list popup
	todoBox.style.visibility = "hidden";
	todoToggle.addEventListener("click", (e) => {
		if (todoBox.style.visibility === "hidden") {
			todoBox.style.visibility = "visible";
			todoToggle.style.color = "rgba(255, 255, 255, 1)";
			if (todoList.childElementCount) {
				todoList.style.visibility = "visible";
				todoInput.style.visibility = "visible";
				todoStart.style.visibility = "hidden";
			} else {
				todoNew.style.visibility = "visible";
				todoNew.style.opacity = "1";
				todoInput.style.visibility = "hidden";
			}
		} else {
			[todoBox, todoNew, todoInput, todoList].forEach((element) => element.style.visibility = "hidden");
			todoToggle.style.color = "";
		}
	});	

	//Make input for adding new task appear
	todoInput.style.visibility = "hidden";
	todoNew.addEventListener("click", (e) => {
		todoNew.style.opacity = "0"
		setTimeout(() => {
			todoNew.style.visibility = "hidden";
		}, 200)
		todoInput.style.visibility = "visible";
	})

	//Add task and switch view to task list
	todoList.style.visibility = "hidden";
	todoInput.addEventListener("keyup", (e) => {
		if (!todoInput.value.replace(/\s/g, "").length) {
			todoInput.value = "";
		}
		if (e.keyCode === 13) {
			if (todoInput.value) {
				let task = document.createElement("li");
				let check = document.createElement("input");
				check.type = "checkbox";
				let taskInput = document.createElement("span");
				taskInput.innerHTML = todoInput.value.trim();
				task.appendChild(check);
				task.appendChild(taskInput);
				todoList.appendChild(task);
				todoList.scrollTop = todoList.scrollHeight;
				todoInput.value = "";
				if (todoList.style.visibility === "hidden") {
					todoList.style.visibility = "visible";
					todoStart.style.display = "none";
					todoInput.style.paddingRight = "20px";
					todoBox.style.paddingRight = "3px";
				}
			}
		}
	})
}