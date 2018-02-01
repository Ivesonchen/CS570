var fs = require("fs");

var data = fs.readFileSync("infile.dat");
var content = data.toString();
var queue = new PriorityQueue();
var output = "";
var val;
var result = 0;
var allChar = 0;

var hashMap = {
    Set : function(key,value){this[key] = value},  
    Get : function(key){return this[key]},
    Contains : function(key){return this.Get(key) == null?false:true},  
	Increase : function(key){
		if(this.Contains(key)){
			this[key] = this.Get(key)+1;
		}else{	
		}
	}
};



count();
showCount();
showhuff();

// console.log(hashMap.Get("k"));


writeToFile();

function writeToFile(){
	fs.writeFile('outfile.dat',output,function(err) {
	   if (err) {
	       return console.error(err);
	   }
	   console.log("Calculate compelete");
	});
}

function PriorityQueue() {
	var items = [];
	var queueElement = [];

	this.enq = function(queueElement) {
		if (this.isEmpty()) {
			items.push(queueElement);
		} else {
			var added = false;
			for (var i = 0; i < items.length; i++) {
				if (queueElement.frequency < items[i].frequency) {
					items.splice(i, 0, queueElement);
					added = true;
					break; 
				}
			}
			if (!added) {
				items.push(queueElement);
			}
		}
	}
	
	this.look = function(i){
		return items[i];
	}

	this.isEmpty = function() {
		return items.length == 0;
	}
	
	this.length = function(){
		return items.length;
	}

	this.print = function() {
		return items;
	}

	this.deq = function() {
		items.shift();
	}

	this.peek = function() {
		if (this.isEmpty()) {
			console.log("Simulation compelete");
		} else {
			return items[0];
		}
	}
	
	this.reverse = function(){
		items.reverse();
	}
}

function count(){
	for(var i=65;i<=90;i++){
		hashMap.Set(String.fromCharCode(i),0);
	}
	for(var i=97;i<=122;i++){
		hashMap.Set(String.fromCharCode(i),0);
	}
	for(var i=48;i<=57;i++){
		hashMap.Set(String.fromCharCode(i),0);
	}
	for(var i=0;i<content.length;i++){
		hashMap.Increase(content[i]);
	}// scan all character
	
	for(var i=65;i<=90;i++){
		allChar += hashMap.Get(String.fromCharCode(i));
	}
	for(var i=97;i<=122;i++){
		allChar+= hashMap.Get(String.fromCharCode(i));
	}
	for(var i=48;i<=57;i++){
		allChar += hashMap.Get(String.fromCharCode(i));
	}//calcualte numbers of character
	
	for(var i=65;i<=90;i++){
		if(hashMap.Get(String.fromCharCode(i))>0){
			var fre = hashMap.Get(String.fromCharCode(i))/allChar;
			// var temp = String.fromCharCode(i)+"    \t"+fre.toFixed(2) + "\n";
			// output += temp;
			queue.enq({frequency:fre.toFixed(2),weight:hashMap.Get(String.fromCharCode(i)),symbol:String.fromCharCode(i)});
		}
	}
	for(var i=97;i<=122;i++){
		if(hashMap.Get(String.fromCharCode(i))>0){
			var fre = hashMap.Get(String.fromCharCode(i))/allChar;
			// var temp = String.fromCharCode(i)+"    \t"+fre.toFixed(2) + "\n";
			// output += temp;
			queue.enq({frequency:fre.toFixed(2),weight:hashMap.Get(String.fromCharCode(i)),symbol:String.fromCharCode(i)});
		}
	}
	for(var i=48;i<=57;i++){
		if(hashMap.Get(String.fromCharCode(i))>0){
			var fre = hashMap.Get(String.fromCharCode(i))/allChar;
			// var temp = String.fromCharCode(i)+"    \t"+fre.toFixed(2) + "\n";
			// output += temp;
			queue.enq({frequency:fre.toFixed(2),weight:hashMap.Get(String.fromCharCode(i)),symbol:String.fromCharCode(i)});
		}
	}
	
}

function showCount(){
	queue.reverse();
	output += "Symbol\tFrequency\n";
	for(var i=0;i<queue.length();i++){
		output += queue.look(i).symbol+"      \t"+queue.look(i).frequency+"\n";
	}
}

function createTree(probabilities) {
  const array = []
  // for (let key in probabilities) {
  //   const value = parseInt(probabilities[key])
  //   if (probabilities.hasOwnProperty(key) &&
  //       !isNaN(value) &&
  //       value >= 1) {
  //     array.push({ key, value: probabilities[key] })
  //   }
  // }//循环将键值对插入array
  
  while (!probabilities.isEmpty()){
  	var key = probabilities.peek().symbol;
  	var temp1 = probabilities.peek().weight;
	array.push({key,value:temp1});
  	probabilities.deq();
  }

  array.sort((a, b) => a.value - b.value)

  while (array.length > 1) {
    const [left, right] = array.splice(0, 2)
    const value = left.value + right.value
    array.splice(binaryIndexOf(value, array), 0, { left, right, value })
  }//叶子值加和生成根节点值

  return array[0]
}

function binaryIndexOf(value, array) {
  let low = 0, high = array.length
  while (low < high) {
    const mid = (low + high) >>> 1
    const computed = array[mid].value
    if (computed <= value) {
      low = mid + 1
    } else if (computed > value){
      high = mid
    }
  }
  return high
}//返回value的序号位置

function encodeTree(tree) {
  if (!tree) return {}
  const huf = {}
  encodeTreeIter(tree, '', huf)
  return huf
}

function encodeTreeIter(tree, str, huf) {
  if (tree.key) {
    huf[tree.key] = str
  } else {
    encodeTreeIter(tree.left, str + '0', huf)
    encodeTreeIter(tree.right, str + '1', huf)
  }
}//从上至下赋值01

function huffman(probabilities) {
  return encodeTree(createTree(probabilities))
}

function showhuff(){
	output += "\nSymbol\tHuffmanCode\n";
	val = huffman(queue);

	for(let key in val){
		var temp = key +"      \t"+val[key]+"\n";
		output += temp;
		result += val[key].length * hashMap.Get(key);
	}
	output += "\nTotalBits: "+ result;
}