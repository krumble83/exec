;(function() {
"use strict";

var menuEl = document.querySelector('#librarymenu');

SVG.extend(exSVG.Worksheet, {

	initLibrary: function() {
		this.initLibraryEventHandlers();
		this.createMenu();

		return this;
	},
	
	createMenu: function(){
		var me = this
		, divhead
		, divbody
		, input;
		
		if(!menuEl){
			menuEl = document.createElement('div');
			menuEl.setAttribute('id', 'librarymenu');
			
			divhead = document.createElement('div');
			divhead.setAttribute('class', 'head');
			divhead.innerHTML = '<div>All Actions for this Graph</div><input type="text" placeholder="search..." \>';
			menuEl.appendChild(divhead);
			
			
			divbody = document.createElement('div');
			divbody.setAttribute('class', 'body');
			divbody.innerHTML = '<ul class="sortable"></ul>';
			menuEl.appendChild(divbody);
			document.body.appendChild(menuEl);
		}
		
	},
	
	initLibraryEventHandlers: function(){
		var me = this;
		
		me.doc().on('link-start.library', function(e){
			//console.log('LibraryMenu:initLibraryEventHandlers.link-start.library');
			var link = e.detail.link
			, menu;
			
			//hide previously created menus
			me.hideMenu();
			
			function terminate(){
				//console.log('terminate')
				SVG.off(document, '.library-linkstart-temp');
				link.off('.library-linkstart-temp'); // not needed ?
				SVG.off(menu, '.mmenu');
			}
			
			link.on('remove.library-linkstart-temp', terminate);
			link.on('cancel.library-linkstart-temp', terminate);					
			link.on('finish.library-linkstart-temp', terminate);
			
			
			SVG.on(document, 'mousemove.library-linkstart-temp', function(e){
				if(e.target.className.baseVal == 'grid')
					me.showTooltip(e, '<img src="exsvg/img/newnode.png" style="vertical-align:-3px"> Place a new node', 1);
			});

			//when user release the button on the grid, we displaying the library menu
			SVG.on(document, 'mouseup.library-linkstart-temp', function(e){
				//console.log('menulibrary.mouseup', e.button, e.buttons);
				var startPin = link.getStartPin()  // Get the startPin of the link to get all nodes with a valid type (input or output) and valid datatype in the library
				, dataType = startPin.getDataType()
				, io = (startPin.getType() == exSVG.Pin.PIN_IN) ? 'output' : 'input'
				, filters2;
				
				if(e.button != 0)
					return;
				
				// We need to cancel some mouse event handlers
				SVG.off(document, '.linkStart-link' + link.id());  // Link class to stop drawing and follow mouse cursor
				SVG.off(document, 'mousemove.library-linkstart-temp'); // This class to stop displaying tooltip "add a new node" on the document
				SVG.off(document, '.library-linkstart-temp'); // prevent to retrigger this event twice if we click on the document and not on the menu

				// show the menu only if we leave mouse button on the grid and not anywhere
				if(e.target.className.baseVal != 'workspace'){
					//link.remove();
					//return;
				}
					
				me.hideTooltip();
				
				console.log(dataType);
				
				// before displaying menu, we get all nodes from library with a comptatible pin
				filters2 = io + '[type="' + dataType + '"]';										
				// widlcards dataType
					filters2 += ',' + io + '[type="' + exLIB.getWildcardsDataType(exLIB.isArrayDataType(dataType)) + '"]';

					
				// Display the menu
				//menu = me.showLibMenu(e, filters);
				menu = me.showLibMenu(e, filters2);

				SVG.on(menu, 'itemclick.mmenu', function(e){
					// here is the event when the user click on a menu item 
					// we create the node, get all compatibles pin on this new node 
					// and attach the link to the first valid pin (input/output & datatype)
					//console.log(e);
					try{
						me.startSequence();
						var pt = me.point(e.detail.e.clientX, e.detail.e.clientY)
						, node = me.import(exLIB.getNode2(e.detail.nodeid).attr('pos', pt.x + ',' + pt.y))
						//, node = me.addNode(e.detail.nodeid, {x: pt.x, y: pt.y})
						, pins;
						
						if(startPin.getType() == exSVG.Pin.PIN_IN) // if the startPin of the link is a input, we select all output pins
							pins = node.getPins({output: {type: startPin.getDataType()}}, true);
							//pins = node.select('.exPin.output[data-dataType="' + startPin.getDataType() + '"],.exPin.output[data-isWildcards="1"]');
						else if(startPin.getType() == exSVG.Pin.PIN_OUT) // if the startPin of the link is a output, we select all input pins
							pins = node.getPins({input: {type: startPin.getDataType()}}, true);
							//pins = node.select('.exPin.input[data-dataType="' + startPin.getDataType() + '"],.exPin.output[data-isWildcards="1"]');

						console.assert(pins.length() > 0);

						
					} catch(err){
						link.remove();
						console.log('Can\'t create link', err);
						me.stopSequence();
						return;
						//throw e;
					}
					finally {
						// disable menu event handlers
						terminate();
						//SVG.off(menu, '.mmenu');
					}

					// finally we finish the link beetween two pins node
					//link.finish(pins.first(), e.detail.e);
					pins.first().node.dispatchEvent(e.detail.e);
					me.createSmartLink(link);
					//pins.first().endLink(link, e.detail.e);
					me.stopSequence();
				});
				
				SVG.on(menu, 'cancel.mmenu', function(e){
					link.remove();
					//SVG.off(menu, '.mmenu');
					terminate();
				});
			});
			
			
		});

		// event handler to show the library menu when user right click on the grid
		me.doc().on('contextmenu.library', function(ev){
			var menu = me.showLibMenu(ev);
			
			ev.preventDefault();
			SVG.on(menu, 'itemclick.mmenu', function(e){
				var pt = me.point(e.detail.e.clientX, e.detail.e.clientY);
				
				me.import(exLIB.getNode2(e.detail.nodeid).attr('pos', pt.x + ',' + pt.y));
				SVG.off(menu, '.mmenu');
			});

			SVG.on(menu, 'cancel.mmenu', function(e){
				SVG.off(menu, '.mmenu');
			});
		});
		
		me.doc().on('node-add', function(e){
			var node = e.detail.node;
			
			node.on('move-start.menu', function(){
				me.hideMenu();
			});			
		});
	},

	showLibMenu: function(ev, filters, callback){
		//console.log(ev, filters);
		var me = this
		, filters = filters || 'node,macro'
		, div
		, input
		, ul
		, nodes;

		//hide previously created menus
		me.hideMenu();
		
		function genuid(){
			function s4() {
				return Math.floor((1 + Math.random()) * 0x10000)
					.toString(16)
					.substring(1);
			}
			return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();				
		}

		function insert(parent, el){
			for(var i=0; i < parent.childElementCount; i++){
				if(!el.querySelector('label')){
					if(parent.childNodes[i].querySelector('label'))
						continue;
					//console.log(parent.childNodes[i].innerText, el.innerText, parent.childNodes[i].innerText > el.innerText);
					if(parent.childNodes[i].innerText > el.innerText){
						parent.insertBefore(el, parent.childNodes[i]);
						return;
					}
				}
				if(!parent.childNodes[i].querySelector('label')){
					parent.prepend(el);
					return;
				}
				if(parent.childNodes[i].querySelector('label').innerHTML > el.querySelector('label').innerHTML){
					parent.insertBefore(el, parent.childNodes[i]);
					return;
				}
			}
			//console.dir(parent);
			parent.appendChild(el);
		}
		
		function findUl(id, parent){
			//console.log('findUl()', id, parent)
			var el
			, path = id.split('/')
			, tid = path.shift()
			, ul = parent.querySelector('ul[id="' + tid + '"]')
			, li
			, input
			, lab
			, uid = genuid()
			
					
			if(!ul){
				li = document.createElement('li');
				
				input = document.createElement('input');
				input.setAttribute('type', 'checkbox');
				input.setAttribute('id', 'folder_' + uid);
				li.appendChild(input);
				
				lab = document.createElement('label');
				lab.setAttribute('for', 'folder_' + uid);
				lab.innerText = tid;
				li.appendChild(lab);
				
				ul = document.createElement('ul');
				ul.setAttribute('id', tid);
				li.appendChild(ul);
				insert(parent, li);
			}
			if(path.length > 0)
				return findUl(path.join('/'), ul);
			
			return ul;	
		}

		function fill(parent, nodes, expended, highlight){
			var reg = (highlight) ? new RegExp('(' + highlight + ')', 'gi') : null
			while (parent.firstChild) {
				parent.removeChild(parent.firstChild);
			}

			nodes.each(function(){
				var node = this
				, cats = node.select('category')
				
				if(!cats.first())
					return;
				
				cats.each(function(){
					var ul = findUl(this.Name(), parent)
					, li = document.createElement('li');
					
					if(node.Symbol())
						li.innerHTML = '<img src="' + node.Symbol() + '">&nbsp;';
					if(reg)
						li.innerHTML += node.Title().replace(reg, '<span class="highlight">$1</span>');
					else
						li.innerHTML += node.Title();
					
					li.setAttribute('id', 'Node_' + node.Id());
					li.setAttribute('child', '1');
					//insert(ul, li);
					ul.appendChild(li);	
				});
			});
			if(expended || nodes.length() < 100){
				expended = parent.querySelectorAll('input');
				for(var a=0; a < expended.length; a++)
					expended[a].setAttribute('checked', true);
			}
		}

		div = menuEl;
		input = div.querySelector('input[type="text"]');	
		ul = div.querySelector('ul.sortable');
		div.querySelector('.body').scrollTop = 0;
		input.value = '';
		
		
		SVG.on(input, 'keyup.librarymenu', function(e){
			var nodes
			, flters = ((filters != 'node,macro') ? filters : '')
			
			if(this.value){
				nodes = exLIB.getNodes2('node[title*="' + this.value + '" i] ' + flters + ', node[keywords*="' + this.value + '" i] ' + flters, ['id', 'symbol', 'title', 'categories']);
				fill(ul, nodes, true, this.value);
			}
			else{
				nodes = exLIB.getNodes2(filters, ['id', 'symbol', 'title', 'categories']);
				fill(ul, nodes);
			}
		});
		
		nodes = exLIB.getNodes2(filters, ['id', 'symbol', 'title', 'categories']);
		//console.log(nodes);
		fill(ul, nodes);
		
		SVG.on(ul, 'click.librarymenu', function(e){
			//when user click on a menu item, cancel all event listeners of the menu
			var elem = e.target
			, pt
			, event
					
			if(elem.tagName == 'INPUT')
				return;
			
			if(elem.tagName == 'SPAN' || elem.tagName == 'IMG')
				elem = elem.parentNode;
			if(elem.tagName != 'LI')
				return;
			
			SVG.off(input, '.librarymenu');
			SVG.off(ul, '.librarymenu');

			pt = me.point(ev.clientX, ev.clientY);
			event = new CustomEvent('itemclick', {detail: {elem: elem, e: ev, nodeid: elem.id.replace('Node_', '')}});
			div.dispatchEvent(event);
			me.hideMenu();
		});
		
		me.doc().on('mousedown.librarymenu', function(ev){
			var event = new CustomEvent('cancel', {detail: {e: ev}});
			
			SVG.off(input, '.librarymenu');
			SVG.off(ul, '.librarymenu');
			me.off('.librarymenu');
			div.dispatchEvent(event);
			me.hideMenu();
		});
		
		//tinysort('.sortable>li');
		
		if(!ev || !ev.clientX)
			return;

		if(ev.clientX + 360 > window.innerWidth)
			div.style.left = window.innerWidth - 360 + 'px';
		else
			div.style.left = ev.clientX + 'px';

		if(ev.clientY + 310 > window.innerHeight)
			div.style.top = window.innerHeight - 310 + 'px';
		else
			div.style.top = ev.clientY + 'px';

		div.style.display = 'block';
		input.focus();
		return div;
		//me.fire('show' + menu.name, {menu: div});		
	},

	hideMenu: function(menu){
		var menu = document.querySelector('#librarymenu');
		menu.style.display = 'none';
	},
	
	createSmartLink: function(link){
		var me = this
		, inp = link.getInputPin().getNode().select('.exPin.exPinExec.input[data-id="entry"]')
		, out = link.getOutputPin().getNode().select('.exPin.exPinExec.output[data-id="exit"]');

		if(inp.length() == 1 && out.length() == 1){
			var l1 = me.createLink(inp.first());
			inp.first().startLink(l1);
			out.first().endLink(l1);
			
		}
	}
});

exSVG.Worksheet.prototype.plugins.library = {name: 'Library Wrapper', initor: 'initLibrary'}

loadCss('exsvg/css/librarymenu.css');

}).call(this);