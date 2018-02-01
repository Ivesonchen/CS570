var game = require('./aboutgame/gameFunction');
var fileData = require("./aboutgame/fileProcess");
var prompt = require('prompt-sync')();


var newPlay = prompt('Any saved game? :(y/n)');
if (newPlay == 'n') {
	try {
		var gms = game.newGame();
		game.processGame(gms);
	} catch (error) {
		console.log(error);
	}
} else {
	var filesList = [];
	fileData.getFileList('mygame/', filesList);
	console.log(filesList);
	var filename = prompt('Choose your saved game ');
	if (filename != null) {
		var in_array = 0;
		for (var i = 0; i < filesList.length; i++) {
			if (filesList[i] == filename) {
				in_array = 1;
			}
		}
		if (in_array == 1) {
			game.resumeGame(filename);
		} else {
			console.log("No such Game");
		}
	}
}
