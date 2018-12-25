;(function() {
"use strict";

exSVG.Pin = SVG.invent({
    create: 'g', 
    inherit: SVG.G,
	
    extend: {
		init: function(data){
			//console.log('exSVG.Pin.init()', data);
			var me = this;

			this.getNode().on('destroy', me.destroy, me);
			
			for (var i = 0, atts = data.attr(), n = atts.length; i < n; i++){
				if(['import'].indexOf(atts[i].nodeName) > -1)
					continue;
				me.setData(atts[i].nodeName, atts[i].value);
			}
			me.addClass('exPin');
			me.setId(data.Id());
			me.setType(data.type);

			/*
			this.getNode().on('export.pin-' + me.getId(), function(e){
				//console.dir('export', me.constructor);
				me.export(e.detail.parent);
			});
			*/
			data.select(':scope > *').each(function(){
				if(me['import' + this.type.capitalize()])
					me['import' + this.type.capitalize()](this, me);
			});
			
			exSVG.execPlugins(this, arguments, exSVG.Pin);
			return me;
        },
		
		import: function(data){
			var me = this;
			
			for (var i = 0, atts = data.attr(), n = atts.length; i < n; i++){
				if(['import'].indexOf(atts[i].nodeName) > -1)
					continue;
				me.setData(atts[i].nodeName, atts[i].value);
			}
			me.setId(data.Id());
			me.addClass('exPin');
			me.mMaxLink = -1;
			
			
			if(data.type == 'INPUT'){
				this.addClass('input')
				.setMaxLink(1);
			}
			if(data.type == 'OUTPUT'){
				this.addClass('output')
				.setMaxLink(-1);
			}
			
			if(me.initGfx)
				me.initGfx(data);

			data.select('*').each(function(){
				if(me['import' + this.type.capitalize()])
					me['import' + this.type.capitalize()](this, me);
			});			
            return me;

		},
		
		hide: function(){
			this.setData('hidden', true);
			return SVG.G.prototype.hide.apply(this, arguments);
		},
		
		show: function(){
			this.setData('hidden', false);
			return SVG.G.prototype.show.apply(this, arguments);			
		},

		getNode: function(){
			return this.parent(exSVG.Node);
		},
		
		getId: function(){
			return this.getData('id');
		},

		setId: function(id){
			this.id(this.getNode().id() + '-' + id);
			this.setData('id', id);
			return this;
		},
		
		setDataType: function(datatypeid){
			this.setData('type', datatypeid);
			return this;
		},
		
		getDataType: function(){
			return this.getData('type');
		},
		
		isArrayDataType: function(){
			return exLIB.isArrayDataType(this.getDataType());
		},
				
		getType: function(){
			var me = this
				, ret = 0;
			if(me.hasClass('input'))
				ret += exSVG.Pin.PIN_IN;
			if(me.hasClass('output'))
				ret += exSVG.Pin.PIN_OUT;
			return ret;
		},
		
		setType: function(type){
			if(type == 'INPUT' || type == 'input' || type == exSVG.Pin.PIN_IN){
				this.addClass('input')
					.removeClass('output')
					.setMaxLink(1);
			}
			if(type == 'OUTPUT' || type == 'output' || type == exSVG.Pin.PIN_OUT){
				this.addClass('output')
					.removeClass('input')
					.setMaxLink(-1);
			}
			return this;
		},
				
		setData: function(name, value){
			var me = this
				, data = me.data(name);
			
			if(data && data != value || data == undefined){
				me.data(name, value);
				me.fire('data-change', {name: name, value: value});
			}
			return me;
		},		
		
		getData: function(name, dflt){
			return this.data(name) || dflt;
		},
		
		setMaxLink: function(max){
			this.mMaxLink = max;
			return this;
		},
		
		getMaxLink: function(){
			return this.mMaxLink;
		},
		
		getTooltip: function(){
			return this.getData('tooltip');
		},
		
		export: function(graph){
			//console.warn('exSVG.Pin.export()', graph);
			var me = this
				, attrs = me.attr()
				, pin;
			
			if(me.getType() == exSVG.Pin.PIN_IN){
				pin = (graph && graph.Input) ? graph.Input() : false;
				if(!pin){
					pin = new exGRAPH.Input();
					if(graph)
						graph.add(pin);
				}
			}
			else{
				pin = (graph && graph.Output) ? graph.Output() : false;
				if(!pin){
					pin = new exGRAPH.Output();
					if(graph)
						graph.add(pin);
				}
			}
			
			for (var key in attrs) {
				if(!Object.prototype.hasOwnProperty.call(attrs, key) || key.substr(0,5) != 'data-')
					continue;
				pin.attr(key.substr(5), attrs[key]);
			}
			me.fire('export', {parent: pin});
			return pin;
		},

		destroy: function(){
			return;
			this.fire('destroy');
			this.getNode().off('.pin-' + this.getId());
			this.off();
			this.remove();
			delete this;
		}
	}
});

define(exSVG.Pin, 'PIN_UNKNOWN', 0);
define(exSVG.Pin, 'PIN_IN', 1);
define(exSVG.Pin, 'PIN_OUT', 2);
define(exSVG.Pin, 'PIN_INOUT', 3);

define(exSVG.Pin, 'PIN_LINK_ACCEPT_SAME_NODE', 1);
define(exSVG.Pin, 'PIN_LINK_ACCEPT_SAME_DIRECTION', 2);
define(exSVG.Pin, 'PIN_LINK_ACCEPT_DATATYPE', 4);
define(exSVG.Pin, 'PIN_LINK_ACCEPT_DATATYPE_ARRAY', 8);


exSVG.PinGroup = SVG.invent({
    create: 'g', 
    inherit: SVG.G,
	
    extend: {
		init: function(data){},
		
		draw: function(){
			var me = this
			, offset = 0;
			
			// place visibles input pins
			me.select('.exPin').each(function(){
				if(!this.visible())
					return;
				this.move(0, offset);
				offset += this.bbox().height+6;
			});

			
			// place hidden input pins
			me.select('.exPin').each(function(){
				if(this.visible())
					return;
				this.move(0, offset);
				offset += this.bbox().height+6;
			});
			
		}
	}
});


SVG.extend(exSVG.Node, {
	
	importPin: function(data){
		//console.log('exSVG.Node.importPin()', data);
		var me = this;
		
		this.createPinsGroups();
		
		if(data.type.toLowerCase() == 'input')
			return me.createPin(data, me.mInputPinGroup);
			
		else if(data.type.toLowerCase() == 'output')
			return me.createPin(data, me.mOutputPinGroup);
		
		assert(false);
		
	},
	
	importInput: function(data){
		//console.log('exSVG.Node.importInput()', data);
		var me = this;

		this.createPinsGroups();
		return me.createPin(data, me.mInputPinGroup);
	},
	
	importOutput: function(data){
		//console.log('exSVG.Node.importOutput()', data);
		var me = this;

		this.createPinsGroups();
		return me.createPin(data, me.mOutputPinGroup);
	},
	
	createPinsGroups: function(){
		var me = this;
		
		if(!me.mInputPinGroup)
			me.mInputPinGroup = new exSVG.PinGroup().addTo(me).attr('type', 'inputs').addClass('exInputs');
		if(!me.mOutputPinGroup)
			me.mOutputPinGroup = new exSVG.PinGroup().addTo(me).attr('type', 'outputs').addClass('exOutputs');
		
	},
	
	createPin: function(data, parent){
		//console.log('exSVG.Node.createPin()', data);
		var me = this
			, type = exLIB.getDataType2(data.Type())
			, pin = new exSVG[(data.Ctor && data.Ctor()) ? data.Ctor() : type.Ctor()]();
		
		assert(pin instanceof exSVG.Pin);
		assert(parent);
		
		parent.put(pin);
		pin.setColor(type.Color());
		pin.init(data);
		me.fire('pin-add', {pin: pin});
		return pin;	
	},
	
	getPin: function(id){
		if(id)
			return this.select('.exPin.output[data-id="' + id + '"], .exPin.input[data-id="' + id + '"]').first();
		return this.select('.exPin.output,.exPin.input');
	},

	getPins: function(filters){
		var me = this
			, pins
			, type
			, out
		
		filters = filters || {};
		
		if(filters.input){
			pins = me.select('.exPin.input');
		} else if(filters.output) {
			pins = me.select('.exPin.output');
		} else {
			pins = me.select('.exPin');
		}
		out = me.doc().set();
		//var out = [];
		pins.each(function(){
			type = (filters.input) ? filters.input.type : (filters.output && filters.output.type) ? filters.output.type : {};

			if(!this.getId)
				return;
			if(filters.input && filters.input.name && (this.getId() == filters.input.name || filters.input.name == '*'))
				out.add(this);
			else if(filters.output && filters.output.name && (this.getId() == filters.output.name || filters.output.name == '*'))
				out.add(this);
			else if(type && (type == '*' || exLIB.isDataTypeCompatible(this.getDataType(), type)))
				out.add(this);
			else if(filters.name && (this.getId() == filters.name || filters.name == '*'))
				out.add(this);
			//	console.log('zzzzz')
		});
		//console.log(out);
		return out;
	}
});

}).call(this);