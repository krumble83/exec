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
		preventDefault: function(dataType){
			this.defaultPrevented = true;
			this.mDataType = dataType;
		},
		
		reset: function(){
			this.clear();
			this.defaultPrevented = false;
			//this.mDataType = undefined;
		}
	}
});


exSVG.PinWildcards = SVG.invent({
	create: 'g',
	inherit : exSVG.Pin,
	
	extend: {
		
		test: 'titi',
	
		init: function(data){
			//console.log('exSVG.PinWildcards.init()', this.titi);
			var me = this;
			
			exSVG.Pin.prototype.init.apply(this, arguments);
			me.setData('ctor', 'PinWildcards');
			me.setData('iswildcards', 1);
			me.setDataType(exLIB.getWildcardsDataType());
									
			if(data.group)
				me.setData('group', data.group);
			return me;
		},
		
		addLink: function(link){
			//console.log('exSVG.PinWildcards.addLink()', link);
			var me = this
				, set = new exSVG.WildcardsSet
				, datatype = link.getDataType()
				, oPin = link.getOtherPin(me);
			
			assert(oPin instanceof exSVG.Pin);			
			exSVG.Pin.prototype.addLink.apply(this, arguments);

			if(exLIB.isWildcardsDataType(datatype) && !exLIB.isWildcardsDataType(oPin.getDataType()))
				datatype = oPin.getDataType();
			
			me.checkDataTypeChange(datatype, set);
			if(!set.defaultPrevented){
				set.each(function(){
					this.setDataType(datatype);
				});
				me.getNode().paint();
				return true;
			}
			me.getNode().paint();
			return false;			
		},
		
		removeLink: function(link){
			var me = this
				, set = new exSVG.WildcardsSet;
			
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
					else if(this.getDataType() !== datatype && exLIB.swapArrayDataType(me.getDataType()) !== datatype){
						console.log('Prevented 1');
						set.preventDefault(this.getDataType());
					}
				});
			}
			
			// check for links attached to this pin
			links = me.parent(exSVG.Worksheet).select('.exLink[data-pinIn="' + me.id() + '"],.exLink[data-pinOut="' + me.id() + '"]');
			links.each(function(){
				pin = this.getOtherPin(me);
				assert(pin instanceof exSVG.Pin);
				set.add(this);
				if(pin.checkDataTypeChange)
					pin.checkDataTypeChange(datatype, set);
				else if(pin.getDataType() !== datatype && exLIB.swapArrayDataType(pin.getDataType()) !== datatype){
					console.log('Prevented 2', pin.getId(), pin.getDataType());
					set.preventDefault(pin.getDataType());
				}
			});
		},
		
		setDataType: function(datatypeid){
			var me = this
				, libdatatype = exLIB.getDataType2(datatypeid);
			
			if(me.getDataType() === datatypeid || exLIB.swapArrayDataType(datatypeid) === me.getDataType())
				return;
			
			if(me.mGfx.editor){
				me.mGfx.editor.destroy();
				me.mGfx.editor = undefined;
			}
			
			// Event used by exsvg.pin.gfx to create/update editor
			me.fire('changeDatatType');
			
			if(exLIB.isArrayDataType(me.getDataType()) !== exLIB.isArrayDataType(datatypeid))
				datatypeid = exLIB.swapArrayDataType(datatypeid);
			
			exSVG.Pin.prototype.setDataType.call(this, datatypeid);
		},
		
		zexport: function(graph){
			var me = this
				, pin = exSVG.Pin.prototype.export.apply(this, arguments);
			
			//pin.Type(exLIB.getWildcardsDataType(exLIB.isArrayDataType(pin.Type())));
			return pin;
		}
	}
});



