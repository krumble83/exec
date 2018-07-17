;(function() {
"use strict";

var clipboardData = document.querySelector('#exClipboardData')
, mousePosEvent;
 
if(!clipboardData){
	clipboardData = document.createElement('textarea');
	clipboardData.setAttribute('id', 'exClipboardData');
}
document.body.appendChild(clipboardData);

exSVG.plugin(exSVG.Worksheet, {
	
	init: function(){
		var me = this;
		me.initClipboardEventHandlers();
		return me;
	},
	
	initClipboardEventHandlers: function(){
		var me = this;
		
		me.doc().on('node-add.clipboard', function(e){
			var node = e.detail.node;
			
			node.on('before-menu.clipboard', function(e){
				var menu = e.detail.menu
				, copy
				, cut
				,paste
				
				
				menu.sep();
				cut = menu.addItem('Cut', 'cut', function(){
					me.cut(this);
				});
				
				copy = menu.addItem('Copy', 'copy', function(){
					me.copy(this);
				});

			});
		});
		
		me.doc().on('mousemove.clipboard', function(e){
			mousePosEvent = e;
		});
		
		me.doc().on('keyup.clipboard', function(e){
			if(e.keyCode == 86 && e.ctrlKey){ //Ctrl+V
				me.paste(mousePosEvent);
			}
		});
	},

	cut: function(data){
		var me = this
		, expt = new exGRAPH.Graph();
		
		console.assert(data instanceof SVG.Set)
		me.startSequence();
		data.each(function(){
			expt.add(this.export());
			//this.remove();
		});
		me.stopSequence();
		clipboardData.value = expt.node.outerHTML;
		data.each(function(){
			this.remove();
		});
		return me;
	},
	
	copy: function(data){
		var me = this
		, expt = new exGRAPH.Graph();
		
		console.assert(data instanceof SVG.Set)
		data.each(function(){
			expt.add(this.export());
		});
		clipboardData.value = expt.node.outerHTML;
		return me;		
	},
	
	paste: function(e){
		console.log('Clipboard.paste()', e);
		var me = this
		, data = clipboardData.value;
		
		if(!data || data == '')
			return;
		
		var graph = new exGRAPH.Graph();
		graph.node.innerHTML = data;
				
		me.doc().fire('before-paste', {data: graph});

		me.startSequence();
		me.import(graph);
		me.stopSequence();
		return me;
	}
})

//exSVG.Worksheet.prototype.plugins.clipboard = {name: 'Clipboard', initor: 'initClipboard'};

}());
