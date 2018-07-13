
exGEN.Fragment = exGEN.invent({
    create: 'fragment',
	inherit: exGEN.Element,
	
    extend: {
		Init: function(){},

		Id: function(id){
			return this.Attr.call(this, 'id', value);
		},
		
		Name: function(value){
			return this.Attr.call(this, 'name', value);
		},

		Call: function(value){
			return this.Attr.call(this, 'call', value);
		},
		
		Ns: function(value){
			return this.Attr.call(this, 'ns', value);
		},
		
		Value: function(value){
			if(value instanceof exGEN.Fragment)
				this.Add(value);
			else
				return this.Attr('value', value);
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
	DOCUMENT
**************************************************************************************/
exGEN.Module = exGEN.invent({
    create: 'module',
	inherit: exGEN.Fragment,
	
    extend: {
		Init: function(ns){
			if(typeof ns !== 'undefined')
				this.Attr('ns', ns);
			
			document.body.appendChild(this.node);
			return this;
		},
		
		Target:  function(value){
			return this.Attr.call(this, 'target', value);
		}
	}
});




/**************************************************************************************
	FUNCTION
**************************************************************************************/
exGEN.Function = exGEN.invent({
    create: 'function', 
    inherit: exGEN.Fragment,
	
    extend: {
		Init: function(name, type){
			if(typeof name !== 'undefined')
				this.node.setAttribute('name', name);
			if(typeof type !== 'undefined')
				this.node.setAttribute('type', type);
			return this;
		},
		
		Arguments: function(){
			var ret = this.node.querySelector('arguments');
			if(ret && ret.instance)
				return ret.instance;
			else if(ret)
				return exGEN.adopt(ret);
			
			var ret = new exGEN.Arguments;
			ret.Init.apply(ret, arguments);
			this.Add(ret);
			return ret;
		},
		
		Return: function(value){
			var ret = new exGEN.Return;
			ret.Init.apply(ret, arguments);
			this.Add(ret);
			return ret;
		},
		
		Type: function(value){
			return this.Attr.call(this, 'type', value);
		}
	}, 
	construct: {
		Function: function(name, type){
			var ret = new exGEN.Function;
			ret.Init.apply(ret, arguments);
			this.Add(ret);
			return ret;
		}
	}
});

exGEN.Arguments = exGEN.invent({
    create: 'arguments', 
    inherit: exGEN.Fragment,
	
    extend: {
		Argument: function(){
			var ret = new exGEN.Argument;
			ret.Init.apply(ret, arguments);
			this.Add(ret);
			return ret;
		},
	}
});

exGEN.Argument = exGEN.invent({
    create: 'argument', 
    inherit: exGEN.Fragment,
	
    extend: {
		Init: function(name, type, value){
			if(typeof name !== 'undefined')
				this.node.setAttribute('name', name);
			if(typeof type !== 'undefined')
				this.Type(type);
			if(typeof value !== 'undefined')
				this.Value(value);
			return this;
		},
		
		Type: function(value){
			return this.Attr.call(this, 'type', value);
		}
	}
});



/**************************************************************************************
	CALL
**************************************************************************************/
exGEN.Call = exGEN.invent({
    create: 'call', 
    inherit: exGEN.Fragment,
	
    extend: {
		Init: function(method, object){
			if(typeof object !== 'undefined')
				this.node.setAttribute('object', object);
			if(typeof method !== 'undefined')
				this.node.setAttribute('method', method);
			return this;
		},
		
		Object: function(name){
			return this.Attr.call(this, 'object', name);
		},
		
		Method: function(name){
			return this.Attr('method', name);
		},
		
		New: function(){
			return this.Attr('new', true);
		},
		
		Arguments: function(){
			var args = [].slice.call(arguments)
			, arg
			, ret;
			
			while(arg = args.shift()){
				ret = new exGEN.Argument;
				ret.Init.apply(ret);
				ret.Value(arg);
				this.Add(ret);
				
			}
			return this;
		},
		
		Argument: function(pos, value){
			
		}
		
	}, 
	construct: {
		Call: function(method, object){
			var ret = new exGEN.Call;
			ret.Init.apply(ret, arguments);
			this.Add(ret);
			return ret;
		}
	}
});


/**************************************************************************************
	RETURN
**************************************************************************************/
exGEN.Return = exGEN.invent({
    create: 'return', 
    inherit: exGEN.Fragment,
	
    extend: {
		Init: function(value){
			if(typeof value !== 'undefined')
				this.node.setAttribute('value', value);
			return this;			
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
		Init: function(namename, operator, value){
			if(typeof name !== 'undefined')
				this.Condition.apply(this, arguments);
			
		},
		
		Operator: function(operator){
			this.node.setAttribute('operator', operator);
			return this;
		},

		Condition: function(name, operator, value){
			var ret = new exGEN.Condition;
			ret.Init.apply(ret, arguments);
			this.Add(ret);
			return ret;
		},
		
		Then: function(fragment){
			var ret = this.node.querySelector('then');
			if(!ret){
				ret = new exGEN.Then;
				this.Add(ret);
			}
			if(typeof fragment === 'undefined')
				return ret;

			ret.Add.apply(ret, arguments);
			return ret;
		},
		
		Elseif: function(){
			var ret = this.node.querySelector('elseif');
			if(!ret){
				ret = new exGEN.Elseif;
				this.Add(ret);
			}
			return ret;
		},
		
		Else: function(fragment){
			var ret = this.node.querySelector('else');
			if(!ret){
				ret = new exGEN.Else;
				this.Add(ret);
			}
			if(typeof fragment === 'undefined')
				return ret;

			ret.Add.apply(ret, arguments);
			return ret;
		}
	}, 
	construct: {
		If: function(name, operator, value){
			var ret = new exGEN.If;
			ret.Init.apply(ret, arguments);
			this.Add(ret);
			return ret;
		}
	}
});


/**************************************************************************************
	CONDITION
**************************************************************************************/
exGEN.Condition = exGEN.invent({
    create: 'condition', 
    inherit: exGEN.Fragment,
	
    extend: {
		Init: function(name, operator, value){
			if(typeof name !== 'undefined' && name !== null)
				this.Var(name);
			if(typeof operator !== 'undefined' && operator !== null)
				this.Operator(operator);
			if(typeof value !== 'undefined' && value instanceof exGEN.Fragment){
				this.Add(value);
			}
			else if(typeof value !== 'undefined' && value !== null)
				this.Value(value);
			return this;			
		},
		
		Not: function(not){
			return this.Attr.call(this, 'not', (not ? true : false));
		},
		
		And: function(condition){
			return this.Attr.call(this, 'and', value);
		},

		Or: function(condition){
			
		},

		Var: function(value){
			return this.Attr.call(this, 'var', value);
		},

		Operator: function(value){
			return this.Attr.call(this, 'operator', value);
		},
		
		Then: function(fragment){
			var parent = this.Parent(exGEN.If);
			if(parent)
				parent.Then.apply(parent, arguments);
		},
		
		Else: function(fragment){
			var parent = this.Parent(exGEN.If);
			if(parent)
				parent.Else.apply(parent, arguments);
		}
	}, 
	construct: {
		Condition: function(name, operator, value){
			var ret = new exGEN.Condition;
			ret.Init.apply(ret, arguments);
			this.Add(ret);
			return ret;
		}
	}
});

exGEN.Elseif = exGEN.invent({
    create: 'elseif', 
    inherit: exGEN.Condition,
	
    extend: {
		Init: function(){
			
		},
		
		Else: function(fragment){
			var parent = this.Parent(exGEN.If);
			if(parent)
				parent.Else.apply(parent, arguments);
		}
	}
});



exGEN.Then = exGEN.invent({
    create: 'then', 
    inherit: exGEN.Fragment,
	
    extend: {
		Init: function(fragment){
			if(typeof fragment !== 'undefined' && fragment instanceof exGEN.Fragment)
				this.Add.apply(this, arguments);
			return this;
		},
		
		Else: function(fragment){
			var ret;
			
			if(typeof fragment !== 'undefined' && fragment instanceof exGEN.Fragment){
				ret = this.Parent(exGEN.If);
				ret.Else.apply(ret, arguments);
			}
			return this;
		}
	}
});

exGEN.Else = exGEN.invent({
    create: 'else', 
    inherit: exGEN.Then
});


/**************************************************************************************
	FOR
**************************************************************************************/
exGEN.For = exGEN.invent({
    create: 'for', 
    inherit: exGEN.Fragment,
	
    extend: {
		
		Var: function(value){
			return this.Attr.call(this, 'var', value);
		},

		From: function(value){
			return this.Attr.call(this, 'from', value);
		},
		
		To: function(value){
			return this.Attr.call(this, 'to', value);
		},
		
		Step: function(value){
			return this.Attr.call(this, 'step', value);
		}
	}, 
	construct: {
		For: function(){
			var ret = new exGEN.For;
			ret.Init.apply(ret, arguments);
			this.Add(ret);
			return ret;
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
		
		Var: function(value){
			return this.Attr.call(this, 'var', value);	
		},

		Operator: function(value){
			return this.Attr.call(this, 'operator', value);
		},
		
		Do: function(){
			var ret = new exGEN.Fragment;
			ret.Init.apply(ret, arguments);
			this.Add(ret);
			return ret;
		}
			
	}, 
	construct: {
		While: function(){
			var ret = new exGEN.While;
			ret.Init.apply(ret, arguments);
			this.Add(ret);
			return ret;
		}
	}
});




/**************************************************************************************
	LAMBDA
**************************************************************************************/
exGEN.Lambda = exGEN.invent({
    create: 'lambda', 
    inherit: exGEN.Function,
	
    extend: {
		
	}
});


/**************************************************************************************
	DECLARE / ASSIGN
**************************************************************************************/
exGEN.Assign = exGEN.invent({
    create: 'assign', 
    inherit: exGEN.Fragment,
	
    extend: {
		
		Init: function(name, value){
			if(typeof name !== 'undefined')
				this.Attr('name', name);
			if(typeof value !== 'undefined')
				this.Value(value);
		},
				
		Name: function(value){
			return this.Attr('name', value);	
		},
		
		Constant: function(value){
			this.Clear();
			return this.Attr('value', value);
		},
		
		Lambda: function(){
			this.Attr('value', null);
			this.Clear();
			var ret = new exGEN.Lambda;
			ret.Init.apply(ret, arguments);
			this.Add(ret);
			return ret;			
		},

		Property: function(){
			
		},
		
		Operator: function(name){
			return this.Attr.call(this, 'operator', name);
		}
	}, 
	construct: {
		Assign: function(name, value){
			var ret = new exGEN.Assign;
			ret.Init.apply(ret, arguments);
			this.Add(ret);
			return ret;
		}
	}
});


exGEN.Declare = exGEN.invent({
    create: 'declare', 
    inherit: exGEN.Assign,
	
    extend: {
		Call: function(){
			this.Clear();
			return exGEN.Fragment.prototype.Call.apply(this, arguments);
		}

	}, 
	construct: {
		Declare: function(name){
			var ret = new exGEN.Declare;
			ret.Init.apply(ret, arguments);
			this.Add(ret);
			return ret;
		}
	}
});
exGEN.Declare.prototype.Operator = undefined;