/*********************************************
	PinNoLink
*********************************************/
exSVG.PinNolink = SVG.invent({
    create: 'g', 
    inherit: exSVG.Pin,
	
    extend: {
		drawPin: function(x, y, color, size){
			var me = this
				, ret;
			
			if(!me.mGfx.pin){
				me.mGfx.pin = me.polygon('0,0 5,0 10,5 5,10 0,10')
					.translate(x || 0, y || 0)
					.addClass('pin')
					.fill(color || me.mColor)
					.style('pointer-events', 'none')
					.hide();
			}
			ret = me.mGfx.pin.bbox();
			return ret
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
			var me = this;
			
			//me.setData('ctor', 'PinStructure');
			exSVG.Pin.prototype.init.apply(me, arguments);
			
			console.log(me.getData('expanded'));
			if(me.getData('expanded') == '1')
				me.expandPins();
					
			me.on('menu.pinstructure', function(e){
				var menu = e.detail.menu
				, el;
				
				el = menu.addItem('Split Struct Pin', 'split', function(){
					me.expandPins();
					me.getNode().paint();
				});
				if(me.getLinks().length() > 0)
					el.enabled(false);
				
			});
			
			return me;
		},
		
		expandPins: function(){
			var me = this
				, node = me.getNode()
				, datatype
				, type;

			datatype = exLIB.getDataType2(me.getDataType()).clone();
			var pins = datatype.select('pin')
				, pos = me.y()
				, importer = (me.getType() === exSVG.Pin.PIN_IN) ? node.importInput : node.importOutput
				, pin;
			
			pins.each(function(){
				this.Id(me.getId() + '-' + this.Id());
				pin = importer.call(node, this);
				pin.setType(me.getType());
				pin.move(0, pos);							
				node.off('.pin-' + pin.getId());
				
				pin.on('menu', function(ev){
					var cmenu = ev.detail.menu
						, menuEl;
					
					menuEl = cmenu.addItem('Recombine Struct Pin', 'recombine', function(){
						// check if any pin is linked
						if(node.select('.exPin.linked[data-id^="' + me.getId() + '-"]').length() > 0)
							return false;
						
						node.select('.exPin[data-id^="' + me.getId() + '-"]').each(function(){
							this.destroy();
						});
						me.setData('expanded', '0');
						me.show();
						me.getNode().paint();
					});
					if(node.select('.exPin.linked[data-id^="' + me.getId() + '-"]').length() > 0)
						menuEl.enabled(false);
				});
				
				pos += pin.bbox().height+4;
			});
			me.setData('expanded', '1');
			me.hide();
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

			if(me.getType() === exSVG.Pin.PIN_IN)
				me.mMaxLink = -1;
			if(me.getType() === exSVG.Pin.PIN_OUT)
				me.mMaxLink = 1;

			return me;
		},

		acceptLink: function(pin){
			if(!exLIB.isExecDataType(pin.getDataType()))
				return {code: exSVG.Pin.PIN_LINK_ACCEPT_DATATYPE, label: '<div><img src="exsvg/img/none.png"> Datatype is not compatible'};
			return exSVG.Pin.prototype.acceptLink.apply(this, arguments);
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
			if(me.getType() === exSVG.Pin.PIN_OUT){
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

			if(me.getId() === 'entry' || me.getId() === 'exit'){
				me.rect(10,10).move(9,3).style('pointer-events', 'none');
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
	//console.log(e);
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
}

function refreshPins(){
	var me = this
		, arrayId = me.getData('targetarray')
		, pins = me.getNode().select('.exPin[data-arrayid="' + arrayId + '"]')
		, a = 0;
	
	pins.each(function(){
		this.setData('label', (this.getData('label') || this.getId()).replace(new RegExp("\\d+", "g"), a));
		this.paint();
		a++;
	});
}

exSVG.PinAdd = SVG.invent({
    create: 'g', 
    inherit: exSVG.Pin,
	
    extend: {
		
		init: function(data){
			//console.log('exSVG.PinAdd.init()', data);
			var me = this
				, pin
				, arrayId;
			
			setTimeout(function(e){
				me.removeClass('linkable');
			}, 100);

			exSVG.Pin.prototype.init.apply(me, arguments);
			me.addClass('exPinAdd');
			
			if(!me.getData('targetarray')){
				pin = me.getNode().select('.exPin[data-id="' + me.getData('target') + '"');
				assert(pin.length() === 1);
				if(!pin.first().getData('arrayId')){
					arrayId = Math.floor((Math.random() * 10000) + 1);
					me.setData('targetarray', arrayId);
					pin.first().setData('arrayid', arrayId);
				}
				pin.first().setId(pin.first().getId() + '_0');
				me.setData('target', pin.first().getId());
			}
			else
				arrayId = me.getData('targetarray');

			//in case of the parent node was pasted, init all event handler for added pins
			me.getNode().select('.exPin[data-arrayid="' + arrayId + '"]').each(function(){
				this.on('menu', function(e){
					pinAddContextMenu.call(me, e, this);
				});
			});
						
			me.on('click.pinadd', me.addPin, me);
			me.on('contextmenu.pinadd', function(e){
				e.stopPropagation();
				e.stopImmediatePropagation();
				e.preventDefault();
			});
			
			setTimeout(function(){
				var p = me.parent();
				me.remove().addTo(p);
			}, 2000);
			
			return me;
		},
		
		addPin: function(){
			var me = this
				, newPin
				, arrayId = me.getData('targetarray')
				, pins = me.getNode().select('.exPin[data-arrayid="' + arrayId + '"]')
				, lastId = parseInt(pins.last().getId().match('\[\\d+\]')[0])
				, pin = pins.first();
			
			var d = pin.export();
			d.Id(pins.last().getId().replace(new RegExp('\\d+', 'g'), lastId+1));
			//console.log(d.Ctor());
			newPin = me.parent(exSVG.Node).importPin(d);
			newPin.setDataType(pin.getDataType());

			//newPin = me.parent(exSVG.Node).addPin(d);
			assert(newPin instanceof exSVG.Pin);
			
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
			var me = this;

			color = color || me.getColor();
			
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