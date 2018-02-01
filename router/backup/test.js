function list(){
	this.v = {};

	this.addedge = function(start,end,cost){
		if(this.checkstart(start)){
			this.v[start][end] = cost;
		}else{
			var second = {};
			second[end] = cost;
			this.v[start] = second;
		}

	}

	this.checkstart = function(index){
		if(this.v[index] == undefined){
			return false;
		}else{
			return true;
		}
	}

	this.checkend = function(index1,index2){
		if(this.v[index1]!= undefined){
			if(this.v[index1][index2] == undefined){
				return false;
			}else{
				return true;
			}
		}
	}

	this.size = function(){
		var len = 0;
		for(var i in this.v){
			len++;
		}
		return len;
	}

	this.getstart = function(){
		for(var i in this.v){
			console.log(i);
			console.log(this.v[i]);
		}
	}

}

function dijkstra(){
	this.start = null;
	this.list = null;
    this.dis = {};
    this.book = {};
    this.outgoingLink = {};
	this.fullOut = {};

	this.compute = function(start,list){
		this.start = start;
		this.list = list;
		var index;
        // console.log(start,list.v);
		for(var i in list.v){
			this.dis[i] = Infinity;
			this.book[i] = 0;
			this.outgoingLink[i] = parseInt(i);
		}
		delete this.dis[start];
		delete this.outgoingLink[start];
		for(var i in this.list.v[start]){
			this.dis[i] = this.list.v[start][i];
			this.outgoingLink[i] = parseInt(i);
		}

		// console.log(this.dis);
	// 	console.log(this.outgoingLink);

		for(var i=0;i<this.list.size()-1;i++){
			var min = Infinity;

			// console.log("a");
			for(var j in this.dis){
				// console.log("b");

				if (this.book[j]==0 && this.dis[j] < min){
					// console.log("c");
					min = this.dis[j];
					index = j;
				}
				// console.log(index);
			}
			this.book[index] = 1;
			for(var m in this.list.v[index]){
				if(this.dis[m]!=undefined){
					if(this.list.v[index][m] + this.dis[index] < this.dis[m]){
						this.dis[m] = this.list.v[index][m] + this.dis[index];
						// console.log(m);
						// console.log(index);
						if(this.outgoingLink[m] == m || this.ougoingLink[m] == Infinity){
							this.outgoingLink[m] = parseInt(index);
						}
					}
				}else{
				}

			}
			// console.log("_________");
		}
		// console.log("-----------");
		// console.log(this.book);
		// console.log(this.dis);
		// console.log(this.outgoingLink);
		for(var index in this.dis){
			if(this.book[index] == 1){
				this.fullOut[index] = {outgoingLink:this.outgoingLink[index],cost:this.dis[index]}
			}
		}
		// console.log(this.fullOut);
		return this.fullOut;
	}
}

var ive = new list();
ive.addedge(2,1,3);
ive.addedge(1,2,1);
ive.addedge(1,3,4);
ive.addedge(2,3,1);
ive.addedge(3,1,4);
ive.addedge(2,4,1);
ive.addedge(4,3,1);
// console.log(ive.size());
var d = new dijkstra();

d.compute(1,ive);

// var l = new list();
//
// console.log(l);
// console.log(ive.checkend(2,1));
// ive.getstart();




// var i = Infinity;
// var v = 2;
// console.log(i<v);
//
// var ive = "s2";
// console.log(ive[1]);