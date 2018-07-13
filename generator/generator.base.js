

;exLIB.load('core', function(ctx){
	
	ctx.registerGenerator('entrypoint', function(node, fragment, params){
		var links = node.GetLinks('exit')
		, child
		, func;
		
		if(links.length() == 0)
			return;
		
		console.assert(links.length() < 2, 'Should have only 1 link on exec output pin, but ' + links.length() + ' found');

		child = links.first().GetInputNode();
		
		func = exLIB.getGenerator(child.attr('id'));
		if(typeof func === 'function')
			func(child, fragment, params);
		else
			console.log('no generator for ' + child.attr('id'));
			
	});

});


;exLIB.load('core.flow', function(ctx){
	
	ctx.registerGenerator('sequence', function(node, fragment, params){
		//console.log('sequence', this);
		var id = 0
		, pins = node.select('output[id^="then_"]')
		, child, links, func;

		
		pins.each(function(){
			links = this.GetLinks();
			console.assert(links.length() < 2, 'Should have only 1 link, but ' + links.length() + ' found');
			if(links.length() == 0)
				return;
			
			child = links.first().GetInputNode();
			func = exLIB.getGenerator(child.attr('id'));
			if(typeof func !== 'function')
				return console.log('no generator for ' + child.attr('id'));
			
			func(child, fragment, params);
		});

	});
	
	
	ctx.registerGenerator('forloop', function(node, fragment, params){
		//console.log('forloop', this);
		var id = 0
		, name = fragment.Uname('int')
		, loopPin = node.GetPin('loop')
		, links = loopPin.GetLinks()
		, ret, doo, func, child;
			
		console.assert(links.length() < 2);
		
		if(links.length() == 0)
			return;
		
		ret = fragment.For();
		ret.Declare(name, 0).Type('core.type.int');
		ret.Condition(name, '<');
		doo = ret.Do();
		
		child = links.first().GetInputNode();
		func = exLIB.getGenerator(child.attr('id'));
		if(typeof func !== 'function')
			return console.log('no generator for ' + child.attr('id'));
		
		func(child, doo, params);
		
		return ret;

	});	
});



;exLIB.load('core.array', function(ctx){
	
	ctx.registerGenerator('set', function(node, fragment, params){
		var arrayPin = node.GetPin('array')
		, links = arrayPin.GetLinks()
		, indexPin = node.GetPin('index')
		, itemPin = node.GetPin('item')
		, fitPin = node.GetPin('fit')
		, child, func, ret;
		
		console.assert(links && links.length() == 1);

		child = links.first().GetOutputNode();
		func = exLIB.getGenerator(child.attr('id'));
		if(typeof func !== 'function')
			return console.log('no generator for ' + child.attr('id'));
		
		ret = fragment.Assign();
		func(child, ret, params);
		ret.Value('test');
		ret.Index('@call');
		return ret;
	});


	ctx.registerGenerator('make', function(node, fragment, params){
		var name = node.attr('varname')
		, pins = node.select('input[id^="item_"]')
		, context, decl, links;
		
		console.log();
		if(!name){
			name = fragment.Uname('array');
			context = fragment.Context();
			if(context.Body){
				decl = context.Body().Declare(name).Type(pins.first().attr('type')).Array(pins.length()).top();
				pins.each(function(){
					links = this.GetLinks();
					if(links.length() == 0)
						return;
					decl.Value(this.attr('id')).attr('index', pins.index(this));
				});
				
			}
			node.attr('varname', name);
		}
		//fragment.attr('test:toto', 'tata');
		fragment.Name(name);
	});

});


