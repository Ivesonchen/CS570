// var st = "Verizon and Wireless";
// console.log(st.match(/(a |an |or |the |and |but )/gi));

// console.log(/([a-zA-Z]|(\d)|(~))/.test("~"));

// var ss = "apple  apd"
// ss = ss.replace(/\s+/g," ");
// console.log(ss.split(' ').length);

var ss = "apple kld.dfl ! sdkfl;";
var after = '';
for(var i=0;i<ss.length;i++){
	if(/[a-zA-Z]|\d|\s/.test(ss[i])){
		after += ss[i];
	}else{
		after += ' ';
	}
}
console.log(after);


// nContent = content.replace(/\s+/g," ");


// var ive = "hello.wo\nr ;ld;\n";
// console.log(ig_symbol(ive));
//
// function ig_symbol(str){
// 	var after = '';
// 	for(var i=0;i<str.length;i++){
// 		if(/([a-zA-Z]|(\d))/.test(str[i])){
// 			after += str[i];
// 		}
// 	}
// 	return after;
// }