var fs = require('fs');
var prompt = require('prompt-sync')();
var routerArray = [];
var currentSource;

readFromCon();
process();

// for(var j in routerArray){
// 	routerArray[j].originatePacket();
// }
// for(var i in routerArray){
// 	// console.log(routerArray[i].dirRouters.v);
// 	console.log("-----------");
// 	console.log(routerArray[i].list.v);
// 	console.log(routerArray[i].outgoingLink);
// }

function readFromCon(){
	var input = fs.readFileSync("infile.dat");
	// console.log(data.toString());
	var data = input.toString();
	var dataArray = data.split("\n");
	
	// console.log(dataArray);
	
	for(var i in dataArray){
		var readLine = dataArray[i];
		var element = readLine.split(/\s+/);
		// console.log(element);
		if(element[0] != ''){
			
			var routingList = new list();
			// console.log(routingList);
			var nRouter = new router(element[0],element[1],routingList);
			currentSource = nRouter;
			routerArray[nRouter.id] = nRouter;
			
		}else{
			if(element[2] != undefined){
				routingLisr.addedge(currentSource.id,element[1],element[2]);
				// currentSource.dirRouters = new list();
				// currentSource.dirRouters.addedge(currentSource.id,element[1],element[2]);
				// set cost
			}else{
				// currentSource.dirRouters = new list();
				// currentSource.dirRouters.addedge(currentSource.id,element[1],1);
				routingList.addedge(currentSource.id,element[1],1);
				//default cost 1
			}
		}
	}
}

function process(){
	while (true) {
	    console.log("Fllow the instructions below:");
	    console.log("C : Continue");
		console.log("Q : Quit");
		console.log("P followed by the routers id : Print the routing table of a router");
		console.log("S followed by the id : Shut down a router");
		console.log("T followed by the id : Start up a router");
	    var choice = prompt("What do you want to do: ");
	    if (choice == "c") {
	            for (var index in routerArray) {
	                routerArray[index].originatePacket();
	        }
	    }
	    else if (choice == "q" || choice =="Q") {
	        break;
	    }
	    else if (choice[0] == "p" || choice[0] == "P") {
	        if (routerArray[choice[1]].status == "run") {
				format(choice[1]);
	        }
	        else {
				console.log("----------------------------------------");
	            console.log(choice + " has been shutdown");
				console.log("----------------------------------------");
				
	        }
	    }
	    else if (choice[0] == "s" || choice[0] == "S") {
	        routerArray[choice[1]].status = "stop";
	    }
	    else if (choice[0] == "t" || choice[0] == "T") {
	        routerArray[choice[1]].status = "run";
		
	    }
	}
}

function format(index){
	console.log("----------------------------------------");
	for(var i in routerArray[index].outgoingLink){
		if(routerArray[i].status == "run"){
			console.log(routerArray[i].networkName + " outgoingLink: "+
			routerArray[index].outgoingLink[i].outgoingLink+" cost: "+ 
			routerArray[index].outgoingLink[i].cost);
		}
	}
	console.log("----------------------------------------");
	
}

