var fs = require('fs');
var prompt = require('prompt-sync')();

/*
	initialize all the global variable
*/
var company;
var companyIm = new Array();
var companyCount = [];
var newContent = '';
var com = 0,art=0,allWord=0,allCount=0,allTimes=0;
var tree = new tries();


readFromCon();//read from the 'companies.dat' and format the data
initcount();//initialize the Array for count the match result

insertTotree(company);//initialize the tree based on the basic configuration

improve(' ');//creat improved matching rules which add space '_' to each end of the rule
insertTotree(companyIm);//update the tree

improve('.');//creat another improved matching rules which add '.' to each end of the rule
insertTotree(companyIm);//update the tree

// var fileName = prompt('Input the Article file name: ');
var data = fs.readFileSync("article.dat");
var content = data.toString();

processArticle();//cheack the line which consists entirely of a period symbol (.) do some seperations
match();// matching the content of the article with the tries tree.

dealWithc();//processing all the ignored words in matching rules
dealWitha();//processing all the ignored words in article
// show(companyCount);
all();//calculate the needed result
showAll();//output the result in standard formation




function readFromCon(){
	var data = fs.readFileSync("companies.dat");
	var content = data.toString();
	company = content.split('\n');
	for(var i=0;i<company.length;i++){
		company[i] = company[i].split('\t');
	}
}

function initcount(){
	for(var i=0;i<company.length;i++){
		companyCount[i] = {name:company[i][0],times:0,count:0};
	}
	// show(companyCount);
}

function improve(symbol){
	for(var i=0;i<company.length;i++){
		var com = [];
		for(var j=0;j<company[i].length;j++){
			com[j] = company[i][j] + symbol;			
		}
		companyIm[i] = com;
	}
	// console.log(companyIm);
}

function insertTotree(version){
	for(var i=0;i<version.length;i++){
		for(var j=0;j<version[i].length;j++){
			var id = version[i][j].split(' ');
			if(id[id.length-1] == ''){
				tree.insert(version[i][j],i,id.length-1);
			}else{
				tree.insert(version[i][j],i,id.length);
			}
		}
	}
}

function processArticle(){
	var sContent = content.split('\n');
	// console.log(sContent);
	for(var i=0;i<sContent.length;i++){
		// show(i);
		if(sContent[i].indexOf(".......") == -1){
			// console.log(sContent[i]);
			newContent += sContent[i];
			newContent += "\n";
		}else{
			// console.log("$");
			break;
		}
	}
	// console.log(newContent);
	
}

function match(){
	var currentNode = new triesNode();
	currentNode = tree.Root();
	var currentAc,i=0;
	while(i<newContent.length){
		// show('a');
		var endFlag = false,foundFlag = false;
		var positionF,positionE;
		// show(newContent[i]);
		currentAc = newContent[i];
		// show(currentNode);
		for(var j=0;j<currentNode.childLength();j++){
			if(currentAc == currentNode.child(j).symbol){
				// show(currentNode.child(j).symbol);
				foundFlag = true;
				positionF = j;
			}else if(currentNode.child(j).symbol == '^'){
				endFlag = true;
				positionE = j;
			}
		}//search each childnode of currentNode
		
		if(foundFlag == true){
			currentNode = currentNode.child(positionF);
			foundFlag = false;
			// show('c');
			i++;
		}else if (foundFlag == false && endFlag == true){
			// show(positionE);
			companyCount[currentNode.child(positionE).num].times ++;
			companyCount[currentNode.child(positionE).num].count += currentNode.child(positionE).val;
			currentNode = tree.Root();
			endFlag = false;
			// show('end');
			
		}else if (foundFlag == false && endFlag == false){
			currentNode = tree.Root();
			// show('b');
			i++;
		}
		//deal with each result
		
	}
}

