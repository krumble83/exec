;(function() {
"use strict";

exSVG.Pin = SVG.invent({
    create: 'g', 
    inherit: SVG.G,
	
    extend: {
		init: function(data){
			var me = this;

			this.getNode().on('export', function(e){
				me.export(e.detail.parent);
			});

			this.getNode().on('destroy', function(e){
				me.destroy();
			});
			
			if(data instanceof exGRAPH.Pin)
				return this.import(data);

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
		
		getNode: function(){
			return this.parent(exSVG.Node);
		},
		
		getId: function(){
			return this.getData('id');
		},

		setId: function(id){
			this.id(this.getNode().id() + '-' + id);
			this.setData('id', id);
		},
		
		setDataType: function(datatypeid){
			var me = this
			, libdatatype = exLIB.getDataType2(datatypeid);
			
			me.setData('type', datatypeid);
		},
		
		getDataType: function(){
			return this.getData('type');
		},
		
		isArrayDataType: function(){
			return exLIB.isArrayDataType(this.getDataType());
		},
				
		getType: function(){
			var me = this;
			if(me.hasClass('input'))
				return exSVG.Pin.PIN_IN;
			if(me.hasClass('output'))
				return exSVG.Pin.PIN_OUT;
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
			var me = this
			, ret = {}
			, attrs = me.attr()
			, pin;
			
			if(me.getType() == exSVG.Pin.PIN_IN)
				pin = (graph && graph.Input) ? graph.Input() : new exGRAPH.Input();
			else
				pin = (graph && graph.Output) ? graph.Output() : new exGRAPH.Output();
			
			for (var key in attrs) {
				if(!Object.prototype.hasOwnProperty.call(attrs, key) || key.substr(0,5) != 'data-')
					continue;
				pin.attr(key.substr(5), attrs[key]);
			}
			me.fire('export', {parent: pin});
			return pin;
		},

		destroy: function(){
			this.fire('destroy');
			this.off();
			this.remove();
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


SVG.extend(exSVG.Node, {
	importInput: function(data){
		var me = this;
		
		if(!me.mInputPinGroup)
			me.mInputPinGroup = me.group();
		if(!me.mOutputPinGroup)
			me.mOutputPinGroup = me.group();

		return me.createPin(data, me.mInputPinGroup);
	},
	
	importOutput: function(data){
		var me = this;
		
		if(!me.mInputPinGroup)
			me.mInputPinGroup = me.group();
		if(!me.mOutputPinGroup)
			me.mOutputPinGroup = me.group();
		
		return me.createPin(data, me.mOutputPinGroup);
	},
	
	createPin: function(data, parent){
		var me = this
		, type = exLIB.getDataType2(data.Type())
		, pin = new exSVG[type.Ctor()];
			
		parent.put(pin);
		pin.setColor(type.Color());
		pin.init(data);
		me.fire('pin-add', {pin: pin});
		data.svg = pin;
		return pin;	
	},
	
	addPin: function(data){
		if(data.type == 'INPUT')
			return this.importInput(data);
		else if(data.type == 'OUTPUT')
			return this.importOutput(data);
	},
        
	getPin: function(id){
		return this.select('.exPin.output[data-id="' + id + '"], .exPin.input[data-id="' + id + '"]').first();
	},

	getPins: function(filters){
		var me = this
		, pins
		, type
		, out
		
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