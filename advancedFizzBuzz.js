var temp = 10;
var container = new Array();
for(var i=0;i<=240;i++){
	container[i] = temp;
	temp++;
}
FizzBuzzer(container);


function FizzBuzzer(arr){
	// var arr = new Array();
	for(var i=0;i<=240;i++){
		if(arr[i]%3==0 && arr[i]%5!=0){
			console.log("Buzz");
		}else if(arr[i]%3!=0 && arr[i]%5==0){
			console.log("Fizz");
		}else if(arr[i]%3==0 && arr[i]%5==0){
			console.log("BuzzFizz");
		}else{
			console.log(arr[i]);
		}
	}
}