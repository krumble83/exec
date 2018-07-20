;(function() {
"use strict";

var mousePosEvent;

exSVG.plugin(exSVG.Worksheet, {
	
	init: function(){
		var me = this;

		me.on('mousemove.clipboard', function(e){
			mousePosEvent = e;
		});
		
		SVG.on(window, 'paste.clipboard', me.paste, me);
		SVG.on(window, 'copy.clipboard', me.copy, me);
		SVG.on(window, 'cut.clipboard', me.cut, me);
		
		return me;
	},
	
	cut: function(data){
		//console.log('Clipboard.cut()', data);
		var me = this;
		
		if(data instanceof ClipboardEvent){
			if(!me.hasFocus() || !me.getSelection)
				return me;
			data.stopPropagation();
			data.preventDefault();		
			return me.cut(me.getSelection());
		}
		
		assert(data.each);
		me.copy(data);
		me.startSequence();
		data.each(function(){
			if(this.hasFlag && (this.hasFlag(F_NOCUT) || this.hasFlag(F_NODELETE)))
				return;
			this.remove();
		});
		me.stopSequence();
		return me;
	},
	
	copy: function(data){
		//console.log('Clipboard.copy()', data);
		var me = this
		, expt
		, clipboardData;
		
		if(data instanceof ClipboardEvent){
			if(!me.hasFocus() || !me.getSelection)
				return me;
			data.stopPropagation();
			data.preventDefault();		
			//console.log('data copied to clipboard');
			return me.copy(me.getSelection());
		}
		expt = new exGRAPH.Graph();
		expt.box = data.bbox();
		
		data.select(':scope > *').each(function(){
			if(this.hasFlag && this.hasFlag(F_NOCOPY))
				return;
			if(this.export)
				this.export(expt);
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
		var me = this
		, ev = me.point(mousePosEvent)
		, pos
		, graph
		, set;

		if(data instanceof ClipboardEvent){
			if(!me.hasFocus())
				return me;
			data.stopPropagation();
			data.preventDefault();		
			var clipboardData = data.clipboardData || window.clipboardData;
			//console.log('data pasted from clipboard');
			return me.paste(clipboardData.getData('Text'));
		}
		else if(typeof data === 'string'){		
			graph = me.strToGraph(data);
			if(!graph)
				return;
			
			graph.select(':scope > *').each(function(){			
				if(this.attr('pos')){
					if(!this.attr('pos'))
						return;
					pos = this.attr('pos').split(',');
					pos[0] = parseInt(pos[0]) + ev.x;
					pos[1] = parseInt(pos[1]) + ev.y;
					this.attr('pos',  pos[0] + ',' + pos[1]);
				}
			});
							
			me.doc().fire('before-paste', {data: graph});

			me.startSequence();
			set = me.import(graph);
			me.stopSequence();
			me.doc().fire('paste', {data: set});
		}
		return me;
	}
});



exSVG.plugin(exSVG.Node, {
	
	init: function(){
		var me = this
		, worksheet = me.parent(exSVG.Worksheet)
		, el
		
		me.on('before-menu.clipboard', function(e){
			var menu = e.detail.menu;
			
			menu.sep();
			el = menu.addItem('Cut', 'cut', function(){
				me.cut(this);
			})
				.setMeta('Cut to clipboard', 'Ctrl+X');
			if(me.hasFlag(F_NOCUT) || me.hasFlag(F_NODELETE))
				el.enabled(false);
			
			el = menu.addItem('Copy', 'copy', function(){
				me.copy(this);
			})
				.setMeta('Copy to clipboard', 'Ctrl+C');
			if(me.hasFlag(F_NOCOPY))
				el.enabled(false);			
		});				
	}
});
	
}());
