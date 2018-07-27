;(function(ctx){

var libz;

define(ctx, 'exLIB', {});

define(ctx.exLIB, 'package', function(package, callback){
	if(!libz){
		libz = new exGRAPH.Library().init();
			libz.node.style = 'display:none';
			document.body.appendChild(libz.node);
	}
	var pack = libz.Package(package);
	if(typeof callback == 'function')
		callback.call(libz.Package(package), libz.Package(package));
	return pack;
});


define(ctx.exLIB, 'init', function(callback){
	loadCss('menu.css');
	console.time('libraryLoad');
	loadScript('menu.js', 'lib/core/core.js', 'lib/core/macro.js', 'lib/core/flow.js', 'lib/core/int.js', 'lib/core/float.js', 'lib/core/array.js', 'lib/core/bool.js', 'lib/core/object.js', 'lib/core/string.js', 'lib/core/byte.js', 'lib/core/date.js', 
		'lib/web/browser.js', 'lib/web/dom.js',
		'lib/javascript/javascript.js', 'lib/javascript/console.js',
		'lib/network/network.js',
		'lib/arduino/base.js', 'lib/arduino/eeprom.js', 'lib/arduino/serial.js', 'lib/arduino/sdcard.js', 'lib/arduino/spi.js', 'lib/arduino/io.js', 'lib/arduino/sdcard.js', 
		'lib/arduino/device.duem.js', 'lib/arduino/device.mega.js', 'lib/arduino/wifi.base.js',
		'lib/python/python.js', 'lib/python/regex.js', 'lib/python/requests.js',
		'lib/json.js', 
		'debug.js', 
		function(){
			console.timeEnd('libraryLoad');
			if(typeof callback === 'function')
				callback();
		});
});


/***************************************************************************
	Nodes
***************************************************************************/

function createQuery(context, filters, search){
	var ret = []
	, search = (search) ? ['[keywords*="' + search + '" i]', '[title*="' + search + '" i]'] : [''];
	
	for(var a=0; a < filters.length; a++){
		for(var b=0; b < search.length; b++){
			if(filters[a].startsWith('input') || filters[a].startsWith('output')){
				ret.push('node' + search[b] + ':not([context]) ' + filters[a]);
				ret.push('macro' + search[b] + ':not([context]) ' + filters[a]);
				if(context){
					ret.push('node[context="' + context + '"]' + search[b] + ' ' + filters[a]);
					ret.push('macro[context="' + context + '"]' + search[b] + ' ' + filters[a]);
					
				}
			}
			else if(filters[a] =='node' || filters[a] == 'macro'){
				ret.push(filters[a] + search[b] + ':not([context])');
				if(context)
					ret.push(filters[a] + '[context="' + context + '"]' + search[b]);
			}
		}
	}
	return ret;
}



define(ctx.exLIB, 'getNodes', function(context, selectors, query){
	//console.log(selector.split(','));
	var out = new exBASE.Set
	, q = createQuery(context, selectors, query)
	, sel = libz.select(q.join(','))
	, node;
	
	sel.each(function(){
		node = (this.type == 'node' || this.type == 'macro') ? this : (this.parent(exGRAPH.Node) || this.parent(exGRAPH.Macro));
		if(node && !out.has(node))
			out.add(node);
	});
	return out;
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

define(ctx.exLIB, 'getDataType2', function(id){
	//console.log('exLIB.getDataType()', id, exprt);
	if(exLIB.isArrayDataType(id))
		id = exLIB.swapArrayDataType(id);
	return libz.select('type[id="' + id + '"],class[id="' + id + '"],structure[id="' + id + '"],enum[id="' + id + '"],component[id="' + id + '"]').first()
	//return libz.GetType(id);
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
	return libz.isWildcardsDataType(type, arraycheck);
});

define(ctx.exLIB, 'getWildcardsDataType', function(array){
	return libz.getWildcardsDataType(array);
});



/***************************************************************************
	Array
***************************************************************************/
define(ctx.exLIB, 'isArrayDataType', function(type){
	return libz.isArrayDataType(type);
});

define(ctx.exLIB, 'getArrayDataType', function(type){
	return libz.getArrayDataType(type);
});

define(ctx.exLIB, 'swapArrayDataType', function(type){
	return libz.swapArrayDataType(type);
});

define(ctx.exLIB, 'removeArrayDataType', function(type){
	return libz.removeArrayDataType(type);
});

/***************************************************************************
	Exec
***************************************************************************/
define(ctx.exLIB, 'getExecDataType', function(){
	return libz.getExecDataType();
});

define(ctx.exLIB, 'isExecDataType', function(type){
	return libz.getExecDataType();
});


})(window);