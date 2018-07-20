;(function() {
"use strict";


var pluginsList = [
	'exsvg/exsvg.workspace.js'
	, 'exsvg/exsvg.selection.js'
	, 'exsvg/exsvg.grid.js'
	, 'exsvg/exsvg.undo.js'
	, 'exsvg/exsvg.clipboard.js'
	, 'exsvg/exsvg.menu.js'
	, 'exsvg/exsvg.librarymenu.js'
	];


exSVG.Worksheet = SVG.invent({
    create: 'svg', 
    inherit: SVG.Nested ,
    extend: {
        init: function(data){
			//console.group('worksheet.init()');
			var me = this;
						
			me.doc()
				.addClass('worksheet');
			
			me.createTooltip()
				.createHeader()
				.size('100%', '100%');
	
			//PinArray pattern
			me.pattern(10, 10, function(add) {
				add.rect(3,3).move(2,2);
			}).id('pinArrayPattern').attr('patternUnits', 'userSpaceOnUse');
			
			me.initWorksheetEventHandlers();
					
			me.doc().rect('100%', '100%')
				.addClass('focusrect');
			
			me.on('blur', function(){
				 me.doc().addClass('blur');
			})
			.on('focus', function(){
				 me.doc().removeClass('blur');
			});
			
			return me;
        },
		
		doLayout: function(){
			//console.log(this.mTitle.bbox().width, this.doc().parent().clientWidth);
			this.mTitleGroup.select('text').x((this.doc().parent().clientWidth/2)-this.mTitle.bbox().width);
			return this;
		},
		
		focus: function(){
			this.node.focus();
			return this;
		},
		
		hasFocus: function(){
			return document.activeElement && document.activeElement.instance && document.activeElement.instance === this;
		},
		
		initWorksheetEventHandlers: function(){
			//console.log('worksheet.initEventHandlers()');
			var me = this;

			me.doc().on('node-add.worksheet-dragnode', function(e){
				//console.log('worksheet:nodeadd.worksheet-drag');
				var dragPoint = null
				, node = e.detail.node;

				if(!node.draggable)
					return;
				node.draggable(me.snapToGrid);
				
				node.on('dragstart.worksheet-dragnode', function(e){
					//console.log('node.dragstart', e);
					this.fire('startmove', e);
					dragPoint = e.detail.p;
				})
				node.on('dragend.worksheet-dragnode', function(e){
					//console.log('node.dragend', e);
					var m = {x: e.detail.p.x - dragPoint.x, y: e.detail.p.y - dragPoint.y};
					if(me.snapToGrid)
						m = me.snapToGrid(e.detail.p.x - dragPoint.x, e.detail.p.y - dragPoint.y);
					e.detail.event.stopImmediatePropagation();
					e.detail.event.stopPropagation();
					me.doc().fire('node-moved', {node: this, movement: m});
					this.fire('moved', {event: e});
					dragPoint = null;
				});
			});

			me.doc().on('before-pin-menu', function(e){
				var menu
				, pin
				, links
				, jumps;
				
				if(!me.zoom) // if panZoom not avaiable
					return;

				menu = e.detail.menu;
				pin = e.detail.pin;
				links = pin.getLinks();
				
				if(links.length() == 0)
					return;
				if(links.length()  == 1){
					var p = links.last().getOtherPin(pin);
					menu.addItem('Jump to `' + p.getNode().getData('title') + '`', 'jumpto', function(){
							console.warn('TODO : Jump to node');
							var nodeCenter = p.getNode().getCenter()
							, vb = me.viewbox()

							, p1 = nodeCenter
							, p2 = vb
							, deltaP = [p2.x - p1.x, p2.y - p1.y]
							, box = new SVG.Box(vb).transform(new SVG.Matrix().translate(deltaP[0], deltaP[1]));

							me.viewbox(box);
						})
						.setMeta('Jump to node `' + p.getNode().getData('title') + '`');
				}
				else {
					jumps = menu.addSubMenu('Jump to... ', 'jump');
					links.each(function(){
						var link = this;
						var p = link.getOtherPin(pin);
						console.assert(p instanceof exSVG.Pin, 'instanceof "exSVG.Pin expected" but "' + p.constructor.name + '" found');
						jumps.addItem('Jump to `' + p.getNode().getData('title') + '`', 'jumpto', function(){
							console.warn('TODO : Jump to node');
							p.getNode().getCenter();
						})
							.setMeta('Jump to node `' + p.getNode().getData('title') + '`');	
					});
				}
			});
			return me;
		},
		
		createHeader: function(){
			//console.log('worksheet.createHeader()');
			var me = this;
			me.mTitleGroup = me.doc()
				.group()
				.id('gtitle')
				.addClass('header');
				
			me.mTitleGroup.rect()
				.front()
				.size('100%', 40);
			
			me.mTitleGroup.text('test')
				.addClass('title')
				.front()
				.translate(3, 7);
			return me;
		},
		
		createTooltip: function(){
			//console.log('worksheet.createTooltip()');
			var me = this;
			me.mToolTip = document.querySelector('#exTooltip');
			if(!me.mToolTip){
				me.mToolTip = document.createElement('div');
				me.mToolTip.setAttribute('id', 'exTooltip');
				document.body.appendChild(me.mToolTip);
			}
			return me;
		},
		
		getTitleBar: function(){
			//console.log('worksheet.getTitleBar()');
			return this.mTitleGroup;
		},
		
		setTitle: function(title){
			//console.log('worksheet.setTitle()');
			this.mTitleGroup.select('text').text(title);
			return this;
		},
		
		import: function(data, parent){
			//console.log('exSVG.Worksheet.import()', data);
			var me = this;
			
			if(typeof data === 'string')
				return me.import(exLIB.getNode2(data), parent);

			if(me['import' + data.type.capitalize()])
				return me['import' + data.type.capitalize()](data, me);
		},
		
		importGraph: function(data, parent){
			//console.log('exSVG.Worksheet.importGraph()', data);
			var me = this
			, set = new SVG.Set();
			
			me.startSequence();
			data.select(':scope > *').each(function(){
				set.add(me.import(this, parent));
			});			
			me.stopSequence();
			return set;
		},
		
		
		exportGraph: function(graph){	
			var me = this;	
			me.fire('export', {parent: graph});	
		},
		
		showTooltip: function(e, text, timeout){
			//console.log('worksheet.showTooltip()', text);
			var me = this;
			
			me.mToolTip.innerHTML = text;
			me.mToolTip.style.left = e.pageX + 'px';
			me.mToolTip.style.top = (e.pageY+10) + 'px';
			//me.mToolTip.setAttribute('class', 'exTooltip visible');
			me.mToolTip.timer = setTimeout(function(){
				if(!me.mToolTip.timer)
					return;
				me.mToolTip.setAttribute('class', 'exTooltip visible');
			}, timeout || 500);
			return me;
		},

		hideTooltip: function(){
			//console.log('worksheet.hideTooltip()');
			var me = this;
			me.mToolTip.timer = null;
			me.mToolTip.setAttribute('class', 'exTooltip');
			return me;
		},
		
		getPoint: function(e){
			//console.log('worksheet.getPoint()');
			return this.point(e);
		},
		
		startSequence: function(){
			return this;
		},
		
		stopSequence: function(){
			return this;
		},

		enableSequence: function(){
			return this;
		}
		
	}, 
	construct: {
		worksheet: function(callback, plugins) {
			var ret = new exSVG.Worksheet()
			, plugins = plugins || pluginsList;
			
			this.put(ret);
			loadCss('exsvg/css/css.css');
			
			loadScript(
				'exsvg/exsvg.extend.js', 'svgjs/svg.draggable.js', 'svgjs/svg.panzoom.js', 'svgjs/svg.foreignobject.js', 'svgjs/svg.draw.js', 'svgjs/svg.filter.js'
				, 'exsvg/exsvg.node.js', 'exsvg/exsvg.node.gfx.js', 'exsvg/exsvg.node.derived.js', 'exsvg/exsvg.node.properties.js'
				, 'exsvg/exsvg.pin.js', 'exsvg/exsvg.pin.gfx.js', 'exsvg/exsvg.pin.link.js',  'exsvg/exsvg.pin.derived.js', 'exsvg/exsvg.pin.editors.js'
				, 'exsvg/exsvg.link.js', 'exsvg/exsvg.node.reroute.js', 'exsvg/exsvg.node.ramp.js'
				, plugins
				, function(){
					ret.init();
					exSVG.execPlugins(ret, ret, exSVG.Worksheet);
					ret.doc().fire('plugins-init');
					if(typeof callback === 'function')
						callback.call(ret, ret);			
			});
			return ret;
		}
	}
});

}());