function dealWithc() {
	for (var i = 0; i < companyIm.length; i++) {
		for (var j = 0; j < companyIm[i].length; j++) {
			if(companyIm[i][j].match(/(a |an |or|the|and |but)/gi) === null){
				com +=0;
			}else{
				com += companyIm[i][j].match(/(a |an |or|the|and |but)/gi).length;
			}
		}
	}
	// console.log(com);
}

function dealWitha(){
	if(newContent.match(/(a |an |or|the|and |but)/gi) === null){
		art = 0;
	}else{
		art = newContent.match(/(a |an |or|the|and |but)/gi).length;
	}
	// console.log(art);
}

function all(){
	console.log(companyCount);
	for(var i=0;i<companyCount.length;i++){
		allCount += companyCount[i].count;
	}
	allWord = newContent.split(' ').length - (art - com) + allCount;
	for(var i=0;i<companyCount.length;i++){
		allTimes += companyCount[i].times;
	}
}

function showAll(){
	console.log(formatSt("Company")+'\t'+"Hit Count"+'\t'+"Relevance");
	for(var i=0;i<companyCount.length;i++){
		console.log(formatSt(companyCount[i].name)+'\t'+companyCount[i].times+'\t\t'+formatDe(companyCount[i].times/allWord)+'%')
	}
	console.log(formatSt("    Total")+'\t'+allTimes+'\t\t'+formatDe(allTimes/allWord)+'%');
	console.log(formatSt("Total Words")+'\t'+allWord);
}




function tries(){
	var root = new triesNode();
	root.set('|');
	
	this.insert = function(str,position,size){
		var currentNode = root;
		// console.log(str.length);
		
		for(var i=0;i<str.length;i++){
			//for each character.str[i]
			// console.log(i);
			// console.log(str[i])
			// console.log('------');
			var flag1 = false;
			var flag2 = true;
			if (currentNode.childLength() == 0){
				var newNode = new triesNode();
				newNode.set(str[i]);
				// console.log(str[i]);
				currentNode.newChild(newNode);
				currentNode = newNode;
				flag2 = false;
				//if no child, create a new one.
			}else if(currentNode.childLength() > 0){
				for(var j=0;j<currentNode.childLength();j++){
					if(str[i] == currentNode.child(j).symbol){
						currentNode = currentNode.child(j);
						flag1 = true;
						break;
						//find the node which has the same symbol, move the pointer.
					}
				}
			}
			
			if(flag1 == false && flag2 == true){
				var newNode = new triesNode();
				newNode.set(str[i]);
				// console.log(str[i]);
				currentNode.newChild(newNode);
				currentNode = newNode;
				//can't find the node which has the same symbol, create a new one then move the pointer
			}
			
		}
		//insert all the character into tree.
		
		var end = new endNode(position,size);
		currentNode.newChild(end);
		//add a spical node for calculating
		
	}
	
	this.print = function(){
		preTraverse(root);	
	}
	this.Root = function(){
		return root;
	}
}

function preTraverse(node){
	if(node.symbol =='^'){
		console.log("end");
		console.log(node.num);
		show(node.val);
	}else if(node!==null){
		console.log(node.symbol);
		for(var i=0;i<node.childLength();i++){
			preTraverse(node.child(i));
		}
		console.log("----------");
	}
}

function triesNode(){
	var symbol = '';
	var items = [];
	
	this.childLength = function(){
		return items.length;
	}
	
	this.nextChild = function(){
		return items.length;
	}
	
	this.child = function(i){
		return items[i];
	}
	this.newChild = function(val){
		items[this.nextChild()] = val;
	}
	this.set = function(st){
		this.symbol = st;
	}
}

function endNode(num,val){
	this.symbol = '^';
	this.num = num;
	this.val = val;
}

function show(val){
	console.log(val);
}

function formatSt(st){
	for(var i=0;i<25-st.length;i++){
		st += ' ';
	}
	return st;
}

function formatDe(val){
	val = val * 100;
	if(val<10){
		return val.toFixed(3);
	}else{
		return val.toFixed(2);
	}
}