;(function() {
"use strict";


exSVG.Worksheet = SVG.invent({
    create: 'svg', 
    inherit: SVG.Nested ,
    extend: {
        init: function(data){
			//console.group('worksheet.init()');
			var me = this;
						
			me.doc().addClass('worksheet');			
			me.createTooltip();
			me.createHeader();
			me.doc().size('100%', '100%')
			

			//PinArray pattern
			me.pattern(10, 10, function(add) {
				add.rect(3,3).move(2,2)
			}).id('pinArrayPattern').attr('patternUnits', 'userSpaceOnUse')			
			
			me
				.initWorksheetEventHandlers()
				.size('100%', '100%')
				.panZoom({zoomMin: 0.05, zoomMax: 1, zoomFactor: 0.08})

			return me;
        },
		
		doLayout: function(){
			console.log(this.mTitle.bbox().width, this.doc().parent().clientWidth);
			this.mTitle.x((this.doc().parent().clientWidth/2)-this.mTitle.bbox().width);
			
		},
		
		initWorksheetEventHandlers: function(){
			//console.log('worksheet.initEventHandlers()');
			var me = this
			, panStart = {x:null, y:null, pan:false}
			, panEl
			, panElCursor;

			me.on('panStart.worksheet', function(e){
				panStart.x = e.detail.event.clientX;
				panStart.y = e.detail.event.clientY;
				panEl = e.detail.event.target;
				panElCursor = panEl.instance.style('cursor');
				panEl.instance.style('cursor', 'url("exsvg/img/pancursor.png"), default');
				me.addClass('blur');
			});
			
			me.on('panEnd.worksheet', function(e){
				if (e.detail.event.clientX != panStart.x || e.detail.event.clientY != panStart.y)
					panStart.pan = true;
				else
					panStart.pan = false;
				e.stopPropagation();
				e.stopImmediatePropagation();
				panEl.instance.style('cursor', panElCursor);
				me.removeClass('blur');
			});
				/*		
			me.doc().on('contextmenu.worksheet', function(e){
				if(panStart.pan){
					e.preventDefault();
					e.stopImmediatePropagation();
					e.stopPropagation();
				}
			});
			*/
			me.doc().on('node-add.worksheet-dragnode', function(e){
				console.log('worksheet:nodeadd.worksheet-drag');
				var dragPoint = null
				, node = e.detail.node;

				if(!node.draggable)
					return;
				node.draggable(me.snapToGrid);
				
				node.on('dragstart.worksheet-dragnode', function(e){
					console.log('node.dragstart', e);
					this.fire('startmove', e);
					dragPoint = e.detail.p;
				})
				node.on('dragend.worksheet-dragnode', function(e){
					console.log('node.dragend', e);
					var m = me.snapToGrid(e.detail.p.x - dragPoint.x, e.detail.p.y - dragPoint.y);
					e.detail.event.stopImmediatePropagation();
					e.detail.event.stopPropagation();
					me.doc().fire('node-moved', {node: this, movement: m});
					this.fire('moved', {event: e});
					dragPoint = null;
				});				
			});

			me.doc().on('node-add.worksheet', function(e){
				//console.log('worksheet:nodeadd');
				var node = e.detail.node;
				node.on('contextmenu.worksheet', function(e){
					if(panStart.pan){
						e.preventDefault();
						e.stopImmediatePropagation();
						e.stopPropagation();
					}
				});
			});
			
			me.doc().on('link-start.worksheet', function(e){
				var pin = e.detail.link.getStartPin()
				, type = pin.getDataType();

				me.select('.exLink:not(.exLinkStart)').animate(100).opacity(0.4);
				
				if(exLIB.isArrayDataType(type))
					me.select('.exPin:not([data-type="' + type + '"]):not([data-type="' + exLIB.getWildcardsDataType(true) + '"])').animate(100).opacity(0.2);
				else
					me.select('.exPin:not([data-type="' + type + '"]):not([data-type="' + exLIB.getWildcardsDataType() + '"])').animate(100).opacity(0.2);
				
				if(pin.getType() == exSVG.Pin.PIN_IN)
					me.select('.exPin.input').animate(100).opacity(0.2);
				else
					me.select('.exPin.output').animate(100).opacity(0.2);
				
				
				me.doc().on('link-finish.worksheet-linkstart', function(e){
					//console.log('link-finish')
					me.doc().off('.worksheet-linkstart');
					me.select('.exLink, .exPin').animate(50).opacity(1);
				});

				me.doc().on('link-cancel.worksheet-linkstart', function(e){
					me.doc().off('.worksheet-linkstart');
					me.select('.exLink, .exPin').animate(50).opacity(1);
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
							console.warn('TODO : Jump to node', me.zoom());
							var pt = me.doc().point(p.x(), p.y());
							me.zoom(0.1, pt.x, pt.y);
							me.zoom(1, pt.x, pt.y);
							console.log(pt);
							
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
				.addClass('header')
			me.mTitleGroup.rect()
				.front()
				.size('100%', 40)
			
			me.mTitle = me.mTitleGroup.text('test')
				.addClass('title')
				.front()
				.translate(100, 5)
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
		},
		
		getTitleBar: function(){
			//console.log('worksheet.getTitleBar()');
			return this.mTitleGroup;
		},
		
		setTitle: function(title){
			//console.log('worksheet.setTitle()');
			this.mTitle.text(title);
			return this;
		},
		
		import: function(data, parent){
			//console.log('worksheet.import()', data);
			var me = this;
			
			if(typeof data === 'string')
				data = exLIB.getNode2(data);
			

			if(me['import' + data.type.capitalize()])
				return me['import' + data.type.capitalize()](data, me);

			me.startSequence();
			data.select(':scope > *').each(function(){
				//console.log(this);
				me.import(this);
			});
			me.stopSequence();
			return me;
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
		},

		hideTooltip: function(){
			//console.log('worksheet.hideTooltip()');
			this.mToolTip.timer = null;
			this.mToolTip.setAttribute('class', 'exTooltip');
		},
		
		getPoint: function(e){
			//console.log('worksheet.getPoint()');
			return this.point(e);
		},
		
		exportGraph: function(graph){
			var me = this;
			me.fire('export', {parent: graph});
		},
		
		stopAutoScroll: function(){
			SVG.off(document, '.worksheet-autoscroll');
		},
		
		startSequence: function(){
			//not used in the base class, but by the undo/redo frameworks
			console.log('Worksheet.startSequence(), should not be called without undo/redo framework');
		},
		
		stopSequence: function(){
			//not used in the base class, but by the undo/redo frameworks
			console.log('Worksheet.stopSequence(), should not be called without undo/redo framework');
		},

		doSequence: function(){
			//not used in the base class, but by the undo/redo frameworks
			console.log('Worksheet.doSequence(), should not be called without undo/redo framework');
		}
		
	}, 
	construct: {
		worksheet: function(callback, plugins) {
			var ret = new exSVG.Worksheet;
			
			this.put(ret);
			if(typeof plugins === 'undefined')
				var plugins = '*';

			loadCss('exsvg/css/css.css');
			
			loadScript('exsvg/exsvg.extend.js', 'svgjs/svg.draggable.js', 'svgjs/svg.panzoom.js', 'svgjs/svg.foreignobject.js', 'svgjs/svg.draw.js', 'svgjs/svg.filter.js', 
				'exsvg/exsvg.grid.js', 'exsvg/exsvg.selection.js', 'exsvg/exsvg.undo.js', 'exsvg/exsvg.clipboard.js', 'exsvg/exsvg.menu.js',  
				'exsvg/exsvg.node.js', 'exsvg/exsvg.node.gfx.js', 'exsvg/exsvg.node.derived.js', 'exsvg/exsvg.node.properties.js', 
				'exsvg/exsvg.pin.js', 'exsvg/exsvg.pin.gfx.js', 'exsvg/exsvg.pin.link.js',  'exsvg/exsvg.pin.derived.js', 'exsvg/exsvg.pin.editors.js', 
				'exsvg/exsvg.link.js',
				'exsvg/exsvg.librarymenu.js',
				
				function(){
					ret.init();

					if(plugins == '*'){
						for (var key in ret.plugins) {
							//console.log('--', key);
							if (!Object.prototype.hasOwnProperty.call(ret.plugins, key))
								continue;
							if(ret.plugins[key].initor)
								ret[ret.plugins[key].initor].call(ret);
							else
								console.log(key);
						}
						//console.log(ret.plugins);
					}
					ret.doc().fire('plugins-init');
					if(typeof callback === "function")
						callback.call(ret);
				}
			);
			return ret;
		}
	}
});

exSVG.Worksheet.prototype.plugins = {}

}());
