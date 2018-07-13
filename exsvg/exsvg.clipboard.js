;(function() {
"use strict";

var clipboardData = document.querySelector('#exClipboardData')
, mousePosEvent;
 
if(!clipboardData){
	clipboardData = document.createElement('textarea');
	clipboardData.setAttribute('id', 'exClipboardData');
}
document.body.appendChild(clipboardData);

SVG.extend(SVG.Doc, SVG.Nested, {
	
	initClipboard: function(){
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
		, out = [];
		
		if(data instanceof exSVG.Node){
			clipboardData.value = JSON.stringify(data.export());
			data.remove();	
		}
		else if(data instanceof SVG.Set){
			me.startSequence();
			data.each(function(){
				out.push(this.export());
				this.remove();
			});
			me.stopSequence();
			clipboardData.value = JSON.stringify(out);
		}
		else if(typeof data === 'object')
			clipboardData.value = JSON.stringify(data);
	},
	
	copy: function(data){
		var me = this
		, out = [];
		
		if(data instanceof exSVG.Node){
			clipboardData.value = JSON.stringify(data.export());
		}
		else if(data instanceof SVG.Set){
			data.each(function(){
				out.push(this.export());
			});
			clipboardData.value = JSON.stringify(out);
			console.log(out);
		}
		else if(typeof data === 'object')
			clipboardData.value = JSON.stringify(data);
		
	},
	
	paste: function(e){
		console.log('Clipboard.paste()', e);
		var me = this
		, data;
		
		if(!clipboardData.value || clipboardData.value == '')
			return;
		data =  JSON.parse(clipboardData.value)
		me.doc().fire('before-paste', {data: data});
		
		if(Array.isArray(data)){
			console.log('array');
			me.startSequence();
			var group = new SVG.Set();

			var pt = me.doc().point(e);
			//group.translate(pt.x, pt.y);
			//console.dir(group);

			for(var i=0; i < data.length; i++){
				if(data[i].ctorMethod && me[data[i].ctorMethod]){
					var el = me[data[i].ctorMethod].call(me, data[i]);
					group.add(el);
				}
			}
			console.log(group.bbox());
			group.move(pt.x, pt.y);
			me.stopSequence();
			me.doc().fire('paste', {data: group});
		}
	}
})

exSVG.Worksheet.prototype.plugins.clipboard = {name: 'Clipboard', initor: 'initClipboard'};

}());
