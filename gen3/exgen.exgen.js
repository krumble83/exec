

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function map(array, block) {
    var i
      , il = array.length
      , result = [];
    
    for (i = 0; i < il; i++)
      result.push(block(array[i]));
    
    return result
  }


var exGEN = {}

// Method for extending objects
exGEN.extend = function() {
  var modules, methods, key, i

  // Get list of modules
  modules = [].slice.call(arguments)

  // Get object with extensions
  methods = modules.pop();

  for (i = modules.length - 1; i >= 0; i--)
    if (modules[i])
      for (key in methods)
        modules[i].prototype[key] = methods[key]

}

// Invent new element
exGEN.invent = function(config) {
  // Create element initializer
  var initializer = typeof config.create == 'function' ?
    config.create :
    function() {
      this.constructor.call(this, exGEN.create(config.create))
    }

  // Inherit prototype
  if (config.inherit)
    initializer.prototype = new config.inherit

  // Extend with methods
  if (config.extend)
    exGEN.extend(initializer, config.extend)

  // Attach construct method to parent
  if (config.construct)
    exGEN.extend(config.parent || exGEN.Fragment, config.construct)

  return initializer
}

exGEN.create = function(name) {
  // create element
  var element = document.createElement(name);

  // apply unique id
  //element.setAttribute('id', this.eid(name))

  return element
}

// Adopt existing svg elements
exGEN.adopt = function(node) {
	// check for presence of node
	if (!node) 
		return null;

	// make sure a node isn't already adopted
	if (node.instance) 
		return node.instance;

	// initialize variables
	var element;

	// adopt with element-specific settings
	if (exGEN[capitalize(node.nodeName)])
		element = new exGEN[capitalize(node.nodeName)];
	else
		element = new exGEN.Element(node);

	// ensure references
	element.type  = node.nodeName;
	element.node  = node;
	node.instance = element;

	return element
}


// Select elements by query string
exGEN.select = function(query, parent) {
  return new exGEN.Set(
    map((parent || document).querySelectorAll(query), function(node) {
      return exGEN.adopt(node);
    })
  )
}


exGEN.Element = exGEN.invent({
	create: function(node) {
		// create circular reference
		if(this.node = node) {
			this.type = node.nodeName;
			this.node.instance = this;
		}
	},
	
    extend: {
		parent2: function(type) {
			var parent = this;

			// check for parent
			if(!parent.node.parentNode) 
				return null;

			// get parent element
			parent = exGEN.adopt(parent.node.parentNode)

			if(!type) 
				return parent;

			// loop trough ancestors if type is given
			while(parent && parent.node instanceof window.SVGElement){
				if(typeof type === 'string' ? parent.matches(type) : parent instanceof type) return parent
				if(parent.node.parentNode.nodeName == '#document') return null // #720
				parent = exGEN.adopt(parent.node.parentNode)
			}
		},
		
		parent: function(type) {
			var parent = this;

			// check for parent
			if(!parent.node.parentNode) 
				return null;

			// get parent element
			parent = exGEN.adopt(parent.node.parentNode);

			if(!type) 
				return parent;

			// loop trough ancestors if type is given
			while(parent && parent instanceof window.exGEN.Element){
				if(typeof type === 'string' ? parent.matches(type) : parent instanceof type) 
					return parent;
				//if(parent.node.parentNode.nodeName == '#document') return null // #720
				parent = exGEN.adopt(parent.node.parentNode)
			}
		},
		
		add: function(element) {
			this.node.appendChild(element.node);
			return this;
		},
		
		select: function(query) {
			return exGEN.select(query, this.node);
		},
		
		attr: function(name, value){
			if(!name)
				return this.node.attributes;
			else if(name && typeof value === 'undefined')
				return this.node.getAttribute(name);
			this.node.setAttribute(name, value);
			return this;
		},
		
		attrNS: function(ns, name, value){
			if(name && typeof value === 'undefined')
				return this.node.getAttributeNS(ns, name);
			else if(name && value === null)
				this.node.removeAttribute(name);
			else
				this.node.setAttributeNS(ns, name, value);
			return this;
		},
		
		create: function(type, args){
			var ret = new exGEN[type];
			ret.init.apply(ret, args);
			this.add(ret);
			return ret;		
		},
		
		remove: function(){
			this.node.parentNode.removeElement(this.node);
			return this;
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
			var i = this.index(element)
		  
			if (i > -1)
				this.members.splice(i, 1);

			return this;
		}, 
		
		each: function(block) {
			for (var i = 0, il = this.members.length; i < il; i++)
				block.apply(this.members[i], [i, this.members]);
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
			return new exGEN.Set(members)
		}
	}
});