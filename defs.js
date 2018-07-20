;(function(ctx){

if(ctx.define)
	return;

function def(obj, name, value){
	Object.defineProperty(obj, name, {
			enumerable: true,
			configurable: false,
			writable: false,
			value: value
	});
}

/*
function clone(obj) {
	if (obj === null || typeof(obj) !== 'object' || 'isActiveClone' in obj)
		return obj;

	if (obj instanceof Date)
		var temp = new obj.constructor(); //or new Date(obj);
	else if(obj.constructor.name)
		var temp = obj.constructor();
	else {
		console.log("no ctor for cloning", obj);
		return obj;
	}
	
	for (var key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			obj['isActiveClone'] = null;
			temp[key] = clone(obj[key]);
			delete obj['isActiveClone'];
		}
	}
	return temp;
}

function merge(src, dest) {
	for (var key in src) {
		if (Object.prototype.hasOwnProperty.call(src, key)) {
			if(typeof dest[key] === 'undefined')
				dest[key] = clone(src[key]);
			else if(typeof src[key] !== 'object')
				dest[key] = src[key];
			else{
				//dest[key] = src[key].constructor();
				merge(src[key], dest[key]);
			}
		}
	}
}

function clone2(obj) {
	
	console.log(Array.isArray(obj));
	if(obj === null || obj === undefined || 'isActiveClone' in obj || !Array.isArray(obj))
		return obj;

	if (obj instanceof Date)
		var temp = new obj.constructor(); //or new Date(obj);
	else if(Array.isArray(obj)){
		console.log('array');
		var temp = [];
		for(var a=0; a < obj.length; a++)
			temp.push(clone(obj[a]));
		return temp;
	}
	else{
		console.log(obj);
		var temp = obj.constructor();
	}

	for (var key in obj) {
		console.log(obj[key]);
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			obj['isActiveClone'] = null;
			temp[key] = clone(obj[key]);
			delete obj['isActiveClone'];
		}
	}
	return temp;
}
*/

function loadScript(){
	var args = Array.prototype.slice.call(arguments);

	function loaded(src){
		var scripts = document.getElementsByTagName("script");
		for(var i = 0; i < scripts.length; i++) 
		   if(scripts[i].getAttribute('src') == src) 
			   return true;
		return false;
	}


	if(args.length === 0)
		return;
	
	var tok = args.shift();
	if(typeof tok === 'string'){
		if(loaded(tok)){
			loadScript.apply(this, args);
			return;
		}
		var script = document.createElement('script');
		script.type = "text\/javascript";
		script.onload = function () {
			loadScript.apply(this, args);
		};
		(document.head || document.getElementsByTagName("head")[0]).appendChild(script);
		script.src = tok;
	}
	else if(typeof tok === 'function'){
		if(tok.apply(this, args) === false)
			return;
		loadScript.apply(this, args);
	}
	else if(tok instanceof Array){
		loadScript.apply(this, tok.concat(args));
	}
	else{
		console.log('loadScript: Argument ignored (not string or function)');
		loadScript.apply(this, args);
	}
}

function loadCss(){
	var args = Array.prototype.slice.call(arguments);

	function loaded(src){
		var links = document.getElementsByTagName("link");
		for(var i = 0; i < links.length; i++) 
		   if(links[i].getAttribute('href') == src) 
			   return true;
		return false;
	}

	if(args.length === 0)
		return;

	var tok = args.shift();
	if(typeof tok === 'string'){
		if(loaded(tok)){
			loadCss.apply(this, args);
			return;
		}
		var link  = document.createElement('link');
		link.rel  = 'stylesheet';
		link.type = 'text/css';
		link.href = tok;
		link.media = 'all';
		link.onload = function () {
			loadCss.apply(this, args);
		};
		(document.head || document.getElementsByTagName('head')[0]).appendChild(link);	
	}
	else if(typeof tok === 'function'){
		if(tok.apply(this, args) === false)
			return;
		loadCss.apply(this, args);
	}
	else{
		console.log('loadCss: Argument ignored (not string)');
		loadCss.apply(this, args);
	}
}

function nl2br (str, is_xhtml) {
    if (typeof str === 'undefined' || str === null) {
        return '';
    }
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}



/*
Object.defineProperty(ctx, '__stack', {
get: function() {
        var orig = Error.prepareStackTrace;
        Error.prepareStackTrace = function(_, stack) {
            return stack;
        };
        var err = new Error;
        Error.captureStackTrace(err, arguments.callee);
        var stack = err.stack;
        Error.prepareStackTrace = orig;
		console.dir(stack);
        return stack;
    }
});

Object.defineProperty(ctx, '__line', {
get: function() {
        return __stack[2].getLineNumber();
    }
});

Object.defineProperty(ctx, '__function', {
get: function() {
        return __stack[2].getFunctionName();
    }
});

Object.defineProperty(ctx, '__file', {
get: function() {
        return __stack[2].getFileName();
    }
});
*/



function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}



function assert(ass, callback){
	if(!ass){
		if(typeof callback === 'function')
			callback();
		throw new Error('Assertion Error');
	}
};

def(ctx, 'define', def);
def(ctx, 'download', download);
def(ctx, 'assert', assert);
def(ctx, 'loadScript', loadScript);
def(ctx, 'loadCss', loadCss);
def(ctx, 'nl2br', nl2br);


def(ctx, 'F_UNIQUE', 1);
def(ctx, 'F_NODELETE', 2);
def(ctx, 'F_NOCOPY', 4);
def(ctx, 'F_NOCUT', 8);
def(ctx, 'F_REQUIRED', 16);


def(ctx, 'exSVG', {
	plugin: function(){
		var modules, methods, key, i;

		modules = [].slice.call(arguments);
		methods = modules.pop();

		for (i = modules.length - 1; i >= 0; i--){
			if (modules[i]){
				if(!modules[i].__plugins)
					modules[i].__plugins = [];
				for (key in methods){
					//console.log(methods[key]);
					if(key == 'init'){
						modules[i].__plugins.push(methods[key]);
						//console.log(this);
					}
					else
						modules[i].prototype[key] = methods[key];
				}
			}
		}
		
	},
	
	execPlugins: function(obj, args, parent){
		if(parent.__plugins){
			parent.__plugins.forEach(function(val){
				val.apply(obj, args);
			});
		}		
	}
});


Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

String.prototype.capitalize = function(firstOnly) {
	if(firstOnly)
		return this.charAt(0).toUpperCase() + this.slice(1);
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

/*
Function.prototype.clone = function() {
    var that = this;
    var temp = function temporary() { return that.apply(this, arguments); };
    for(var key in this) {
        if (this.hasOwnProperty(key)) {
            temp[key] = this[key];
        }
    }
    return temp;
};
*/


if (!Array.prototype.forEach) {
  Array.prototype.forEach = function(callback /*, thisArg*/) {

    var T, k;

    if (this == null) {
      throw new TypeError(' this vaut null ou n est pas défini');
    }

    // 1. Soit O le résultat de l'appel à ToObject
    //    auquel on a passé |this| en argument.
    var O = Object(this);

    // 2. Soit lenValue le résultat de l'appel de la méthode 
    //    interne Get sur O avec l'argument "length".
    // 3. Soit len la valeur ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. Si IsCallable(callback) est false, on lève une TypeError.
    // Voir : http://es5.github.com/#x9.11
    if (typeof callback !== "function") {
      throw new TypeError(callback + ' n est pas une fonction');
    }

    // 5. Si thisArg a été fourni, soit T ce thisArg ;
    //    sinon soit T égal à undefined.
    if (arguments.length > 1) {
      T = arguments[1];
    }

    // 6. Soit k égal à 0
    k = 0;

    // 7. On répète tant que k < len
    while (k < len) {

      var kValue;

      // a. Soit Pk égal ToString(k).
      //   (implicite pour l'opérande gauche de in)
      // b. Soit kPresent le résultat de l'appel de la 
      //    méthode interne HasProperty de O avec l'argument Pk.
      //    Cette étape peut être combinée avec c
      // c. Si kPresent vaut true, alors
      if (k in O) {

        // i. Soit kValue le résultat de l'appel de la 
        //    méthode interne Get de O avec l'argument Pk.
        kValue = O[k];

        // ii. On appelle la méthode interne Call de callback 
        //     avec T comme valeur this et la liste des arguments
        //     qui contient kValue, k, et O.
        callback.call(T, kValue, k, O);
      }
      // d. On augmente k de 1.
      k++;
    }
    // 8. on renvoie undefined
  };
}








/*
var fnRegex = /^function(?:.+)?(?:\s+)?\((.+)?\)(?:\s+|\n+)?\{(?:\s+|\n+)?((?:.|\n)+)\}$/m;
ctx.strToFunction = function (fnString){
  var fnMetadata = fnRegex.exec(fnString);
  var args = [];
  var fnArgs = fnMetadata[1];
  if (fnArgs){
    fnArgs.split(',').forEach(function(item){ 
      args.push(item.trim()); 
    });
  };
  
  args.push(fnMetadata[2]);
  return new Function(...args);
};
*/

})(window);



