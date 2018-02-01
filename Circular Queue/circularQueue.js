var prompt = require('prompt-sync')();

function listNode(val){
	this.val = val;
	this.next = null;
}

function circularQueue(size) {
	this.size = size;
	var actualSize = 0;
	var cQueue = new listNode("null");
	var position = cQueue;
	
	this.generate = function(){
		var current = cQueue;
		for (var i = 1; i <= size - 1; i++) {
			current.next = new listNode("null");
			current = current.next;
		}
		current.next = cQueue;
	}

	this.enqueue = function(item){
		actualSize++;
		position.val = item;
		position = position.next;
	}

	this.display = function(ins) {
		var instruction = ins;
		console.log("The queue has "+ actualSize + " items");
		var current = cQueue;
		if(instruction == "all"){
			for (var i = 1; i <= size; i++) {
				console.log(current.val);
				current = current.next;
			}
		}else{
			for (var i = 1; i <= actualSize; i++) {
				console.log(current.val);
				current = current.next;
			}
		}

	}
}
var circularQueue = new circularQueue(12);
circularQueue.generate();

do{
	var input = prompt("Input the string or 'quit' to quit:  ");
	if(input != "quit"){
		circularQueue.enqueue(input);
		console.log("--------");
		circularQueue.display("all");
		console.log("--------");
		
	}else{
		circularQueue.display();
	}
}while (input != "quit")



