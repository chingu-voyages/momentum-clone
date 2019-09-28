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
		if (e.keyCode === 13 && hasContent(userInput)) {
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

	//Implement main focus
	let mainFocus = document.getElementById("main-focus");
	let mainFocusHeader = mainFocus.getElementsByTagName("span")[0];
	let mainFocusInput = mainFocus.getElementsByTagName("input")[0];
	
	//Prompt user to hit enter after 4 seconds
	let instruction = mainFocus.getElementsByTagName("span")[1];
	instruction.style.opacity = "0";
	let showInstruction;
	mainFocusInput.addEventListener("keyup", (e) => {
		clearTimeout(showInstruction);
		if (hasContent(mainFocusInput)) {
			showInstruction = setTimeout(() => {
				instruction.style.opacity = "1";
			}, 4000);
		} else {
	instruction.style.opacity = "0";
		};
	});

	//Translate user search bar input into valid Google search query
	let search = document.getElementsByClassName("search")[0].getElementsByTagName("input")[0];
	search.addEventListener("keyup", (e) => {
		if (e.keyCode === 13 && hasContent(search)) {
			location.href = "https://www.google.com/search?q=" + search.value;
			search.value = "";
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
		if (!hasContent(todoInput)) {
			todoInput.value = "";
		}
		if (e.keyCode === 13) {
			if (todoInput.value) {
				let task = document.createElement("li");
				let check = document.createElement("input");
				check.type = "checkbox";
				let taskInput = document.createElement("span");
				taskInput.innerHTML = todoInput.value.trim();
				let taskEditor = document.createElement("input");
				taskEditor.type = "text";
				taskEditor.style.display = "none";
				let optionsIcon = document.createElement("i");
				optionsIcon.className = "fa fa-ellipsis-h";
				optionsButton = document.createElement("button");
				optionsButton.appendChild(optionsIcon);
				let optionsContainer = document.createElement("div");
				[0, 1].forEach((i) => optionsContainer.appendChild(document.createElement("button")));

				task.appendChild(check);
				task.appendChild(taskInput);
				task.appendChild(taskEditor);
				task.appendChild(optionsButton);
				task.appendChild(optionsContainer);
				todoList.appendChild(task);

				makeMenu(todoList, todoList.childElementCount - 1);

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

	//Edit and remove to do list items
	let makeMenu = function(list, ind) {
		let task = list.getElementsByTagName("li")[ind];
		let buttons = task.getElementsByTagName("button");
		editDelete(buttons[1], buttons[2], task);
		let toggle = buttons[0];
		let menu = task.getElementsByTagName("div")[0];
		menu.style.display = "none";
		window.addEventListener("click", (e) => {
			if (toggle.contains(e.target)) {
				menu.style.display = (menu.style.display === "none") ? "flex" : "none";
				toggle.style.opacity= (menu.style.display === "none") ? "" : "1"; 
				listHeight = parseFloat(window.getComputedStyle(list, null).getPropertyValue("height").replace("px", ""));
				listEnd = list.getBoundingClientRect().bottom;
				menuEnd = menu.getBoundingClientRect().bottom;
				if (menuEnd > listEnd) {
					listHeight += menuEnd - listEnd;
				}
				list.style.height = (menu.style.display === "none") ? "" : listHeight + "px";
			} else {
				menu.style.display = "none";
				toggle.style.opacity = "";
				list.style.height = "";
			}
		})
	}

	//Implement edit and delete features
	let editDelete = function(edit, del, task) {
		let taskInput = task.getElementsByTagName("span")[0];
		let taskEditor = task.getElementsByTagName("input")[1];
		taskEditor.value = taskInput.innerHTML;
		
		//Implement edit
		edit.innerHTML = "Edit";
		edit.style.borderBottom = "1px solid var(--medium-gray)"
		edit.addEventListener("mouseover", (e) => {
			edit.style.borderRadius = "5px 5px 0px 0px";
		});
		taskEditor.addEventListener("focus", (e) => {
			taskEditor.style.color = "rgba(255, 255, 255, 0.7)"
		})
		window.addEventListener("click", (e) => {
			if (edit.contains(e.target)) {
				taskInput.style.display = "none";
				taskEditor.style.display = "block";
				taskEditor.value = taskInput.innerHTML;
				taskEditor.focus();				
			}
		})
		window.addEventListener("click", (e) => {
			if (!taskEditor.contains(e.target) && !edit.contains(e.target)) {
				if (hasContent(taskEditor)) {
					taskInput.innerHTML = taskEditor.value;
				}
				taskEditor.style.display = "none";
				taskInput.style.display = "";					
			}
		})
		taskEditor.addEventListener("keyup", (e) => {
			if (e.keyCode === 13 && hasContent(taskEditor)) {
				taskInput.innerHTML = taskEditor.value;
				taskEditor.style.display = "none";
				taskInput.style.display = "";	
			}
		})

		//Implement delete
		del.innerHTML = "Delete";
		del.addEventListener("mouseover", (e) => {
			del.style.borderRadius = "0px 0px 5px 5px";
		});
		del.addEventListener("click", (e) => {
			task.remove();
		})
	}

	//Check that the content of an input isn't only whitespace
	let hasContent = function(input) {
		return input.value.replace(/\s/g, "").length;
	}
}