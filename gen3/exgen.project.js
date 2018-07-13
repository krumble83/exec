
/**************************************************************************************
	PROJECT
**************************************************************************************/
exGEN.Project = exGEN.invent({
    create: 'project',
	inherit: exGEN.Element,
	
    extend: {
		init: function(){
			this.node.appendChild(document.createElement('nodes'));
			this.node.appendChild(document.createElement('links'));
			document.body.appendChild(this.node);
			return this;
		},
		
		Node: function(svgid){
			return this.node.select('node[svgid="' + svgid + '"]');

		},
		
		Parse: function(data){

		}
	}
});




/**************************************************************************************
	NODE
**************************************************************************************/
exGEN.Node = exGEN.invent({
    create: 'node',
	inherit: exGEN.Element,
	
    extend: {
		init: function(){
			return this;
		},
		
		Pin: function(name){
			if(typeof name !== 'undefined')
				return exGEN.adopt(this.node.querySelector('inputs[name="' + name + '"],outputs[name="' + name + '"]'));
			else
				return this.create('Pin', arguments);
		}
	}
});


/**************************************************************************************
	PIN
**************************************************************************************/
exGEN.Pin = exGEN.invent({
    create: 'pin',
	inherit: exGEN.Element,
	
    extend: {
		init: function(){
			return this;
		},
		
		GetLinks: function(){
			var parent = this.parent(exGEN.Project);
			return parent.select('link[pinIn="' + this.attr('id') + '"],link[pinOut="' + this.attr('id') + '"]');
		},
		
		GetNode: function(){
			return this.parent(exGEN.Node);
		}
	}
});


/**************************************************************************************
	LINK
**************************************************************************************/
exGEN.Link = exGEN.invent({
    create: 'link',
	inherit: exGEN.Element,
	
    extend: {
		init: function(){
			return this;
		},
		
		GetOtherPin: function(pin){
			
		},
		
		GetOtherPinNode: function(pin){
			
		}

	}
});