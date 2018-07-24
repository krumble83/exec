;(function() {
"use strict";

var menuRoot;

exSVG.plugin(exSVG.Worksheet, {
	
	init: function(){
		var me = this
			, menuEl = document.querySelector('#exMenu');
		
		if(menuEl && menuEl.instance)
			menuRoot = menuEl.instance;
		else if(menuEl) {
			menuRoot = new MenuObject(menu);
			menuRoot.initEventHandlers();
		}
		else
			menuRoot = new MenuObject;

		me.doc().on('link-start.menu', menuRoot.close, menuRoot);				
		return me;
	}
});


exSVG.plugin(exSVG.Link, {
	init: function(){
		var me = this;

		me.on('contextmenu', function(e){
			me.showLinkContextMenu(me, e);
		}, me, {capture: true});
	},
	
	showLinkContextMenu: function(link, e){
		var me = this
			, worksheet = me.parent(exSVG.Worksheet)
			, el
			, pt;

		e.preventDefault();
		e.stopPropagation();
		//ev.stopImmediatePropagation();
		
		menuRoot.clear()
		.addTitleItem('Link Actions');
		
		menuRoot.addItem('Add Reroute Node', 'reroute', function(){
			me.addRerouteNode.call(me, e);
		});
			
		el = menuRoot.addItem('Delete Link', 'delete', function(){
			this.remove();
		});
		if(me.hasFlag(F_NODELETE))
			el.enabled(false);

		link.fire('before-menu', {menu: menuRoot});
		if(me.doc().event().isPrevented)
			return;
		
		//menuRoot.node = node;
		pt = {x: e.pageX, y: e.pageY};
		menuRoot.showAt(pt, link);
		link.fire('menu', {menu: menuRoot});
		
		return menuRoot;
	}
});


exSVG.plugin(exSVG.Pin, {
	init: function(){
		var me = this;

		me.on('contextmenu', function(e){
			me.showPinContextMenu(this, e);			
		});
	},
	
	showPinContextMenu: function(pin, e){		
		var me = this
			, worksheet = me.parent(exSVG.Worksheet)
			, links = pin.getLinks()
			, breaq;
		
		e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();
		
		worksheet.hideTooltip();
		
		menuRoot.clear()
			.addTitleItem('Pin Actions');

		if(links.length() == 0){
			breaq = menuRoot.addItem('Break Link(s)', 'breaklink')
				.setMeta('Remove link(s) to this pin')
				.enabled(false);
		}
		else if(links.length() == 1){
			var p = links.last().getOtherPin(pin);
			assert(p instanceof exSVG.Pin, 'instanceof "exSVG.Pin expected" but "' + p.constructor.name + '" found');
			menuRoot.addItem('Break Link to `' + p.getNode().getData('title') + '`', 'breaklink', function(){
					links.last().remove();
				})
				.setMeta('Remove link to this pin');
		}
		else{
			breaq = menuRoot.addItem('Break all Links', 'breaklinks', function(){
					worksheet.startSequence();
					links.each(function(){
						this.remove();
					});
					worksheet.stopSequence();
				})
				.setMeta('Remove links to this pin');
			var breaks = menuRoot.addSubMenu('Break Link to... ');

			links.each(function(){
				var link = this
					, p = link.getOtherPin(pin);
				
				assert(p instanceof exSVG.Pin, 'instanceof "exSVG.Pin expected" but "' + p.constructor.name + '" found');
				breaks.addItem('Break Link to `' + p.getNode().getData('title') + '`', 'breaklinks', function(){
						link.remove();
					})
					.setMeta('Remove link to this pin');
			});
		}
			

		pin.fire('before-menu', {menu: menuRoot});
		me.doc().fire('before-pin-menu', {menu: menuRoot, pin: pin});
		if(me.doc().event().isPrevented)
			return;
		
		menuRoot.pin = pin;
		var pt = {x: e.pageX, y: e.pageY};
		menuRoot.showAt(pt, pin);
		pin.fire('menu', {menu: menuRoot});
		me.doc().fire('pin-menu', {menu: menuRoot, pin: pin});	
		return menuRoot;
	}
});


exSVG.plugin(exSVG.Node, {
	init: function(){
		var me = this;

		me.on('contextmenu.nodez', function(ev){
			me.showNodeContextMenu(this, ev);
		}, me);
		
		me.on('move-start.menu', menuRoot.close, menuRoot);
	},

	showNodeContextMenu: function(node, e){
		var me = this
			, worksheet = me.parent(exSVG.Worksheet)
			, el
			, point = {x: e.pageX || 0, y: e.pageY || 0};

		e.preventDefault();
		e.stopPropagation();

		menuRoot.clear()
		.addTitleItem('Node Actions');
		
		el = menuRoot.addItem('Delete', 'delete', function(){
				this.remove();
			})
			.setMeta('Delete selected node', 'del');
		if(node.hasFlag(F_NODELETE))
			el.enabled(false);
		
		el = menuRoot.addItem('Duplicate', 'duplicate', function(){
				console.warn('TODO : Duplicate node');
			})
			.setMeta('Duplicate selected node', 'Ctrl+W');
		if(node.hasFlag(F_UNIQUE))
			el.enabled(false);
		
		menuRoot.sep();
		
		menuRoot.addItem('Break Link(s)', 'breaklinks', function(){
				worksheet.startSequence();
				this.getLinks().each(function(){
					this.remove();
				});
				worksheet.stopSequence();
			})
			.setMeta('Remove all link to this node');

		if(worksheet.selectNode){
			menuRoot.addItem('Select All linked nodes', 'selectlinked', function(){
					var links = this.getLinks();
					links.each(function(){
						worksheet.selectNode(this.getInputPin().getNode());
						worksheet.selectNode(this.getOutputPin().getNode());
					});
				});
		}

		node.fire('before-menu', {menu: menuRoot});
		if(me.doc().event().isPrevented)
			return;
		
		menuRoot.node = node;
		menuRoot.showAt(point, node);
		node.fire('menu', {menu: menuRoot});
		
		return menuRoot;
	}
});

}());
