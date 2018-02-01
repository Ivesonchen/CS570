/*
	test case is in "article.dat"
*/
var fs = require('fs');
var prompt = require('prompt-sync')();

/*
	initialize all the global variable
*/
var company;
var companyCount = [];
var content = '';
var nContent = '';
var newContent = '';
var com = 0,art=0,allWord=0,allCount=0,allTimes=0;
var tree = new tries();


readFromCon();//read from the 'companies.dat' and format the data
initcount();//initialize the Array for count the match result

insertTotree(company);//initialize the tree based on the basic configuration

readFromConsole();

/*
	process the article
*/
var newContent = ig_symbol(content);
ig_space();
nContent += '~';

match();// matching the content of the article with the tries tree.

dealWithc();//processing all the ignored words in matching rules
dealWitha();//processing all the ignored words in article
all();//calculate the needed result
showAll();//output the result in standard formation




function readFromCon(){
	var data = fs.readFileSync("companies.dat");
	var content = data.toString();
	company = content.split('\n');
	for(var i=0;i<company.length;i++){
		company[i] = company[i].split('\t');
	}
	// console.log(company);
}

function initcount(){
	for(var i=0;i<company.length;i++){
		companyCount[i] = {name:company[i][0],times:0,count:0,sp:0};
	}
	// show(companyCount);
}

function insertTotree(version){
	for(var i=0;i<version.length;i++){
		for(var j=0;j<version[i].length;j++){
			var id = version[i][j].split(' ');
			if(id[id.length-1] == ''){
				tree.insert(version[i][j],i,id.length-1);
			}else{

				if(version[i][j].match(/(a |an |or |the |and |but )/gi) === null){
					var sp = 0;
				}else{
					var sp = version[i][j].match(/(a |an |or |the |and |but )/gi).length;
				}
				// console.log(version[i][j]);
				// console.log(i);
				// console.log(id.length);
				// console.log(sp);
				tree.insert(version[i][j],i,id.length,sp);
			}
		}
	}
}

function readFromConsole(){
	console.log("Input the article: (end with . in another line)");
	while (true){
		var part = prompt();
		if(part == '.'){
			break;
		}else{
			content += part;
			content += ' ';
		}
	}
}

function match(){
	var currentNode = new triesNode();
	currentNode = tree.Root();
	var endNode = null;
	var currentAc,i=0;
	while(i<nContent.length){
		// console.log("&");
		var endFlag = false,foundFlag = false;
		var positionF,positionE;
		currentAc = nContent[i];
		// console.log(currentAc);
		for(var j=0;j<currentNode.childLength();j++){
			// console.log("@");
			if(currentAc == currentNode.child(j).symbol){
				// console.log(currentNode.child(j).symbol);				
				foundFlag = true;
				positionF = j;
			}else if(currentNode.child(j).symbol == '^'){
				endFlag = true;
				positionE = j;
			}
		}//search each childnode of currentNode
		
		if (foundFlag == true && endFlag == false){
			currentNode = currentNode.child(positionF);
			i++;
		}else if (foundFlag == true && endFlag == true){
			
			endNode = currentNode.child(positionE);
			currentNode = currentNode.child(positionF);
			i++;
		}else if (foundFlag == false && endFlag == true){
			endNode = currentNode.child(positionE);
			
			companyCount[endNode.num].times ++;
			companyCount[endNode.num].count += endNode.val;
			companyCount[endNode.num].sp += endNode.sp;
			endNode = null;
			// console.log("A");
			// console.log(companyCount[endNode.num].count);
			currentNode = tree.Root();
			
		}else if (foundFlag == false && endFlag == false){
			if (endNode === null){
				currentNode = tree.Root();
				i++;
			}else{
				companyCount[endNode.num].times ++;
				companyCount[endNode.num].count += endNode.val;
				companyCount[endNode.num].sp += endNode.sp;
				// console.log("B");
				// console.log(companyCount[endNode.num].count);
				endNode = null;
				currentNode = tree.Root();
			}
			// i++;
		}
		//deal with each result
	}
}

function dealWithc() {

	for(var i=0;i<companyCount.length;i++){
		com += companyCount[i].sp;
	}
	// console.log(com);
}

function dealWitha(){
	if(content.match(/(a |an |or|the|and |but)/gi) === null){
		art = 0;
	}else{
		art = content.match(/(a |an |or|the|and |but)/gi).length;
	}
	// console.log(art);
}

function all(){
	// console.log(companyCount);
	for(var i=0;i<companyCount.length;i++){
		allCount += companyCount[i].count;
	}
	// console.log(content.split(' ').length);
	// console.log(nContent);
	// console.log(nContent.split(' ').length);
	// console.log(art);
	// console.log(com);
	allWord = nContent.split(' ').length - 1 - (art - com);
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
	
	this.insert = function(str,position,size,sp){
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
		
		var end = new endNode(position,size,sp);
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

function endNode(num,val,sp){
	this.symbol = '^';
	this.num = num;
	this.val = val;
	this.sp = sp;
}

function ig_symbol(str){
	var after = '';
	for(var i=0;i<str.length;i++){
		if(/[a-zA-Z]|\d|\s/.test(str[i])){
			after += str[i];
		}else{
			after += ' ';
		}
	}
	return after;
}

function ig_space(){
	nContent = newContent.replace(/\s+/g," ");
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