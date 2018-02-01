var gameModel = require('./gameModel');
var prompt = require('prompt-sync')();
let gameFunction = {

	resumeGame(filename) {
		var gms = new gameModel.game();
		gms.resumeGame('./mygame/' + filename, gms).then((gms) => {
			this.show(gms);
			this.processGame(gms);
		}).catch((err) => {
			console.log(err);
		});
	},

	processGame(gms) {
		while (gms.isQuit == 0 || gms.gameStatus != null) {
			var result = prompt(gms.players[gms.currentplayer] + ': Input Row number (Comma) Column number. Input q to quit the game: ');
			if (result === 'q') {
				gms.isQuit = 1;
			} else {
				var row_column = result.split(",");
				if (parseInt(row_column[0]) <= gms.boardNumber && parseInt(row_column[0]) >= 1 && parseInt(row_column[1]) >= 1 && parseInt(row_column[1]) <= gms.boardNumber) {
					if (gms.board[row_column[0] - 1][row_column[1] - 1] != null) {
						console.log("Please choose another point");
					} else {
						gms.board[row_column[0] - 1][row_column[1] - 1] = gms.players[gms.currentplayer];
						gms.allStep--;
						this.show(gms);
						if (gms.checkWin(gms, row_column[0] - 1, row_column[1] - 1) == true) {
							gms.gameStatus = "win";
							gms.winner = gms.players[gms.currentplayer];
							break;
						} else if (gms.checkTie()) {
							gms.gameStatus = "tie";
							break;
						}
						gms.currentplayer = (gms.currentplayer + 1) % gms.playerNumber;
					}
				} else {
					console.log("number not correct");
				}
			}
		}

		if (gms.gameStatus == "win") {
			console.log("Congrats, winner is " + gms.winner);
		} else if (gms.gameStatus == "tie") {
			console.log("Hmmmmm, it's a tie game.");
		}

		if (gms.isQuit == 1) {
			var result = prompt('Save your game ? (y/n): ');
			if (result == 'y') {
				var filename = prompt('Your filename ？: ');
				gms.saveGame(filename, gms);
			} else {
				gms.quit();
			}
		}
	},

	newGame() {
		var playerNumber = prompt('Input players number (26Max): ');
		if (playerNumber >= 1 && playerNumber <= 26) {
			var boardNumber = prompt('The board scale (999Max): ');
			if (boardNumber > 0 && boardNumber <= 999) {
				var sequenceCount = prompt('The sequence count to win :');
				if ((sequenceCount > 0) && eval(sequenceCount) <= eval(boardNumber)) {
					if ((eval(boardNumber) * eval(boardNumber)) / eval(sequenceCount) >= playerNumber - 1) {
						var gms = new gameModel.game();
						gms.boot(playerNumber, boardNumber, sequenceCount);
						this.show(gms);
						return gms;
					} else {
						console.log("No one can win in this game");
					}
				} else {
					console.log("Sequence count should be less than board number ");
					// console.log(sequenceCount,boardNumber);
				}
			} else {
				console.log("Board scale should be 1~999");
			}
		} else {
			console.log("Players number shoud be 1~26");
		}
	},

	show(gameModel) {
		var output = '';
		for (var i = 0; i < gameModel.boardNumber; i++) {
			if (i == 0) {
				output += '   ';
			}
			var temp = 1 + i;
			if (temp < 10) {
				temp = "  " + (1 + i);
			} else if (temp >= 10 && temp <= 99) {
				var temp = " " + (1 + i);
			}
			output += ' ' + temp;
		}
		output += "\n";
		for (var i = 0; i < gameModel.board.length; i++) {
			var temp = 1 + i;
			if (temp < 10) {
				temp = "  " + (1 + i);
			} else if (temp >= 10 && temp <= 99) {
				var temp = " " + (1 + i);
			}
			output = output + temp + " ";
			for (var j = 0; j < gameModel.board[i].length; j++) {

				if (gameModel.board[i][j] == null) {
					output += '   ';
				} else {
					output += ' ' + gameModel.board[i][j] + ' ';
				}

				if (j != gameModel.board[i].length - 1) {
					output += '|';
				}
			}
			if (i != gameModel.board.length - 1) {
				output += "\n";
				for (var j = 0; j < gameModel.board[i].length; j++) {
					if (j == 0) {
						output += '    ---';
					} else {
						output += '---';
					}

					if (j != gameModel.board[i].length - 1) {
						output += '+';
					}
				}
				output += "\n";
			}
		}
		console.log(output);
	}
};
module.exports = gameFunction;