function router(id,networkName,list){
	this.status = "run";
	this.id = id;
	this.networkName = networkName;
	this.tick = 0;
	this.list = list;
	this.dirRouters = list;
	this.outgoingLink = {};
	this.sendList = {};
	this.sequenceNumber = 0;
	this.haveseenList = {};
	this.originLSP = null;
	
	this.receivePacket = function(lsp) {
		// console.log(lsp);
		if (this.status == "run") {
			lsp.TTL--;
			// console.log(lsp.TTL);
			if (this.checkLSP(lsp)) {
				// console.log("pass");
				// pass
				this.merge(lsp);

				var dij = new dijkstra();
				this.outgoingLink = dij.compute(this.id,this.list);
				
				for (var index in this.dirRouters.v[this.id]) {
					// console.log("b");
					var newPacket = this.tranLSP(lsp);
					newPacket.from = this.id;
					if (routerArray[index].receivePacket(newPacket) == true) {
						if (this.sendList[this.tick] == undefined) {
							this.sendList[this.tick] = {};
						}
						this.sendList[this.tick][index] = 1;
					}
				}

			} else {
				//can't pass
			}
			return true;
		} else {
			return false;
		}
	}

	this.originatePacket = function(){
        if (this.status == "run") {
            this.tick = this.tick +1 ;
            this.sendList[this.tick] = {};
			this.sequenceNumber = this.sequenceNumber + 1;
			
	        this.originLSP = new LSP();
	        this.originLSP.routerId = this.id;
	        this.originLSP.sequenceNumber = this.sequenceNumber;
	        this.originLSP.list = {};
	        this.originLSP.TTL = 10;
			this.originLSP.list = this.list.v;
			// console.log(this.dirRouters.v[this.id]);
            for (var index in this.dirRouters.v[this.id]) {
				// console.log(this.originLSP);
				// console.log("A");
                var newPacket = this.tranLSP(this.originLSP);
                newPacket.from = this.id;
				// console.log(index);
				// console.log(newPacket);
				
                if (routerArray[index].receivePacket(newPacket) == true) {
                    this.sendList[this.tick][index] = 1;
                }// send to all connected routers, edit the send record
            }
			//check when second continue happens
            if (this.tick >= this.TICK_CHECK) {
                this.checkTicks();
            }
        }
	}
	
	this.checkTicks = function(){
        for (var index in this.dirRouters.v[this.id]) {
            if (this.sendList[this.tick][index] == undefined && this.sendList[this.tick - 1][index] == undefined) {
                this.dirRouters.v[this.id][index] = Infinity;
				this.list.v[this.id][index] = Infinity;
            }
            if (this.sendList[this.tick][index] != undefined) {
                this.dirRouters.v[this.id][index] = 1;//check
                if (this.dirRouters.v[this.id][index] == Infinity) {
                    this.dirRouters.v[this.id][index] = routerArray[index].dirRouters.v[index][this.id];
					this.list.v[this.id][index] = routerArray[index].dirRouters.v[index][this.id];
                }
            }
        }
	}
	
	this.checkLSP = function(lsp){
        if (lsp.TTL <= 0) {
            return false;
        }else if (this.haveseenList[lsp.routerId] == null) {
            this.haveseenList[lsp.routerId] = lsp.sequenceNumber;
			return true;
        }else {
            if (this.haveseenList[lsp.routerId] >= lsp.sequenceNumber) {
                return false;
            }else{
            	return true;
            }
        }
	}
	
	this.tranLSP = function(pac){
		// console.log(this.originLSP);
		
		var after = new LSP();
		// console.log(pac);
		for(var i in pac){
			after[i] = pac[i];
			// after.list.v[i] = lsp.list.v[i];
		}
		return after;
	}
	
	this.merge = function(lsp){
		// console.log(lsp);
		// console.log(this.list);
		for(var i in lsp.list){
			for(var j in lsp.list[i]){
				// console.log(i);
				// console.log(j);
				// console.log(this.list.v[i]);
				this.list.addedge(i,j,lsp.list[i][j]);
			}
		}
	}
}

function LSP(){
    this.routerId = null;
    this.sequenceNumber = null;
    this.list = {};
	this.from = null;
	this.TTL = 10;
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
		// console.log(this.outgoingLink);

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

function graph(){
	// this.scale = scale;
	this.startV = [];

	this.add = function(edge){
		if(this.startV[edge.start] == undefined){
			this.startV[edge.start] = [];
		}
		var item = new listElement(edge.end,edge.cost);
		this.startV[edge.start].push(item);
	}
}

function edge(start,end,cost){
	this.start = start;
	this.end = end;
	this.cost = cost;
}

function listElement(endPoint,cost){
	this.endPoint = endPoint;
	this.cost = cost;
}