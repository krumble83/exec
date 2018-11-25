;(function() {
"use strict";


function getIdent(ident){
	var ret = '';
	for(var a=0; a < ident; a++)
		ret += '\t';
	return ret;
}

/**************************************************************************************
	FRAGMENT
**************************************************************************************/
exBASE.extend(exCODE.Fragment, {
	ExportC: function(ident, args){
		var ret = getIdent(ident)
		, el;
		
		if(this.attr('ns') && this.attr('ns') != 'c')
			return '';

		for(var a=0; a < this.node.childElementCount; a++){
			el = exBASE.adopt(this.node.childNodes[a]);
			if(el.attr('ns') && el.attr('ns') != 'c')
				continue;
			ret += el.ExportC(ident, args);
		}
		return ret;		
	},
	
	GetCtype: function(id){
		var libtype = exLIB.getDataType(id);
		if(libtype && libtype.ctype)
			return libtype.ctype;
		return id;
	}
});




/**************************************************************************************
	MODULE
**************************************************************************************/
exBASE.extend(exCODE.Module, {
	ExportC: function(){
		return exCODE.Fragment.prototype.ExportC.call(this, 0, arguments);
	}
});




/**************************************************************************************
	INCLUDE
**************************************************************************************/
exBASE.extend(exCODE.Include, {
	ExportC: function(ident, args){
		return getIdent(ident) + '#include ' + this.attr('value') + ';\r\n';
	}
});




/**************************************************************************************
	CONDITION
**************************************************************************************/
exBASE.extend(exCODE.Condition, {
	ExportC: function(ident, args){
		var ret = getIdent(ident);
		ret += this.attr('var') || '';
		ret += this.attr('operator') || '';
		if(this.attr('value'))
			ret += this.attr('value');
		else
			ret += exCODE.Fragment.prototype.ExportC.call(this, 0, arguments);
		return ret;
	}
});




/**************************************************************************************
	VALUE
**************************************************************************************/
exBASE.extend(exCODE.Value, {
	ExportC: function(ident, args){
		var ret = '';
		
		if(this.attr('type'))
			ret += this.attr('type') + ' ';
		
		ret += this.attr('prefix') || '';
		ret += this.attr('name') || '';
		
		if(this.attr('name') && this.text())
			ret += '=';
		if(this.attr('type') == 'String' && this.text())
			ret += '"' + this.text() + '"';
		else
			ret += this.text() || '';
		
		return ret;
	}
});




/**************************************************************************************
	DECLARE / ASSIGN
**************************************************************************************/
exBASE.extend(exCODE.Declare, {
	ExportC: function(ident, args){
		var call = this.select('call')
		, value = this.attr('value')
		, ret = ''
		
		ret += this.GetCtype(this.attr('type')) + ' ';
		
		if(this.attr('pointer'))
			ret += '*';
		
		ret += this.attr('name');
		
		if(this.attr('array'))
			ret += '[' + this.attr('array') + ']';

		if(this.attr('pointer'))
			ret += ' = ';

		if(this.attr('new'))
			ret += 'new ';

		ret += exCODE.Fragment.prototype.ExportC.call(this, ident, args);

		return ret+ ';\r\n';
	}
});




/**************************************************************************************
	CALL
**************************************************************************************/
exBASE.extend(exCODE.Call, {
	ExportC: function(ident, args){
		var ret = getIdent(ident);
		
		if(this.attr('object'))
			ret += this.attr('object');
		
		if(this.attr('object') && this.attr('name'))
			ret += '.';

		ret += this.attr('name') || '';
		ret += '(';
		ret += exCODE.Fragment.prototype.ExportC.call(this, 0, args);
		return ret + ')';
	}
});




/**************************************************************************************
	FOR
**************************************************************************************/
exBASE.extend(exCODE.For, {
	ExportC: function(ident, args){
		var ret = getIdent(ident) + 'for(';
		
		ret += exCODE.Fragment.prototype.ExportC.call(this, ident, args);
		
		return ret + ')';
	}
});




/**************************************************************************************
	FUNCTION
**************************************************************************************/
exBASE.extend(exCODE.Function, {
	ExportC: function(ident, args){
		var ret = ''
		, el
		, body;
		
		if(this.attr('type'))
			ret += this.attr('type') + ' ';
		ret += this.attr('name') || '';
		ret += '(';

		for(var a=0; a < this.node.childElementCount; a++){
			el = exBASE.adopt(this.node.childNodes[a]);
			if(el instanceof exCODE.Body)
				body = el.ExportC(ident, args);
			else
				ret += el.ExportC();
		}
		return ret + ')' + (body || '') + ';\r\n';
	}
});

exBASE.extend(exCODE.Body, {
	ExportC: function(ident, args){
		var ret = '{\r\n';
		
		for(var a=0; a < this.node.childElementCount; a++){
			ret += exBASE.adopt(this.node.childNodes[a]).ExportC(ident + 1) + ';';
		}

		return ret + '\r\n}';
	}
});




/**************************************************************************************
	ARGUMENTS
**************************************************************************************/
exBASE.extend(exCODE.Arguments, {
	ExportC: function(ident, args){
		var ret = '';
		
		for(var a=0; a < this.node.childElementCount; a++){
			ret += exBASE.adopt(this.node.childNodes[a]).ExportC() + ', ';
		}
		if(ret.length > 0)
			ret = ret.substr(0, ret.length-2);
		return ret;
	}
});

exBASE.extend(exCODE.Argument, {
	ExportC: function(ident, args){
		var ret = '';
		
		if(this.attr('type'))
			ret += this.attr('type') + ' ';
		
		ret += this.attr('prefix') || '';
		ret += this.attr('name') || '';
		
		if(this.attr('name') && this.text())
			ret += '=';
		if(this.attr('type') == 'String' && this.text())
			ret += '"' + this.text() + '"';
		else
			ret += this.text() || '';
		
		return ret;
	}
});




/**************************************************************************************
	WHILE
**************************************************************************************/
exBASE.extend(exCODE.While, {
	ExportC: function(ident, args){
		var ret = 'while('
		, el
		, condition
		, body;

		for(var a=0; a < this.node.childElementCount; a++){
			el = exBASE.adopt(this.node.childNodes[a]);
			if(el instanceof exCODE.Do)
				body = el.ExportC(ident, args);
			else if(el instanceof exCODE.Condition)
				ret += el.ExportC(0);
		}		
		
		return ret + ')' + (body || '') + ';\r\n';
	}
});

exBASE.extend(exCODE.Do, {
	ExportC: function(ident, args){
		return exCODE.Body.prototype.ExportC.call(this, ident, args);
	}
});




/**************************************************************************************
	IF
**************************************************************************************/
exBASE.extend(exCODE.If, {
	ExportC: function(ident, args){
		var ret = 'If('
		, el
		, condition
		, then
		, elsee

		for(var a=0; a < this.node.childElementCount; a++){
			el = exBASE.adopt(this.node.childNodes[a]);
			if(el instanceof exCODE.Else)
				elsee = el.ExportC(ident, args);
			else if(el instanceof exCODE.Then)
				then = el.ExportC(ident, args);
			else if(el instanceof exCODE.Condition)
				ret += el.ExportC(0);
		}		
		
		ret += ')' + (then || '');
		ret + '\r\nelse' + elsee;
		return ret + ';\r\n';
	}
});




/**************************************************************************************
	RETURN / BREAK / CONTINUE
**************************************************************************************/
exBASE.extend(exCODE.Return, {
	ExportC: function(ident, args){
		var ret = getIdent(ident);
		return 'return';
	}
});

exBASE.extend(exCODE.Break, {
	ExportC: function(ident, args){
		var ret = getIdent(ident);
		return 'break';
	}
});

exBASE.extend(exCODE.Continue, {
	ExportC: function(ident, args){
		var ret = getIdent(ident);
		return 'continue';
	}
});

}());