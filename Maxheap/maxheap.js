var prompt = require('prompt-sync')();
var mh = new maxheap();
do{
	var input = prompt("input the number or q to finish: ");
	if(input!="q"){
		mh.push(input);
	}
}while (input!="q")
console.log("------result-------");
mh.print();
console.log("-------------------");
do{
	var input = prompt("Delete the largest ? y for yes and n for no ");
	var flag = mh.delete(0);
	if (flag){
		console.log("----------");
		mh.print();
		console.log("----------");
	}

}while (input!="n" && flag)
// la.push(3);
// la.push(4);
// la.push(6);
// la.push(7);
// la.delete(0);
// la.delete(0);
//
// la.print();

function maxheap(){
	var items = [];
	
	this.push = function(val){
		var next = items.length;
		items[next] = val;
		this.sort();
		// this.print();
	}
	
	this.delete = function(index){
		if(items[index]!= undefined){
			items[index] = items[items.length - 1];
			items.length --;
			if(items.length == 0){
				console.log("It's empty");
				return false;
			}
			this.sort();
			return true;
		}else{
			console.log("It's empty");
			return false;
		}

		// this.print();
	}
	
	this.level = function(){
		var num = items.length;
		// console.log(num);
		var flag = true;
		var i=0,temp=0;
		while (flag){
			var temp_p = temp;
			temp += Math.pow(2,i);
			// var temp2 = Math.pow(2,i+1);
			if(num>=temp_p && num<=temp){
				flag = false;
				return i+1;
			}else{
				i++;
			}
		}
	}
	
	this.sort = function(){
		var index_l = sums(this.level()-1) -1;//last node index not in leave level
		// console.log(index);
		var index = index_l;
		while (index>=0){
			if (items[2*index+1] != undefined){
				if (items[index]<items[2*index+1]){
					var temp = items[index];
					items[index] = items[2*index+1];
					items[2*index+1] = temp;
					
					// console.log(index);
					// console.log("L");
				}
			}
			if (items[2*index+2] != undefined){
				if (items[index]<items[2*index+2]){
					var temp = items[index];
					items[index] = items[2*index+2];
					items[2*index+2] = temp;
					
					// console.log(index);
					// console.log("R");
					
				}
			}
			index--;
		}

	}
	
	this.print = function(){
		for(var i=0;i<items.length;i++){
			console.log("index: "+i+" value: "+items[i]);
		}
	}
	
}

function sums(n){
	var temp = 0;
	for(var i=0;i<n;i++){
		temp += Math.pow(2,i);
	}
	return temp;
}