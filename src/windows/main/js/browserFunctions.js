// all the functions maybe are here, to make reusable code
// the requires
const puppeteer = require('puppeteer'),
	cheerio = require('cheerio'),
	Store = require('electron-store');

// variables
// return the page Content as string if runPuppeteer() success.else show 'page failed'
const store = new Store(); // make instance of Store
let $;
let content = {
	pageContent : 'page failed'
};

async function runPuppeteer() {
	const browser = await puppeteer.launch({
		headless : true,
		args     : [
			`--no-proxy-server`
		]
	});
	// Grab the website content
	const page = await browser.newPage();
	await page.setViewport({ width: 1920, height: 1080 });
	await page.setRequestInterception(true);
	// disable the css , imgs and the fonts of the page for speed
	page.on('request', (req) => {
		if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image') {
			req.abort();
		} else {
			req.continue();
		}
	});

	await page.goto('https://aqms.doe.ir/Home/AQI', {
		timeout : 0
	});
	await page.select('select.form-control', '2');
	await page.click('button#btnSearch');
	await page.waitFor(6000);
	$ = cheerio.load(await page.content()); // set the page to cheerio
	console.log($.html());
	await browser.close();
}
function getCities() {
	let citiesArray = [];
	$('tbody tr').each((i, element) => {
		if (Object.prototype.hasOwnProperty.call(element.attribs, 'data-uid')) {
			citiesArray[citiesArray.length] = {
				state     :
					(element.children[1].children[0] && element.children[1].children[0].data) ||
					'استان مورد نظر فعلا موجود نمی باشد',
				city      :
					(element.children[2].children[0] && element.children[2].children[0].data) ||
					'شهر مورد نظر یافت نشد',
				CO        : (element.children[3].children[0] && element.children[3].children[0].data) || '-',
				O3        : (element.children[4].children[0] && element.children[4].children[0].data) || '-',
				NO2       : (element.children[5].children[0] && element.children[5].children[0].data) || '-',
				SO2       : (element.children[6].children[0] && element.children[6].children[0].data) || '-',
				index     : (element.children[9].children[0] && element.children[9].children[0].data) || '-',
				pollution : (element.children[10].children[0] && element.children[10].children[0].data) || '-',
				time      : ((element.children[11].children[0] && element.children[11].children[0].data) || '-')
					.split(' ')
			}; // more beautiful than array.push
		}
	});
	return citiesArray;
}
function checkUserData() {
	return store.get('aloodak') ? true : false;
}

function getUserData() {
	return store.get('aloodak');
}
function writeUserData(value) {
	store.set('aloodak', {
		city : value
	});
}
function deleteData() {
	store.delete('aloodak');
}
function returnCityInfo(city) {
	let cities = getCities();

	for (let cityNum = 0; cityNum < cities.length; cityNum++) {
		console.log(cityNum);

		if (cities[cityNum].city == city) {
			console.log(cities[cityNum]);
			return cities[cityNum];
		}
	}
}

function getColorDescribe(number) {
	if (number <= 50) {
		return {
			color    : '#8BF451',
			describe : 'عالی'
		}; //green
	} else if (number >= 51 && number <= 100) {
		return {
			color    : '#F9E337',
			describe : 'خوب'
		}; //yellow
	} else if (number >= 101 && number <= 150) {
		return {
			color    : '#FD9A4C',
			describe : 'کمی الوده'
		}; //orange
	} else if (number >= 151 && number <= 200) {
		return {
			color    : '#FF4F63',
			describe : 'خطرناک'
		}; //red
	} else if (number >= 201 && number <= 300) {
		return {
			color    : '#B563B6',
			describe : 'خیلی خطرناک'
		}; //pink
	} else if (number >= 300) {
		return {
			color    : '#B06885',
			describe : 'فجیع'
		}; //2x pink
	}
}
exports.content = content;
exports.getCities = getCities;
exports.runPuppeteer = runPuppeteer;
exports.writeUserData = writeUserData;
exports.checkUserData = checkUserData;
exports.getUserData = getUserData;
exports.getColorDescribe = getColorDescribe;
exports.returnCityInfo = returnCityInfo;
exports.deleteData = deleteData;
