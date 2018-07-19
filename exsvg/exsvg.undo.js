;(function() {
"use strict";


function removeFromTo(array, from, to) {
	array.splice(from,
		!to ||
		1 + to - from + (!(to < 0 ^ from >= 0) && (to < 0 || -1) * array.length));
	return array.length;
}

var UndoManager = function() {

	var commands = [],
		index = -1,
		limit = 0,
		isExecuting = false,
		callback,
		sequences = [],
		isSequence = false,
		
		// functions
		execute;

	execute = function(command, action) {
		if (!command || typeof command[action] !== "function") {
			return this;
		}
		isExecuting = true;

		command[action]();

		isExecuting = false;
		return this;
	};

	return {

		/*
		Add a command to the queue.
		*/
		add: function (command) {
			if (isExecuting) {
				return this;
			}
			
			//if we are in a sequence, push the current action 
			if(isSequence){
				sequences.push(command);
				return;
			}
			
			// if we are here after having called undo,
			// invalidate items higher on the stack
			commands.splice(index + 1, commands.length - index);

			commands.push(command);
			
			// if limit is set, remove items from the start
			if (limit && commands.length > limit) {
				removeFromTo(commands, 0, -(limit+1));
			}
			
			// set the current index to the end
			index = commands.length - 1;
			if (callback) {
				callback();
			}
			return this;
		},
		
		startSequence: function(name){
			isSequence = true;
		},
		
		stopSequence: function(name){
			isSequence = false;

			if(sequences.length == 0)
				return;
			var seqs = sequences;
			
			undoManager.add({
				undo: function(){
					// undo sequence in reverse order
					for(var a=seqs.length-1; a > -1; a--)
						execute(seqs[a], 'undo');
				},
				redo: function(){
					// redo sequence in normal order
					for(var a=0; a < seqs.length; a++)
						execute(seqs[a], 'redo');					
				}
			});
			sequences = [];
		},

		undo: function () {
			var command = commands[index];
			if (!command)
				return this;

			execute(command, 'undo');
			index -= 1;
			return this;
		},

		redo: function () {
			var command = commands[index + 1];
			if (!command)
				return this;

			execute(command, "redo");
			index += 1;
			return this;
		},

		clear: function () {
			var prev_size = commands.length;

			commands = [];
			index = -1;
		},

		hasUndo: function () {
			return index !== -1;
		},

		hasRedo: function () {
			return index < (commands.length - 1);
		},
		
		setLimit: function (l) {
			limit = l;
		}
	};
};

var undoManager = new UndoManager();


exSVG.plugin(exSVG.Worksheet, {

	init: function() {
		var me = this;
		me.sequenceEnabled = true;
				
		if(me.getTitleBar){
			var bar = me.getTitleBar();
			console.assert(bar instanceof SVG.G);
			me.mUndoIcon = bar.image('exsvg/img/undo.png')
				.move(10,3)
				.addClass('undoredo undo disabled')
				.on('click.undo', function(e){
					me.undo();
					e.stopPropagation();
					e.stopImmediatePropagation();					
				});

			me.mRedoIcon = bar.image('exsvg/img/redo.png')
				.move(50,3)
				.addClass('undoredo redo disabled')
				.on('click.undo', function(e){
					me.redo();
					e.stopPropagation();
					e.stopImmediatePropagation();
				});
			bar.select('text').move(100,0);
		}

		me.doc().on('keydown.undo', function(e){
			if(!me.hasFocus())
				return;
			if(e.keyCode == 90 && e.ctrlKey){ //Ctrl+Z
				undoManager.undo();
			}
			else if(e.keyCode == 89 && e.ctrlKey){ //Ctrl+Y
				undoManager.redo();
			}
		});
		
		me.doc().on('node-add.undo', function(e){
			//console.log('undo:node-add.undo')
			var node = e.detail.node;
			undoManager.add({
				undo: function() {
					//console.group('Undo:node-add(undo)');
					node.fire('before-remove');
					node.parent().removeElement(node);
					node.fire('remove');
					//node.remove(false);
					//console.groupEnd();
				},
				redo: function() {
					//console.group('Undo:node-add(redo)');
					me.put(node);
					node.fire('add');
					//node.addTo(me, false);
					//console.groupEnd();
				}
			});			
			me.updateUndoButtons();
		});
		
		me.doc().on('node-remove.undo', function(e){
			//console.log('undo:node-remove.undo');
			
			var node = e.detail.node;
			undoManager.add({
				undo: function() {
					//console.group('Undo:node-remove(undo)');
					me.put(node);
					node.fire('add');
					//console.groupEnd();
				},
				redo: function() {
					//console.group('Undo:node-remove(redo)');
					node.fire('before-remove');
					node.parent().removeElement(node);
					node.fire('remove');
					//console.groupEnd();
				}
			});			
			me.updateUndoButtons();
		});
		
		me.doc().on('node-moved.undo', function(e){
			//console.log('undo:node-moved');
			var node = e.detail.node;
			var move = e.detail.movement;
			undoManager.add({
				undo: function() {
					node.dmove(-move.x, -move.y);
				},
				redo: function() {
					node.dmove(move.x, move.y);
				}
			});			
			me.updateUndoButtons();
		});
		
		me.doc().on('link-add.undo', function(e){
			//console.log('undo.link-add');
			var link = e.detail.link;
			undoManager.add({
				undo: function() {
					//console.group('Undo:link-add(undo)');
					link.parent().removeElement(link);
					link.fire('remove');
					//console.groupEnd();
					//link.remove(false);
				},
				redo: function() {
					//console.group('Undo:link-add(redo)');
					me.getLinksLayer().put(link);
					link.fire('add');
					//console.groupEnd();
					//link.addTo(me.getLinksLayer(), false);
				}
			});			
			me.updateUndoButtons();
		});
		
		me.doc().on('link-remove.undo', function(e){
			//console.log('undo.link-remove');
			var link = e.detail.link;
			undoManager.add({
				undo: function() {
					//console.group('Undo:link-remove(undo)');
					
					// see exSVG.Pin.addLink (link removed when a blur is applied to all links)
					link.opacity(1);					
					
					me.getLinksLayer().put(link);
					link.fire('add');
					//console.groupEnd();
					//link.addTo(, false);
				},
				redo: function() {
					//console.group('Undo:link-remove(redo)');
					link.parent().removeElement(link);
					link.fire('remove');
					//console.groupEnd();
					//link.remove(false);
				}
			});
			me.updateUndoButtons();
		});
		
		return this;
	},
	
	startSequence: function(name){
		var me = this;
		if(!me.sequenceEnabled)
			return;
		if(typeof name === 'function'){
			undoManager.startSequence();
			name();
			undoManager.stopSequence();
		}
		else
			undoManager.startSequence();
		return me;
	},
	
	stopSequence: function(){
		var me = this;
		if(!me.sequenceEnabled)
			return;
		undoManager.stopSequence();
		return me;
	},
	
	enableSequence: function(enable){
		var me = this;
		me.sequenceEnabled = (typeof enable !== 'undefined') ? enable : true;
		return me;
	},

	undo: function(viewbox){
		var me = this;
		undoManager.undo();
		me.updateUndoButtons();
		me.fire('undoredo-undo');
	},
	
	redo: function(){
		var me = this;
		undoManager.redo();
		me.updateUndoButtons();
		me.fire('undoredo-redo');
	},
	
	clearUndo: function(){
		var me = this;
		undoManager.clear();		
		me.updateUndoButtons();
	},
	
	updateUndoButtons: function(){
		var me = this;
		if(undoManager.hasUndo())
			me.mUndoIcon.removeClass('disabled');
		else
			me.mUndoIcon.addClass('disabled');

		if(undoManager.hasRedo())
			me.mRedoIcon.removeClass('disabled');
		else
			me.mRedoIcon.addClass('disabled');		
	},
	
	destroyUndo: function(){
		me.doc().off('.undo');
		me.mUndoIcon.off();
		me.mRedoIcon.off()
	}
})


//SVG.Nested.prototype.startSequence = start;

//exSVG.Worksheet.prototype.plugins.undo = {name: 'Undo Framework', initor: 'initUndo'};

}());
