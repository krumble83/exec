;(function(ctx){
"use strict";

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function map(array, block) {
	var i
	  , il = array.length
	  , result = [];

	for (i = 0; i < il; i++)
	  result.push(block(array[i]));

	return result;
}


var exGEN = {};
ctx.exGEN = exGEN;

exGEN.extend = function() {
  var modules, methods, key, i;

  modules = [].slice.call(arguments);
  methods = modules.pop();

  for (i = modules.length - 1; i >= 0; i--)
    if (modules[i])
      for (key in methods)
        modules[i].prototype[key] = methods[key];

};

exGEN.invent = function(config) {
  var initializer = typeof config.create == 'function' ?
    config.create :
    function() {
      this.constructor.call(this, exGEN.create(config.create));
    };

  if(config.inherit)
    initializer.prototype = new config.inherit();

  if(config.extend)
    exGEN.extend(initializer, config.extend);

  if(config.construct)
    exGEN.extend(config.parent || exGEN.Fragment, config.construct);

  return initializer;
};

exGEN.create = function(name) {
	return document.createElement(name);
};

exGEN.adopt = function(node, parent) {
	if (!node) 
		return null;

	parent = parent || exGEN;
	
	if(node.instance) 
		return node.instance;

	var element;

	if (parent[capitalize(node.nodeName)])
		element = new parent[capitalize(node.nodeName)]();
	else
		element = new parent.Element(node);

	element.type  = node.nodeName;
	element.node  = node;
	node.instance = element;
	return element;
};


// Select elements by query string
exGEN.select = function(query, parent) {
  return new exGEN.Set(map((parent || document).querySelectorAll(query), function(node){return exGEN.adopt(node);}));
};


exGEN.Element = exGEN.invent({
	create: function(node) {
		// create circular reference
		if(this.node = node) {
			this.type = node.nodeName;
			this.node.instance = this;
		}
	},
	
    extend: {
		parent: function(type) {
			var parent = this;

			if(!parent.node.parentNode) 
				return null;
			parent = exGEN.adopt(parent.node.parentNode);

			if(!type) 
				return parent;

			while(parent && parent instanceof window.exGEN.Element){
				if(typeof type === 'string' ? parent.matches(type) : parent instanceof type) return parent;
				if(parent.node.parentNode.nodeName == '#document') return null; // #720
				parent = exGEN.adopt(parent.node.parentNode);
			}
		},
		
		add: function(element) {
			this.node.appendChild(element.node);
			return this;
		},
		
		prepend: function(element){
			this.node.prepend(element.node);
			return this;			
		},
		
		top: function(){
			var parent = this.parent();
			this.remove();
			parent.prepend(this);
			return this;			
		},
		
		data: function(id, value){
			if(typeof this._data === 'undefined')
				this._data = {};
			if(typeof id === 'undefined')
				return this._data;
			if(typeof value === 'undefined')
				return this._data[id];
			this._data[id] = value;
			return this;
		},
		
		after: function insertAfter(reference) {
			reference.node.parentNode.insertBefore(this.node, reference.node.nextSibling);
			return this;
		},
		
		mergeAttrs: function(el, overwrite){
			for (var i = 0, atts = el.node.attributes, n = atts.length; i < n; i++){
				if(typeof this.attr(atts[i].nodeName) != 'undefined' && overwrite !== false)
					continue;
				if(['id', 'import'].indexOf(atts[i].nodeName) > -1)
					continue;
				this.attr(atts[i].nodeName, atts[i].value);
			}
			return this;
		},
		
		select: function(query, parent){
			return new exGEN.Set(map((this.node || document).querySelectorAll(query), function(node){return exGEN.adopt(node, parent);}));
		},
		
		querySelector: function(query){
			return exGEN.adopt(this.node.querySelector(query));
		},
		
		attr: function(name, value){
			if(typeof name === 'undefined')
				return this.node.attributes;
			else if(name && typeof value === 'undefined')
				return this.node.getAttribute(name);
			if(value === null || value === undefined)
				this.node.removeAttribute(name);
			else
				this.node.setAttribute(name, value);
			return this;
		},

		attrNS: function(ns, name, value){
			if(name && typeof value === 'undefined')
				return this.node.getAttributeNS(ns +':' + name);
			this.node.setAttributeNS(ns + ':' + name, value);
			return this;
		},
		
		create: function(type, args){
			//console.log(args);
			var ret = new exGEN[type]();
			this.add(ret);
			if(typeof ret.init === 'function')
				ret.init.apply(ret, args);
			return ret;		
		},
		
		remove: function(){
			this.node.parentNode.removeChild(this.node);
			return this;
		},
		
		clear: function(query){
			if(!query){
				while(this.node.firstChild)
					this.node.removeChild(this.node.firstChild);
			}
			else{
				this.select(query).each(function(){
					this.remove();
				});
			}
			return this;
		},

		text: function(text){
			if(typeof text === 'undefined')
				return this.node.innerText;
			this.node.innerText = text;
			return this;
		},
		
		clone: function(parent){
			//console.log(capitalize(this.node.nodeName));
			parent = parent || exGEN;
			var element = new parent[capitalize(this.node.nodeName)]();
			element.type  = this.node.nodeName;
			element.node  = this.node.cloneNode();
			element.mergeAttrs(this);
			this.select(':scope > *').each(function(){
				element.add(this.clone());
			});
			element.node.instance = element;
			return element;
		}
	}
});







exGEN.Set = exGEN.invent({
	// Initialize
	create: function(members) {
		// Set initial state
		Array.isArray(members) ? this.members = members : this.clear();
	}, 
	
	extend: {
		add: function() {
			var i, il, elements = [].slice.call(arguments);

			for (i = 0, il = elements.length; i < il; i++)
				this.members.push(elements[i]);
			  
			return this;
		}, 
		
		remove: function(element) {
			var i = this.index(element);
			if (i > -1)
				this.members.splice(i, 1);
			return this;
		}, 
		
		each: function(block) {
			for (var i = 0, il = this.members.length; i < il; i++)
				if(block.apply(this.members[i], [i, this.members]) === false)
					break;
			return this;
		}, 
		
		clear: function() {
			this.members = [];
			return this;
		}, 
		
		length: function() {
			return this.members.length;
		}, 
		
		has: function(element) {
			return this.index(element) >= 0;
		}, 
		
		index: function(element) {
			return this.members.indexOf(element);
		}, 
		
		get: function(i) {
			return this.members[i];
		}, 
		
		first: function() {
			return this.get(0);
		}, 
		
		last: function() {
			return this.get(this.members.length - 1);
		}, 
		
		valueOf: function() {
			return this.members;
		}
	}, 
	
	construct: {
		set: function(members) {
			return new exGEN.Set(members);
		}
	}
});

})(this);