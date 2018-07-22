;(function() {
"use strict";


function toParent(node, parent){
	if(typeof node.screenCTM !== 'function')
		parent.put(node);
	else {
		var ctm = node.screenCTM();
		var pCtm = parent.screenCTM().inverse();
		parent.put(node);
		node.untransform().transform(pCtm.multiply(ctm));
	}
}


exSVG.Selection = SVG.invent({
    create: 'g', 
    inherit: SVG.G,
	
    extend: {
		init: function(parent){
			var me = this;
			me.mWorksheet = parent;
			
			
			//add the node selection marquee gradient to the svg defs
			// we can customize it in the css with #selectionHandlerStroke
			me.gradient('linear', function(stop) {
				stop.at(0, '#f1b000');
				stop.at(1, '#ce6d00');
				stop.from(0, 0).to(0, 1);
			}).id('selectionHandlerStroke');

			if(me.draggable)
				me.draggable(me.mWorksheet.snapToGrid);

			me.initSelectionEventHandlers();
			return me;
		},
		
		length: function(){
			return this.nodes().length();
		},
		
		nodes: function(){
			return this.mWorksheet.getNodes(this);
		},
	
		selectNode: function(el){
			var me = this;
			if(!el){
				var sel = me.mWorksheet.getNodes();
				sel.each(function(){
					me.selectNode(this);
				});
				return;
			}
			if(el instanceof SVG.Set){
				el.each(function(){
					me.selectNode(this);
				});
				return;
			}
			if(el.parent() == me || !(el instanceof exSVG.Node))
				return;
			toParent(el, me);
			me.mWorksheet.fire('node-selected', {node: el});
			me.front();
			if(me.mWorksheet.getWorkspace)
				me.mWorksheet.getWorkspace().back();
			me.mWorksheet.focus();
		},
	
		unselectNode: function(el){
			//console.log(el);
			var me = this;
			if(!el){
				var sel = me.nodes();
				sel.each(function(){
					me.unselectNode(this);
				});
				return;
			}
			if(el instanceof SVG.Set){
				el.each(function(){
					me.unselectNode(this);
				});
				return;
			}

			if(el.parent() == me.mWorksheet || !el.parent() || !(el instanceof exSVG.Node))
				return;
			toParent(el, me.mWorksheet);
			me.mWorksheet.fire('node-unselected', {node: el});
			if(me.mWorksheet.getWorkspace)
				me.mWorksheet.getWorkspace().back();
		},
		
		swapSelectNode: function(el){
			var me = this;
			if(el.parent() == me)
				toParent(el, me.mWorksheet);
			else
				toParent(el, me);
		},
		
		isSelectedNode: function(node){
			return node.parent() == this;
		},
		
		deleteSelection: function(selection){
			var me = this
			, selection = selection || me.nodes()
			, out = new SVG.Set;
			
			// we start a sequence because we want only one undo action for all deleted nodes
			me.mWorksheet.startSequence();
			selection.each(function(){
				me.unselectNode(this);
				this.remove();
				out.add(this);
			});
			me.doc().fire('selection-remove', {selection: out});
			me.mWorksheet.stopSequence();
		},
		
		initSelectionEventHandlers: function(){
			//console.log('Selection.initSelectionEventHandlers()');
			var me = this
			, dragPoint
			, selectionRect;

			me.on('dragstart.selection', function(e){
				//console.log('Selection:dragstart.selection');
				
				// to check if nodes really moving and to get the delta of the drag movement, we need to store the start drag position
				dragPoint = e.detail.p;
				
				// Add events to handle drag events
				me.on('dragmove.selection', function(ev){
					//console.log('selection.dragmove', e);
					var selection = me.nodes();
					
					// make all nodes to don't react a mouse events (over)
					me.mWorksheet.addClass('blur');

					selection.fire('move', {event:ev});
					if(!dragPoint.dragged)
						selection.fire('move-start', {event:ev});
					
					// because drag plugin suck, if the user press down the mouse button but not move mouse,
					// the plugin still throw a dragend event when the mouse button is released
					// if we don't be aware of this, the undo/redo framework register a move event but nothing was happened
					dragPoint.dragged = true;
				})
				.on('dragend.selection', function(ev){
					//console.log('selection.dragend');
					var selection
					, movement;

					// remove listeners
					me.off('dragmove.selection').off('dragend.selection');

					// make all nodes to react a mouse events (over)
					me.mWorksheet.removeClass('blur');
					//me.select('.exNode').removeClass('unfocusable');			
					
					// first, we stop all propagation of the initial mouse event (mouse up)
					// given by the drag plugin in e.detail.event
					ev.detail.event.stopImmediatePropagation();
					ev.detail.event.stopPropagation();
					
					//if no move happen, return (see on('dragmove') above)
					if(!dragPoint.dragged){
						dragPoint = null;
						return;
					}
					
					// we get all moved nodes
					// normaly it's all nodes in the SVG selection group
					selection = me.nodes();

					// movement is the delta between start drag position and stop drag position
					movement = me.mWorksheet.snapToGrid(ev.detail.p.x - dragPoint.x, ev.detail.p.y - dragPoint.y);
					
					// we start a sequence because we want only one undo/redo action for all moved nodes
					// see undo/redo framework for more
					me.mWorksheet.startSequence();
					selection.each(function(){
						this.fire('dragend', {event: ev});
						this.fire('moved', {movement: movement});
						me.doc().fire('node-moved', {node: this, movement: movement});
					});
					me.mWorksheet.stopSequence();
					dragPoint = null;
				});			
							
			})

			// Rectangle selection stuff
			me.doc().on('mousedown.selection-rectangle', function(e){
				//console.log('selection.mousedown');
				var coordsCache = {}
				, nodes = false
				, box
				, x1
				, x2
				
				, bound = me.doc().parent().getBoundingClientRect()
				, scrollX = 0
				, scrollY = 0
				, viewb
				, scrollTimer
				
				me.mWorksheet.focus();

				// first we checking if the mouse button is valid, selection rectangle working only with left button
				// after, we check if selectionRect is not allready assigned, in normal condition he's not, but in case a bug (multiple rectangle selection ?)
				// and finnaly, if we have the grid, we check if we are on
				if(e.buttons != 1 || selectionRect)
					return;

				if(!e.ctrlKey && !e.shiftKey)
					me.unselectNode();
				
				selectionRect = me.mWorksheet.rect().addClass('marquee');
				nodes = me.mWorksheet.getNodes();
				
				// to check if a node is in the selection rectangle we need it's coordinates (x, y, w, h)
				// put in cache all node position and size to avoid performances issues
				nodes.each(function(){
					var box = this.rbox();
					var x1 = this.parent(exSVG.Workesheet).point(box);
					var x2 = this.parent(exSVG.Workesheet).point(box.x + box.w, box.y + box.h);
					//console.log(p);
					coordsCache[this.id()] = {x1:x1.x, y1:x1.y, x2:x2.x, y2:x2.y};
				});

				// adding class .blur on each node only for visual effect (pins not hightligth when dragging rectangle)
				me.mWorksheet.addClass('blur');

				// before drawing, we initialize all event handlers
				// handler when user release mouse button when selection rectangle is drawing
				SVG.on(document, 'mouseup.selection-rectangle-handler', function(e){
					//console.log('selection:rectangle-selection.mouseup');
					selectionRect.draw('stop', e); // stop drawind rectangle
					selectionRect.off(); // remove all events handlers
					selectionRect.remove(); // remove rectangle from DOM
					selectionRect = null;
					me.mWorksheet.removeClass('blur'); //// remove class unfocusable on all nodes
					SVG.off(document, '.selection-rectangle-handler');
				});
				
				// handler when the selection rectangle is updated, see drawing svg plugin
				selectionRect.on('drawupdate.selection', function(e){
					// here we check if each node is in the selection rectangle
					// actually we check only if one of it's four corners is in
					// in future we can check for middle point border too
					var sel = {x1 :selectionRect.x(), y1: selectionRect.y(), x2: selectionRect.x() + selectionRect.width(), y2: selectionRect.y() + selectionRect.height()};

					nodes.each(function(){
						var coords = coordsCache[this.id()];
						if(sel.x2 < coords.x1 || sel.y2 < coords.y1 || sel.x1 > coords.x2 || sel.y1 > coords.y2){
							// if the user not hold the ctl key, we unselect the node, because he's not in the selection rectangle
							if(!e.detail.event.ctrlKey)
								me.unselectNode(this);
							return;
						}
						me.selectNode(this);
					});
					selectionRect.front();
					
					/*
					e = e.detail.event;

					if(e.clientX < bound.x+bound.width && e.clientY < bound.y+bound.height && e.clientX > bound.x && e.clientY > bound.y)
						return;
					//console.log('ok', e);

					if(e.clientX > bound.x+bound.width)
						scrollX = 10;
					if(e.clientY > bound.y+bound.height)
						scrollY = 10;
					
					var h = selectionRect.height();
					
					viewb = me.mWorksheet.viewbox();
					console.log(h,scrollY);
					viewb.x += scrollX;
					viewb.y += scrollY;
					setTimeout(function(){
						selectionRect.width(selectionRect.width() + scrollX);
						selectionRect.height(h + scrollY);
						
					},100);
					me.mWorksheet.viewbox(viewb);
					*/
						
				});

				//start drawing selection rectangle
				selectionRect.draw(e);
			});

			
			// prevent initializing dragging of single node (from Worksheet class)
			// because we want to drag all selected nodes and not only one
			me.doc().off('node-add.worksheet-dragnode');

			
			//when we add a node in the document, we need to do some stuff
			me.doc().on('node-add.selection', function(e){
				var node = e.detail.node;
				
				// here we are transforming the node context menu to adapt some action on all selected nodes
				// instead of one node
				node.on('menu.selection', function(e){
					var menu = e.detail.menu
					, el = menu.getMenu('delete')
					, oldF = {}
					
					if(el){
						if(!el.enabled() && me.nodes().length() > 1)
							el.enabled(true);
						el.callback(function(){
							me.deleteSelection();
						});
					};
					
					el = menu.getMenu('duplicate');
					if(el){
						el.callback(function(){
							console.warn('TODO : Duplicate selection');
						});
					};
					
					el = menu.getMenu('cut');
					if(el){
						el.callback(function(){
							var sel = me.nodes();
							me.unselectNode();
							me.mWorksheet.cut(sel);
						});
					};

					el = menu.getMenu('copy');
					if(el){
						el.callback(function(e){
							me.mWorksheet.copy(me);
						});
					};

					el = menu.getMenu('breaklinks');
					if(el){
						oldF['breaklinks'] = el.callback();
						el.callback(function(){
							me.mWorksheet.startSequence()
								.enableSequence(false)
							me.nodes().each(function(e){
								oldF['breaklinks'].call(this, e);
							});
							me.mWorksheet.enableSequence()
								.stopSequence();
						});
					};

					el = menu.getMenu('selectlinked');
					if(el){
						oldF['selectlinked'] = el.callback();
						el.callback(function(){
							me.nodes().each(function(e){
								oldF['selectlinked'].call(this, e);
							});
						});
					};
					
				});

				
				// To be able to drag a unselected node, we need to put it in mSelection before.
				// So, the only place to do this is when the user press down the mouse button on the node
				node.on('mousedown.selection', function(e){
					var selected;
					
					me.mWorksheet.focus();
					
					if(e.button == 2) // right button is reserved for panning
						return;

					selected = me.isSelectedNode(this);
					
					// we check if user hold down the Ctrl key before selecting the node
					if(!e.ctrlKey && !selected){
						me.unselectNode();
						me.selectNode(this);
					}
					else if(e.ctrlKey && selected)
						me.unselectNode(this);
					else
						me.selectNode(this);
					
					// if drag plugin is available, we send to it the mouse event to start dragging 
					// in case of the user move the mouse when the button is down
					// stop event propagation to avoid dragstart triggered twice
					if(me.getDragHandler()){
						me.getDragHandler().start(e);
						e.stopPropagation();
						e.stopImmediatePropagation();
					}
				});

				
				// do some stuff for Node context menu
				// no menu is shown is this method
				// real context menu is triggered by 'exsvg.menu.js'
				// and catched on event 'menu' in worksheet
				node.on('contextmenu.selection', function(e){
					if(!me.isSelectedNode(this))
						me.unselectNode();
					if(!dragPoint)
						me.selectNode(node);
				});
				
			});
			/*
			me.doc().on('before-paste.selection', function(){
				me.unselectNode();
			});
			*/
			me.doc().on('paste.selection', function(e){
				me.unselectNode();
				me.selectNode(e.detail.data);
			});
			
			
			// remove node from selection before removing from SVG
			// needed because transformations are applied when node is in selection SVG.G
			// and when we reput it via undo/redo, transformations are lost
			me.doc().on('node-remove.selection', function(e){
				me.unselectNode(e.detail.node);
			});

			
			// Handle some keyboard shortcut
			SVG.on(window, 'keydown.selection', function(e){
				if(!me.mWorksheet.hasFocus())
					return;
				
				if(e.keyCode == 46){ //delete
					me.deleteSelection();
				}
				else if(e.keyCode == 65 && e.ctrlKey){ //Ctrl+A
					console.log('ctrl+A');
					me.selectNode();
					e.preventDefault();
					e.stopPropagation();
					e.stopImmediatePropagation();
				}
			});
		}
	}
});


exSVG.plugin(exSVG.Worksheet, {

	init: function(options) {
		var me = this;
		
		// initialize the selection SVG group
		// when a node is selected by the user, he is putted is this group
		// and when is unselected he will be removed from this group and go back in the nested SVG (Worksheet)
		me.mSelection = new exSVG.Selection().addClass('selection').addTo(me).init(me);
			
		return me;
	},

	unselectNode: function(el){
		return this.mSelection.unselectNode(el);
	},
	
	selectNode: function(el){
		return this.mSelection.selectNode(el);
	},
	
	getSelection: function(){
		return this.mSelection;
	},
	
	deleteSelection: function(){
		var me = this
		, sel = me.getSelection()
		, out = new SVG.Set;
		
		// we start a sequence because we want only one undo action for all deleted nodes
		me.startSequence('Selection.deleteSelection');
		sel.each(function(){
			if(!this)
				return;
			me.unselectNode(this);
			if(this.remove())
				out.add(this);
		});
		me.doc().fire('selection-remove', {selection: out});
		me.stopSequence('Selection.deleteSelection');
		return me;
	}
})

}());
