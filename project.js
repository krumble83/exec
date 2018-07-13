

define(window, 'Project', function(){
	this.devices = [];
	this.graphs = {};
	this.functions = {};
	this.vars = {};
	
	this.open = function(data){
		this.data = clone(data);
	};
	
	this.listDevices = function(){
		return this.devices;
	}
});