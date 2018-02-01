var fileData = require("./fileProcess");

var game = function() {

	this.playerNumber = 0;
	this.boardNumber = 0;
	this.sequenceCount = 0;
	this.isQuit = 0;
	this.gameStatus = null;
	this.winner = null;
	this.board = new Array();
	this.players = new Array();
	this.currentplayer = 0;
	this.allStep;
	this.filePath = 'mygame/';
	this.playerSymbol = "OXABCDEFGHIJLLMNPQRSTUVWYZ";

	this.boot = function(playerNumber, boardNumber, sequenceCount) {
		this.playerNumber = playerNumber;
		this.boardNumber = boardNumber;
		this.sequenceCount = sequenceCount;
		for (var i = 0; i < playerNumber; i++) {
			this.players[i] = this.playerSymbol.charAt(i);
		}
		for (var i = 0; i < boardNumber; i++) {
			this.board[i] = new Array();
			for (var j = 0; j < boardNumber; j++) {
				this.board[i][j] = null;
			}
		}
		this.allStep = boardNumber * boardNumber;

	};

	this.quit = function() {
		this.quit = 1;
		console.log("See you next time");
	};

	this.checkTie = function() {
		if (this.allStep <= 0) {
			return true;
		} else {
			return false;
		}
	};

	this.checkWin = function(gms, x, y) {
		var player = gms.players[this.currentplayer];
		var step = this.sequenceCount;
		var maxContinuousRowStep = 1;
		var maxContinuousColumnStep = 1;
		var maxContinuousDiaStep = 1;

		var checkRow = function() {
			var i = y - 1;

			while (i >= 0 && gms.board[x][i] == player) {
				maxContinuousRowStep++;
				i--;
			}
			var j = y + 1;
			while (j < gms.boardNumber && gms.board[x][j] == player) {
				maxContinuousRowStep++;
				j++;
			}
			if (maxContinuousRowStep >= step) {
				return true;
			} else {
				return false;
			}
		}

		if (checkRow() == true) {
			return true;
		}

		var checkColumn = function() {
			var i = x - 1;

			while (i >= 0 && gms.board[i][y] == player) {
				maxContinuousColumnStep++;
				i--;
			}
			var j = x + 1;
			while (j < gms.boardNumber && gms.board[j][y] == player) {
				maxContinuousColumnStep++;
				j++;
			}
			if (maxContinuousColumnStep >= step) {
				return true;
			} else {
				return false;
			}
		}

		if (checkColumn() == true) {
			return true;
		}

		var checkDiagonal = function() {
			var i = x - 1;
			var j = y - 1;
			while (i >= 0 && j >= 0 && gms.board[i][j] == player) {
				maxContinuousDiaStep++;
				i--;
				j--;
			}
			var m = x + 1;
			var n = y + 1;
			while (m < gms.boardNumber && n << gms.boardNumber && gms.board[m][n] == player) {
				maxContinuousDiaStep++;
				m++;
				n++;
			}
			if (maxContinuousDiaStep >= step) {
				return true;
			} else {
				return false;
			}
		}
		if (checkDiagonal() == true) {
			return true;
		}
		return false;
	};

	this.saveGame = function(filename, gms) {
		var saveObj = {
			playerNumber: gms.playerNumber,
			boardNumber: gms.boardNumber,
			sequenceCount: gms.sequenceCount,
			board: gms.board,
			players: gms.players,
			currentplayer: gms.currentplayer,
			allStep: gms.allStep
		}

		var saveText = JSON.stringify(saveObj);
		var path = this.filePath + filename;
		var fileWtPromise = fileData.postString(path, saveText);
		fileWtPromise.then((rtn) => {
			console.log("save successed");
		}, (err) => {
			console.log(err);
		});
	};

	this.resumeGame = function(filename, gms) {
		var fileRdPromise = fileData.getJson(filename);
		return new Promise(function(fulfill, reject) {
			fileRdPromise.then((rtn) => {
				gms.playerNumber = rtn.playerNumber;
				gms.boardNumber = rtn.boardNumber;
				gms.sequenceCount = rtn.sequenceCount;
				gms.board = rtn.board;
				gms.players = rtn.players;
				gms.currentplayer = rtn.currentplayer;
				gms.allStep = rtn.allStep;
				fulfill(gms);
			}, (err) => {
				console.log(err);
			});
		});
	};
}

module.exports = {
	game: game
};
