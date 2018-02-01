var sortarry = [23, 34, 8, 234, 234, 778, 998, 231, 0];
var flag1;
var flag2;
function bouncebubbleSort(sortarry)
{
    
    do {
		sortFromBegin();
		// console.log(a);
		sortFromEnd();
		// console.log(a);
    } while (flag1 || flag2);
}

function sortFromBegin(){
    flag1 = false;
    for (var i=0; i < sortarry.length-1; i++) {
        if (sortarry[i] > sortarry[i+1]) {
            var temp = sortarry[i];
            sortarry[i] = sortarry[i+1];
            sortarry[i+1] = temp;
            flag1 = true;
        }
    }
	console.log("sort from beginning");
}
function sortFromEnd(){
	flag2 = false;
    for (var i=sortarry.length-1;i > 0;i--) {
        if (sortarry[i] < sortarry[i-1]) {
            var temp = sortarry[i];
            sortarry[i] = sortarry[i-1];
            sortarry[i-1] = temp;
            flag2 = true;
        }
    }
	console.log("sort from the end");
}


bouncebubbleSort(sortarry);
console.log(sortarry);