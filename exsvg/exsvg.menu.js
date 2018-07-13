;(function() {
"use strict";

SVG.extend(exSVG.Worksheet, {
	
	initMenu: function(){
		var me = this
		, menuEl = document.querySelector('#exMenu');
		
		if(menuEl && menuEl.instance)
			me.mMenuRoot = menuEl.instance;
		else if(menuEl) {
			me.mMenuRoot = new MenuObject(menu);
			me.mMenuRoot.initEventHandlers();
		}
		else
			me.mMenuRoot = new MenuObject;

		me.doc().on('node-add.menu', function(e){
			var node = e.detail.node;
			
			//bind event listener on each new created pin
			node.on('pin-add.menu', function(e){
				var pin = e.detail.pin;
				
				pin.on('contextmenu.menu', function(e){
					me.showPinContextMenu(this, e);
				});
			});
			
			// bind event on all already created pins
			node.select('.exPin').each(function(){
				this.on('contextmenu.menu', function(e){
					var pin = e.detail.pin;
					
					me.showPinContextMenu(this, e);
				});
			});
			
			// bind event for node context menu
			node.on('contextmenu.node', function(ev){
				me.showNodeContextMenu(this, ev);
				ev.preventDefault();
				ev.stopPropagation();
				ev.stopImmediatePropagation();
			});
			
			node.on('move-start.menu', function(){
				me.mMenuRoot.close();
			});
		});
		
		me.doc().on('link-start.menu', function(){
			me.mMenuRoot.close();
		});
				
		return me;
	},

	showNodeContextMenu: function(node, e){
		var me = this
		, menuObject = {
			getMenu: function(id){}
		};

		me.mMenuRoot.clear()
			.addTitleItem('Node Actions');
		
		var ren = me.mMenuRoot.addItem('Rename', 'rename', function(){
				//this.remove();
			})
			.setMeta('Rename selected node', 'F2');
		if(node.hasFlag(READ_ONLY))
			ren.enabled(false);

		var del = me.mMenuRoot.addItem('Delete', 'delete', function(){
				this.remove();
			})
			.setMeta('Delete selected node', 'Delete');
		if(node.hasFlag(READ_ONLY))
			del.enabled(false);
		
		var dup = me.mMenuRoot.addItem('Duplicate', 'duplicate', function(){
				console.warn('TODO : Duplicate node');
			})
			.setMeta('Duplicate selected node', 'Ctrl+W');
		
		var breaq = me.mMenuRoot.addItem('Break Link(s)', 'breaklinks', function(){
				console.warn('TODO : Break all links');
			})
			.setMeta('Remove all link to this node');

		node.fire('before-menu', {menu: me.mMenuRoot});
		if(me.doc().event().isPrevented)
			return;
		
		me.mMenuRoot.node = node;
		var pt = {x: e.pageX, y: e.pageY};
		me.mMenuRoot.showAt(pt, node);
		node.fire('menu', {menu: me.mMenuRoot});
		
		return me.mMenuRoot;
	},
	

	showPinContextMenu: function(pin, e){		
		var me = this;
		e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();
		
		me.hideTooltip();
		
		me.mMenuRoot.clear()
			.addTitleItem('Pin Actions');
		
		var breaq;
		var links = pin.getLinks();
		
		if(links.length() == 0){
			breaq = me.mMenuRoot.addItem('Break Link(s)', 'breaklink')
				.setMeta('Remove link(s) to this pin')
				.enabled(false);
		}
		else if(links.length() == 1){
			var p = links.last().getOtherPin(pin);
			console.assert(p instanceof exSVG.Pin, 'instanceof "exSVG.Pin expected" but "' + p.constructor.name + '" found');
			me.mMenuRoot.addItem('Break Link to `' + p.getNode().getData('title') + '`', 'breaklink', function(){
					links.last().remove();
				})
				.setMeta('Remove link to this pin');
			/*
			me.mMenuRoot.addItem('Jump to `' + p.getNode().getData('title') + '`', 'jumpto', function(){
					console.warn('TODO : Jump to node');
				})
				.setMeta('Jump to node `' + p.getNode().getData('title') + '`');
			*/
		}
		else{
			breaq = me.mMenuRoot.addItem('Break all Links', 'breaklinks', function(){
					me.startSequence();
					links.each(function(){
						this.remove();
					});
					me.stopSequence();
				})
				.setMeta('Remove links to this pin');
			var breaks = me.mMenuRoot.addSubMenu('Break Link to... ');
			//var jumps = me.mMenuRoot.addSubMenu('Jump to... ');

			links.each(function(){
				var link = this
				, p = link.getOtherPin(pin);
				
				console.assert(p instanceof exSVG.Pin, 'instanceof "exSVG.Pin expected" but "' + p.constructor.name + '" found');
				breaks.addItem('Break Link to `' + p.getNode().getData('title') + '`', 'breaklinks', function(){
						link.remove();
					})
					.setMeta('Remove link to this pin');
			});
		}
			

		pin.fire('before-menu', {menu: me.mMenuRoot});
		me.doc().fire('before-pin-menu', {menu: me.mMenuRoot, pin: pin});
		if(me.doc().event().isPrevented)
			return;
		
		me.mMenuRoot.pin = pin;
		var pt = {x: e.pageX, y: e.pageY};
		me.mMenuRoot.showAt(pt, pin);
		pin.fire('menu', {menu: me.mMenuRoot});
		me.doc().fire('pin-menu', {menu: me.mMenuRoot, pin: pin});
		
		return me.mMenuRoot;
	}
})

exSVG.Worksheet.prototype.plugins.menu = {name: 'Context Menu', initor: 'initMenu'}

}());
