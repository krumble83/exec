
/**************************************************************************************
	FRAGMENT
**************************************************************************************/
exGEN.Fragment = exGEN.invent({
    create: 'fragment',
	inherit: exGEN.Element,
	
    extend: {
		init: function(){},
		
		clear: function(){
			while(this.node.firstChild)
				this.node.removeChild(this.node.firstChild);
			return this;
		},

		Id: function(id){
			return this.attr('id', value);
		},
		
		Ns: function(value){
			return this.attr('ns', value);
		},
		
		Doc: function(){
			return this.Parent(exGEN.Module);
		},
		
		text: function(text){
			if(typeof text === 'undefined')
				return this.node.innerText;
			this.node.innerText = text;
			return this;
		},
		
		ExportC: function(ident){
			return '';
		},
		
		ident: function(ident){
			var ret = '';
			while(ident){
				ret += '';
				ident--;
			}
			return ret;
		}
	}
});




/**************************************************************************************
	MODULE
**************************************************************************************/
exGEN.Module = exGEN.invent({
    create: 'module',
	inherit: exGEN.Fragment,
	
    extend: {
		init: function(){
			document.body.appendChild(this.node);
			return this;
		},
		
		Import: function(){
			return this.create('Import', arguments);
		},
		
		Include: function(){
			return this.create('Include', arguments);
		},
		
		Target:  function(value){
			return this.attr('target', value);
		}
	}
});




/**************************************************************************************
	VALUE
**************************************************************************************/
exGEN.Value = exGEN.invent({
    create: 'value', 
    inherit: exGEN.Fragment,
	
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
			return this;
		}
	}
});




/**************************************************************************************
	IMPORT / INCLUDE
**************************************************************************************/
exGEN.Import = exGEN.invent({
    create: 'import', 
    inherit: exGEN.Fragment,
	
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

exGEN.Include = exGEN.invent({
    create: 'include', 
    inherit: exGEN.Fragment,
	
    extend: {
		init: function(name){},
		
		Value: function(value){
			return this.attr('value', value);
		}
	}
});




/**************************************************************************************
	FUNCTION / LAMBDA
**************************************************************************************/
exGEN.Function = exGEN.invent({
    create: 'function', 
    inherit: exGEN.Fragment,
	
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
		
		Argument: function(name, type, value){
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

exGEN.Arguments = exGEN.invent({
    create: 'arguments', 
    inherit: exGEN.Fragment,
	
    extend: {
		Argument: function(){
			return this.create('Argument', arguments);
		},
	}
});

exGEN.Argument = exGEN.invent({
    create: 'argument', 
    inherit: exGEN.Value,
	
    extend: {
		init: function(name, type, value){
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
		}
	}
});

exGEN.Body = exGEN.invent({
    create: 'body', 
    inherit: exGEN.Fragment,
	
    extend: {
	}
});

exGEN.Return = exGEN.invent({
    create: 'return', 
    inherit: exGEN.Value,
	
    extend: {
		init: function(value){
			if(typeof value === 'string')
				this.attr('value', value);
			else if(value instanceof exGEN.Fragment)
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

exGEN.Lambda = exGEN.invent({
    create: 'lambda', 
    inherit: exGEN.Function
});




/**************************************************************************************
	CALL
**************************************************************************************/
exGEN.Call = exGEN.invent({
    create: 'call', 
    inherit: exGEN.Fragment,
	
    extend: {
		init: function(name){
			var args = [].slice.call(arguments)
			, Args;
			
			if(typeof name !== 'undefined')
				this.Name(name);
			if(args.length > 1) {
				Args = this.Arguments();				
				for(var a=1; a < args.length; a++){
					Args.Argument().Value(args[a]);
				}
			}
			return this;
		},
		
		Name: function(name){
			return this.attr('name', name);
		},
		
		Arguments: function(){
			var args = this.node.querySelector('arguments');
			
			if(!args)
				args = this.create('Arguments', arguments);
			else
				args = exGEN.adopt(args);
			if(arguments){
				for(var a=0; a < arguments.length; a++)
					this.Argument(arguments[a]);
			}
			return args;
		},
		
		Argument: function(value, type){
			return this.Arguments().create('Argument').Value(value).Type(type);
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
exGEN.If = exGEN.invent({
    create: 'if', 
    inherit: exGEN.Fragment,
	
    extend: {
		
		Operator: function(operator){
			this.attr('operator', operator);
			return this;
		},
		
		Condition: function(){
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
			return this.create('else');
		}
	}, 
	construct: {
		If: function(){
			return this.create('If', arguments);
		}
	}
});

exGEN.Condition = exGEN.invent({
    create: 'condition', 
    inherit: exGEN.Fragment,
	
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
			if(value instanceof exGEN.Fragment)
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

exGEN.Then = exGEN.invent({
    create: 'then', 
    inherit: exGEN.Fragment,
	
    extend: {
	}
});

exGEN.Elseif = exGEN.invent({
    create: 'elseif',
    inherit: exGEN.Condition,
	
    extend: {
	}
});

exGEN.Else = exGEN.invent({
    create: 'else',
    inherit: exGEN.Then,
	
    extend: {
	}
});




/**************************************************************************************
	FOR
**************************************************************************************/
exGEN.For = exGEN.invent({
    create: 'for', 
    inherit: exGEN.Fragment,
	
    extend: {
		
		Var: function(value){
			return this.attr('var', value);
		},

		From: function(value){
			return this.attr('from', value);
		},
		
		To: function(value){
			return this.attr('to', value);
		},
		
		Step: function(value){
			return this.attr('step', value);
		},
		
		Break: function(){
			return this.create('Break', arguments);
		},
		
		Continue: function(){
			return this.create('Continue', arguments);
		}
	}, 
	construct: {
		For: function(){
			return this.create('For', arguments);
		}
	}
});

exGEN.Break = exGEN.invent({
    create: 'break', 
    inherit: exGEN.Fragment,
	
	construct: {
		Return: function(value){
			return this.create('Return', arguments);
		}
	}
});

exGEN.Continue = exGEN.invent({
    create: 'continue', 
    inherit: exGEN.Fragment,
	
	construct: {
		Return: function(value){
			return this.create('Return', arguments);
		}
	}	
});




/**************************************************************************************
	WHILE
**************************************************************************************/
exGEN.While = exGEN.invent({
    create: 'while', 
    inherit: exGEN.Fragment,
	
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

exGEN.Do = exGEN.invent({
    create: 'do', 
    inherit: exGEN.Fragment
});




/**************************************************************************************
	DECLARE / ASSIGN
**************************************************************************************/
exGEN.Assign = exGEN.invent({
    create: 'assign', 
    inherit: exGEN.Fragment,
	
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
		
		Value: function(value, type){
			var s = this.node.querySelectorAll('*:not(value)');
			
			for(var a=0; a < s.length; a++){
				this.node.removeElement(s[a]);
			}
			return this.create('Value', arguments);
		},
		
		Call: function(){
			this.clear();
			return this.create('Call', arguments);
		}
	}, 
	construct: {
		Assign: function(name){
			return this.create('Assign', arguments);
		}
	}
});

exGEN.Declare = exGEN.invent({
    create: 'declare', 
    inherit: exGEN.Assign,
	
    extend: {
		Type: function(value){
			return this.attr('type', value);
		}	
	}, 
	construct: {
		Declare: function(name){
			return this.create('Declare', arguments);
		}
	}
});