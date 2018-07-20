;(function() {
"use strict";

exSVG.Node = SVG.invent({
    create: 'g', 
    inherit: SVG.G,
    extend: {
        init: function(data){
			//console.group('Node.init()');
			var me = this;
			
			me.parent(exSVG.Worksheet).on('export', function(e){
				if(!me.parent())
					return;
				me.export(e.detail.parent);
			});

			me.addClass('exNode');
			for (var i = 0, atts = data.attr(), n = atts.length; i < n; i++){
				if(['import', 'keywords', 'svgid'].indexOf(atts[i].nodeName) > -1)
					continue;
				me.setData(atts[i].nodeName, atts[i].value);
			}						

			data.select(':scope > *').each(function(){
				if(me['import' + this.type.capitalize()])
					me['import' + this.type.capitalize()](this, me);
			});
			
			exSVG.execPlugins(this, arguments, exSVG.Node);
			
            return me;
        },
		
		hasFlag: function(flag){
			var me = this
			, flags = me.getData('flags');
			
			if(!flags)
				return false;
			return flags & flag > 0;
		},
							
		export: function(graph){
			var me = this
			, node = (graph && graph.Node) ? graph.Node() :  false
			, attrs = me.attr()
			, pos

			if(!node){
				node = new exGRAPH.Node();
				if(graph)
					graph.add(node);
			}
			node.attr('svgid', me.id());
			
			for (var key in attrs) {
				if(!Object.prototype.hasOwnProperty.call(attrs, key) 
					|| key.substr(0,5) != 'data-')
					continue;
				node.attr(key.substr(5), attrs[key]);
				//node.attr('pos', '');
			}
			if(graph && graph.box)
				pos = {x: me.x()-graph.box.x, y:me.y()-graph.box.y}
			else
				pos = {x: me.x(), y: me.y()};

			node.attr('pos', pos.x + ',' + pos.y);
			me.fire('export', {parent: node});
			return node;
		},
				
		move: function(){
			console.log('exnodebase.move');
			var me = this
			, ret = SVG.G.prototype.move.apply(me, arguments);
			
			me.fire('move');
			me.doc().fire('node-move', {node:me});
			return ret;
		},
		
		dmove: function(){
			//console.log('exnodebase.dmove');
			var me = this
			, ret = SVG.G.prototype.dmove.apply(me, arguments);
			
			me.fire('move');
			me.doc().fire('node-move', {node:me});
			return ret;
		},
		
		x: function(){
			//console.log('exSVG.Node.x()');
			var me = this
			, ret = SVG.G.prototype.x.apply(me, arguments);
			
			if(arguments.length > 0){
				//console.log('zz');
				me.fire('move');
				me.doc().fire('node-move', {node:me});
			}
			return ret;			
		},
		
		y: function(){
			//console.log('exnodebase.y');
			var me = this
			, ret = SVG.G.prototype.y.apply(me, arguments);
			
			if(arguments.length > 0){
				me.fire('move');
				me.doc().fire('node-move', {node:me});
			}
			return ret;
		},

		remove: function(throwEvents){
			//console.group('Node.remove()');
			var me = this
			, parent
			, ret
			
			if(me.hasFlag(READ_ONLY))
				return false;
			
			parent = me.doc();
			me.fire('before-remove');
			ret = SVG.G.prototype.remove.apply(me, arguments);
			me.fire('remove');
			parent.fire('node-remove', {node: me});
			//console.groupEnd();
			return ret;
		},
		
		addTo: function(parent, throwEvents){
			//console.group('Node.addTo()');
			var me = this
			, ret = SVG.G.prototype.addTo.call(me, parent);
			
			me.fire('add');
			me.doc().fire('node-add', {node: me});
			//console.groupEnd();
			return ret;
		},

		
		setData: function(name, value){
			var me = this
			, data = me.data(name);
			
			if(data && data != value || data == undefined){
				me.data(name, value);
				//me.mData[name] = value;
				me.fire('data-change', {name: name, value: value});
			}
			return me;
		},

		getData: function(name, dflt){
			return this.data(name) || dflt;
		},
		
		destroy: function(){
			this.fire('destroy');
			this.off();
			this.remove();
		}
    }
});

//define(exSVG.Node, 'NOT_DELETABLE', 1);

define(window, 'READ_ONLY', 1);


SVG.extend(exSVG.Worksheet, {
	
	getNodes: function(parent){
		return (parent || this).select('.exNode');
	},
	
	importNode: function(data, parent){
		//console.log('exSVG.Worksheet.importNode()', data, data.Ctor());
		var node = new exSVG[data.Ctor()]
		, pos = data.attr('pos') ? data.attr('pos').split(',') : false;
		
		parent.put(node);
		data.attr('pos', null);
		node.init(data);
		node.addTo(parent);
		if(pos){
			pos = {x: Number.parseInt(pos[0]), y: Number.parseInt(pos[1])};
			if(parent.snapToGrid && parent.getGrid)
				pos = parent.snapToGrid(pos);
			node.x(pos.x);
			node.y(pos.y);
		}
		//if(data.attr('svgid'))
		//	data.attr('svgid', node.id());
		//data.svg = node;
		return node;
	},
	
	importMacro: function(){
		return exSVG.Worksheet.prototype.importNode.apply(this, arguments);
	}
});

}).call(this);