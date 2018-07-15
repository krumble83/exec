;(function() {
"use strict";


exSVG.PinEditorBase = SVG.invent({
    create: 'foreignObject', 
    inherit: SVG.ForiegnObject,
	
    extend: {
        init: function(){
			var me = this;
			me.width(20).height(22);
			return me;
        },
		
		getValue: function(){
		},
		
		setValue: function(value){
			
		},
		
		draw: function(){
			var me = this
			, pin = me.parent(exSVG.Pin);
			
			if(pin.hasClass('linked'))
				me.hide();
			else
				me.show();

		},
		
		destroy: function(){
			this.off();
			this.remove();
		}
	}
});



exSVG.PinEditorInput = SVG.invent({
    create: 'foreignObject', 
    inherit: exSVG.PinEditorBase,
	
    extend: {
		
		init: function(){
			var me = this
			, pin = me.parent(exSVG.Pin)
			, editor = exLIB.getDataType2(pin.getDataType()).Editor();
			
			exSVG.PinEditorBase.prototype.init.apply(me, arguments);
			
			function update(e){
				e.stopPropagation();
				e.stopImmediatePropagation();
				me.width(Math.min(me.input.clientWidth + 4, 300));
				me.height(Math.min(me.input.clientHeight, 150) + 4);
				pin.getNode().paint();
				pin.fire('field-change');
			}

			pin.addClass('exPinTextInput')
			
			me.appendChild('div', {class : 'textareaWrapper'})
				.on('mousedown', function(e){
					e.stopImmediatePropagation();
					e.stopPropagation();
				})
				.on('mousemove', function(e){
					e.stopImmediatePropagation();
					e.stopPropagation();
				});

			me.getChild(0).setAttribute('class', 'textareaWrapper');
			me.input = me.getChild(0).appendChild(document.createElement('div'));
			me.input.setAttribute('contenteditable', 'true');
			me.input.setAttribute('class', 'textarea');
			
			me.input.onfocus = function(e) {
				requestAnimationFrame(function() {
					var range = document.createRange();
					range.selectNodeContents(me.input);
					var sel = window.getSelection();
					sel.removeAllRanges();
					sel.addRange(range);
				});
			};

			SVG.on(me.input, 'keydown', function(e){
				if(typeof editor.data('keydown') === 'function')
					editor.data('keydown').call(me, e, me.input);
				update.call(me, e);
			});
			SVG.on(me.input, 'keyup', update);
						
			return me;
		},
		
		getValue: function(){
			return me.input.innerHTML;
		},
		
		setValue: function(value){
			if(me.input)
				me.input.innerHTML = value;
		},
		
		draw: function(){
			var me = this
			, pin = me.parent(exSVG.Pin);
			
			exSVG.PinEditorBase.prototype.draw.apply(me, arguments);
			
			if(pin.hasClass('linked') && typeof me.input != 'undefined'){
				me.input.innerHTML = '';
				me.width(20).height(22);
			}
			
		},
		
		destroy: function(){
			if(this.input)
				SVG.off(this.input);
			SVG.off(this.getChild(0));
			return exSVG.PinEditorBase.prototype.destroy.apply(this, arguments);
		}
	}
});



exSVG.PinEditorBool = SVG.invent({
    create: 'foreignObject', 
    inherit: exSVG.PinEditorBase,
	
    extend: {
		
		init: function(){
			var me = this
			, pin = me.parent(exSVG.Pin);
			
			exSVG.PinEditorBase.prototype.init.apply(me, arguments);
			
			pin.addClass('exPinBoolInput')
			
			me.appendChild('input', {type: 'checkbox'})
				.style('pointer-events', 'all')
				.on('mousedown', function(e){
					e.stopImmediatePropagation();
					e.stopPropagation();
				})
				.on('mouseup', function(e){
					e.stopImmediatePropagation();
					e.stopPropagation();
				});
			me.input = me.getChild(0);	
			return me;
		},
		
		getValue: function(){
			return me.input.innerHTML;
		},
		
		setValue: function(value){
			if(me.input)
				me.input.innerHTML = value;
		},
		
		draw: function(){
			var me = this
			, pin = me.parent(exSVG.Pin);
			
			exSVG.PinEditorBase.prototype.draw.apply(me, arguments);
			
			if(pin.hasClass('linked') && typeof me.input != 'undefined'){
				me.input.checked = false;
				me.width(20).height(22);
			}
			
		},
		
		destroy: function(){
			console.warn('TODO: implements exSVG.PinEditorSelect.destroy()');
			return exSVG.PinEditorBase.prototype.destroy.apply(this, arguments);
		}
	}
});



exSVG.PinEditorSelect = SVG.invent({
    create: 'foreignObject', 
    inherit: exSVG.PinEditorBase,
	
    extend: {
		
		init: function(){
			var me = this
			, pin = me.parent(exSVG.Pin)
			, type = exLIB.getDataType2(pin.getDataType());
			
			exSVG.PinEditorBase.prototype.init.apply(me, arguments);
			me.width(100);
			pin.addClass('exPinSelectInput')
			
			me.appendChild('select')
				.style('pointer-events', 'all')
				.on('mousedown', function(e){
					e.stopImmediatePropagation();
					e.stopPropagation();
				})
				.on('mousemove', function(e){
					e.stopImmediatePropagation();
					e.stopPropagation();
				})
				.on('mouseup', function(e){
					e.stopImmediatePropagation();
					e.stopPropagation();
				})
				.on('click', function(e){
					e.stopImmediatePropagation();
					e.stopPropagation();
				})
				.on('change', function(e){
					me.fire('field-change', {e: e});
				});
			me.input = me.getChild(0);
			
			//console.log(type.Values());
			var o;
			JSON.parse(type.Values() || '[]').forEach(function(val){
				o = document.createElement('option');
				o.innerText = val;
				me.input.appendChild(o);
			});
			me.width(me.input.offsetWidth);
			return me;
		},
		
		getValue: function(){
			return me.input.innerHTML;
		},
		
		setValue: function(value){
			if(me.input)
				me.input.innerHTML = value;
		},
		
		draw: function(){
			var me = this
			, pin = me.parent(exSVG.Pin);
			
			exSVG.PinEditorBase.prototype.draw.apply(me, arguments);
			
			if(pin.hasClass('linked') && typeof me.input != 'undefined'){
				me.input.checked = false;
				me.width(20).height(22);
			}
			
		},
		
		destroy: function(){
			console.warn('TODO: implements exSVG.PinEditorSelect.destroy()');
			return exSVG.PinEditorBase.prototype.destroy.apply(this, arguments);
		}
	}
});

}).call(this);