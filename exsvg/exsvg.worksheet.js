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
	, 'exsvg/exsvg.validator.js'
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

			me.attr('tabindex', -1);
			me.focus();

				
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
			
			me.initDnd();
			
			return me;
        },
		
		initDnd: function(){
			var me = this;
			
			me.on('dragover.worksheet', function(e){
				var isLink = e.dataTransfer.types.indexOf('application/xml') > -1;
				if (isLink)
					e.preventDefault();
			});

			me.on('drop.worksheet', function(e){
				console.dir(e.dataTransfer.getData('application/xml'));
				me.import(me.strToGraph(e.dataTransfer.getData('application/xml')));
			});			
		},
		
		doLayout: function(){
			//console.log(this.mTitle.bbox().width, this.doc().parent().clientWidth);
			//this.mTitleGroup.select('text').first().x((this.doc().parent().clientWidth/2)-this.mTitle.bbox().width);
			return this;
		},
		
		focus: function(){
			this.node.focus();
			return this;
		},
		
		hasFocus: function(){
			return document.activeElement && document.activeElement.instance && document.activeElement.instance == this;
		},
		
		setContext: function(context){
			this.mContext = context;
		},
		
		getContext: function(){
			return this.mContext;
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
				});
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
						var link = this
							, p = link.getOtherPin(pin);

						assert(p instanceof exSVG.Pin, 'instanceof "exSVG.Pin expected" but "' + p.constructor.name + '" found');
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
			//console.log('exSVG.Worksheet.createHeader()');
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
			//console.log('exSVG.Worksheet.createTooltip()');
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
			//console.log('exSVG.Worksheet.setTitle()');
			this.mTitleGroup.select('text').first().text(title);
			return this;
		},
		
		import: function(data){
			//console.log('exSVG.Worksheet.import()', data);
			var me = this;
			
			if(me['import' + data.type.capitalize()])
				return me['import' + data.type.capitalize()](data, me);
			return 0;
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
			//console.log('exSVG.Worksheet.exportGraph()', data);
			var me = this;

			me.fire('export', {parent: graph});	
		},
		
		showTooltip: function(e, text, timeout){
			//console.log('exSVG.Worksheet.showTooltip()', text);
			var me = this;
			
			me.mToolTip.innerHTML = nl2br(text);
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
			//console.log('exSVG.Worksheet.hideTooltip()');
			var me = this;

			me.mToolTip.timer = null;
			me.mToolTip.setAttribute('class', 'exTooltip');
			return me;
		},
		
		getPoint: function(e){
			//console.log('exSVG.Worksheet.getPoint()');
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
		},
		
		strToGraph: function(str){
			//console.log('exSVG.Worksheet.getPoint()');
			var graph = new exGRAPH.Graph()
				, parser = new DOMParser()
				, xmlDoc = parser.parseFromString(str, "text/xml");
			//document.getElementById('ttest').value = xmlDoc.innerHTML;
			
			if(xmlDoc.querySelector('parsererror')){
				return console.error('cant paste from clipboard');
			}
			//console.log(xmlDoc.firstChild.innerHTML);
			graph.node.innerHTML = xmlDoc.firstChild.innerHTML;
			return graph;
		},

		graphToStr: function(graph){

		}
	}, 
	construct: {
		worksheet: function(callback, plugins) {
			var ret = new exSVG.Worksheet();

			console.time('exSVG Init');
			plugins = plugins || pluginsList;
			
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
					console.timeEnd('exSVG Init');
					if(typeof callback == 'function')
						callback.call(ret, ret);			
			});
			return ret;
		}
	}
});

}());
