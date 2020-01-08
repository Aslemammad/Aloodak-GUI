const electron = require('electron'),
	url = require('url'),
	path = require('path');
const { app, BrowserWindow, Menu } = electron;
const { checkUserData, deleteData } = require(`${__dirname}/js/browserFunctions`);
// require('electron-reload')(`${__dirname}/../../../../`);
let mainWindow = null;

app.on('ready', () => {
	mainWindow = new BrowserWindow({
		icon           : `${__dirname}/img/icon2.png`,
		width          : 800,
		height         : 600,
		frame          : false,
		webPreferences : {
			// preload : path.join(__dirname, '/js/preload.js')
			nodeIntegration : true
		},
		resizable      : false
	});

	//check if there is  config
	if (checkUserData()) {
		mainWindow.loadFile(
			url.format({
				pathname : path.join(__dirname, 'index.html'),
				slashes  : true
			})
		);
	} else {
		mainWindow.loadFile(
			url.format({
				pathname : path.join(__dirname, 'first-run.html'),
				slashes  : true
			})
		);
	}

	// mainWindow.openDevTools();

	mainWindow.on('closed', () => {
		app.quit();
	});

	// Don't show the window and create a tray instead

	// hide the default menu
	Menu.setApplicationMenu(null);
});
