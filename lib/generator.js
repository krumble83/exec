

var functions = {}
var var


function param(name, type, value){
	this.name = name;
}

paramFunc.prototype.type = function(type){
	this.type = type;
}

paramFunc.prototype.val = function(value){
	this.value = value;
}

function Output(){

}



Output.prototype.include = function(name){
	this.name = name;
	return {
		push: function(){}
		
		find: function(name){}
		
	}
}


Output.prototype.global = function(name, type, deflt){
	return {
		push: function(){}
		
		find: function(name){}
		
		remove: function(){}
		
		param: function(name, type, deflt){
		}
		
	}
}

Output.prototype.func = function(name){
	return {
		push: function(){}
		
		find: function(name){}
		
		remove: function(){}
		
		declare: paramFunc;
		
		return: paramFunc;
		
		param: function(name, type, deflt){
		}
		
	}
}