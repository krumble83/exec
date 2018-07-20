;(function(ctx){
"use strict";


exGEN.extend(exGRAPH.Graph, exGRAPH.Macro, {
	Generate: function(){
		var me = this
		, exprt = new exCODE.Module().init()
		, out = exprt.Function('setup').Type('void').Body()
		, entries = this.select('node[ctor="NodeEntryPoint"]')
		, func;

		//console.log(entries);
		entries.each(function(){
			func = exLIB.getGenerator(this.attr('id'));
			if(typeof func === 'function')
				func(this, out);
		});
		return exprt;
	},
	
	GetLinks: function(nodesvgid, pinid){
		var out = new exGEN.Set;
		this.select('link output[node="' + nodesvgid + '"][pin="' + pinid + '"], link input[node="' + nodesvgid + '"][pin="' + pinid + '"]').each(function(){
			out.add(this.parent());
		});
		return out;
	},
	
});

exGEN.extend(exGRAPH.Node, {
	GetPin: function(name){
		console.log(name, this);
		var set = this.select('input[id="' + name + '"], output[id="' + name + '"]');
		assert(set.length() == 1);
		return set.first();
	},
	
	GetLinks: function(pin){
		var graph = this.parent(exGRAPH.Graph);
		if(pin instanceof exGRAPH.Pin)
			pin = pin.attr('id');
		return graph.GetLinks(this.attr('svgid'), pin);
	}
});

exGEN.extend(exGRAPH.Pin, exGRAPH.Input, exGRAPH.Output, {
	GetLinks: function(){
		//console.log(this.parent().attr('svgid'), this.attr('id'));
		var project = this.parent(exGRAPH.Graph);
		return project.GetLinks(this.parent().attr('svgid'), this.attr('id'));
		
	},
	
	GetNode: function(){
		return this.parent(exGRAPH.Node);
	}
	
});

exGEN.extend(exGRAPH.Link, {
	GetInputPin: function(){
		return this.querySelector('input');
	},
	
	GetOutputPin: function(){
		return this.querySelector('output');
	},

	GetInputNode: function(){
		var project = this.parent(exGRAPH.Graph);
		return project.GetNode(this.GetInputPin().attr('node'));
	},
	
	GetOutputNode: function(){
		var project = this.parent(exGRAPH.Graph);
		return project.GetNode(this.GetOutputPin().attr('node'));			
	}
});


var exCODE = {};
ctx.exCODE = exCODE;


/**************************************************************************************
	FRAGMENT
**************************************************************************************/
exCODE.Fragment = exGEN.invent({
    create: 'fragment',
	inherit: exGEN.Element,
	
    extend: {
		init: function(){
			return this;
		},
		
		create: function(type, args){
			var ret = new exCODE[type];
			this.add(ret);
			if(typeof ret.init === 'function')
				ret.init.apply(ret, args);
			return ret;		
		},

		Target: function(value){
			return this.attr('target', value);
		},
		
		Module: function(){
			return this.Parent(exCODE.Module);
		},

		Prefix: function(value){
			return this.attr('prefix', value);
		},

		Suffix: function(value){
			return this.attr('suffix', value);
		},
		
		Context: function(){
			var parent = this;
			while(parent && parent instanceof exCODE.Fragment){
				if(parent instanceof exCODE.Context)
					return parent;
				parent = parent.parent();
			}
		}
	}
});


/**************************************************************************************
	CONTEXT
**************************************************************************************/
exCODE.Context = exGEN.invent({
    create: 'context',
	inherit: exCODE.Fragment
});

/**************************************************************************************
	MODULE
**************************************************************************************/
exCODE.Module = exGEN.invent({
    create: 'module',
	inherit: exCODE.Context,
	parent: exCODE.Fragment,
	
    extend: {
		init: function(){
			document.body.appendChild(this.node);
			this._names = {};
			return this;
		},
		
		Import: function(){
			return this.create('Import', arguments);
		},
		
		Include: function(name){
			var f = this.select('include[value="' + name + '"]');
			return f.first() || this.create('Include', [name]);
		},
		
		Target:  function(value){
			return this.attr('target', value);
		},
		
		Uname: function(prefix){
			var a = 0;
			if(!this._names[prefix])
				this._names[prefix] = 0;
			this._names[prefix]++;
			console.log(this._names);
			return prefix + '_' + (this._names[prefix]-1);
		}
	}, 
	construct: {
		Uname: function(prefix){
			return this.parent(exCODE.Module).Uname(prefix);
		}
	}
});




/**************************************************************************************
	VALUE
**************************************************************************************/
exCODE.Value = exGEN.invent({
    create: 'value', 
    inherit: exCODE.Fragment,
	
    extend: {
		init: function(value, type){
			if(typeof value !== 'undefined')
				this.Value(value);
			if(typeof type !== 'undefined')
				this.Type(type);
			return this;
		},
		
		Operator: function(value){
			return this.attr('operator', value);
		},
		
		Type: function(value){
			return this.attr('type', value);
		},
		
		Value: function(value){
			this.clear();
			this.text(value);
		}
	}
});




/**************************************************************************************
	IMPORT / INCLUDE
**************************************************************************************/
exCODE.Import = exGEN.invent({
    create: 'import', 
    inherit: exCODE.Fragment,
	
    extend: {
		init: function(){},
		
		Value: function(value){
			return this.attr('value', value);
		},
		
		From: function(value){
			return this.attr('from', value);
		},
		
		As: function(value){
			return this.attr('as', value);
		}
	}
});

exCODE.Include = exGEN.invent({
    create: 'include', 
    inherit: exCODE.Fragment,
	
    extend: {
		init: function(name){
			return this.Value(name);
		},
		
		Value: function(value){
			return this.attr('value', value);
		}
	}
});




/**************************************************************************************
	FUNCTION / LAMBDA
**************************************************************************************/
exCODE.Function = exGEN.invent({
    create: 'function', 
    inherit: exCODE.Context,
	parent: exCODE.Fragment,
	
    extend: {
		init: function(name, type){
			if(typeof name !== 'undefined')
				this.node.setAttribute('name', name);
			if(typeof type !== 'undefined')
				this.node.setAttribute('type', type);
			return this;
		},
		
		Arguments: function(){
			var args = this.node.querySelector('arguments');
			
			if(args)
				return exGEN.adopt(args);
			return this.create('Arguments', arguments);
		},
		
		Argument: function(name, value, type){
			return this.Arguments().create('Argument', arguments);
		},
		
		Body: function(){
			var body = this.node.querySelector('body');
			
			if(body)
				return exGEN.adopt(body);
			return this.create('Body', arguments);
		},
		
		Type: function(value){
			return this.attr('type', value);
		},
		
		Return: function(value){
			return this.Body().create('Return', arguments);
		}
	}, 
	construct: {
		Function: function(name, type){
			return this.create('Function', arguments);
		}
	}
});

exCODE.Arguments = exGEN.invent({
    create: 'arguments', 
    inherit: exCODE.Fragment,
	
    extend: {
		Argument: function(){
			return this.create('Argument', arguments);
		},
	}
});

exCODE.Argument = exGEN.invent({
    create: 'argument', 
    inherit: exCODE.Value,
	
    extend: {
		init: function(name, value, type){
			if(typeof name !== 'undefined')
				this.Name(name);
			if(typeof type !== 'undefined')
				this.Type(type);
			if(typeof value !== 'undefined')
				this.Value(value);
			return this;
		},
		
		Name: function(name){
			return this.attr('name', name);
		},
		
		Pointer: function(pointer){
			return this.Prefix(pointer !== false ? '*' : null);
		},

		Reference: function(reference){
			return this.Prefix(reference !== false ? '&' : null);
		},
	}
});

exCODE.Body = exGEN.invent({
    create: 'body', 
    inherit: exCODE.Fragment,
	
    extend: {
	}
});

exCODE.Return = exGEN.invent({
    create: 'return', 
    inherit: exCODE.Value,
	parent: exCODE.Fragment,
	
    extend: {
		init: function(value){
			if(typeof value === 'string')
				this.attr('value', value);
			else if(value instanceof exCODE.Fragment)
				this.add(value);
			return this;			
		}
	},
	construct: {
		Return: function(value){
			return this.create('Return', arguments);
		}
	}
});

exCODE.Lambda = exGEN.invent({
    create: 'lambda', 
    inherit: exCODE.Function
});




/**************************************************************************************
	CALL
**************************************************************************************/
exCODE.Call = exGEN.invent({
    create: 'call', 
    inherit: exCODE.Fragment,
	parent: exCODE.Fragment,
	
    extend: {
		init: function(name){
			var args = [].slice.call(arguments)
			, Args;
			
			if(typeof name !== 'undefined')
				this.attr('name', name);
			if(args.length > 1) {
				Args = this.Arguments();				
				for(var a=1; a < args.length; a++){
					Args.Argument().Value(args[a]);
				}
			}
			return this;
		},
		
		Arguments: function(){
			var args = this.node.querySelector('arguments');
			
			if(args)
				return exGEN.adopt(args);
			return this.create('Arguments', arguments);
		},
		
		Argument: function(name, type, value){
			return this.Arguments().create('Argument', arguments);
		},
		
		Object: function(value){
			return this.attr('object', value);
		},
		
		Pointer: function(value){
			return this.attr('pointer', value);
		}
	}, 
	construct: {
		Call: function(name, type){
			return this.create('Call', arguments);
		}
	}
});




/**************************************************************************************
	IF
**************************************************************************************/
exCODE.If = exGEN.invent({
    create: 'if', 
    inherit: exCODE.Fragment,
	parent: exCODE.Fragment,
	
    extend: {
		
		init: function(name, operator, value){		
			if(typeof name !== 'undefined')
				this.Condition(name, operator, value);
		},
		
		Operator: function(operator){
			this.attr('operator', operator);
			return this;
		},
		
		Condition: function(name, operator, value){
			return this.create('Condition', arguments);
		},
		
		Then: function(){
			var then = this.node.querySelector('then');
			
			if(then)
				return exGEN.adopt(then);
			return this.create('Then');
		},
		
		Elseif: function(){
			return this.create('Elseif');
		},
		
		Else: function(){
			var els = this.node.querySelector('else');
			
			if(els)
				return exGEN.adopt(els);
			return this.create('Else');
		}
	}, 
	construct: {
		If: function(name, operator, value){
			return this.create('If', arguments);
		}
	}
});

exCODE.Condition = exGEN.invent({
    create: 'condition', 
    inherit: exCODE.Fragment,
	
    extend: {
		
		init: function(name, operator, value){
			if(typeof name !== 'undefined')
				this.Var(name);
			if(typeof operator !== 'undefined')
				this.Operator(operator);
			if(typeof value !== 'undefined')
				this.Value(value);
		},
		
		Condition: function(name, operator, value){
			return this.create('Condition', arguments);
		},
		
		And: function(){
			return this.attr('boperator', '&&');
		},

		Or: function(){
			return this.attr('boperator', '||');
		},
		
		Value: function(value, type){
			this.clear();
			if(value instanceof exCODE.Fragment)
				this.add(value);
			else if(typeof value !== 'undefined')
				this.add(this.create('Value', [value, type]));
		},

		Var: function(value){
			return this.attr('var', value);
		},

		Operator: function(value){
			return this.attr('operator', value);
		},
		
		Eq: function(){
			return this.attr('operator', '==');
		},
		
		Neq: function(){
			return this.attr('operator', '!=');
		},

		Lt: function(){
			return this.attr('operator', '<');
		},
		
		Lte: function(){
			return this.attr('operator', '<=');
		},
		
		Gt: function(){
			return this.attr('operator', '>');
		},
		
		Gte: function(){
			return this.attr('operator', '>=');
		},

	}
});

exCODE.Then = exGEN.invent({
    create: 'then', 
    inherit: exCODE.Body,
	
    extend: {
	}
});

exCODE.Elseif = exGEN.invent({
    create: 'elseif',
    inherit: exCODE.Condition,
	
    extend: {
	}
});

exCODE.Else = exGEN.invent({
    create: 'else',
    inherit: exCODE.Then,
	
    extend: {
	}
});




/**************************************************************************************
	FOR
**************************************************************************************/
exCODE.For = exGEN.invent({
    create: 'for', 
    inherit: exCODE.Fragment,
	parent: exCODE.Fragment,
	
    extend: {
		
		init: function(declare, condition, step){
			if(typeof declare !== 'undefined')
				this.Declare(declare);
			if(typeof condition !== 'undefined')
				this.Condition(condition);
			if(typeof step !== 'undefined')
				this.Step(step);
		},

		Do: function(){
			var body = this.node.querySelector('body');
			
			if(body)
				return exGEN.adopt(body);
			return this.create('Body');
		},
		
		Declare: function(){
			return this.create('Declare', arguments);
		},

		Condition: function(name, operator, value){
			return this.create('Condition', arguments);
		},
		
		Step: function(value){
			return this.attr('step', value);
		}
	}, 
	construct: {
		For: function(){
			return this.create('For', arguments);
		}
	}
});

exCODE.Break = exGEN.invent({
    create: 'break', 
    inherit: exCODE.Fragment,
	parent: exCODE.Fragment,
	
	construct: {
		Break: function(value){
			return this.create('Break', arguments);
		}
	}
});

exCODE.Continue = exGEN.invent({
    create: 'continue', 
    inherit: exCODE.Fragment,
	parent: exCODE.Fragment,
	
	construct: {
		Continue: function(value){
			return this.create('Continue', arguments);
		}
	}	
});




/**************************************************************************************
	WHILE
**************************************************************************************/
exCODE.While = exGEN.invent({
    create: 'while', 
    inherit: exCODE.Fragment,
	parent: exCODE.Fragment,
	
    extend: {
		
		Condition: function(){
			return this.create('Condition', arguments);
		},
		
		Do: function(){
			return this.create('Do', arguments);
		},
		
		Break: function(){
			return this.create('Break', arguments);
		},
		
		Continue: function(){
			return this.create('Continue', arguments);
		}
			
	}, 
	construct: {
		While: function(){
			return this.create('While', arguments);
		}
	}
});

exCODE.Do = exGEN.invent({
    create: 'do', 
    inherit: exCODE.Fragment
});




/**************************************************************************************
	DECLARE / ASSIGN
**************************************************************************************/
exCODE.Assign = exGEN.invent({
    create: 'assign', 
    inherit: exCODE.Fragment,
	parent: exCODE.Fragment,
	
    extend: {
		
		init: function(name, value){
			if(typeof name !== 'undefined')
				this.Name(name);
			if(typeof value !== 'undefined')
				this.Value(value);
		},
		
		Name: function(value){
			return this.attr('name', value);	
		},
		
		Pointer: function(value){
			return this.attr('pointer', value != false ? true : null);
		},
		
		Value: function(value, type){
			this.clear('value,call');
			return this.create('Value', arguments);
		},
		
		Call: function(){
			this.clear('value,call');
			return this.create('Call', arguments);
		},
		
		Index: function(){
			return this.querySelector('index') || this.create('Index', arguments);
		}

	},
	construct: {
		Assign: function(name){
			return this.create('Assign', arguments);
		}
	}
});

exCODE.Index = exGEN.invent({
    create: 'index', 
    inherit: exCODE.Value
});

exCODE.Declare = exGEN.invent({
    create: 'declare', 
    inherit: exCODE.Assign,
	parent: exCODE.Fragment,
	
    extend: {
		
		Type: function(value){
			return this.attr('type', value);
		},
		
		New: function(value){
			return this.attr('new', true);
		},
		
		Array: function(size){
			return this.attr('array', size || 1);
		},
		
		Value: function(){
			return this.create('Value', arguments);
		}
	},
	construct: {
		Declare: function(name){
			return this.create('Declare', arguments);
		}
	}
});


})(this);