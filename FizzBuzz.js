var number;
for(number=74;number<=291;number++){
	if(number%3==0 && number%5!=0){
		console.log("Buzz");
	}else if(number%3!=0 && number%5==0){
		console.log("Fizz");
	}else if(number%3==0 && number%5==0){
		console.log("BuzzFizz");
	}else{
		console.log(number);
	}
}