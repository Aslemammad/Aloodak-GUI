//
const notifier = require('node-notifier'),
	{
		runPuppeteer,
		writeUserData,
		getCities,
		getUserData,
		returnCityInfo,
		getColorDescribe
	} = require(`${__dirname}/js/browserFunctions`);
let shell = require('electron').shell;

// elements
const cityElement = document.getElementById('city'),
	leftElement = document.getElementById('left'),
	coElement = document.getElementById('co'),
	o3Element = document.getElementById('o3'),
	no2Element = document.getElementById('no2'),
	so2Element = document.getElementById('so2'),
	dayElement = document.getElementById('day'),
	hourElement = document.getElementById('hour'),
	statusElement = document.getElementById('status'),
	refreshElement = document.getElementById('refresh'),
	citySelect = document.getElementById('city-select'),
	citySelectButton = document.getElementById('activate'),
	loading = document.getElementById('windows8loading'),
	settingsButtonElement = document.getElementById('settings-button'),
	settingsElement = document.getElementById('settings'),
	centerPart = document.getElementById('center'),
	descriptionCitySelect = document.getElementById('description-city-select'),
	footerButtons = document.querySelectorAll('.footer-button'),
	aboutElement = document.getElementById('about');

//start the operation

runPuppeteer().then(
	() => {
		let cityInfo = returnCityInfo(getUserData().city);

		let describe = getColorDescribe(cityInfo.index);
		// write in the elements
		cityElement.innerHTML = cityInfo.city;
		leftElement.innerHTML = `${cityInfo.index}<sub>${cityInfo.pollution}</sub>`;
		coElement.innerHTML = cityInfo.CO;
		o3Element.innerHTML = cityInfo.O3;
		no2Element.innerHTML = cityInfo.NO2;
		so2Element.innerHTML = cityInfo.SO2;
		dayElement.innerHTML = cityInfo.time[0] || '';
		statusElement.innerHTML = describe.describe;
		addCitiesOptions(citySelect, getCities()); // append the cities into the select Box
		citySelectButton.addEventListener('click', (e) => {
			// change the city

			writeUserData(citySelect.value);
			location.reload();
		});
		deleteLoading();

		setInterval(() => {
			location.reload();
		}, 3600000); // 1 hour in milliseconds
		function deleteLoading() {
			// hide the loading
			loading.className += ' animated fadeOut ';
			loading.style.visibility = ' hidden';
			centerPart.style.visibility = ' visible ';
			document.body.classList.remove('animation');
			document.body.style.backgroundColor = describe.color;
			settingsElement.style.backgroundColor = describe.color;
			citySelectButton.style.color = describe.color;
			descriptionCitySelect.style.color = describe.color;
			document.querySelectorAll('footer span', (element) => {
				console.log(element);
				element.classList.remove('animation-button');
				element.style.color = describe.color;
			});
			settingsButtonElement.style.visibility = 'visible';
		}
		//send notification
		notifier.notify({
			title   : 'آلودک',
			message : `الایندگی شهر ${cityInfo.city} ${cityInfo.index} است `
		});
	},
	(e) => {
		location.reload();
	}
);

// Todo list:
// write the cities
// edit the background color
// edit the reload in first-run page
//
aboutElement.addEventListener('click', (e) => {
	e.preventDefault();
	shell.openExternal('');
});

refreshElement.addEventListener('click', (e) => {
	location.reload();
});
settingsButtonElement.addEventListener('click', () => {
	settingsElement.style.visibility = 'visible';
});
function addCitiesOptions(selectBox, array) {
	for (let arrayNum = 0; arrayNum < array.length; arrayNum++) {
		let option = document.createElement('option');
		option.value = array[arrayNum].city;
		option.innerHTML = `${array[arrayNum].state}: ${array[arrayNum].city}`;

		selectBox.appendChild(option);
	}
}
