;(function(ctx){

var exGRAPH = {};
ctx.exGRAPH = exGRAPH;

/**************************************************************************************
	BASE
**************************************************************************************/
exGRAPH.Base = exGEN.invent({
    create: 'base',
	inherit: exGEN.Element,
	parent: exGRAPH,
	extend: {
		create: function(type, args){
			if(!exGRAPH[type])
				return console.log('cant create ' + type + ' from exGRAPH', exGRAPH);
			var ret = new exGRAPH[type];
			this.add(ret);
			if(typeof ret.init === 'function' && args)
				ret.init.apply(ret, args);
			return ret;		
		},
		
		merge: function(src){
			var me = this;
			
			me.mergeAttrs(src);
			src.select('*').each(function(){
				me.add(this.clone(exGRAPH));
			});
			return this;
		},
		
		clone: function(){
			return exGEN.Element.prototype.clone.call(this, exGRAPH);
		}
	}
});



/**************************************************************************************
	LIBRARY
**************************************************************************************/
exGRAPH.Library = exGEN.invent({
    create: 'library',
	inherit: exGRAPH.Base,
	
    extend: {
		init: function(){
			this.node.style = 'display:none';
			document.body.appendChild(this.node);
			return this;
		},
		
		GetNode: function(id, package){
			if(package instanceof exGRAPH.Package)
				package = package.Id();
			
			return this.querySelector('node[id="' + package + '.' + id + '"],macro[id="' + package + '.' + id + '"]') || this.querySelector('node[id="' + id + '"],macro[id="' + id + '"]');
		},
		
		GetNodes: function(selector){
			var out = new exGEN.Set
			, parent ,ret;
			
			this.select(selector).each(function(){
				ret = this;
				if(ret instanceof exGRAPH.Node == false)
					ret = this.parent(exGRAPH.Node);
				if(!ret || out.index(ret) > -1)
					return;
				out.add(ret);
			});
			return out;
		},
		
		GetType: function(id, package){
			return this.querySelector('type[id="' + package + '.' + id + '"],structure[id="' + package + '.' + id + '"],enum[id="' + package + '.' + id + '"]') 
				|| this.querySelector('type[id="' + id + '"],structure[id="' + id + '"],enum[id="' + id + '"]');
		},
						
		Package: function(id){
			return this.querySelector('package[id="' + id + '"]') || this.create('Package', arguments);
		}
	}
});



/**************************************************************************************
	PACKAGE
**************************************************************************************/
exGRAPH.Package = exGEN.invent({
    create: 'package',
	inherit: exGRAPH.Base,
	
    extend: {
		init: function(id){
			this.Id(id);
			return this;
		},
		
		Id: function(id){
			return this.attr('id', id);
		},
		
		Category: function(name){
			return this.data('category', name);
		},
		
		Color: function(name){
			return this.data('color', name);
		},
						
		Symbol: function(name){
			return this.data('symbol', name);
		},

		Node: function(id, title){
			var ret = this.querySelector('node[id="' + this.attr('id') + '.' + id + '"]') || this.create('Node');
			ret.init.apply(ret, arguments);
			ret.attr('id', this.attr('id') + '.' + id)
			ret.Color(this.Color());
			ret.Symbol(this.Symbol());
			ret.Category(this.Category());
			return ret;
		},

		NodeTpl: function(id, title){
			var ret = this.querySelector('nodetpl[id="' + this.attr('id') + '.' + id + '"]') || this.create('Nodetpl');
			ret.init.apply(ret, arguments);
			ret.attr('id', this.attr('id') + '.' + id)
			ret.Color(this.Color());
			ret.Symbol(this.Symbol());
			ret.Category(this.Category());
			return ret;
		},
		
		Type: function(id){
			var ret = this.querySelector('type[id="' + this.attr('id') + '.' + id + '"]') || this.create('Type');
			ret.init.apply(ret, arguments);
			return ret.attr('id', this.attr('id') + '.' + id);
		},
		
		Macro: function(id){
			var ret = this.querySelector('macro[id="' + this.attr('id') + '.' + id + '"]') || this.create('Macro');
			ret.init.apply(ret, arguments);
			ret.attr('id', this.attr('id') + '.' + id);
			ret.Color(this.Color());
			ret.Symbol(this.Symbol());
			ret.Category(this.Category());
			return ret;
		},
		
		Device: function(id, label){
			var ret = this.querySelector('device[id="' + this.attr('id') + '.' + id + '"]') || this.create('Device');
			ret.init.apply(ret, arguments);
			return ret.attr('id', this.attr('id') + '.' + id);			
		},
		
		Struct: function(id, label){
			var ret = this.querySelector('structure[id="' + this.attr('id') + '.' + id + '"]') || this.create('Structure');
			//ret.attr('id', this.attr('id') + '.' + id);
			//ret.Inherits('core.type.struct');
			ret.init.apply(ret, arguments);
			return ret.attr('id', this.attr('id') + '.' + id);
		},
		
		Enum: function(id, label){
			var ret = this.querySelector('enum[id="' + this.attr('id') + '.' + id + '"]') || this.create('Enum');
			ret.Inherits('core.type.enum');
			ret.init.apply(ret, arguments);
			return ret.attr('id', this.attr('id') + '.' + id);
		},
		
		MakeAccessorNodes: function(data, color){
			// make
			var n = this.Node('make', 'Make ' + data.Label())
				.Id(data.Id() + '.' + 'make')
				.Keywords('make ' + data.Label())
				.Symbol('lib/img/make.png')
				.Color(color);
			
			data.select('pin').each(function(){
				n.Input(this.Id()).mergeAttrs(this);
			});
			n.Output('out', data.Id(), data.Label());
			this.add(n);
			
			// break
			n = this.Node('break', 'Break ' + data.Label())
				.Id(data.Id() + '.' + 'break')
				.Keywords('break ' + data.Label())
				.Symbol('lib/img/break.png')
				.Color(color);
			
			n.Input('in', data.Id(), data.Label());
			this.add(n);
			data.select('pin').each(function(){
				n.Output(this.Id()).mergeAttrs(this);
			});
			
			return data;
		}		
	}
});



/**************************************************************************************
	GRAPH / MACRO
**************************************************************************************/
exGRAPH.Graph = exGEN.invent({
    create: 'graph',
	inherit: exGRAPH.Base,
	
    extend: {
		init: function(){
			this.node.style = 'display:none';
			document.body.appendChild(this.node);
			return this;
		},
								
		Node: function(id){
			var ret = this.querySelector('node[id="' + this.attr('id') + '.' + id + '"]') || this.create('Node');
			ret.init.apply(ret, arguments);
			ret.attr('id', this.attr('id') + '.' + id)
			ret.Ctor('Node');
			return ret;
		},

		Link: function(){
			return this.create('Link', arguments);
		},
		
		Macro: function(id){
			var ret = this.querySelector('macro[id="' + id + '"]') || this.create('Macro');
			ret.init.apply(ret, arguments);
			return ret;			
		},
		
		GetNode: function(svgid){
			return this.querySelector('node[svgid="' + svgid + '"],macro[svgid="' + svgid + '"]');
		}
	}
});

exGRAPH.Macro = exGEN.invent({
    create: 'macro',
	inherit: exGRAPH.Graph,
	
    extend: {
		init: function(id, callback){
			this.Id(id);
			this.Ctor('NodeMacro');
			if(typeof callback === 'function')
				callback.apply(this);
			return this;
		},
		
		Id: function(id){
			return this.attr('id', id);
		},
		
		Keywords: function(name){
			return this.attr('keywords', name);
		},
		
		Subtitle: function(name){
			return this.attr('subtitle', name);
		},

		Tooltip: function(name){
			return this.attr('tooltip', name);
		},

		Color: function(name){
			return this.attr('color', name);
		},

		Title: function(label){
			return this.attr('title', label);
		},

		Symbol: function(name){
			return this.attr('symbol', name);
		},

		Category: function(name){
			if(name == undefined)
				return;
			var ret = this.select('category[name="' + name + '"]').first() || this.create('Category');
			ret.init.apply(ret, arguments);
			return this;
		},
		
		Ctor: function(name){
			return this.attr('ctor', name);
		},

		Input: function(){
			return this.create('Input', arguments);
		},
		
		Output: function(){
			return this.create('Output', arguments);
		},
		
		GetPackage: function(){
			return this.parent(exGRAPH.Package);
		},
		
		ImportNode: function(id){
			var ret = this.parent(exGRAPH.Library).GetNode(id);
			if(ret){
				ret = ret.clone();
				ret.select('category').each(function(){
					this.remove();
				});
				this.add(ret);
				return ret;
			}
		},
		
		
		MakeEntry: function(){
			this.Input('entry', 'core.exec');
			return this;
		},
		
		MakeExit: function(){
			this.Output('exit', 'core.exec');
			return this;
		}
	}
});



/**************************************************************************************
	DEVICE / PROVIDE / REQUIRE / COMPONENT / FUNCTION
**************************************************************************************/
exGRAPH.Device = exGEN.invent({
    create: 'device',
	inherit: exGRAPH.Base,
	
    extend: {
		init: function(id, label){
			if(typeof id !== 'undefined')
				this.Id(id);
			if(typeof label !== 'undefined')
				this.Label(label);
			return this;
			
		},
	
		Id: function(id){
			return this.attr('id', id);
		},
		
		Label: function(name){
			return this.attr('label', name);
		},
	
		Category: function(name){
			return this.attr('category', name);
		},

		Description: function(name){
			return this.attr('description', name);
		},

		Provide: function(){
			var args = [].slice.call(arguments)
			, ret;
			for (i = 0, il = args.length; i < il; i++)
				ret = this.querySelector('provide[id="' + args[i] + '"]') || this.create('Provide', [args[i]]);
			return ret;
		},

		Component: function(id, label){
			var ret = this.querySelector('component[id="' + this.attr('id') + '.' + id + '"]') || this.create('Component');
			return ret.init.apply(ret, arguments);
			//return ret;//.attr('id', this.attr('id') + '.' + id);			
		},
		
		Function: function(name, type){
			return this.create('Function', arguments);
		},
		
	}
});

exGRAPH.Provide = exGEN.invent({
    create: 'provide',
	inherit: exGRAPH.Base,
	
    extend: {
		init: function(id){
			if(typeof id !== 'undefined')
				this.Id(id);
			return this;
		},
	
		Id: function(id){
			return this.attr('id', id);
		},
	
		Require: function(){
			var args = [].slice.call(arguments);
			for (i = 0, il = args.length; i < il; i++)
				this.querySelector('require[id="' + args[i] + '"]') || this.create('Require', [args[i]]);
			return this;
		}
	}
});

exGRAPH.Component = exGEN.invent({
    create: 'component',
	inherit: exGRAPH.Provide,
	
    extend: {
		init: function(id, label){
			if(typeof id !== 'undefined')
				this.Id(id);
			if(typeof label !== 'undefined')
				this.Label(label);
			return this;
		},
	
		Multiple: function(){
			return this.attr('unique', true);
		},
		
		Label: function(name){
			return this.attr('label', name);
		}

	}
});

exGRAPH.Require = exGEN.invent({
    create: 'require',
	inherit: exGRAPH.Base,
	
    extend: {
		init: function(id){
			if(typeof id !== 'undefined')
				this.Id(id);
			return this;
		},
	
		Id: function(id){
			return this.attr('id', id);
		}

	}
});

exGRAPH.Function = exGEN.invent({
    create: 'function', 
    inherit: exGRAPH.Graph,
	
    extend: {
		init: function(name){
			if(typeof name !== 'undefined')
				this.node.setAttribute('name', name);
			return this;
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



/**************************************************************************************
	TYPE / EDITOR / STRUCTURE / ENUM
**************************************************************************************/
exGRAPH.Type = exGEN.invent({
    create: 'type',
	inherit: exGRAPH.Base,
	
    extend: {
		init: function(id, label){
			this.Id(id);
			this.Label(label);
			return this.Ctor('Pin').Color('#fff');
		},
		
		Id: function(id){
			return this.attr('id', id);
		},

		Label: function(name){
			return this.attr('label', name);
		},

		Color: function(name){
			return this.attr('color', name);
		},

		Ctor: function(name){
			return this.attr('ctor', name);
		},

		Inherits: function(){
			var me = this
			, args = [].slice.call(arguments);
			
			args.forEach(function(val){
				//console.log(val, me.parent(exGRAPH.Library).GetType(val, me.parent(exGRAPH.Package).Id()));
				//me.importAttrs(val);
				me.merge(me.parent(exGRAPH.Library).GetType(val, me.parent(exGRAPH.Package).Id()));
				me.attr('inherits', val + ((me.attr('inherits')) ? ',' + me.attr('inherits') : ''));
			});
			return this;
		},
		
		Accept: function(){
			var me = this
			, args = [].slice.call(arguments);
			
			args.forEach(function(val){
				console.log(me.parent(exGRAPH.Package));
				me.attr('accept', val + ((me.attr('accept')) ? ',' + me.attr('accept') : ''));
			});
			return this;
			
		},
		

		importAttrs: function(name){
			var base = this.parent(exGRAPH.Library).GetType(name, this.parent(exGRAPH.Package).Id());
			
			if(!base)
				return console.log('can\'t find type ' + name);
			
			return this.mergeAttrs(base);			
		},
		
		
		MakeLiteralNode: function(package){
			var pack = this.parent(exGRAPH.Library).Package(package);
			var n = pack.Node('make', 'Make literal (' + this.Label() + ')')
				.Import('tpl.node.pure')
				.Id(this.Id() + '.' + 'makeliteral')
				.Keywords('make ' + this.Label());
			n.Input('in', this.Id());
			n.Output('value', this.Id(), this.Label());
			pack.add(n);
			return n;
		},
		
		Editor: function(editor, deflt){
			var ret = this.select('editor').first() || this.create('Editor');
			return ret.init.apply(ret, arguments);
		},
		
		Tooltip: function(tip){
			return this.attr('tooltip', tip);
		}
	}
});

exGRAPH.Editor = exGEN.invent({
    create: 'editor',
	inherit: exGRAPH.Base,
	
    extend: {		
		init: function(name, deflt){
			this.Name(name);
			this.Default(deflt);
			return this;
		},
		
		Name: function(name){
			return this.attr('name', name);
		},
		
		Default: function(value){
			return this.attr('default', value);
		}
	}
});

exGRAPH.Structure = exGEN.invent({
    create: 'structure',
	inherit: exGRAPH.Type,
	
    extend: {
		
		init: function(){
			exGRAPH.Type.prototype.init.apply(this, arguments);
			this.Inherits('core.type.struct');
			return this;
		},
		
		Pin: function(id, type, label){
			var ret = this.querySelector('pin[id="' + id + '"]') || this.create('Pin');
			return ret.init.apply(ret, arguments);
		},

		
		MakeAccessorNodes: function(package){
			var pack = this.parent(exGRAPH.Library).Package(package);
			return pack.MakeAccessorNodes(this, '#00f');
		}

	}
});

exGRAPH.Enum = exGEN.invent({
    create: 'enum',
	inherit: exGRAPH.Type,
	
    extend: {
				
		Values: function(values){
			return this.attr('values', Array.isArray(values) ? JSON.stringify(values) : values);
		}
	}
});



/**************************************************************************************
	NODE / CATEGORY / NODETPL
**************************************************************************************/
exGRAPH.Node = exGEN.invent({
    create: 'node',
	inherit: exGRAPH.Base,
	
    extend: {
		init: function(id, title){
			this.Id(id);
			this.Title(title);
			this.Ctor('Node');
			return this;//.Color('#aaeea0');
		},
		

		Input: function(id, type, label){
			var ret = this.querySelector('input[id="' + id + '"]') || this.create('Input');
			return ret.init.apply(ret, arguments);
		},
		
		Output: function(id, type, label){
			var ret = this.querySelector('output[id="' + id + '"]') || this.create('Output');
			return ret.init.apply(ret, arguments);
		},
		
		Id: function(id){
			return this.attr('id', id);
		},
		
		Import: function(name){
			this.ImportAttrs(name);			
			this.ImportInputs(name);
			//this.ImportCategories(name);
			return this.ImportOutputs(name);
		},

		ImportAttrs: function(name){
			var base = this.parent(exGRAPH.Library).GetNode(name, this.parent(exGRAPH.Package).Id());
			
			if(!base)
				return console.log('can\'t find node ' + name);
			
			return this.mergeAttrs(base);			
		},
		
		ImportInputs: function(name){
			var me = this
			, base = this.parent(exGRAPH.Library).GetNode(name, this.parent(exGRAPH.Package).Id())
			, clone
			
			if(!base)
				return console.log('can\'t find node ' + name);
			base.select('input').each(function(){
				clone = exGEN.adopt(this.node.cloneNode(true), exGRAPH);
				me.add(clone);
			});
			return this;
		},

		ImportOutputs: function(name){
			var me = this
			, base = this.parent(exGRAPH.Library).GetNode(name, this.parent(exGRAPH.Package).Id())
			, clone
			
			if(!base)
				return console.log('can\'t find node ' + name);
			base.select('output').each(function(){
				clone = exGEN.adopt(this.node.cloneNode(true), exGRAPH);
				me.add(clone);
			});
			return this;			
		},

		ImportCategories: function(name){
			var me = this
			, base = this.parent(exGRAPH.Library).GetNode(name, this.parent(exGRAPH.Package).Id())
			, clone
			
			if(!base)
				return console.log('can\'t find node ' + name);
			base.select('category').each(function(){
				clone = exGEN.adopt(this.node.cloneNode(true), exGRAPH);
				me.add(clone);
			});
			return this;			
		},

		Ctor: function(name){
			return this.attr('ctor', name);
		},
		
		Category: function(name){
			if(name == undefined)
				return;
			var ret = this.select('category[name="' + name + '"]').first() || this.create('Category');
			ret.init.apply(ret, arguments);
			return this;
		},

		Keywords: function(name){
			return this.attr('keywords', name);
		},

		Title: function(name){
			return this.attr('title', name);
		},
		
		Subtitle: function(name){
			return this.attr('subtitle', name);
		},

		Tooltip: function(name){
			return this.attr('tooltip', name);
		},

		Symbol: function(name){
			return this.attr('symbol', name);
		},

		Color: function(name){
			return this.attr('color', name);
		},
		
		MakeEntry: function(){
			this.Input('entry', 'core.exec');
			return this;
		},
		
		MakeExit: function(){
			this.Output('exit', 'core.exec');
			return this;
		},
		
		GetPackage: function(){
			return this.parent(exGRAPH.Package);
		}
	}
});

exGRAPH.Category = exGEN.invent({
    create: 'category',
	inherit: exGRAPH.Base,
	
    extend: {
		init: function(name){
			return this.Name(name);
		},
		
		Name: function(name){
			return this.attr('name', name);
		}
	}
});

exGRAPH.Nodetpl = exGEN.invent({
    create: 'Nodetpl',
	inherit: exGRAPH.Node,
	
    extend: {
		init: function(id, title){
			this.Id(id);
			this.Title(title);
		},
		
		Create: function(type, title){
			
		}
	}
});

/**************************************************************************************
	PIN / INPUT / OUTPUT
**************************************************************************************/
exGRAPH.Pin = exGEN.invent({
    create: 'pin',
	inherit: exGRAPH.Base,
	
    extend: {
		init: function(id, type, label){
			this.Id(id);
			this.Type(type);
			this.Label(label);
			return this;
		},
		
		Id: function(id){
			return this.attr('id', id);
		},
		
		Type: function(name){
			return this.attr('type', name);
		},
		
		Label: function(name){
			return this.attr('label', name);
		},

		Group: function(name){
			return this.attr('group', name);
		},
		
		Tooltip: function(name){
			return this.attr('tooltip', name);
		},

		Optional: function(){
			return this.attr('optional', true);
		},
		
		Value: function(){
			return this.attr('value', true);
		}
	}
});

exGRAPH.Output = exGEN.invent({
    create: 'output',
	inherit: exGRAPH.Pin
});

exGRAPH.Input = exGEN.invent({
    create: 'input',
	inherit: exGRAPH.Pin
});



/**************************************************************************************
	LINK
**************************************************************************************/
exGRAPH.Link = exGEN.invent({
    create: 'link0',
	inherit: exGRAPH.Base,
	
    extend: {
		init: function(){
			return this;
		},
		
		Input: function(nodeid, pinid){
			return this.create('Input').attr('node', nodeid).attr('pin', pinid);
		},
		
		Output: function(nodeid, pinid){
			return this.create('Output').attr('node', nodeid).attr('pin', pinid);			
		}

	}
});


})(this);