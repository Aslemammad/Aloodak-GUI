const remote = require('electron').remote;
(function() {
	document.onreadystatechange = function() {
		if (document.readyState == 'complete') {
			document.getElementById('close-btn').addEventListener('click', function(e) {
				e.preventDefault();
				remote.getCurrentWindow().minimize();
			});
		}
	};
})();
