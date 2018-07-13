
;exLIB.package('core.float', function(pack){

	pack.Category('Float');

	;exLIB.package('core.type', function(pack){
		var t = pack.Type('float', 'Float')
			.Inherits('core.type.scalar')
			.Color('#004040');
		t.Editor('input')
			.data('keydown', function(e, input){
				//console.log(e.keyCode);
				if((e.keyCode == 67 || e.keyCode == 88) && e.ctrlKey) // Ctrl+C Ctrl+X
					return;
				if([8 // back
					, 37 // left
					, 39 // right
					, 46 // delete
					, 36,35 // end - start 
					, 96,97,98,99,100,101,102,103,104,105 //digits
					, 109 // minus
					, 110 // point
				].indexOf(e.keyCode) == -1)
					e.preventDefault();
				if(e.keyCode == 13)
					input.blur();
			});
		t.MakeLiteralNode('core.float');
		
	});

	n = pack.Node('random', 'Random Float').Keywords('make random');
	n.Input('min', 'core.type.float');
	n.Input('max', 'core.type.float');
	n.Output('out', 'core.type.float', 'Return Value');

	
	
	
/******************************************************************
	Arithmetic Operators
******************************************************************/	
	pack.Category('Float/Arithmetic');
	n = pack.Node('add', 'Float + Float').Import('tpl.node.add');
	n.Input('in1', 'core.type.float');
	n.Input('in2', 'core.type.float');
	n.Output('out', 'core.type.float');
	
	pack.Node('substract').Import('add').Import('tpl.node.sub').Title('Float - Float');
	pack.Node('multiply').Import('add').Import('tpl.node.mul').Title('Float x Float');
	pack.Node('divide').Import('add').Import('tpl.node.div').Title('Float / Float');
	pack.Node('modulo').Import('add').Import('tpl.node.mod').Title('Float % Float');


/******************************************************************
	Comparators
******************************************************************/	
	pack.Category('Float/Comparators');
	n = pack.Node('equal', 'Equal (Float)').Import('tpl.node.eq');
	n.Input('a', 'core.type.float');
	n.Input('b', 'core.type.float');
	n.Output('out', 'core.type.bool');
	
	pack.Node('lt').Import('equal').Import('tpl.node.lt').Title('Lower Than (Float)');
	pack.Node('gt').Import('equal').Import('tpl.node.gt').Title('Gretter Than (Float)');
	pack.Node('lte').Import('equal').Import('tpl.node.lte').Title('Lower Than or Equal (Float)');
	pack.Node('gte').Import('equal').Import('tpl.node.gte').Title('Gretter Than or Equal (Float)');
	pack.Node('neq').Import('equal').Import('tpl.node.neq').Title('Not Equal (Float)');	
	
	
});

















