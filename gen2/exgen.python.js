
exGEN.extend(exGEN.Module,{

		Import: function(){
			var ret = new exGEN.Import;
			this.Add(ret);
			ret.Init.apply(ret, arguments);
			ret.Attr('ns', 'py');
			return ret;
		}
})


/**************************************************************************************
	IMPORT
**************************************************************************************/
exGEN.Import = exGEN.invent({
    create: 'import', 
    inherit: exGEN.Fragment,
	
    extend: {
		Init: function(){},
		
		Name: function(value){
			return this.Attr.call(this, 'name', value);
		},
		
		From: function(value){
			return this.Attr.call(this, 'from', value);
		},
		
		As: function(value){
			return this.Attr.call(this, 'as', value);
		}
	}
});


