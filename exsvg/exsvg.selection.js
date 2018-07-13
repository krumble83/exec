;(function() {
"use strict";


function toParent(node, parent){
    var ctm = node.screenCTM();
    var pCtm = parent.screenCTM().inverse();
	parent.put(node);
	node.untransform().transform(pCtm.multiply(ctm));
}


SVG.extend(exSVG.Worksheet, {

	initSelection: function(options) {
		var me = this;
		
		//add the node selection marquee gradient to the svg defs
		// we can customize it in the css with #selectionHandlerStroke
		me.gradient('linear', function(stop) {
			stop.at(0, '#f1b000');
			stop.at(1, '#ce6d00');
			stop.from(0, 0).to(0, 1);
		}).id('selectionHandlerStroke');
		
		me.attr('tabindex', -1);
		me.setFocus();

		//initialize the selection SVG group
		// when a node is selected by the user, he is putted is this group
		// and when is unselected he will be removed from this group and go back in the nested SVG (Workesheet)
		me.mSelection = me.group()
			.addClass('selection')
			
		// if drag plugin is available, we can drag all seleted nodes
		// so make selection SVG group draggable
		// we are snapping the movment to the grid (if available)
		if(me.mSelection.draggable)
			me.mSelection.draggable((typeof me.snapToGrid === 'function') ? me.snapToGrid : undefined);

		me.initSelectionEventHandlers();
		return me;
	},
	
	initSelectionEventHandlers: function(){
		//console.log('Selection.initSelectionEventHandlers()');
		var me = this
		, selectionRect
		, dragPoint;

		me.mSelection.on('dragstart.selection', function(e){
			//console.log('Selection:dragstart.selection');
			
			// to check if nodes really moving and to get the delta of the drag movement, we need to store the start drag position
			dragPoint = e.detail.p;
		})
		.on('dragmove.selection', function(e){
			//console.log('selection.dragmove', e);
			var selection = me.getSelection();
			
			// make all nodes to don't react a mouse events (over)
			me.addClass('blur');
			//me.select('.exNode').addClass('unfocusable');

			selection.fire('move', {event:e});
			if(!dragPoint.dragged)
				selection.fire('move-start', {event:e});
			
			// because drag plugin suck, if the user press down the mouse button but not move it,
			// the plugin still throw a dragend event when the mouse button is released
			// if we don't be aware of this, the undo/redo framework register a move event but nothing was happened
			dragPoint.dragged = true;
		})
		.on('dragend.selection', function(e){
			//console.log('selection.dragend');
			var selection
			, movement;

			// make all nodes to react a mouse events (over)
			me.removeClass('blur');
			//me.select('.exNode').removeClass('unfocusable');			
			
			// first, we stop all propagation of the initial mouse event (mouse up)
			// given by the drag plugin in e.detail.event
			e.detail.event.stopImmediatePropagation();
			e.detail.event.stopPropagation();
			
			//if no move happen, return (see on('dragmove') above)
			if(!dragPoint.dragged){
				dragPoint = null;
				return;
			}
			
			// we get all moved nodes
			// normaly it's all nodes in the SVG selection group
			selection = me.getSelection();

			// movement is the delta between start drag position and stop drag position
			movement = me.snapToGrid(e.detail.p.x - dragPoint.x, e.detail.p.y - dragPoint.y);

			//me.doc().fire('selection-moved', {selection: selection, movement: movement});
			
			// we start a sequence because we want only one undo/redo action for all moved nodes
			// see undo/redo framework for more
			me.startSequence();
			selection.each(function(){
				this.fire('dragend', {event: e});
				me.doc().fire('node-moved', {node: this, movement: movement});
			});
			me.stopSequence();
			dragPoint = null;
		});

		// Rectangle selection stuff
		me.doc().on('mousedown.selection-rectangle', function(e){
			//console.log('selection.mousedown');
			var coordsCache = {}
			, nodes = false
			, box
			, x1
			, x2;
			
			me.setFocus();

			// first we checking if the mouse button is valid, selection rectangle working only with left button
			// after, we check if selectionRect is not allready assigned, in normal condition he's not, but in case a bug (multiple rectangle selection ?)
			// and finnaly, if we have the grid, we check if we are on
			if(e.buttons != 1 || selectionRect || (me.getGrid() && e.target != me.mGrid.node))
				return;

			//e.stopPropagation()
			//e.stopImmediatePropagation()
			
			if(!e.ctrlKey && !e.shiftKey)
				me.unselectNode();
			
			selectionRect = me.rect().addClass('marquee');
			
			nodes = me.select('.exNode');
			
			// to check if a node is in the selection rectangle we need it's coordinates (x, y, w, h)
			// put in cache all node position and size to avoid performances issues
			nodes.each(function(){
				var box = this.rbox();
				var x1 = this.parent(exSVG.Workesheet).point(box);
				var x2 = this.parent(exSVG.Workesheet).point(box.x + box.w, box.y + box.h);
				//console.log(p);
				coordsCache[this.id()] = {x1:x1.x, y1:x1.y, x2:x2.x, y2:x2.y};
				
				// adding class .unfocusable on each node only for visual effect (pins not hightligth when dragging rectangle)
				me.addClass('blur');
				//this.addClass('unfocusable');
			});

			// before drawing, we initialize all event handlers
			// handler when user release mouse button when selection rectangle is drawing
			me.doc().on('mouseup.selection-rectangle-handler', function(e){
				//console.log('selection:rectangle-selection.mouseup');
				selectionRect.draw('stop', e); // stop drawind rectangle
				selectionRect.off(); // remove all events handlers
				selectionRect.remove(); // remove rectangle from DOM
				selectionRect = null;
				me.removeClass('blur');
				//nodes.removeClass('unfocusable'); // remove class unfocusable on all nodes
				me.doc().off('.selection-rectangle-handler');  // remove this event handler from doc()
			});
			
			// handler when the selection rectangle is updated, see drawing svg plugin
			selectionRect.on('drawupdate.selection', function(){
				// here we check if each node is in the selection rectangle
				// actually we check only if one of it's four corners is in
				// in future we can check for middle point border too
				nodes.each(function(){
					var coords = coordsCache[this.id()];
					if(selectionRect.inside(coords.x1, coords.y1) 
							|| selectionRect.inside(coords.x2, coords.y1) 
							|| selectionRect.inside(coords.x1, coords.y2) 
							|| selectionRect.inside(coords.x2, coords.y2))
						me.selectNode(this);
							
					// if the user not hold the ctl key, we unselect the node, because he's not in the selection rectangle
					else if(!e.ctrlKey)
						me.unselectNode(this);
				});
				selectionRect.front();
			});

			//start drawing selection rectangle
			selectionRect.draw(e);
		});

		
		// prevent initializing dragging of single node (from Worksheet class)
		// because we want to drag all selected nodes and not only one
		me.doc().off('node-add.worksheet-dragnode');

		
		//when we add a node in the document, we need to do some stuff
		me.doc().on('node-add.selection', function(e){
			//console.log('selection:nodeadd');
			var node = e.detail.node;
			
			//me.unselectNode();
			//me.selectNode(node);
			
			// here we are transforming the node context menu to adapt some action on all selected nodes
			// instead of one node
			node.on('menu.selection', function(e){
				var menu = e.detail.menu
				,el = menu.getMenu('delete');
				
				if(el){
					if(!el.enabled() && me.getSelection().length() > 1)
						el.enabled(true);
					el.callback(function(){
						me.deleteSelection();
					});
				};
				
				el = menu.getMenu('rename');
				if(el && me.getSelection().length() > 1)
					el.enabled(false);

				el = menu.getMenu('duplicate');
				if(el){
					el.callback(function(){
						console.warn('TODO : Duplicate selection');
					});		
				};
				
				el = menu.getMenu('cut');
				if(el){
					el.callback(function(){
						var sel = me.getSelection();
						me.unselectNode();
						me.cut(sel);
					});		
				};

				el = menu.getMenu('copy');
				if(el){
					el.callback(function(){
						me.copy(me.getSelection());
					});		
				};

			});

			
			// To be able to drag a unselectd node, we need to put it in mSelection Group before
			// so, the only place to do this is when the user press down the mouse button on the node
			node.on('mousedown.selection', function(e){
				var selected;
				
				me.setFocus();
				
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
				if(me.mSelection.getDragHandler()){
					me.mSelection.getDragHandler().start(e);
					e.stopPropagation();
					e.stopImmediatePropagation();
				}
			});

			
			// do some stuff for Node context menu
			node.on('contextmenu.selection', function(e){
				if(!me.isSelectedNode(this))
					me.unselectNode();
				if(!dragPoint)
					me.selectNode(node);
			});
			
		});

		me.doc().on('before-paste.selection', function(){
			me.unselectNode();
		});


		me.doc().on('paste.selection', function(e){
			console.log(e.detail);
			var selection = e.detail.data;
			me.selectNode(selection);
		});
		
		
		// remove node from selection before removing from SVG
		// needed because transformations are applied when node is in selection SVG.G
		// and when we reput it via undo/redo, transformations are lost
		me.doc().on('node-remove.selection', function(e){
			//console.log('selection:node-remove', me);
			me.unselectNode(e.detail.node);
		});

		
		// Handle some keyboard shortcut
		me.doc().on('keyup.selection', function(e){
			//console.log('selection.keyup', e);
			if(e.keyCode == 46){ //delete
				me.deleteSelection();
			}
			else if(e.keyCode == 65 && e.ctrlKey){ //Ctrl+A
				me.selectNode();
				e.preventDefault();
				e.stopPropagation();
				e.stopImmediatePropagation();
			}
			else if(e.keyCode == 67 && e.ctrlKey){ //Ctrl+C
				me.copy(me.getSelection());
			}
			else if(e.keyCode == 88 && e.ctrlKey){ //Ctrl+X
				var sel = me.getSelection();
				me.unselectNode();
				me.cut(sel);
			}
		});
	},
	
	
	// Clipboard plugin handle cut/copy/paste of nodes only
	// here, we need to cut/copy/paste links too
	// it's the purpose of this method
	exportSelection: function(){
		var me = this
		, selection = me.getSelection();
		
	},
		
	hasSelection: function(){
		return this.mSelection;
	},
	
	setFocus: function(){
		if(this.node.focus)
			this.node.focus();
	},
	
	unselectNode: function(el){
		var me = this;
		if(!el){
			var sel = me.getSelection();
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

		if(el.parent() == me || !el.parent())
			return;
		toParent(el, me);
		me.fire('node-unselected', {node: el});
		if(me.getGrid)
			me.getGrid().back();
	},
	
	selectNode: function(el){
		var me = this;
		if(!el){
			me.select('.exNode').each(function(){
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
		if(el.parent() == this.mSelection)
			return;
		toParent(el, me.mSelection);
		me.fire('node-selected', {node: el});
		me.mSelection.front();
		if(me.getGrid)
			me.getGrid().back();
		me.setFocus();
	},
	
	isSelectedNode: function(node){
		return node.parent() == this.mSelection;
	},
	
	getSelection: function(){
		return this.mSelection.select('.exNode');
		//return this.mSelection;
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
	},
	
	pointz: function(x, y){
		
	}
})

exSVG.Worksheet.prototype.plugins.selection = {name: 'Selection', initor: 'initSelection'}

}());