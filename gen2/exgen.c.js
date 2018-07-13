
exGEN.extend(exGEN.Module,{

		Include: function(name){
			var ret = new exGEN.Include;
			this.Add(ret);
			ret.Init.apply(ret, arguments);
			ret.Attr('ns', 'c');
			return ret;
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
		Init: function(name){
			if(typeof name !== 'undefined')
				this.Name(name);
		},
		
		Name: function(value){
			return this.Attr('name', value);
		},
		
		ExportC: function(ident){
			var ret = this.ident(ident);
			return ret + '#include ' + this.Attr('name') + ';\r\n';
		}
	}
});


exGEN.extend(exGEN.Declare, {
	Type: function(value){
		return this.AttrNS.call(this, 'c', 'type', value);	
	},
	
	pointer: function(pointer){
		return this.Attr('pointer', true);		
	},
	
	ExportC: function(ident){
		var ret = this.ident(ident)
		, call = exGEN.adopt(this.node.querySelector('call'));
		
		if(call && !call.Attr('method')){
			var args = call.node.querySelectorAll('argument');
			ret += call.Attr('object') + ' ' + this.Attr('name') + '(';
			for(var i=0; i < args.length; i++)
				ret += exGEN.adopt(args[i]).Value() + ',';
			ret = ret.substring(0, ret.length-1);
			ret += ');\r\n';
		}
		if(call && call.Attr('method') && call.Attr('object')){
			var args = call.node.querySelectorAll('argument');
			ret += this.Type() + ' ' + this.Attr('name') + ' = ' + call.Attr('object') + '.' + call.Attr('name') + '(';
			for(var i=0; i < args.length; i++)
				ret += exGEN.adopt(args[i]).Value() + ',';
			ret = ret.substring(0, ret.length-1);
			ret += ');\r\n';
		}
		return ret;
	}
	
})