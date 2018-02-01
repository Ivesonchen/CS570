var rb = require('redblack');
 
function dictionary(){
	var tree = rb.tree();
	
	this.get = function(key){
		if(tree.get(key)!==null){
			console.log(key +"  "+tree.get(key));
		}else{
			console.log("Can not find such key");
		}
	}
	this.insert = function(key,value){
		tree.insert(key,value);
	}
	this.delete = function(key){
		if(tree.get(key) !== null){
			tree.delete(key);
		}else{
			console.log("Can not find such key");
		}
	}
}

var ive = new dictionary();

ive.insert('hello','world');
ive.insert('goodbye','everyone');
ive.insert('name','student');
ive.insert('occupation','student');
ive.insert('year','2016');
ive.insert('gpa','4.0');
ive.insert('lab','yes');
ive.insert('assignment','no');
ive.insert('department','cs');

ive.get('gpa');
ive.get('department');
