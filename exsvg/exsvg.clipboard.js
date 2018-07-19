;(function() {
"use strict";

var mousePosEvent;

exSVG.plugin(exSVG.Worksheet, {
	
	init: function(){
		var me = this;

		me.on('mousemove.clipboard', function(e){
			mousePosEvent = e;
		});
		
		SVG.on(window, 'paste', me.paste, me);
		SVG.on(window, 'copy', me.copy, me);
		SVG.on(window, 'cut', me.copy, me);
		
		return me;
	},
	
	cut: function(data){
		//console.log('Clipboard.cut()', data);
		var me = this
		, expt = new exGRAPH.Graph()
		, clipboardData;
		

		if(data instanceof ClipboardEvent){
			if(!me.hasFocus() || !me.getSelection)
				return me;
			data.stopPropagation();
			data.preventDefault();		
			console.log('data cutted to clipboard');
			return me.cut(me.getSelection());
		}
		
		console.assert(data instanceof SVG.Set);
		me.startSequence();
		data.each(function(){
			expt.add(this.export());
			this.remove();
		});
		me.stopSequence();
		
		clipboardData = document.createElement('textarea');
		document.body.appendChild(clipboardData);
		clipboardData.value = expt.node.outerHTML;
		clipboardData.select();
		document.execCommand('copy');
		document.body.removeChild(clipboardData);
		me.focus();
		return me;
	},
	
	copy: function(data){
		//console.log('Clipboard.copy()', data);
		var me = this
		, expt = new exGRAPH.Graph()
		, clipboardData;
		
		if(data instanceof ClipboardEvent){
			if(!me.hasFocus() || !me.getSelection)
				return me;
			data.stopPropagation();
			data.preventDefault();		
			console.log('data copied to clipboard');
			return me.copy(me.getSelection());
		}
		
		console.assert(data instanceof SVG.Set);
		data.each(function(){
			expt.add(this.export());
		});
		
		clipboardData = document.createElement('textarea');
		document.body.appendChild(clipboardData);
		clipboardData.value = expt.node.outerHTML;
		clipboardData.select();
		document.execCommand('copy');
		document.body.removeChild(clipboardData);
		me.focus();
		return me;
	},
	
	paste: function(data){
		//console.log('Clipboard.paste()', data);
		var me = this;

		if(data instanceof ClipboardEvent){
			if(!me.hasFocus())
				return me;
			data.stopPropagation();
			data.preventDefault();		
			var clipboardData = data.clipboardData || window.clipboardData;
			console.log('data pasted from clipboard');
			return me.paste(clipboardData.getData('Text'));
		}
		
		var graph = new exGRAPH.Graph();
		graph.node.innerHTML = data;
				
		me.doc().fire('before-paste', {data: graph});

		me.startSequence();
		me.import(graph);
		me.stopSequence();
		return me;
	}
});



exSVG.plugin(exSVG.Node, {
	
	init: function(){
		var me = this
		, worksheet = me.parent(exSVG.Worksheet);
		
		me.on('before-menu.clipboard', function(e){
			var menu = e.detail.menu;
			
			menu.sep();
			menu.addItem('Cut', 'cut', function(){
				me.cut(this);
			});
			
			menu.addItem('Copy', 'copy', function(){
				me.copy(this);
			});

		});				
	}
});
	
}());
