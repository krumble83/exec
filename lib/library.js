
;(function(ctx){

define(ctx, 'Driver', {});	
define(ctx, 'Library', {});

var lib_nodes = {};
var lib_types = {};
var lib_templates = {};

define(ctx.Driver, 'require', function(libs, callback){
	callback(ctx.Library);
});

define(ctx.Driver, 'load', function(callback){
	callback(ctx.Library);
});


ctx.log = function(){
	console.log(JSON.stringify(lib_nodes));
	
}

function mergeNode2(src, dest){
	for (var key in src) {
		if (Object.prototype.hasOwnProperty.call(src, key)) {
			if(key == 'inherits'){
				if(!Array.isArray(src[key]))
					src[key] = [src[key]];
				if(!dest[key])
					dest[key] = [];
				if(!Array.isArray(dest[key]))
					dest[key] = [dest[key]];
			}
			if(typeof dest[key] === 'undefined' && !Array.isArray(src[key]))
				dest[key] = clone(src[key]);
			else if(typeof dest[key] === 'undefined' && Array.isArray(src[key])){
				dest[key] = clone(src[key]);
			}
			else if(Array.isArray(dest[key]) && Array.isArray(src[key])){
				for(var a=0; a < src[key].length; a++){
					if(dest[key].indexOf(src[key][a]) == -1)
						dest[key].push(src[key][a]);
				}
			}
			else
				dest[key] = clone(src[key]);
		}
	}		
}


function mergeNode(src, dest){
	for (var key in src) {
		if (Object.prototype.hasOwnProperty.call(src, key)) {
			if(key == 'inherits'){
				if(!Array.isArray(src[key]))
					src[key] = [src[key]];
				if(!Array.isArray(dest[key]))
					dest[key] = [dest[key]];
			//console.log(dest, src);
			}
			if(typeof dest[key] === 'undefined' && !Array.isArray(src[key]))
				dest[key] = clone(src[key]);
			else if(typeof dest[key] === 'undefined' && Array.isArray(src[key])){
				dest[key] = clone(src[key]);
			}
			else if(Array.isArray(dest[key]) && Array.isArray(src[key])){
				for(var a=0; a < src[key].length; a++){
					if(dest[key].indexOf(src[key][a]) == -1)
						dest[key].push(src[key][a]);
				}
			}
			else
				dest[key] = clone(src[key]);
		}
	}		
}

function reg(package, name, data, target){
	var pack = package + '.';
	data.id = pack + name;
	if(data.inherits){
		if(!Array.isArray(data.inherits))
			data.inherits = [data.inherits];
		//console.log(data)
		target[pack + name] = {};
		for(var a=0; a < data.inherits.length; a++){
			data.inherits[a] = (data.inherits[a].search('\\.') != -1) ? data.inherits[a] : pack + data.inherits[a];
			if(!target[data.inherits[a]]){
				console.log('cant find ' + data.inherits[a]);
				continue;
			}
			mergeNode(target[data.inherits[a]], target[pack + name]);
		}
		mergeNode(data, target[pack + name]);
	}
	else
		target[pack + name] = clone(data);
	//console.log(target);
};


function createStructAccessors(name, data, package){
	//console.log(data);
	if(!data.members)
		return;

	var out = {
		categories: data.categories,
		symbol: 'lib/img/break.png',
		keywords: 'make struct',
		title:'Make ' + data.label + ' Structure',
		color: data.color,
		inputs: [],
		outputs: [
			{id : 'out', type: name, label: data.label}
		]
	}

	if(data.make){
		for(var i=0; i < data.members.length; i++){
			out.inputs.push(clone(data.members[i]));
		}
		reg(package, name + '_create', out, lib_nodes);
	}
	if(data.break){
		out.inputs = [{id : 'in', type: name, label: data.label}]
		out.outputs = [];
		out.keywords = 'break struct';
		out.title = 'Break ' + data.label + ' Structure';
		for(var i=0; i < data.members.length; i++){
			out.outputs.push(clone(data.members[i]));
		}
		reg(package, name + '_break', out, lib_nodes);
	}
}


function createGetterNode(varname, data){
	node = {
		title:'',
		ctor: 'NodeVarGetter',
		color: lib_types[varname].color,
		inputs: [],
		outputs: [
			{id: 'out', type: varname, label:'Var_name'}
		]
	}
	reg(varname, 'getter', node, lib_nodes);
}


function createSetterNode(varname, data){
	node = {
		title:'',
		ctor: 'NodeVarSetter',
		color: lib_types[varname].color,
		inputs: [
			{id: 'entry', type: 'core.exec'},
			{id: 'in', type: varname, label:'Var_name'}
		],
		outputs: [
			{id: 'exit', type: 'core.exec'},
			{id: 'out', type: varname, label:' '}
		]
	}
	reg(varname, 'setter', node, lib_nodes);
}

define(ctx.Library, 'load', function(package, callback, require){
	callback({
		registerNode: function(name, data){
			reg(package, name, data, lib_nodes);
		}, 
		registerType: function(name, data){
			var ret = Library.registerType(name, data);
			if(data.inherits && data.inherits == 'core.type.struct')
				createStructAccessors(name, ret, package);
			//reg_type(name, data);
		},
		registerTemplate: function(name, data){
			reg(package, name, data, lib_templates);
		}, 
		getNode: function(name){
			return clone(lib_nodes[name]);
		},
		getType: function(name){
			return clone(lib_types[name]);
		},
		require: function(){
			var script = document.createElement('script');
			script.src = src;
			script.async = false;
			document.head.appendChild(script);			
		},
		defer: function(callback){
			
		}
	});
});


define(ctx.Library, 'registerNode', function(name, data){
	if(data.inherits){
		if(Array.isArray(data.inherits)){
			if(!lib_nodes[data.inherits]){
				console.log('cant find ' + name + ' to inherits of');
				return;
			}
			lib_nodes[name] = {};
			for(var a=0; a < data.inherits.length; a++){
				mergeNode(lib_nodes[data.inherits[a]], lib_nodes[name]);
			}
			mergeNode(data, lib_nodes[name]);
		} else {
			if(!lib_nodes[data.inherits]){
				console.log('cant find ' + name + ' to inherits of');
				return;
			}
			lib_nodes[name] = clone(lib_nodes[data.inherits]);
			mergeNode(data, lib_nodes[name]);
		}
	}
	else
		lib_nodes[name] = clone(data);
});


define(ctx.Library, 'registerType', function(name, data){
	var node;
	
	if(data.inherits){
		if(!Array.isArray(data.inherits))
			data.inherits = [data.inherits];
		
		lib_types[name] = {inherits : data.inherits};
		if(name == 'core.object')
			console.log('----------------------', data.inherits, lib_types[name]);
		for(var a=0; a < data.inherits.length; a++){
			mergeNode(lib_types[data.inherits[a]], lib_types[name]);
		}
		mergeNode(data, lib_types[name]);
		//console.log(name, lib_types[name]);
	}
	else
		lib_types[name] = clone(data);
	
	if(lib_types[name].inherits){
		if((Array.isArray(lib_types[name].inherits) && lib_types[name].inherits.indexOf('core.variable') != -1) || lib_types[name].inherits == 'core.variable'){
			createSetterNode(name, data);
			createGetterNode(name, data);
		}

		if((Array.isArray(lib_types[name].inherits) && lib_types[name].inherits.indexOf('core.device') != -1) || lib_types[name].inherits == 'core.device'){
			//console.log('zzzzzzzzzzzzz');
			createGetterNode(name, data);
		}

	}
	

	//console.log(lib_types);
	return lib_types[name];
});


define(ctx.Library, 'getDataType', function(name){
	return lib_types[name.replace('[]', '')];
});


define(ctx.Library, 'createPin', function(data){
	var type = data.type;
	//console.log(Library.getDataType(data.type));
	if(type.search('[]') != 0)
		type = type.replace('[]', '');
	if(type && lib_types[type]){
		var p;
		if(exSVG[lib_types[type].pinctor])
			p = new exSVG[lib_types[type].pinctor];
		else
			p = new exSVG.Pin;
		p.setColor(lib_types[type].color);
		return p
	}
	else
		return new exSVG.Pin;
});


define(ctx.Library, 'createNode', function(data){
	var n;
	if(data.ctor){
		n = new exSVG[data.ctor];
	}
	else if(data.name){
		if(!lib_nodes[data]){
			console.log('Can\'t find node definition \'' + data + '\'');
			return false;			
		}
		n = new exSVG[lib_nodes[data.name].ctor];
	}
	else if(typeof data === 'string' && !lib_nodes[data]){
		console.log('Can\'t find node definition \'' + data + '\'');
		return false;
	}
	else if(lib_nodes[data].ctor)
		n = new exSVG[lib_nodes[data].ctor];
	else
		n = new exSVG.Node;

	return n
});


define(ctx.Library, 'getNode', function(name){
	return clone(lib_nodes[name]);
});


define(ctx.Library, 'isDataTypeCompatible', function(input, output, withWildcards){
	//console.log('library.isDataTypeCompatible', type1, type2);
	var ret = 0
	, declIntype = Library.getDataType(input);
	
	//console.log(declIntype);
	
	if(typeof withWildcards === 'undefined')
		withWildcards = true;

	if(Library.isExecDataType(input) != Library.isExecDataType(output))
		return false;
	if(input == output) //1
		ret += 1;
	if(!withWildcards)
		return false;
	if(declIntype.inherits && declIntype.inherits.indexOf(Library.getWildcardsDataType()) > -1){
		//console.log('inherits')
		if(declIntype.accept && declIntype.accept.indexOf(output) > -1)
			ret += 2;
		else
			return false;
	}
	else if(declIntype.inherits && declIntype.inherits.indexOf(output) > -1)
		ret += 4;

	if(Library.isWildcardsDataType(input, false) && !Library.isArrayDataType(output)) //2
		ret += 8;
	if(Library.isWildcardsDataType(output, false) && !Library.isArrayDataType(input)) //3
		ret += 16;
	if(Library.isWildcardsDataType(input, true) && Library.isArrayDataType(output)) //4
		ret += 32;
	if(Library.isWildcardsDataType(output, true) && Library.isArrayDataType(input)) //5
		ret += 64;
	//console.log('-result: ' + ret);
	return ret != 0;
});


define(ctx.Library, 'getWildcardsDataType', function(array){
	if(array)
		return 'core.wildcards[]';
	return 'core.wildcards';
});


define(ctx.Library, 'getExecDataType', function(){
	return 'core.exec';
});


define(ctx.Library, 'isWildcardsDataType', function(type, arraycheck){
	if(typeof type === 'string'){
		if(arraycheck)
			return type == Library.getWildcardsDataType(true);
		if(typeof arraycheck == 'undefined')
			return type == Library.getWildcardsDataType(true) || type == Library.getWildcardsDataType();
		return type == Library.getWildcardsDataType();
	}
});


define(ctx.Library, 'isExecDataType', function(type){
	return type == Library.getExecDataType();
});


define(ctx.Library, 'isArrayDataType', function(type){
	return type.search('\\[') != -1;
});


define(ctx.Library, 'swapArrayDataType', function(type){
	if(Library.isArrayDataType(type))
		return type.replace('[]', '');
	return type + '[]';
});


define(ctx.Library, 'getNodes', function(filters){
	var tmp = {};
	var reName,reKeyword;

	if(filters && filters.name){
		reName = new RegExp(filters.name, 'gi');
		//reKeyword
	}

	var havePin = function(pins, pin){
		//console.log(pins, pin);
		if(!pins)
			return false;
		for(var i=0; i < pins.length; i++){
			//console.log(pin.type, pins[i].type);
			if(Library.isDataTypeCompatible(pin.type, pins[i].type))
				return true;
		}
		return false;
	}
	
	var findPath = function(parent, path){
		var p = path.shift();
		if(!parent[p])
			parent[p] = {};
		if(path.length == 0)
			return parent[p];
		else
			return findPath(parent[p], path);
	}
	
	var i,p,path,v;
	for (var key in lib_nodes) {
		if (lib_nodes.hasOwnProperty(key)) {
			//console.log(filters, lib_nodes[key]);

			if(!lib_nodes[key].categories)
				continue;
			if(!lib_nodes[key].inputs && !lib_nodes[key].outputs)
				continue;
			if(filters && filters.input && filters.input.type && !havePin(lib_nodes[key].inputs, filters.input))
				continue;
			else if(filters && filters.output && filters.output.type && !havePin(lib_nodes[key].outputs, filters.output))
				continue;
			if(reName){
				if((lib_nodes[key].title && lib_nodes[key].title.search(reName) == -1) && (lib_nodes[key].keywords && lib_nodes[key].keywords.search(reName) == -1))
					continue;
			}

			for(i=0;i < lib_nodes[key].categories.length; i++){
				p = lib_nodes[key].categories[i].split('/');
				path = findPath(tmp, p);
				v = {label:lib_nodes[key].title};
				if(lib_nodes[key].symbol)
					v.symbol = lib_nodes[key].symbol;
				path[key] = v;
			}
		}
	}
	return tmp;
});


})(window);


