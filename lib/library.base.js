;(function(ctx){

var generators = {};

define(ctx, 'exLIB', {});

var libz;

define(ctx.exLIB, 'package', function(package, callback){
	if(!libz)
		libz = new exGRAPH.Library().init();
	var pack = libz.Package(package);
	callback.call(libz.Package(package), libz.Package(package));
});





var lib = document.createElement('libraryz');
lib.setAttribute('style', 'display:none');
var nodes = document.createElement('nodes');
lib.appendChild(nodes);
var types = document.createElement('types');
lib.appendChild(types);
var generators = document.createElement('generators');
lib.appendChild(generators);


function exportElement(el, exprt){
	var ret = {};
	
	for (var i = 0, atts = el.attributes, n = atts.length; i < n; i++){
		if(Array.isArray(exprt) && exprt.indexOf(atts[i].nodeName) == -1)
			continue;
		ret[atts[i].nodeName] = atts[i].value;
	}

	for(var b=0; b < el.children.length; b++){
		var name = el.children[b].tagName.toLowerCase();

		if(Array.isArray(exprt) && exprt.indexOf(name) == -1)
			continue;			

		if(!ret[name]){
			if(name.substr(-1) == 's')
				ret[name] = [];
		}
		if(el.children[b].innerText != '' && Array.isArray(ret[name]))
			if(el.children[b].innerText.substr(0,8) == 'function')
				ret[name].push(strToFunction(el.children[b].innerText));
			else
				ret[name].push(el.children[b].innerText);
		else if(el.children[b].innerText != '' && !Array.isArray(ret[name]))
			if(el.children[b].innerText.substr(0,8) == 'function')
				ret[name] = strToFunction(el.children[b].innerText);
			else
				ret[name] = el.children[b].innerText;
	
		else if(el.children[b].innerText == '' && Array.isArray(ret[name]))
			ret[name].push(exportElement(el.children[b]));
		else if(el.children[b].innerText == '' && !Array.isArray(ret[name]))
			ret[name] = exportElement(el.children[b]);
	}
	return ret;
}

function mergeAttrs(pinEl, data){
	for (var key in data) {
		if (!Object.prototype.hasOwnProperty.call(data, key))
			continue;
		pinEl.setAttribute(key, data[key]);
	}
}


function mergeElements(parent, data){
	var el;

	for (var key in data) {
		if(!Object.prototype.hasOwnProperty.call(data, key))
			continue;

		if(Array.isArray(data[key])){
			for(var a=0; a < data[key].length; a++){
				el = document.createElement(key);
				if(typeof data[key][a] === 'string')
					el.innerText = data[key][a];
				else
					mergeAttrs(el, data[key][a]);
				parent.appendChild(el);
			}	
		}
		else if(typeof data[key] === 'function'){
			el = document.createElement(key);
			el.innerText = String(data[key]);
			parent.appendChild(el);
		}
		else
			parent.setAttribute(key, data[key]);
	}
	
}


/***************************************************************************
	declare (load)
***************************************************************************/
function createStructAccessors(type){
	var inh = type.querySelectorAll('inherits')
	, found = false
	, id
	, label
	, node
	, pins = []
	, members
	, categories = []
	, catEls;
	
	for(var a=0; a < inh.length; a++){
		if(inh[a].innerText == 'core.type.struct')
			found = true;
	}
	if(!found)
		return;
	
	id = type.getAttribute('id');
	label = type.getAttribute('label');
	
	members = type.querySelectorAll('members');
	for(var i=0; i < members.length; i++){
		pins.push(exportElement(members[i]));
	}
	
	catEls = type.querySelectorAll('categories');
	for(var a=0; a < catEls.length; a++){
		categories.push(catEls[a].innerText);
	}
	
	node = document.createElement('node');
	node.setAttribute('id', id + '.make');
	mergeElements(node, {
		ctor: 'Node',
		symbol: 'lib/img/break.png',
		categories: categories,
		keywords: 'make struct',
		title:'Make ' + type.getAttribute('label'),
		//color: data.color,
		inputs: pins,
		outputs: [
			{id : 'out', type: id, label: label}
		]
	});
	nodes.appendChild(node);

	
	node = document.createElement('node');
	node.setAttribute('id', id + '.break');
	mergeElements(node, {
		ctor: 'Node',
		symbol: 'lib/img/break.png',
		categories: categories,
		keywords: 'break struct',
		title:'Break ' + type.getAttribute('label'),
		//color: data.color,
		inputs: [{id : 'out', type: id, label: label}],
		outputs: pins
	});
	nodes.appendChild(node);
	
}

define(ctx.exLIB, 'init', function(callback){
	loadScript('lib/core/core.js', 'lib/core/macro.js', 'lib/core/flow.js', 'lib/core/int.js', 'lib/core/float.js', 'lib/core/array.js', 'lib/core/bool.js', 'lib/core/object.js', 'lib/core/string.js', 'lib/core/byte.js', 'lib/core/date.js', 
		'lib/web/browser.js', 'lib/web/dom.js', 
		'lib/lib.http.base.js', 
		'lib/javascript/javascript.js', 'lib/javascript/console.js',
		'lib/network/network.js',
		'lib/core/builder.js', 'lib/lib.svgjs.js', 
		'lib/arduino/base.js', 'lib/arduino/eeprom.js', 'lib/arduino/serial.js', 'lib/arduino/sdcard.js', 'lib/arduino/spi.js', 'lib/arduino/io.js', 
		'lib/arduino/device.duem.js', 'lib/arduino/device.mega.js',
		'lib/lib.esp8266.js',
		'lib/python/python.js', 'lib/python/regex.js', 'lib/python/requests.js',
		function(){
			if(typeof callback === 'function')
				callback();
		});
});

define(ctx.exLIB, 'load', function(package, callback){
	package += (package.substr(-1) != '.') ? '.' : '';
	callback({
		registerNode: function(id, data){
			var node;
			if(data.import){
				node = nodes.querySelector('node[id="' + package + data.import + '"]');
				if(!node)
					node = nodes.querySelector('node[id="' + data.import + '"]');
				if(!node){
					console.log('can\'t find node ' + data.import);
					return;
				}
				node = node.cloneNode(true);
			}
			else{
				node = document.createElement('node');
			}
			node.setAttribute('id', package + id);
			mergeElements(node, data);
			if(!data.ctor)
				node.setAttribute('ctor', 'Node');	
			nodes.appendChild(node);
		},
		
		registerType: function(id, data){
			var type
			, inherit;
			
			if(data.inherits){
				type = types.querySelector('type[id="' + package + data.inherits + '"]');
				if(!type)
					type = types.querySelector('type[id="' + data.inherits + '"]');
				if(!type){
					console.log('can\'t find type ' + data.inherits);
					return;
				}
				type = type.cloneNode(true);
				inherit = document.createElement('inherits');
				inherit.innerText = data.inherits;
				type.appendChild(inherit);
				delete data.inherits;
			}
			else
				type = document.createElement('type');

			type.setAttribute('id', id);
			mergeElements(type, data);
			if(!data.ctor)
				type.setAttribute('ctor', 'Pin');	
			types.appendChild(type);
			createStructAccessors(type);
		},
		
		registerGenerator: function(name, func){
			generators[package + name] = func;
		}
	});
});


/***************************************************************************
	Nodes
***************************************************************************/
define(ctx.exLIB, 'createNode', function(name){
	var node
	, def = exLIB.getNode(name);
	
	if(!def)
		console.log('Can\'t find node definition \'' + name + '\'');
	else if(def.ctor && exSVG[def.ctor])
		node = new exSVG[def.ctor];
	else
		node = new exSVG.Node;

	return node;
});

define(ctx.exLIB, 'getNodes2', function(selector, exprt){
	//console.log(selector);
	var sel = libz.select(selector)
	, out = new exGEN.Set
	, node;
	
	sel.each(function(){
		//node = (this.type == 'NODE') ? this : this.parent(exGRAPH.Node);
		node = (this.type == 'NODE' || this.type == 'MACRO') ? this : (this.parent(exGRAPH.Macro) || this.parent(exGRAPH.Node));
		if(!out.has(node))
			out.add(node);
	});
	//console.log(out);
	return out;
});

define(ctx.exLIB, 'getNodes', function(selector, exprt){
	//console.log('exLIB.getNodes("' + selector + '")', exprt);
	var sel = nodes.querySelectorAll(selector)
	, nods = []
	, el;
	
	function nodeInArray(id){
		for(var i=0; i < nods.length; i++)
			if(nods[i].id == id)
				return true;
		return false;
	}
	
	//console.log(sel);
	for(var a=0; a < sel.length; a++){
		if(sel[a].tagName == 'INPUTS' || sel[a].tagName == 'OUTPUTS')
			el = sel[a].parentNode;
		else if(sel[a].tagName == 'NODE')
			el = sel[a];
		else{
			console.log('error, can\'t find node to export', sel[a]);
			continue;
		}
		if(nodeInArray(el.getAttribute('id')))
			continue;
		
		if(exprt === true){
			nods.push(el.cloneNode(true));
			continue;
		}
		nods.push(exportElement(el, exprt));
	}
	//console.log(nods);
	return nods;
});

define(ctx.exLIB, 'getNode', function(id, exprt){
	var sel = nodes.querySelector('node[id="' + id + '"]')
	, node;

	if(sel.tagName == 'PIN')
		sel = sel.parentNode.parentNode;
	else if(sel.tagName != 'NODE'){
		console.log('error, can\'t find node to export', sel.tagName);
		return;
	}
	
	if(exprt === true)
		return sel.cloneNode(true);
	
	return exportElement(sel, exprt);
});

define(ctx.exLIB, 'getNode2', function(id){
	return libz.GetNode(id);
	
});



/***************************************************************************
	Generators
***************************************************************************/
define(ctx.exLIB, 'getGenerator', function(id){
	return generators[id];
});


/***************************************************************************
	Datatype
***************************************************************************/
define(ctx.exLIB, 'getDataType', function(id, exprt){
	//console.log('exLIB.getDataType()', id, exprt);
	if(exLIB.isArrayDataType(id))
		id = exLIB.swapArrayDataType(id);
	
	var sel = types.querySelector('type[id="' + id + '"]');
	
	if(exprt === true)
		return sel.cloneNode(true);

	return exportElement(sel, exprt);
});

define(ctx.exLIB, 'getDataType2', function(id, exprt){
	//console.log('exLIB.getDataType()', id, exprt);
	if(exLIB.isArrayDataType(id))
		id = exLIB.swapArrayDataType(id);
	return libz.GetType(id);
});

define(ctx.exLIB, 'isDataTypeCompatible', function(input, output, withWildcards){
	//console.log('exLIB.isDataTypeCompatible', input, output);
	var ret = 0
	//, declIntype = exLIB.getDataType(input);
	
	//console.log(declIntype);
	
	if(typeof withWildcards === 'undefined')
		withWildcards = true;

	if(exLIB.isExecDataType(input) != exLIB.isExecDataType(output))
		return false;
	if(input == output) //1
		ret += 1;
	if(!withWildcards)
		return false;
	/*
	if(declIntype.inherits && declIntype.inherits.indexOf(exLIB.getWildcardsDataType()) > -1){
		//console.log('inherits')
		if(declIntype.accepts && declIntype.accepts.indexOf(output) > -1)
			ret += 2;
		else
			return false;
	}
	else if(declIntype.inherits && declIntype.inherits.indexOf(output) > -1)
		ret += 4;
	*/
	if(exLIB.isWildcardsDataType(input, false) && !exLIB.isArrayDataType(output)) //2
		ret += 8;
	if(exLIB.isWildcardsDataType(output, false) && !exLIB.isArrayDataType(input)) //3
		ret += 16;
	if(exLIB.isWildcardsDataType(input, true) && exLIB.isArrayDataType(output)) //4
		ret += 32;
	if(exLIB.isWildcardsDataType(output, true) && exLIB.isArrayDataType(input)) //5
		ret += 64;
	//console.log('-result: ' + ret);
	return ret != 0;
});

/***************************************************************************
	wildcards
***************************************************************************/
define(ctx.exLIB, 'isWildcardsDataType', function(type, arraycheck){
	if(arraycheck)
		return type == exLIB.getWildcardsDataType(true);
	if(typeof arraycheck == 'undefined')
		return type == exLIB.getWildcardsDataType(true) || type == exLIB.getWildcardsDataType();
	return type == exLIB.getWildcardsDataType();
});

define(ctx.exLIB, 'getWildcardsDataType', function(array){
	if(array)
		return 'core.wildcards[]';
	return 'core.wildcards';
});



/***************************************************************************
	Array
***************************************************************************/
define(ctx.exLIB, 'isArrayDataType', function(type){
	return type.search('\\[') != -1;
});

define(ctx.exLIB, 'getArrayDataType', function(type){
	return type.replace('[]', '') + '[]';
});

define(ctx.exLIB, 'swapArrayDataType', function(type){
	if(exLIB.isArrayDataType(type))
		return type.replace('[]', '');
	return type + '[]';
});


/***************************************************************************
	Exec
***************************************************************************/
define(ctx.exLIB, 'getExecDataType', function(){
	return 'core.exec';
});

define(ctx.exLIB, 'isExecDataType', function(type){
	return type == exLIB.getExecDataType();
});





setTimeout(function(){
	document.body.appendChild(lib);
}, 100);

})(window);