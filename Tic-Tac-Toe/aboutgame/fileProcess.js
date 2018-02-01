var fs = require('fs');
module.exports = {

	getFileList: function(path, filesList) {
		var files = fs.readdirSync(path);
		files.forEach(function(itm, index) {
			var stat = fs.statSync(path + itm);
			filesList.push(itm);
		})

	},

	getJson: function(path) {
		return new Promise((fulfill, reject) => {
			if (path === undefined || typeof path !== "string") {
				reject("input path is invalid");
			} else {
				fs.readFile(path, "utf8", (err, data) => {
					if (err) {
						reject(err);
					};
					var dataObj = JSON.parse(data);
					fulfill(dataObj);
				});
			}
		});
	},

	postString: function(path, text) {
		return new Promise((fulfill, reject) => {
			if (text === undefined || typeof text !== "string") {
				reject("input text is invalid");
			}
			if (path === undefined || typeof path !== "string") {
				reject("input path is invalid");
			} else {
				fs.writeFile(path, text, function(err) {
					if (err) {
						reject(err);
					}
					fulfill(true);
				});
			}
		});
	}

};
