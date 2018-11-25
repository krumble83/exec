;(function(ctx){
"use strict";

exLIB.package('core', function(){
	
	this.Node('entrypoint').Prepare(function(){
		console.log('entrypoint.Prepare');
		
		this.select('exit').each(function(){
			console.log('zz');
			this.Eval(function(out, caller){
				var link = this.GetLinks();
				
				assert(link.length() < 2);
				
				links.each(function(){
					this.Eval.call(this.Input(), out);
				});
				
			});
		});
		
	});
	
});


exLIB.package('core.flow', function(){
	
	/*
	this.Node('sequence').Prepare(function(){
		console.log('sequence');
		var out = this;
		
		this.select('output').each(function(){
			if(this.Id() == 'add')
				return;
			
			this.Eval = function(out, caller){
				var links = this.GetLinks();
				assert(links.length() < 2);
				
				links.each(function(){
					this.Eval.call(this.Input(), out);
				});
			}
			
		});
	});
	*/
	
	this.Node('forloop').Prepare(function(){
		console.log('forloop');
		var node = this
		, body
		, ret;
		
		
		function create(out){
			if(ret)
				return ret;
			
			ret = out.For();

			//condition
			var cond = ret.Condition('var_todo', '<');
			cond.Declare('var_todo').Type('core.type.int').Value(0, 'core.type.int');
			
			return ret;

		}
		
		node.Input('startIndex').Eval(function(out, caller){
			var links = this.GetLinks();
			
			assert(links.length() < 2);
			
			if(links.length() == 0){
				out.Value(0, 'core.type.int');
			} else {
				links.each(function(){
					this.Eval.call(this.Input(), out.Value());
				});				
			}
			
		});
		
		node.Input('endIndex').Eval(function(out, caller){
			var links = this.GetLinks();
			
			assert(links.length() < 2);
			
			if(links.length() == 0){
				out.Value(0, 'core.type.int');
			} else {
				links.each(function(){
					this.Eval.call(this.Input(), out.Value());
				});				
			}
			
		});


		node.Input('entry').Eval(function(out, caller){
			var ret = create(out);
			node.Output('loopBody').Eval(out);
		});

		node.Output('index').Eval(function(out, caller){
			out.text('ok');
			
		});
		
		/*
		ret = out.For();
		
		//condition
		var cond = ret.Condition('a', '<');
		//cond.Value(0, 'core.type.int');
		cond.Declare('a').Type('core.type.int').Value(0, 'core.type.int');
		
		// loop body
		body = ret.Do();
		graphNode.Output('loopBody').GetLinks().each(function(){
			this.Eval.call(body, this.Input());
		});
		
		// completed
		completed.GetLinks().each(function(){
			this.Eval(this.Input());
		});
		*/
	});
	
});


/*
exLIB.package('core.array', function(){

	this.Node('set').Generator(function(graphNode){
		console.log('set array item');		
		var out = this
		, itemLinks = graphNode.Input('item').GetLinks()
		, indexLinks = graphNode.Input('index').GetLinks()
		, arrayLinks = graphNode.Input('array').GetLinks()
		, arry
		, index
		, ret;
		
		assert(arrayLinks.length() == 1);		
		arry = arrayLinks.first().Eval.call(out, arrayLinks.first().Output());
		
		ret = out.Assign(arry.Name());
		
		if(indexLinks.length() == 0){
			var generator = exLIB.getNode2('core.int.makeliteral').Generator();
			generator.call(ret.Index());
			//ret.Index(0, 'core.type.int');
		} else {
			assert(indexLinks.length() == 1);
			indexLinks.first().Eval.call(ret.Index(), indexLinks.first().Output());
		}
		
		if(itemLinks.length() == 0){
			ret.Value('TODO', graphNode.Input('item').Type());
		} else{

		}
		return ret;
		//out.Assign(arry.Name()).Value('ok').attr('index', 4);
	});


	this.Node('make').Generator(function(graphNode){
		console.log('make array');
		var out = this
		, inputs = graphNode.select('input')
		, arry = graphNode.Output('array')
		, uid = out.Context().GetUID('array')
		, dataType = graphNode.Input('item_1').Type()
		, ret
		
		if(!arry.data('declaration')) {
			var id =0;
			ret = out.Context().Declare(uid).Size(inputs.length());
			ret.Type(dataType + '[]');
			inputs.each(function(){
				var links = this.GetLinks();
				
				if(links.length() == 0) {
					var generator = exLIB.getNode2('core.string.makeliteral').Generator()
					, val = ret.Value();
					
					generator.call(val, this);
					val.attr('index', id);
				} else {
					links.each(function(){
						this.Eval.call(ret.Value(), this.Output()).attr('index', id);
					});
				}
				id++;
			});			
			arry.data('declaration', ret);
		}
		return arry.data('declaration');		
	});
	
});



exLIB.package('core.string', function(){

	this.Node('makeliteral').Generator(function(graphNode){
		console.log('make string literal');
		var out = this;
		
		out.text('"[makeliteral string]"').Type('core.type.string');
		return out;
	});
	
});


exLIB.package('core.int', function(){

	this.Node('makeliteral').Generator(function(graphNode){
		console.log('make int literal');
		var out = this;
		
		out.text('"[makeliteral int]"').Type('core.type.int');
		return out;
	});


	this.Node('add').Generator(function(graphNode){
		console.log('int add');
		var out = this
		, ret = out.Arithmetic('+')
		, inputs = graphNode.select('input');
		
		inputs.each(function(){
			var links = this.GetLinks();
			
			if(links.length() == 0){
				var generator = exLIB.getNode2('core.int.makeliteral').Generator()
				, val = ret.Value();
				
				generator.call(val, this);
			} else {
				links.each(function(){
					this.Eval.call(ret, this.Output());
				});
			}
		});

		return ret;
	});
	
});
*/

}());