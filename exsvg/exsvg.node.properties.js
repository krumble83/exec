
SVG.extend(exSVG.Node, {
	
	getProperty: function(name, deflt){
		if(!this.mData.mProperties)
			this.mData.mProperties = {};
		if(name)
			return this.mData.mProperties[name] || deflt;
		return this.mData.mProperties;
	
	},
	
	setProperty: function(name, value){
		if(!this.mData.mProperties)
			this.mData.mProperties = {};
		this.mData.mProperties[name] = value;
	},

	changePin: function(pin, data){
		
	}
});