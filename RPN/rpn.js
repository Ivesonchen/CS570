//This Reverse Polish Notation Calculator support +,-,*,/,%,POW operational character.
//The operand can be multi-digit numbers and decimal numbers.

var prompt = require('prompt-sync')();
var infixQ = new Queue();
var postQ = new Queue();
var opStack = new Stack();
var calculateStack = new Stack();
var ask;

do{
	var infix = prompt("Please input your mathematical problem in infix: ");
	
	convertInToPost();
	console.log("Your mathematical problem being expressed in postfix: ");
	postQ.print();
	console.log("Here is your final result: ");
	calculate();
	
	ask = prompt("Input y to restart, n to stop: ");
}while(ask == "y")


function Queue() {
	var items = [];
	this.enqueue = function(element) {
		items.push(element);
	};

	this.dequeue = function() {
		return items.shift();
	};

	this.front = function() {
		return items[0];
	};

	this.isEmpty = function() {
		return items.length == 0;
	};

	this.clear = function() {
		items = [];
	};

	this.size = function() {
		return items.length;
	};

	this.print = function() {
		console.log(items.toString());
	};
}

function Stack() {
	var items = [];
	this.push = function(element) {
		items.push(element);
	};

	this.pop = function() {
		return items.pop();
	};

	this.peek = function() {
		return items[items.length - 1];
	};

	this.isEmpty = function() {
		return items.length == 0;
	};

	this.clear = function() {
		items = [];
	};

	this.size = function() {
		return items.length;
	};

	this.print = function() {
		console.log(items.toString());
	};
}

function isNumber(num) {
	var reg = /^[0-9]*$/;
	return reg.test(num);
}

function lowPrecedence(a,b){
	if((a == "+" || a == "-")&&(b == "*" || b == "/" || b == "%" || b == "POW"))
		return true;
	else if ((a == "*" || a == "/" || a == "%") && (b == "POW"))
		return true;
	else
		return false;
}
// function isSeparator(m){
// 	if(m == " " || m == "(" || m == ")")
// 		return true;
// }


function convertInToPost() {

	var i, j;
	var temp = "";
	var str = "";
	for (i = 0; i < infix.length; i++) {
		infixQ.enqueue(infix[i]);
	}
	infixQ.print();
	while (!infixQ.isEmpty()) {
		temp = infixQ.front();
		infixQ.dequeue();
		if (isNumber(temp) || temp == "."){
			str += temp;
			if(infixQ.isEmpty()){
				if(str != ""){
					postQ.enqueue(str);
					str = "";
				}
			}
		}
		else if (temp == " "){
			if(str != ""){
				postQ.enqueue(str);
				str = "";
				// console.log("space end");
			}
		}
		else if (temp == "("){
			opStack.push(temp);
		}
		else if (temp == ")") {
			postQ.enqueue(str);
			str = "";
			while (opStack.peek() != "(") {
				postQ.enqueue(opStack.peek());
				opStack.pop();
			}
			opStack.pop();
		} else {
			if(str != ""){
				postQ.enqueue(str);
				str = "";
			}
			if (temp == "P"){
				infixQ.dequeue();
				infixQ.dequeue();
				while (!opStack.isEmpty() && opStack.peek() != "(" && opStack.peek() != " " && lowPrecedence("POW",opStack.peek())) {
					postQ.enqueue(opStack.peek());
					opStack.pop();
				}
				opStack.push("POW");
			}
			else{
				while (!opStack.isEmpty() && opStack.peek() != "(" && opStack.peek() != " " && lowPrecedence(temp,opStack.peek())) {
					postQ.enqueue(opStack.peek());
					opStack.pop();
					// console.log("hh");
				}//precendence higher coming
				opStack.push(temp);
				// console.log("operator");
			}
		}
	}
	while (!opStack.isEmpty()){
		postQ.enqueue(opStack.peek());
		// console.log(opStack.peek());
		opStack.pop();
	}
	
}

function calculate(){
	var number1,number2,result;
	var temp;
	while (!postQ.isEmpty()){
		temp = postQ.front();
		postQ.dequeue();
		if(temp == "+"){
			number2 = parseFloat(calculateStack.pop());
			number1 = parseFloat(calculateStack.pop());
			result = number1 + number2;
			calculateStack.push(result.toString());
		}
		else if (temp == "-"){
			number2 = parseFloat(calculateStack.pop());
			number1 = parseFloat(calculateStack.pop());
			result = number1 - number2;
			calculateStack.push(result.toString());
		}
		else if (temp == "*"){
			number2 = parseFloat(calculateStack.pop());
			number1 = parseFloat(calculateStack.pop());
			result = number1 * number2;
			calculateStack.push(result.toString());
		}
		else if (temp == "/"){
			number2 = parseFloat(calculateStack.pop());
			number1 = parseFloat(calculateStack.pop());
			result = number1 / number2;
			calculateStack.push(result.toString());
		}
		else if (temp == "%"){
			number2 = parseFloat(calculateStack.pop());
			number1 = parseFloat(calculateStack.pop());
			result = number1 % number2;
			calculateStack.push(result.toString());
		}
		else if (temp == "POW"){
			number2 = parseFloat(calculateStack.pop());
			number1 = parseFloat(calculateStack.pop());
			result = Math.pow(number1,number2);
			calculateStack.push(result.toString());
		}
		else{
			calculateStack.push(temp);
		}
	}
	console.log(calculateStack.pop());
}