;exLIB.load('core.float', function(ctx){
	
ctx.registerType('core.type.float', {
	inherits: 'core.type.editable',
	label: 'Float', 
	color: '#a0fd45',
	editor_validators: function(e, input){
		//console.log(e.keyCode);
		if([8 // back
			, 37 // left
			, 39 // right
			,46 // delete
			,96,97,98,99,100,101,102,103,104,105 //digits
			, 109 // minus
			, 110 // point
		].indexOf(e.keyCode) == -1)
			e.preventDefault();
	}
});

ctx.registerNode('makeliteral', {
	import: 'core.function',
	categories: ['Float'],
	keywords: 'make float',
	title:'Make Literal Float',
	color: '#555',
	inputs: [
		{id: 'in', type: 'core.type.float'}
	],
	outputs: [
		{id: 'value', type: 'core.type.float'}
	]
});

ctx.registerNode('random', {
	categories: ['Float'],
	keywords: 'random',
	title:'Random Float in Range',
	color: '#aaeea0',
	inputs: [
		{id: 'min', type: 'core.type.float', label: 'Min'},
		{id: 'max', type: 'core.type.float'}
	],
	outputs: [
		{id: 'out', type: 'core.type.float', label:'Return Value'}
	]
});

ctx.registerNode('buildstring', {
	categories: ['Utilities/String'],
	keywords: 'build string, float to string, to string, tostring',
	title:'BuildString (Float)',
	color: '#aaeea0',
	inputs: [
		{id: 'prefix', type: 'core.type.string'},
		{id: 'float', type: 'core.type.float'},
		{id: 'suffix', type: 'core.type.string'},
	],
	outputs: [
		{id: 'out', type: 'core.type.string', label:'Return Value'}
	]
});


/******************************************************************
	Arithmetic Operators
******************************************************************/	
ctx.registerNode('add', {
	ctor: 'NodeOp',
	categories: ['Float/Arithmetic Operators'],
	keywords: 'add float,floateger,float add',
	title:'Float + Float',
	subtitle: '+',
	color: '#555',
	inputs: [
		{id: 'in1', type: 'core.type.float'},
		{id: 'in2', type: 'core.type.float'}
	],
	outputs: [
		{id: 'out', type: 'core.type.float'}
	]
});

ctx.registerNode('sub', {
	import: 'add',
	keywords: 'substract,float substract',
	title:'Float - Float',
	subtitle: '-'
});

ctx.registerNode('mult', {
	import: 'add',
	keywords: 'multiply,float multiply',
	title:'Float x Float',
	subtitle: 'x'
});

ctx.registerNode('div', {
	import: 'add',
	keywords: 'divide,float divide',
	title:'Float / Float',
	subtitle: '/'
});

ctx.registerNode('modulo', {
	import: 'add',
	keywords: 'modulo,float modulo',
	title:'% Float',
	subtitle: '%'
});

/******************************************************************
	Comparison Operators
******************************************************************/	
ctx.registerNode('equal', {
	import: 'core.operator',
	categories: ['Float/Comparison Operators'],
	keywords: '==,equal',
	title:'Equal (Float)',
	subtitle: '==',
	inputs: [
		{id: 'a', type: 'core.type.float'},
		{id: 'b', type: 'core.type.float'}
	],
	outputs: [
		{id: 'out', type: 'core.type.bool'}
	]
});

ctx.registerNode('lt', {
	import: 'equal',
	keywords: 'lt,<',
	title:'Lower Than (Float)',
	subtitle: '<'
});

ctx.registerNode('gt', {
	import: 'equal',
	keywords: 'gt,>',
	title:'Gretter Than (Float)',
	subtitle: '>'
});

ctx.registerNode('lte', {
	import: 'equal',
	keywords: 'lte,<=',
	title:'Lower Than or Equal (Float)',
	subtitle: '<='
});

ctx.registerNode('gte', {
	import: 'equal',
	keywords: 'gte,>=',
	title:'Gretter Than or Equal (Float)',
	subtitle: '>='
});

ctx.registerNode('neq', {
	import: 'equal',
	keywords: 'neq,!=,<>',
	title:'Not Equal (Float)',
	subtitle: '!='
});


/******************************************************************
	Bitwise Operators
******************************************************************/	
ctx.registerNode('bitleft', {
	import: 'core.operator',
	categories: ['Float/Bitwise Operators'],
	keywords: 'bitwise left,left bitwise,<<',
	title:'<< (Float)',
	subtitle: '<<',
	inputs: [
		{id: 'input', type: 'core.type.float'},
		{id: 'shift', type: 'core.type.float'}
	],
	outputs: [
		{id: 'out', type: 'core.type.float'}
	]
});

ctx.registerNode('bitright', {
	import: 'bitleft',
	keywords: 'bitwise right,bitwise bit,>>',
	title:'>> (Float)',
	subtitle: '>>'
});

ctx.registerNode('bitand', {
	import: 'bitleft',
	keywords: 'bitwise and,right bitwise,&',
	title:'& (Float)',
	subtitle: '&'
});

});