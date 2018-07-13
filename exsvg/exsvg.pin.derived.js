;(function() {
"use strict";

/*********************************************
	Wildcards pin
*********************************************/

exSVG.WildcardsSet = SVG.invent({
	create: function(members) {
		Array.isArray(members) ? this.members = members : this.clear()
	},
	inherit : SVG.Set,
	extend: {
		preventDefault: function(){
			this.defaultPrevented = true;
		}
	}
});


exSVG.PinWildcards = SVG.invent({
	create: 'g',
	inherit : exSVG.Pin,
	
	extend: {
	
		init: function(data){
			var me = this;
			
			exSVG.Pin.prototype.init.apply(this, arguments);
			me.setData('ctor', 'PinWildcards');
			me.setData('isWildcards', 1);
			me.setDataType(exLIB.getWildcardsDataType());
									
			if(data.group)
				me.setData('group', data.group);
			return me;
		},
		
		addLink: function(link){
			//console.log('ttt');
			var me = this
			, set = new exSVG.WildcardsSet
			, datatype = link.getDataType()
			, oPin = link.getOtherPin(me);
			
			exSVG.Pin.prototype.addLink.apply(this, arguments);

			if(exLIB.isWildcardsDataType(datatype) && !exLIB.isWildcardsDataType(oPin.getDataType()))
				datatype = oPin.getDataType();
			
			me.checkDataTypeChange(datatype, set);
			if(!set.defaultPrevented){
				set.each(function(){
					this.setDataType(datatype);
				});
			}
			me.getNode().paint();
		},
		
		removeLink: function(link){
			var me = this
			, set = new exSVG.WildcardsSet
			
			exSVG.Pin.prototype.removeLink.apply(this, arguments);

			me.checkDataTypeChange(exLIB.getWildcardsDataType(), set);
			if(!set.defaultPrevented){
				set.each(function(){
					this.setDataType(exLIB.getWildcardsDataType());
				});
			}
			me.getNode().paint();
		},

		/*
			This function check if all pins can change their dataType
		*/
		checkDataTypeChange : function(datatype, set){
			var me = this
			, group = me.getData('group')
			, pins
			, pin
			, links;
			
			// To avoid infinite loop, we check if pin is already in Set
			if(set.has(me))
				return;
			
			// Else, add pin to the Set
			set.add(me);

			// check for other pins if current pin is in a group
			if(group){
				pins = me.getNode().select('.exPin[data-group="' + group + '"]');
				pins.each(function(){
					if(this.checkDataTypeChange)
						this.checkDataTypeChange(datatype, set);
					else if(this.getDataType() != datatype && exLIB.swapArrayDataType(me.getDataType()) != datatype)
						set.preventDefault();
				});
			}
			
			// check for links attached to this pin
			links = me.parent(exSVG.Worksheet).select('.exLink[data-pinIn="' + me.id() + '"],.exLink[data-pinOut="' + me.id() + '"]');
			links.each(function(){
				pin = this.getOtherPin(me);
				console.assert(pin instanceof exSVG.Pin);
				set.add(this);
				if(pin.checkDataTypeChange)
					pin.checkDataTypeChange(datatype, set);
				else if(pin.getDataType() != datatype && exLIB.swapArrayDataType(pin.getDataType()) != datatype)
					set.preventDefault();
			});
		},
		
		setDataType: function(datatypeid){
			var me = this
			, libdatatype = exLIB.getDataType2(datatypeid);
			
			if(me.getDataType() == datatypeid || exLIB.swapArrayDataType(datatypeid) == me.getDataType())
				return;
			
			if(me.mGfx.editor){
				me.mGfx.editor.remove();
				me.mGfx.editor = undefined;
			}
			
			// Event used by exsvg.pin.gfx to create/update editor
			me.fire('changeDatatType');
			
			if(exLIB.isArrayDataType(me.getDataType()) != exLIB.isArrayDataType(datatypeid))
				datatypeid = exLIB.swapArrayDataType(datatypeid);
			
			exSVG.Pin.prototype.setDataType.call(this, datatypeid);
		}
	}
});



/*********************************************
	Structure Pin
*********************************************/
exSVG.PinStructure = SVG.invent({
    create: 'g', 
    inherit: exSVG.Pin,
	
    extend: {
		init: function(){
			var me = this
			, node = me.parent(exSVG.Node)
			, datatype
			, type;
			
			me.setData('ctor', 'PinStructure');
			exSVG.Pin.prototype.init.apply(me, arguments);
			
			datatype = exLIB.getDataType2(me.getDataType());
			
					
			me.on('menu.pinstructure', function(e){
				var menu = e.detail.menu
				
				var rem = menu.addItem('Split Struct Pin', 'split', function(){
					console.log();
					var pins = datatype.select('pin')
					, pos = me.y()
					, pin
					, importer = me.getType() == exSVG.Pin.PIN_IN ? node.importInput : node.importOutput
					
					pins.each(function(){
						pin = importer.call(node, this);
						pin.after(me);
						pin.setId(me.getId() + '-' + pin.getId());
						pin.move(0, pos);
						
						pin.on('menu', function(ee){
							var cmenu = ee.detail.menu;
							var rec = cmenu.addItem('Recombine Struct Pin', 'recombine', function(){
								// check if any pin is linked
								if(node.select('.exPin.linked[id^="' + node.id() + '-' + me.getId() + '-"]').length() > 0)
									return false;
								
								node.select('.exPin[id^="' + node.id() + '-' + me.getId() + '-"]').each(function(){
									this.remove();
								});
								me.show();
							});
							if(node.select('.exPin.linked[id^="' + node.id() + '-' + me.getId() + '-"]').length() > 0)
								rec.enabled(false);
						});
						
						pos += pin.bbox().height+4;
					});
					me.hide();
					node.paint();
				});				
				
			});
			
			return me;
		}
	}
	
});


/*********************************************
	Exec pin
*********************************************/
exSVG.PinExec = SVG.invent({
    create: 'g', 
    inherit: exSVG.Pin,
	
    extend: {
		
		init: function(){
			var me = this;
			exSVG.Pin.prototype.init.apply(me, arguments);
			me.addClass('exPinExec');
			return me;
		},

		acceptLink: function(pin){
			var ret = exSVG.Pin.prototype.acceptLink.apply(this, arguments);
			if(pin.getDataType() !== exLIB.getExecDataType())
				ret += exSVG.Pin.PIN_LINK_ACCEPT_DATATYPE;
			return ret;
		},

		drawPin: function(x, y, color, size){
			var me = this
			, ret;
			
			if(!me.mGfx.pin){
				me.mGfx.pin = me.polygon('0,0 5,0 10,5 5,10 0,10')
					.translate(x || 0, y || 0)
					.addClass('pin')
					.fill(color || me.mColor)
					.style('pointer-events', 'none')
			}
			ret = me.mGfx.pin.bbox();
			if(me.getType() == exSVG.Pin.PIN_OUT){
				//me.mGfx.pin.translate(-5,0);
				//console.log('ttttt')
				//me.mGfx.pin.translate(5);
				ret.x += 100;
				//me.mGfx.pin.translate(3,0);
			}
			return ret
		},
		
		drawLabel: function(x, y, text){
			var me = this;
			if(me.getId() == 'entry' || me.getId() == 'exit'){
				me.rect(10,10).move(9,3).style('pointer-events', 'none')
				return exSVG.Pin.prototype.drawLabel.call(this, x, y, '  ');
			}
			return exSVG.Pin.prototype.drawLabel.apply(this, arguments);
		}
	}
});



/*********************************************
	PinAdd pin
*********************************************/
function pinAddContextMenu(e, pin){
	console.log(e);
	var me = this
	, menu = e.detail.menu
	, pins = me.getNode().select('.exPin[data-arrayid="' + me.getData('targetArray') + '"]');
	
	menu.sep();
	var rem = menu.addItem('Remove Pin', 'remove', function(){
		this.remove();
		refreshPins.call(me);
		//me.refreshPins();
		me.getNode().paint();
	});
	if(pins.length() < 2)
		rem.enabled(false);
	if(pin.getLinks().length() > 0)
		rem.enabled(false);	

	menu.addItem('Insert Pin after', 'insert', function(){
		//this.remove();
		refreshPins.call(me);
		//me.refreshPins();
		me.getNode().paint();
	});	
};

function refreshPins(){
	var me = this
	, arrayId = me.getData('targetArray')
	, pins = me.getNode().select('.exPin[data-arrayid="' + arrayId + '"]')
	, a = 0;
	
	pins.each(function(){
		this.setData('label', (this.getData('label') || this.getId()).replace(new RegExp("\\d+", "g"), a));
		this.paint();
		a++;
	});
};

exSVG.PinAdd = SVG.invent({
    create: 'g', 
    inherit: exSVG.Pin,
	
    extend: {
		
		init: function(data){
			var me = this
			, pin
			, arrayId;
			
			setTimeout(function(e){
				me.removeClass('linkable');
			}, 100);

			exSVG.Pin.prototype.init.apply(me, arguments);
			me.addClass('exPinAdd');
			
			if(!me.getData('targetArray')){
				pin = me.getNode().select('.exPin[data-id="' + me.getData('target') + '"');
				console.assert(pin.length() == 1);
				if(!pin.first().getData('arrayId')){
					arrayId = Math.floor((Math.random() * 10000) + 1);
					me.setData('targetArray', arrayId);
					pin.first().setData('arrayid', arrayId);
				}
				pin.first().setId(pin.first().getId() + '_0');
			}
			else
				arrayId = me.getData('targetArray');

			//in case of the parent node was pasted, init all event handler for added pins
			me.getNode().select('.exPin[data-arrayid="' + arrayId + '"]').each(function(){
				this.on('menu', function(e){
					pinAddContextMenu.call(me, e, this);
				});
			});
						
			me.on('click.pinadd', function(e){
				me.addPin();
			});

			me.on('contextmenu.pinadd', function(e){
				e.stopPropagation();
				e.stopImmediatePropagation();
				e.preventDefault();
			});
			
			return me;
		},
		
		addPin: function(){
			var me = this
			, newPin
			, arrayId = me.getData('targetArray')
			, pins = me.getNode().select('.exPin[data-arrayid="' + arrayId + '"]')
			, lastId = parseInt(pins.last().getId().match('\[\\d+\]')[0])
			, pin = pins.first();
			
			var d = pin.exportGraph();
			d.Id(pins.last().getId().replace(new RegExp('\\d+', 'g'), lastId+1));
			//console.log(d.node);
			newPin = me.parent(exSVG.Node).addPin(d);
			console.assert(newPin instanceof exSVG.Pin);
			
			pins.last().after(newPin); // bug? why insert after, shoul be before...
			refreshPins.call(me);
						
			newPin.on('menu', function(e){
				pinAddContextMenu.call(me, e, this)
			});
			me.getNode().paint();
			return me;
		},
		
		
		drawBackground: function(x, y, w, h){
			var me = this
			, box = me.bbox();

			if(!me.mGfx.bg){
				//console.log(me);
				me.mGfx.bg = me.rect()
					.translate(-50, y || 0)
					.fill('none')
			}
			me.mGfx.bg.size(70, box.h);
			me.mGfx.bg.back();
			return me;
		},

		drawPin: function(x, y, color, size){
			var me = this
			, color = color || me.getColor();
			
			if(!me.mGfx.pin) {
				me.addClass('exPinAdd');
				if(!me.doc().defs().get('pinAddPattern' + color.toHex().replace('#','-'))){
					me.doc().pattern(11, 11, function(add) {
						add.rect(3,11).move(4,0).fill(color);
						add.rect(11, 3).move(0, 4).fill(color);
					}).id('pinAddPattern' + color.toHex().replace('#','-')).attr('patternUnits', 'userSpaceOnUse')					
				}

				me.mGfx.pin = me.rect(11, 11)
					.fill('url(#pinAddPattern' + color.toHex().replace('#','-') + ')')
					.stroke({width:0, color: color || color})
					.translate(x || 0, y || 0)
					.style('pointer-events', 'none')
					.addClass('pin')
			}
			return me.mGfx.pin.bbox();
		}
		
	}
});


}).call(this);