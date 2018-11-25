;(function(ctx){

var exGRAPH = {};
ctx.exGRAPH = exGRAPH;


/**************************************************************************************
	BASE
**************************************************************************************/
exGRAPH.Base = exBASE.invent({
    create: 'base',
	inherit: exBASE.Element,
	parent: exGRAPH,
	extend: {
		
		init: function(){
			return this;
		},
		
		create: function(type, args){
			if(!exGRAPH[type])
				return console.warn('cant create ' + type + ' from exGRAPH', exGRAPH);
			var ret = new exGRAPH[type];
			this.add(ret);
			if(typeof ret.init == 'function' && args)
				ret.init.apply(ret, args);
			return ret;		
		},
		
		select: function(query){
			return exBASE.Element.prototype.select.call(this, query, exGRAPH);
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
			return exBASE.Element.prototype.clone.call(this, exGRAPH);
		},
		
		Flags: function(flags){
			return this.attr('flags', flags);
		},
		
		HasFlag: function(flag){
			var flags = parseInt(this.attr('flags') || 0);
			
			return flags & flag == flag;
		},
		
		Id: function(id){
			var path = (this.parent && this.parent() && this.parent().Id) ? this.parent().Id() : null;
			
			if(id){
				if(path)
					return this.attr('id', path + '.' + id);
				else
					return this.attr('id', id);
			}
			else if(this.attr('id'))
				return this.attr('id');
			return '';
		}
		
	}
});



/**************************************************************************************
	LIBRARY
**************************************************************************************/
exGRAPH.Library = exBASE.invent({
    create: 'library',
	inherit: exGRAPH.Base,
	
    extend: {
		init: function(id){
			return exGRAPH.Base.prototype.init.apply(this, arguments);
		},
		
		GetNode: function(id, package){
			if(package && package instanceof exGRAPH.Package)
				package = package.Id();
			
			return this.querySelector('node[id="' + package + '.' + id + '"],macro[id="' + package + '.' + id + '"]') || this.querySelector('node[id="' + id + '"],macro[id="' + id + '"]');
		},
		
		GetNodeTpl: function(id, package){
			if(package instanceof exGRAPH.Package)
				package = package.Id();
			
			return this.querySelector('nodetpl[id="' + package + '.' + id + '"]') || this.querySelector('nodetpl[id="' + id + '"]');
		},

		GetNodes: function(selector){
			var out = new exBASE.Set
				, parent 
				, ret;
			
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
		


		
		isArrayDataType: function(type){
			return type.search('\\[') != -1;
		},
		
		getArrayDataType: function(type){
			return type.replace('[]', '') + '[]';
		},
		
		removeArrayDataType: function(type){
			return type.replace('[]', '');
		},
		
		swapArrayDataType: function(type){
			if(this.isArrayDataType(type))
				return type.replace('[]', '');
			return type + '[]';			
		},
		
		getExecDataType: function(){
			return 'core.exec';
		},
		
		isExecDataType: function(type){
			return type == this.getExecDataType();
		},
		
		getWildcardsDataType: function(array){
			if(array)
				return 'core.wildcards[]';
			return 'core.wildcards';
		},

		isWildcardsDataType: function(type, arraycheck){
			if(arraycheck)
				return type == this.getWildcardsDataType(true);
			if(typeof arraycheck == 'undefined')
				return type == this.getWildcardsDataType(true) || type == this.getWildcardsDataType();
			return type == this.getWildcardsDataType();
		}
	}
});



/**************************************************************************************
	PACKAGE
**************************************************************************************/
exGRAPH.Package = exBASE.invent({
    create: 'package',
	inherit: exGRAPH.Base,
	parent: exGRAPH.Library,
	
    extend: {
		init: function(id){
			exGRAPH.Base.prototype.init.apply(this, arguments);
			return this.Id(id);
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
		
		Require: function(){
			//console.log('toto');
		}
	},
	
	construct: {
		Package: function(id){
			var ret = this.querySelector('package[id="' + id + '"]') || this.create('Package');
			return ret.init.apply(ret, arguments);
		}		
	}
});



/**************************************************************************************
	GRAPH / MACRO
**************************************************************************************/
exGRAPH.Graph = exBASE.invent({
    create: 'graph',
	inherit: exGRAPH.Base,
	
    extend: {
		init: function(id){
			return exGRAPH.Base.prototype.init.apply(this, arguments);
			//return this.Id(id);
		},

		Node: function(id){
			var ret = this.create('Node');
			return ret.init.apply(ret, arguments);
		},
		
		Macro: function(id){
			var ret = this.querySelector('macro[id="' + id + '"]') || this.create('Macro');
			return ret.init.apply(ret, arguments);
		},
		
		GetNode: function(svgid){
			return this.querySelector('node[svgid="' + svgid + '"],macro[svgid="' + svgid + '"]');
		},
		
		Context: function(context){
			return this.attr('context', context);
		}
	}
});

exGRAPH.Macro = exBASE.invent({
    create: 'macro',
	inherit: exGRAPH.Graph,
	parent: exGRAPH.Package,
	
    extend: {
		init: function(id, callback){
			exGRAPH.Graph.prototype.init.apply(this, arguments);
			this.Id(id);
			this.Ctor('NodeMacro');
			if(typeof callback == 'function')
				callback.apply(this, this);
			return this;
		},
		
		Keywords: function(name){
			return exGRAPH.Node.prototype.Keywords.apply(this, arguments);
		},
		
		Subtitle: function(name){
			return exGRAPH.Node.prototype.Subtitle.apply(this, arguments);
		},

		Tooltip: function(name){
			return exGRAPH.Node.prototype.Tooltip.apply(this, arguments);
		},

		Color: function(name){
			return exGRAPH.Node.prototype.Color.apply(this, arguments);
		},

		Title: function(label){
			return exGRAPH.Node.prototype.Title.apply(this, arguments);
		},

		Symbol: function(name){
			return exGRAPH.Node.prototype.Symbol.apply(this, arguments);
		},

		Category: function(name){
			return exGRAPH.Node.prototype.Category.apply(this, arguments);
		},
		
		Ctor: function(name){
			return exGRAPH.Node.prototype.Ctor.apply(this, arguments);
		},

		Input: function(){
			return exGRAPH.Node.prototype.Input.apply(this, arguments);
			//return this.create('Input', arguments);
		},
		
		Output: function(){
			return exGRAPH.Node.prototype.Output.apply(this, arguments);
			//return this.create('Output', arguments);
		},
		
		GetPackage: function(){
			return this.parent(exGRAPH.Package);
		},
		
		Node: function(id){
			var ret = this.parent(exGRAPH.Library).GetNode(id);
			
			assert(ret instanceof exGRAPH.Node);
			ret = ret.clone();
			ret.select('category').each(function(){
				this.remove();
			});
			this.add(ret);
			return ret;
		},
				
		MakeEntry: function(){
			return exGRAPH.Node.prototype.MakeEntry.apply(this);
		},
		
		MakeExit: function(){
			return exGRAPH.Node.prototype.MakeExit.apply(this);
		}
	},
	
	construct: {
		Macro: function(id){
			var ret = this.querySelector('macro[id="' + this.Id() + '.' + id + '"]') || this.create('Macro');

			ret.init.apply(ret, arguments);
			ret.Color(this.Color());
			ret.Symbol(this.Symbol());
			ret.Category(this.Category());
			return ret;
		}		
	}
});



/**************************************************************************************
	DEVICE / PROVIDE / REQUIRE / COMPONENT / FUNCTION
**************************************************************************************/
exGRAPH.Device = exBASE.invent({
    create: 'device',
	inherit: exGRAPH.Base,
	parent: exGRAPH.Package,
	
    extend: {
		init: function(id, label){
			exGRAPH.Base.prototype.init.apply(this, arguments);
			this.Id(id);
			this.Label(label);
			return this;
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
			var  args = [].slice.call(arguments)
			, parent;
						
			for(var a=1; a < args.length; a++){
				var s = args[a].split(',');
				for(var b=0; b < s.length; b++)
					this.create('Provide').init().attr(args[0], s[b]);
			}
			return this;
		},
		
		Function: function(name, type){
			return this.create('Function', arguments);
		},
		
	},
	
	construct: {
		Device: function(id, label){
			var ret = this.querySelector('device[id="' + this.Id() + '.' + id + '"]') || this.create('Device');

			ret.init.apply(ret, arguments);
			return ret;
		}		
	}
});

exGRAPH.Component = exBASE.invent({
    create: 'component',
	inherit: exGRAPH.Base,
	parent: exGRAPH.Device,
	
    extend: {
		init: function(id, label){
			exGRAPH.Base.prototype.init.apply(this, arguments);
			this.Id(id);
			this.Label(label);
			//this.Color('#ff0');
			return this;
		},
		
		Color: function(color){
			return this.attr('color', color);
		},
			
		Label: function(name){
			return this.attr('label', name);
		},
		
		Require: function(){
			var  args = [].slice.call(arguments)
			, parent;
						
			for(var a=1; a < args.length; a++){
				var s = args[a].split(',');
				for(var b=0; b < s.length; b++)
					this.create('Require').init().attr(args[0], s[b]);
			}
			return this;
		},

		Provide: function(id){
			var  args = [].slice.call(arguments)
			, parent;
						
			for(var a=1; a < args.length; a++){
				var s = args[a].split(',');
				for(var b=0; b < s.length; b++)
					this.create('Provide').init().attr(args[0], s[b]);
			}
			return this;
		},

		Component: function(id, label){
			var ret = this.querySelector('component[id="' + this.Id() + '.' + id + '"]') || this.create('Component');

			return ret.init.apply(ret, arguments);
		}
	},
	
	construct: {
		Component: function(id, label, callback){
			var ret = this.querySelector('component[id="' + this.Id() + '.' + id + '"]') || this.create('Component');

			if(typeof callback === 'function')
				callback.call(ret, ret);
			
			return ret.init.apply(ret, arguments);
		},
		
		Require: function(){
			var ret = this.create('Require');
			return ret.init.apply(ret, arguments);
		}
	}
});

exGRAPH.Require = exBASE.invent({
    create: 'require',
	inherit: exGRAPH.Base,
	
    extend: {
		init: function(id){
			exGRAPH.Base.prototype.init.apply(this, arguments);
			return this;
		},
		
		Component: function(id){
			var ret = this.create('Component');
			ret.init.apply(ret, arguments);
			return ret;
		}

	}
});

exGRAPH.Provide = exBASE.invent({
    create: 'provide',
	inherit: exGRAPH.Base,
	parent: exGRAPH.Component,
	
    extend: {
		init: function(id){
			exGRAPH.Base.prototype.init.apply(this, arguments);
			this.Id(id);
			return this;
		},
		
		Id: function(id){
			return this.attr('id', id);
		}
	},
	
	construct: {
		
	}
});



/**************************************************************************************
	TYPE / CLASS / EDITOR / STRUCTURE / ENUM
**************************************************************************************/
exGRAPH.Type = exBASE.invent({
    create: 'type',
	inherit: exGRAPH.Base,
	parent: exGRAPH.Package,
	
    extend: {
		init: function(id, label){
			exGRAPH.Base.prototype.init.apply(this, arguments);
			this.Id(id);
			this.Label(label);
			return this.Ctor('Pin').Color('#fff');
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

		Inherits: function(fromType){
			//console.log(this.Id(), fromType);
			var me = this
				, orgTitle = this.Label()
				, parent = me.GetPackage()
				, found;

			// first, search in current package
			found = parent.select(me.type.toLowerCase() + '[id="' + parent.Id() + '.' + fromType + '"]');

			if(found.length() == 0){
				parent = me.parent(exGRAPH.Library);
				found = parent.select(me.type.toLowerCase() + '[id="' + fromType + '"]');
			}
			
			if(found.length() == 1){
				me.merge(found.first());
				me.attr('inherits', '|' + fromType + ((me.attr('inherits')) ? me.attr('inherits') : '|'));
				if(orgTitle)
					me.Label(orgTitle + ' ' + (found.first().Label() || ''));
			} else {
				console.log('can\'t inherits of type "' + fromType + '" (' + this.Id() + ')');
			}

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
				
		MakeLiteralNode: function(package){
			var pack = this.parent(exGRAPH.Library).Package(package)
				, n = pack.Node('makeliteral', 'Make literal (' + this.Label() + ')')
					.Import('tpl.node.pure')
					.Keywords('make ' + this.Label());

			n.Input('in', this.Id());
			n.Output('value', this.Id(), this.Label());
			pack.add(n);
			return n;
		},
		
		Tooltip: function(tip){
			return this.attr('tooltip', tip);
		},
		
		GetPackage: function(){
			return this.parent(exGRAPH.Package);
		}
	},
	
	construct: {
		Type: function(id){
			var ret = this.querySelector('type[id="' + this.Id() + '.' + id + '"]') || this.create('Type');

			ret.init.apply(ret, arguments);
			return ret;
			//return ret.attr('id', this.GetPath() + id);
		}		
	}
});

exGRAPH.Object = exBASE.invent({
    create: 'object',
	inherit: exGRAPH.Type,
	
    extend: {
		init: function(id, label){
			exGRAPH.Type.prototype.init.apply(this, arguments);
			//this.Inherits('core.object');
			//this.Id(id);
			//this.Label(label);
			//return this;
			return this.Ctor('Pin').Color('#55f');
		}
	}
});

exGRAPH.Editor = exBASE.invent({
    create: 'editor',
	inherit: exGRAPH.Base,
	parent: exGRAPH.Type,
	
    extend: {		
		init: function(name, deflt){
			exGRAPH.Base.prototype.init.apply(this, arguments);
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
	}, 
	
	construct: {
		Editor: function(editor, deflt){
			var ret = this.select('editor').first() || this.create('Editor');

			return ret.init.apply(ret, arguments);
		}		
	}
});

exGRAPH.Structure = exBASE.invent({
    create: 'structure',
	inherit: exGRAPH.Type,
	parent: exGRAPH.Package,
	
    extend: {
		
		init: function(){
			exGRAPH.Type.prototype.init.apply(this, arguments);
			this.Inherits('core.type.struct');
			return this;
		},
		
		Member: function(id, type, label){
			var package = this.GetPackage()
				, ret = this.querySelector('pin[id="' + id + '"]') || this.create('Pin');
			
			ret.init.apply(ret, arguments);
			if(package.select('[id="' + package.Id() + '.' + ret.Type() + '"]:not(node)').length() == 1)
				ret.Type(package.Id() + '.' + ret.Type());
			return ret;
		},

		
		MakeAccessorNodes: function(package){
			var me = this
			, pack = this.parent(exGRAPH.Library).Package(package)
			, shortId = me.Id().split('.').last()
			, node;
			
			// make
			node = pack.Node(shortId + '.make', 'Make ' + me.Label())
				.Keywords('make ' + me.Label())
				.Symbol('lib/core/img/make.png')
				.Color('#00f');
			
			me.select('pin').each(function(){
				node.Input(shortId + '-' + this.Id(), this.Type(), this.Label()).mergeAttrs(this);
			});
			node.Output('out', me.Id(), me.Label());
			
			// break
			node = pack.Node(shortId + '.break', 'Break ' + me.Label())
				.Keywords('break ' + me.Label())
				.Symbol('lib/core/img/break.png')
				.Color('#00f');
			
			node.Input('in', me.Id(), me.Label());
			me.select('pin').each(function(){
				node.Output(shortId + '-' + this.Id(), this.Type(), this.Label()).mergeAttrs(this);
			});
			
			return me;			
		}

	},
	
	construct: {
		Struct: function(id, label){
			var ret = this.querySelector('structure[id="' + this.Id() + '.' + id + '"]') || this.create('Structure');

			ret.init.apply(ret, arguments);
			return ret;
		}		
	}
});

exGRAPH.Enum = exBASE.invent({
    create: 'enum',
	inherit: exGRAPH.Type,
	parent: exGRAPH.Package,
	
    extend: {
		
		init: function(){
			exGRAPH.Type.prototype.init.apply(this, arguments);
			this.Inherits('core.type.enum');
			return this;
		},
				
		Values: function(values){
			return this.attr('values', Array.isArray(values) ? JSON.stringify(values) : values);
		}
	},
	
	construct: {
		Enum: function(id, label){
			var ret = this.querySelector('enum[id="' + this.Id() + '.' + id + '"]') || this.create('Enum');

			ret.Inherits('core.type.enum');
			ret.init.apply(ret, arguments);
			return ret;
			//return ret.attr('id', this.GetPath() + id);
		}		
	}
});

exGRAPH.Interface = exBASE.invent({
    create: 'interface',
	inherit: exGRAPH.Object,
	parent: exGRAPH.Package,
	
    extend: {
		
		init: function(){
			exGRAPH.Object.prototype.init.apply(this, arguments);
			//this.Inherits('core.object');
			return this;
		},
		
		StaticMethod: function(id, label){
			var package = this.GetPackage()
			, ret = this.querySelector('node[id="' + id + '"]') || this.create('Node');
			
			ret.init.apply(ret, arguments);
			//ret.Id(this.Id() + '.' + id);
			if(package){
				ret.Color(package.Color());
				ret.Symbol(package.Symbol());
				ret.Category(package.Category());
			}
			return ret;			
		},
		
		Method: function(id, label){
			var ret = this.StaticMethod.apply(this, arguments);

			ret.Input('target', this.Id()).Required();
			return ret;
		}
	},
	
	construct: {
		Interface: function(id){
			var ret = this.querySelector('interface[id="' + this.Id() + '.' + id + '"]') || this.create('Interface');

			ret.init.apply(ret, arguments);
			//return ret.attr('id', this.GetPath() + id);
		}		
	}
});

exGRAPH.Class = exBASE.invent({
    create: 'class',
	inherit: exGRAPH.Interface,
	parent: exGRAPH.Package,
	
    extend: {
		
		Member: function(id, type, title){
			var ret = this.querySelector('output[id="' + id + '"]') || this.create('Output');

			ret.init.apply(ret, arguments);
			
			//make getter/setter
			/*
			var getset = this.Method(id + '.get', 'Get ' + title);
			getset.init();
			getset.Output('out', type, title);

			getset = this.Method(id + '.set', 'Set ' + title);
			getset.init();
			getset.Input('in', type, title);
			*/
			return ret;
		},
		
		Implements: function(interface){
			return this.attr('inherits', '|' + interface + ((this.attr('inherits')) ? this.attr('inherits') : '|'));
		},
		
	},
	
	construct: {
		Class: function(id, label, callback){
			var ret = this.querySelector('class[id="' + this.Id() + '.' + id + '"]') || this.create('Class');

			ret.init.apply(ret, arguments);
			//ret.Id(this.GetPath() + id);
			if(typeof callback == 'function'){
				callback.call(ret, ret);
			}
			return ret
		}		
	}
});



/**************************************************************************************
	NODE / CATEGORY / NODETPL
**************************************************************************************/
exGRAPH.Node = exBASE.invent({
    create: 'node',
	inherit: exGRAPH.Base,
	parent: exGRAPH.Package,
	
    extend: {
		init: function(id, title){
			exGRAPH.Base.prototype.init.apply(this, arguments);
			this.Id(id);
			this.Title(title);
			this.Ctor('Node');
			return this;
		},
		
		Import: function(name){
			this.ImportAttrs(name);
			this.ImportPins(name);
			return this;
		},
		
		ImportTpl: function(tpl, type, name){
			var me = this
				, label
				, clone;

	        tpl = this.parent(exGRAPH.Library).GetNodeTpl(tpl);

			if(this.Ctor() == 'Node' && tpl.Ctor())
				this.Ctor(null);
			
			this.mergeAttrs(tpl);
			this.Title(this.Title().split('*1').join(name));
			
			if(this.Subtitle())
				this.Subtitle(this.Subtitle().split('*1').join(name));
			
			tpl.select('input,output').each(function(){
				clone = this.clone();
				if(clone.Type() == '*1'){
					clone.Type(type);
					if(clone.Label())
						clone.Label(clone.Label().split('*1').join(name));
				}
				me.add(clone);
			});
		},

		ImportAttrs: function(name){
			var base = this.parent(exGRAPH.Library).GetNode(name, this.parent(exGRAPH.Package).Id());
			
			if(!base)
				return console.log('can\'t find node "' + name + '"');
			
			return this.mergeAttrs(base);
		},
		
		ImportPins: function(name){
			var me = this
			, base = this.parent(exGRAPH.Library).GetNode(name, this.parent(exGRAPH.Package).Id())
			, clone;
			
			if(!base)
				return console.log('can\'t find node "' + name + '"');
			base.select('input,output').each(function(){
				clone = exBASE.adopt(this.node.cloneNode(true), exGRAPH);
				me.add(clone);
			});
			return this;
		},

		Ctor: function(name){
			return this.attr('ctor', name);
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
		
		Context: function(context){
			return this.attr('context', context);
		},
		
		MakeEntry: function(){
			var ret = this.Input('entry', 'core.exec');

			ret.node.parentNode.insertBefore(ret.node, ret.node.parentNode.firstChild);
			return this;
		},
		
		MakeExit: function(){
			var ret = this.Output('exit', 'core.exec');

			ret.node.parentNode.insertBefore(ret.node, ret.node.parentNode.firstChild);
			return this;
		},
		
		GetPackage: function(){
			return this.parent(exGRAPH.Package);
		}
	},
	
	construct: {
		Node: function(id, title){
			var ret = this.querySelector('node[id="' + this.Id() + '.' + id + '"]') || this.create('Node');

			ret.init.apply(ret, arguments);
			//ret.attr('id', this.attr('id') + '.' + id)
			ret.Color(this.Color());
			ret.Symbol(this.Symbol());
			ret.Category(this.Category());
			return ret;
		}		
	}
});

exGRAPH.Category = exBASE.invent({
    create: 'category',
	inherit: exGRAPH.Base,
	parent: exGRAPH.Node,
	
    extend: {
		init: function(name){
			exGRAPH.Base.prototype.init.apply(this, arguments);
			return this.Name(name);
		},
		
		Name: function(name){
			return this.attr('name', name);
		}
	},
	
	construct: {
		Category: function(name){
			if(name == undefined)
				return;
			var ret = this.select('category[name="' + name + '"]').first() || this.create('Category');
			ret.init.apply(ret, arguments);
			return this;
		}		
	}
});

exGRAPH.Nodetpl = exBASE.invent({
    create: 'nodetpl',
	inherit: exGRAPH.Node,
	parent: exGRAPH.Package,
	
    extend: {
		init: function(id, title){
			exGRAPH.Node.prototype.init.apply(this, arguments);
			return this
		}
	},
	
	construct: {
		NodeTpl: function(id, title){
			var ret = this.querySelector('nodetpl[id="' + this.Id() + '.' + id + '"]') || this.create('Nodetpl');

			ret.init.apply(ret, arguments);
			//ret.attr('id', this.attr('id') + '.' + id)
			ret.Color(this.Color());
			ret.Symbol(this.Symbol());
			ret.Category(this.Category());
			return ret;
		}		
	}
});



/**************************************************************************************
	PIN / INPUT / OUTPUT
**************************************************************************************/
exGRAPH.Pin = exBASE.invent({
    create: 'pin',
	inherit: exGRAPH.Base,
	
    extend: {
		init: function(id, type, label){
			exGRAPH.Base.prototype.init.apply(this, arguments);
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
		},
		
		Ctor: function(name){
			return this.attr('ctor', name);
		},
		
		Required: function(){
			return this.Flags(this.Flags() || 0 || F_REQUIRED);
		}
	}
});

exGRAPH.Output = exBASE.invent({
    create: 'output',
	inherit: exGRAPH.Pin,
	parent: exGRAPH.Node,
	
    extend: {
		
		Getter: function(){
			return this.attr('get', true);
		},
		
		Setter: function(){
			return this.attr('set', true);
		}
	},
	
	construct: {
		Output: function(id, type, label){
			var package = this.GetPackage()
				, ret = this.querySelector('output[id="' + id + '"]') || this.create('Output');
			
			ret.init.apply(ret, arguments);

			// check if Pin's dataType name is in current package or outside
			if(package && package.select('[id="' + package.Id() + '.' + exGRAPH.Library.prototype.removeArrayDataType(ret.Type()) + '"]:not(node)').length() == 1)
				ret.Type(package.Id() + '.' + ret.Type());

			return ret;
		}		
	}
});

exGRAPH.Input = exBASE.invent({
    create: 'input',
	inherit: exGRAPH.Pin,
	parent: exGRAPH.Node,
	
	construct: {
		Input: function(id, type, label){
			var package = this.GetPackage()
				, ret = this.querySelector('input[id="' + id + '"]') || this.create('Input');
			
			ret.init.apply(ret, arguments);

			// check if Pin's dataType name is in current package or outside
			if(package && package.select('[id="' + package.Id() + '.' + exGRAPH.Library.prototype.removeArrayDataType(ret.Type()) + '"]:not(node)').length() == 1)
				ret.Type(package.Id() + '.' + ret.Type());

			return ret;
		}		
	}
});



/**************************************************************************************
	LINK / LINKREF
**************************************************************************************/
exGRAPH.Link = exBASE.invent({
    create: 'link',
	inherit: exGRAPH.Base,
	parent: exGRAPH.Graph,
	
    extend: {
		init: function(startPin, endPin){
			exGRAPH.Base.prototype.init.apply(this, arguments);
			//this.Input(startPin);
			//this.Output(endPin);
			return this;
		},
		
		Pin: function(node, pin){
			return this.create('Pin').attr('node', node).attr('pin', pin);
		},
		
		Input: function(node, pin){
			return this.querySelector('input') || this.create('Input').init(pin).attr('node', node);
		},

		Output: function(node, pin){
			return this.querySelector('output') || this.create('Output').init(pin).attr('node', node);
		}
	},
	
	construct: {
		Link: function(){
			var ret = this.create('Link');
			return ret.init.apply(ret, arguments);
		}		
	}
});

exGRAPH.Linkref = exBASE.invent({
    create: 'linkref',
	inherit: exGRAPH.Base,
	
    extend: {
		init: function(node, pin){
			exGRAPH.Base.prototype.init.apply(this, arguments);
			this.Node(node);
			this.Pin(pin);
			return this;
		},
		
		Node: function(nodeid){
			return this.attr('node', nodeid);
		},

		Pin: function(pinid){
			return this.attr('pin', pinid);
		}
	}
});

})(this);