const { runPuppeteer, getCities, writeUserData } = require(`${__dirname}/js/browserFunctions`);
const { getCurrentWindow, globalShortcut, app } = require('electron').remote;

// elements in firstRun.html
const citySelect = document.getElementById('city-select'),
	citySelectButton = document.getElementById('activate'),
	loading = document.getElementById('windows8loading'),
	description = document.getElementById('description');

// on ending process of grabbing cities

runPuppeteer().then(
	() => {
		addCitiesOptions(citySelect, getCities()); // append the cities into the select Box
		deleteLoading();
		citySelectButton.addEventListener('click', (e) => {
			writeUserData(citySelect.value);
			app.relaunch();
			app.exit(0);
		});
	},
	(e) => {
		location.reload();
	}
);

function deleteLoading() {
	// hide the loading
	loading.className += ' animated fadeOut ';
	loading.style.visibility = ' hidden';
	//show the select form
	citySelect.className += ' animated fadeIn ';
	citySelectButton.className += ' animated fadeIn ';

	citySelect.style.visibility = 'visible';
	citySelectButton.style.visibility = 'visible';
	description.innerText = 'شهر زیبا و الوده خود را انتخاب کنید';
}
function addCitiesOptions(selectBox, array) {
	for (let arrayNum = 0; arrayNum < array.length; arrayNum++) {
		let option = document.createElement('option');
		option.value = array[arrayNum].city;
		option.innerHTML = `${array[arrayNum].state}: ${array[arrayNum].city}`;
		selectBox.appendChild(option);
	}
}
