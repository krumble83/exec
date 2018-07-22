;(function() {
"use strict";

var UndoManager = function() {

	var commands = [],
		index = -1,
		limit = 0,
		isExecuting = false,
		callback,
		sequences = [],
		isSequence = false,
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

		add: function (command) {
			if (isExecuting)
				return this;
					
			// if we are here after having called undo,
			// invalidate items higher on the stack
			while(commands.length > index+1){
				execute(commands.pop(), 'destroy');
			}
			//commands.splice(index + 1, commands.length - index);

			//if we are in a sequence, push the current action 
			if(isSequence){
				sequences.push(command);
				return;
			}

			commands.push(command);
			
			// if limit is set, remove items from the start
			if (limit && commands.length > limit) {
				execute(commands.shift(), 'destroy');
				//removeFromTo(commands, 0, -(limit+1));
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
				},
				destroy: function(){
					// destroy sequence in reverse order
					for(var a=seqs.length-1; a > -1; a--)
						execute(seqs[a], 'destroy');					
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
		var me = this
			, bar;

		me.sequenceEnabled = true;
				
		if(me.getTitleBar){
			bar = me.getTitleBar();
			assert(bar instanceof SVG.G);
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
		
		return me;
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
});


exSVG.plugin(exSVG.Node, {
	init: function(){
		var me = this
		, worksheet = me.parent(exSVG.Worksheet);
		
		me.on('add.undo', function(){
			undoManager.add({
				undo: function() {
					//console.group('Undo:node-add(undo)');
					me.fire('before-remove');
					me.parent().removeElement(me);
					me.fire('remove');
				},
				redo: function() {
					//console.group('Undo:node-add(redo)');
					worksheet.put(me);
					me.fire('add');
				},
				destroy: function() {
					me.destroy();
				}
			});			
			worksheet.updateUndoButtons();
		});
		
		me.on('remove.undo', function(e){
			//console.log('undo:node-remove.undo');
			undoManager.add({
				undo: function() {
					//console.group('Undo:node-remove(undo)');
					worksheet.put(me);
					me.fire('add');
					//console.groupEnd();
				},
				redo: function() {
					//console.group('Undo:node-remove(redo)');
					me.fire('before-remove');
					me.parent().removeElement(me);
					me.fire('remove');
					//console.groupEnd();
				},
				destroy: function() {
					me.destroy();
				}
			});			
			worksheet.updateUndoButtons();
		});		
		
		me.on('moved.undo', function(e){
			var move = e.detail.movement;
			
			undoManager.add({
				undo: function() {
					me.dmove(-move.x, -move.y);
				},
				redo: function() {
					me.dmove(move.x, move.y);
				}
			});			
			worksheet.updateUndoButtons();
		});		
	}
});

exSVG.plugin(exSVG.Link, {
	init: function(){
		var me = this
			, worksheet = me.parent(exSVG.Worksheet);
		
		me.on('add.undo', function(e){
			undoManager.add({
				undo: function() {
					me.parent().removeElement(me);
					me.fire('remove');
				},
				redo: function() {
					worksheet.getLinksLayer().put(me);
					me.fire('add');
				},
				destroy: function() {
					me.destroy();
				}
			});			
			worksheet.updateUndoButtons();
		});
		
		me.on('remove.undo', function(e){
			undoManager.add({
				undo: function() {
					me.opacity(1);					
					worksheet.getLinksLayer().put(me);
					me.fire('add');
				},
				redo: function() {
					me.parent().removeElement(me);
					me.fire('remove');
				},
				destroy: function() {
					me.destroy();
				}
			});
			worksheet.updateUndoButtons();
		});
		
	}
});

}());
