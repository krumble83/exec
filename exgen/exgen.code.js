;(function(ctx){
"use strict";


var exCODE = {};
ctx.exCODE = exCODE;

var uid = 1000;

exBASE.extend(exGRAPH.Graph, exGRAPH.Macro, {
	Generate: function(){
		var me = this
		, exprt = new exCODE.Module().init()
		, out = exprt.Function('setup').Type('void')
		, enter = this.querySelector('node[id="core.entrypoint"]')
		, func;

		this.select(':scope > *').each(function(){
			//console.log(this.Prepare());
			if(this.Prepare && typeof this.Prepare() == 'function')
				this.Prepare().call(this);
		});
		this.select('node[id="core.entrypoint"]').each(function(){
			this.Output('exit').Eval().call(this.Output('exit'), exprt);
		});
		//exLIB.getNode2('core.entrypoint').Generator().call(exprt, enter);
		return exprt;		
	}
});

exBASE.extend(exGRAPH.Link, {
	Eval: function(pin){
		var graph = pin.parent(exGRAPH.Graph)
		, node = graph.GetNode(pin.attr('node'))
		, generator = exLIB.getNode2(node.Id()).Generator();
		
		if(!generator){
			console.log('cant find generator for "' + node.Id() + '"');
			return;
		}
				
		return generator.call(this, node);
	}
});

exBASE.extend(exGRAPH.Node, {
	GetLinks: function(pin){
		var graph = this.parent(exGRAPH.Graph)
		, ret = new exBASE.Set();
		
		assert(pin instanceof exGRAPH.Pin);
		
		if(pin instanceof exGRAPH.Input){
			graph.select('link > input[node="' + this.attr('svgid') + '"][id="' + pin.Id() + '"]').each(function(){
				ret.add(this.parent(exGRAPH.Link));
			});
		}
		else if(pin instanceof exGRAPH.Output){
			graph.select('link > output[node="' + this.attr('svgid') + '"][id="' + pin.Id() + '"]').each(function(){
				ret.add(this.parent(exGRAPH.Link));
			});
		}
		return ret;
	},
	
	Generator: function(callback){
		return this.data('generator', callback);
	},
	
	Prepare: function(callback){
		return this.data('prepare', callback);
	}
});

exBASE.extend(exGRAPH.Pin, exGRAPH.Input, exGRAPH.Output, {
	GetLinks: function(){
		//console.log(this.parent().attr('svgid'), this.attr('id'));
		var node = this.parent(exGRAPH.Node);
		return node.GetLinks(this);
		
	},
	
	GetNode: function(){
		return this.parent(exGRAPH.Node);
	},
	
	Eval: function(callback){
		return this.data('eval', callback);
	}
	
});



/**************************************************************************************
	FRAGMENT
**************************************************************************************/
exCODE.Fragment = exBASE.invent({
    create: 'fragment',
	inherit: exBASE.Element,
	parent: exCODE,
	
    extend: {
		init: function(){
			return this;
		},
		
		create: function(type, args){
			var ret = new exCODE[type];
			this.add(ret);
			if(typeof ret.init == 'function' && args)
				ret.init.apply(ret, args);
			return ret;		
		},
		
		Module: function(){
			return this.Parent(exCODE.Module);
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
exCODE.Context = exBASE.invent({
    create: 'context',
	inherit: exCODE.Fragment,
	
	extend: {
		init: function(){
			this.uid = 1000;
		},
		
		GetUID: function(prefix){
			return prefix + (this.uid++);
		}
	}
});

/**************************************************************************************
	MODULE
**************************************************************************************/
exCODE.Module = exBASE.invent({
    create: 'module',
	inherit: exCODE.Context,
	parent: exCODE.Fragment,
	
    extend: {
		init: function(){
			exCODE.Context.prototype.init.apply(this, arguments);
			document.body.appendChild(this.node);
			//this._names = {};
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
		},
		
		Body: function(){
			var body = this.node.querySelector('body');
			
			if(body)
				return exBASE.adopt(body);
			return this.create('Body', arguments);
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
exCODE.Value = exBASE.invent({
    create: 'value', 
    inherit: exCODE.Fragment,
	
    extend: {
		init: function(value, type){
			this.Value(value);
			this.Type(type);
			return this;
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
exCODE.Import = exBASE.invent({
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

exCODE.Include = exBASE.invent({
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
exCODE.Function = exBASE.invent({
    create: 'function', 
    inherit: exCODE.Context,
	parent: exCODE.Fragment,
	
    extend: {
		init: function(name, type){
			exCODE.Context.prototype.init.apply(this, arguments);			
			if(typeof name !== 'undefined')
				this.node.setAttribute('name', name);
			if(typeof type !== 'undefined')
				this.node.setAttribute('type', type);
			return this;
		},
		
		Arguments: function(){
			var args = this.node.querySelector('arguments');
			
			if(args)
				return exBASE.adopt(args);
			return this.create('Arguments', arguments);
		},
		
		Argument: function(name, value, type){
			return this.Arguments().create('Argument', arguments);
		},
		/*
		Body: function(){
			var body = this.node.querySelector('body');
			
			if(body)
				return exBASE.adopt(body);
			return this.create('Body', arguments);
		},
		*/
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

exCODE.Arguments = exBASE.invent({
    create: 'arguments', 
    inherit: exCODE.Fragment,
	
    extend: {
		Argument: function(){
			return this.create('Argument', arguments);
		},
	}
});

exCODE.Argument = exBASE.invent({
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

exCODE.Return = exBASE.invent({
    create: 'return', 
    inherit: exCODE.Value,
	parent: exCODE.Fragment,
	
    extend: {
		init: function(value){
			if(typeof value == 'string')
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

exCODE.Lambda = exBASE.invent({
    create: 'lambda', 
    inherit: exCODE.Function
});



/**************************************************************************************
	BODY
**************************************************************************************/
exCODE.Body = exBASE.invent({
    create: 'body', 
    inherit: exCODE.Context,
	
    extend: {
	}
});


/**************************************************************************************
	CALL
**************************************************************************************/
exCODE.Call = exBASE.invent({
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
				return exBASE.adopt(args);
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
	IF / THEN / ELSEIF / ELSE
**************************************************************************************/
exCODE.If = exBASE.invent({
    create: 'if', 
    inherit: exCODE.Context,
	parent: exCODE.Fragment,
	
    extend: {
		
		init: function(name, operator, value){		
			exCODE.Context.prototype.init.apply(this, arguments);
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
				return exBASE.adopt(then);
			return this.create('Then');
		},
		
		Elseif: function(){
			return this.create('Elseif');
		},
		
		Else: function(){
			var els = this.node.querySelector('else');
			
			if(els)
				return exBASE.adopt(els);
			return this.create('Else');
		}
	}, 
	construct: {
		If: function(name, operator, value){
			return this.create('If', arguments);
		}
	}
});

exCODE.Then = exBASE.invent({
    create: 'then', 
    inherit: exCODE.Body,
	
    extend: {
	}
});

exCODE.Elseif = exBASE.invent({
    create: 'elseif',
    inherit: exCODE.Condition,
	
    extend: {
	}
});

exCODE.Else = exBASE.invent({
    create: 'else',
    inherit: exCODE.Then,
	
    extend: {
	}
});



/**************************************************************************************
	CONDITION
**************************************************************************************/
exCODE.Condition = exBASE.invent({
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



/**************************************************************************************
	FOR
**************************************************************************************/
exCODE.For = exBASE.invent({
    create: 'for', 
    inherit: exCODE.Context,
	parent: exCODE.Fragment,
	
    extend: {
		
		init: function(declare, condition, step){
			exCODE.Context.prototype.init.apply(this, arguments);
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
				return exBASE.adopt(body);
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

exCODE.Break = exBASE.invent({
    create: 'break', 
    inherit: exCODE.Fragment,
	parent: exCODE.Fragment,
	
	construct: {
		Break: function(value){
			return this.create('Break', arguments);
		}
	}
});

exCODE.Continue = exBASE.invent({
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
exCODE.While = exBASE.invent({
    create: 'while', 
    inherit: exCODE.Context,
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

exCODE.Do = exBASE.invent({
    create: 'do', 
    inherit: exCODE.Fragment
});




/**************************************************************************************
	DECLARE / ASSIGN
**************************************************************************************/
exCODE.Assign = exBASE.invent({
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

exCODE.Index = exBASE.invent({
    create: 'index', 
    inherit: exCODE.Value
});

exCODE.Declare = exBASE.invent({
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
		
		Size: function(size){
			return this.attr('size', size);
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



/**************************************************************************************
	Arithmetic
**************************************************************************************/
exCODE.Arithmetic = exBASE.invent({
    create: 'arithmetic', 
    inherit: exCODE.Fragment,
	parent: exCODE.Fragment,
	
    extend: {
		
		init: function(name){
			this.Name(name);
			return this;
		},
		
		Name: function(value){
			return this.attr('name', value);	
		},
		
		Value: function(value, type){
			return this.create('Value', arguments);
		}
	},
	construct: {
		Arithmetic: function(name){
			return this.create('Arithmetic', arguments);
		}
	}
});

})(this);