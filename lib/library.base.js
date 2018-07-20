;(function(ctx){

var libz;

define(ctx, 'exLIB', {});

define(ctx.exLIB, 'package', function(package, callback){
	if(!libz)
		libz = new exGRAPH.Library().init();
	var pack = libz.Package(package);
	if(typeof callback == 'function')
		callback.call(libz.Package(package), libz.Package(package));
	return pack;
});


define(ctx.exLIB, 'init', function(callback){
	loadCss('menu.css');
	loadScript('menu.js', 'lib/core/core.js', 'lib/core/macro.js', 'lib/core/flow.js', 'lib/core/int.js', 'lib/core/float.js', 'lib/core/array.js', 'lib/core/bool.js', 'lib/core/object.js', 'lib/core/string.js', 'lib/core/byte.js', 'lib/core/date.js', 
		'lib/web/browser.js', 'lib/web/dom.js',
		'lib/javascript/javascript.js', 'lib/javascript/console.js',
		'lib/network/network.js',
		'lib/arduino/base.js', 'lib/arduino/eeprom.js', 'lib/arduino/serial.js', 'lib/arduino/sdcard.js', 'lib/arduino/spi.js', 'lib/arduino/io.js', 
		'lib/arduino/device.duem.js', 'lib/arduino/device.mega.js',
		'lib/esp8266/esp8266.network.js',
		'lib/python/python.js', 'lib/python/regex.js', 'lib/python/requests.js',
		'debug.js', 
		function(){
			if(typeof callback === 'function')
				callback();
		});
});


/***************************************************************************
	Nodes
***************************************************************************/

define(ctx.exLIB, 'getNodes2', function(selector, exprt){
	//console.log(selector);
	var sel = libz.select(selector)
	, out = new exGEN.Set
	, node;
		
	sel.each(function(){
		//node = (this.type == 'NODE') ? this : this.parent(exGRAPH.Node);
		node = (this.type == 'node' || this.type == 'macro') ? this : (this.parent(exGRAPH.Macro) || this.parent(exGRAPH.Node));
		if(!out.has(node))
			out.add(node);
	});
	//console.log(out);
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
	return libz.select('type[id="' + id + '"],class[id="' + id + '"],structure[id="' + id + '"],enum[id="' + id + '"]').first()
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

define(ctx.exLIB, 'removeArrayDataType', function(type){
	return type.replace('[]', '');
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


})(window);