;(function(ctx){


exGRAPH.Project = exGEN.invent({
    create: 'project',
	inherit: exGRAPH.Base,
	
    extend: {
		init: function(id){
			this.node.style = 'display:none';
			document.body.appendChild(this.node);
			this.Id(id);
			return this;
		},
		
		Id: function(id){
			return this.attr('id', id);
		},
		
		Graph: function(id){
			var ret = this.querySelector('graph[id="' +  + '"]') || this.create('Graph');
			ret.init.apply(ret, arguments);
		},
		
		Function: function(id){
			var ret = this.querySelector('function[id="' +  + '"]') || this.create('Function');
			ret.init.apply(ret, arguments);
		},
		
		Macro: function(id){
			var ret = this.querySelector('macro[id="' +  + '"]') || this.create('Macro');
			ret.init.apply(ret, arguments);
		},
		
		Device: function(id){
			
		},
		
		Variable: function(id, type){
			
		},
		
		Get: function(){
			var me = this;
			return {
				Graphs: function(){
					return me.select('graph');
				},
				
				Functions: function(){
					return me.select('function');
				},
				
				Macros: function(){
					return me.select('macro');
				},
				
				Devices: function(){
					return me.select('device');
				},
				
				Variables: function(){
					return me.select('variable');
				}
			}
		}
	}
});


exGRAPH.Function = exGEN.invent({
    create: 'function', 
    inherit: exGRAPH.Graph,
	
    extend: {
		init: function(id){
			return this.Id(id);
		},
		
		Id: function(id){
			return this.attr('id', id);
		},
		
		Input: function(id, type, label){
			var ret = this.querySelector('input[id="' + id + '"]') || this.create('Input');
			return ret.init.apply(ret, arguments);
		},
		
		Output: function(id, type, label){
			var ret = this.querySelector('output[id="' + id + '"]') || this.create('Output');
			return ret.init.apply(ret, arguments);
		}
	}
});





exGRAPH.Property = exGEN.invent({
    create: 'property',
	inherit: exGRAPH.Base,
	
    extend: {
		init: function(id, type, dflt){
			this.Id(id);
			this.Type(type);
			return this;
		},
		
		Id: function(id){
			return this.attr('id', id);
		},
		
		Type: function(type){
			return this.attr('type', type);
		}
	}
});



exGEN.extend(exGRAPH.Node, {
	Property: function(name, type, deflt){
		var ret = this.select('property[id="' +  + '"]').first() || this.create('Property');
		ret.init.apply(ret, arguments);
	}
});

})(this);