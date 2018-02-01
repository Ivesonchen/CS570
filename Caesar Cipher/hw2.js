var fs = require("fs");
var prompt = require('prompt-sync')();


// fs.readFile('test.txt',function(err,data){
// 	if(err){
// 		return console.error(err);
// 	}
// 	content = data.toString();
// 	console.log(typeof(content));
// 	console.log(content);
//
// });
var fileName = prompt("Please input your filename: ");
var data = fs.readFileSync(fileName);
var content = data.toString();
var count = 0;
var key = 5;
var symbolCode;
var output = "";
// console.log(content);
// console.log(content.length);

for(var i=0; i<content.length;i++){

	symbolCode = content[i].charCodeAt(0);
	// console.log(symbolCode);
	// console.log(content[i]);
	setKey();
	// console.log(key);
	if(symbolCode!=32){
		if(isLetter(symbolCode)){

			// console.log(key);
			decrypt(symbolCode);
			// console.log(symbolCode);
			// content[i] = String.fromCharCode(symbolCode);
			// console.log(String.fromCharCode(symbolCode));
			// console.log(content[i]);
			output += String.fromCharCode(symbolCode);
		}else{
			output += content[i];
		}
	}else{
		output += " ";
	}

}
writeToFile();

function isLetter(code){
	if(code>=65 && code<=90){
		return true;
	}else if(code>=97 && code<=122){
		return true;
	}else{
		return false;
	}
}

function decrypt(){
	if(symbolCode>=65 && symbolCode<=90){
		if(symbolCode >= (65+key)){
			symbolCode-=key;
		}else{
			symbolCode+=26;
			symbolCode-=key;
		}
	}else if(symbolCode>=97 && symbolCode<=122){
		if(symbolCode >= (97+key)){
			symbolCode-=key;
		}else{
			symbolCode+=26;
			symbolCode-=key;
		}
	}

}

function setKey(){
	if(count == 3){
		key+= 2;
		count = 1;
		if(key>=26){
			key = key % 26;
		}
	}else{
		count++;
	}
}

function writeToFile(){
	fs.writeFile('solution.txt',output,  function(err) {
	   if (err) {
	       return console.error(err);
	   }
	   console.log("Decrypted message has been writen into solution.txt");
	});
}