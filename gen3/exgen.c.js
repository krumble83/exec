exGEN.extend(exGEN.Module,{

		Include: function(name){
			return this.create('Include', arguments);
		},
		
		exportC: function(){
			var ret = ''
			, ident = 0
			, el;
			
			for(var i =0; i < this.node.children.length; i++){
				console.dir(exGEN.adopt(this.node.children[i]));
				el = exGEN.adopt(this.node.children[i]);
				ret += el.ExportC(ident);
			}
			return ret;
		}
})


/**************************************************************************************
	INCLUDE
**************************************************************************************/
exGEN.Include = exGEN.invent({
    create: 'include', 
    inherit: exGEN.Fragment,
	
    extend: {
		init: function(name){
			if(typeof name !== 'undefined')
				this.Name(name);
		},
		
		Name: function(value){
			return this.attr('name', value);
		},
		
		ExportC: function(ident){
			var ret = this.ident(ident);
			return ret + '#include ' + this.attr('name') + ';\r\n';
		}
	}
});


exGEN.extend(exGEN.Declare, {
	Type: function(value){
		return this.attrNS.call(this, 'c', 'type', value);	
	},
	
	pointer: function(pointer){
		return this.attr('pointer', true);		
	},
	
	ExportC: function(ident){
		var ret = this.ident(ident)
		, call = exGEN.adopt(this.node.querySelector('call'));
		
		if(call && !call.attr('method')){
			var args = call.node.querySelectorAll('argument');
			ret += call.attr('object') + ' ' + this.attr('name') + '(';
			for(var i=0; i < args.length; i++)
				ret += exGEN.adopt(args[i]).Value() + ',';
			ret = ret.substring(0, ret.length-1);
			ret += ');\r\n';
		}
		if(call && call.attr('method') && call.attr('object')){
			var args = call.node.querySelectorAll('argument');
			ret += this.Type() + ' ' + this.attr('name') + ' = ' + call.attr('object') + '.' + call.attr('name') + '(';
			for(var i=0; i < args.length; i++)
				ret += exGEN.adopt(args[i]).Value() + ',';
			ret = ret.substring(0, ret.length-1);
			ret += ');\r\n';
		}
		return ret;
	}
	
})