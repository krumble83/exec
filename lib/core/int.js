
;exLIB.package('core.int', function(pack){

	pack.Category('Integer');

	;exLIB.package('core.type', function(pack){
		var t = pack.Type('int', 'Integer')
			.Inherits('core.type.scalar')
			.Color('#1edfab')
			.Tooltip('Any non floating number');
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
				].indexOf(e.keyCode) == -1)
					e.preventDefault();
				if(e.keyCode == 13)
					input.blur();				
			});
		t.MakeLiteralNode('core.int');
		
	});

	n = pack.Node('random', 'Random Integer').Keywords('make random');
	n.Input('min', 'core.type.int');
	n.Input('max', 'core.type.int');
	n.Output('out', 'core.type.int', 'Return Value');
	


/******************************************************************
	Arithmetic Operators
******************************************************************/	
	pack.Category('Integer/Arithmetic');
	n = pack.Node('add', 'Int + Int').Import('special.tpl.add');
	n.Input('in1', 'core.type.int');
	n.Input('in2', 'core.type.int');
	n.Output('out', 'core.type.int');
	
	pack.Node('substract').Import('add').Import('special.tpl.sub').Title('Int - Int');
	pack.Node('multiply').Import('add').Import('special.tpl.mul').Title('Int x Int');
	pack.Node('divide').Import('add').Import('special.tpl.div').Title('Int / Int');
	pack.Node('modulo').Import('add').Import('special.tpl.mod').Title('Int % Int');


/******************************************************************
	Comparators
******************************************************************/	
	pack.Category('Integer/Comparators');
	n = pack.Node('equal', 'Equal (Int)').Import('special.tpl.eq');
	n.Input('a', 'core.type.int');
	n.Input('b', 'core.type.int');
	n.Output('out', 'core.type.bool');
	
	pack.Node('lt').Import('equal').Import('special.tpl.lt').Title('Lower Than (Int)');
	pack.Node('gt').Import('equal').Import('special.tpl.gt').Title('Gretter Than (Int)');
	pack.Node('lte').Import('equal').Import('special.tpl.lte').Title('Lower Than or Equal (Int)');
	pack.Node('gte').Import('equal').Import('special.tpl.gte').Title('Gretter Than or Equal (Int)');
	pack.Node('neq').Import('equal').Import('special.tpl.neq').Title('Not Equal (Int)');
	
});










;exLIB.load('core.int', function(ctx){
	
ctx.registerType('core.type.int', {
	inherits: 'core.type.editable',
	label: 'Integer', 
	color: '#1edfab',
	ctype: 'int',
	editor_validators: function(e, input){
		//console.log(e.keyCode);
		if([8 // back
			, 37 // left
			, 39 // right
			,46 // delete
			,96,97,98,99,100,101,102,103,104,105 //digits
			, 109 // minus
		].indexOf(e.keyCode) == -1)
			e.preventDefault();
	}
});

ctx.registerNode('makeliteral', {
	import: 'core.function',
	categories: ['Integer'],
	keywords: 'make int',
	title:'Make Literal Integer',
	color: '#555',
	inputs: [
		{id: 'in', type: 'core.type.int'}
	],
	outputs: [
		{id: 'value', type: 'core.type.int'}
	]
});

ctx.registerNode('random', {
	categories: ['Integer'],
	keywords: 'random',
	title:'Random Integer in Range',
	color: '#aaeea0',
	inputs: [
		{id: 'min', type: 'core.type.int'},
		{id: 'max', type: 'core.type.int'}
	],
	outputs: [
		{id: 'out', type: 'core.type.int', label:'Return Value'}
	]
});

ctx.registerNode('buildstring', {
	categories: ['Utilities/String'],
	keywords: 'build string, int to string, to string, tostring',
	title:'BuildString (Int)',
	color: '#aaeea0',
	inputs: [
		{id: 'prefix', type: 'core.type.string'},
		{id: 'int', type: 'core.type.int'},
		{id: 'suffix', type: 'core.type.string'},
	],
	outputs: [
		{id: 'out', type: 'core.type.string', label:'Return Value'}
	]
});


ctx.registerNode('add', {
	ctor: 'NodeOp',
	categories: ['Integer/Arithmetic Operators'],
	keywords: 'add int,integer,int add',
	title:'Int + Int',
	subtitle: '+',
	color: '#555',
	inputs: [
		{id: 'in1', type: 'core.type.int'},
		{id: 'in2', type: 'core.type.int'}
	],
	outputs: [
		{id: 'out', type: 'core.type.int'}
	]
});

ctx.registerNode('sub', {
	import: 'add',
	keywords: 'substract,int substract',
	title:'Int - Int',
	subtitle: '-'
});

ctx.registerNode('mult', {
	import: 'add',
	keywords: 'multiply,int multiply',
	title:'Int x Int',
	subtitle: 'x'
});

ctx.registerNode('div', {
	import: 'add',
	keywords: 'divide,int divide',
	title:'Int / Int',
	subtitle: '/'
});

ctx.registerNode('modulo', {
	import: 'add',
	keywords: 'modulo,int modulo',
	title:'% Int',
	subtitle: '%'
});



ctx.registerNode('equal', {
	import: 'core.operator',
	categories: ['Integer/Comparison Operators'],
	keywords: '==,equal',
	title:'Equal (Int)',
	subtitle: '==',
	inputs: [
		{id: 'a', type: 'core.type.int'},
		{id: 'b', type: 'core.type.int'}
	],
	outputs: [
		{id: 'out', type: 'core.type.bool'}
	]
});

ctx.registerNode('lt', {
	import: 'equal',
	keywords: 'lt,<',
	title:'Lower Than (Int)',
	subtitle: '<'
});

ctx.registerNode('gt', {
	import: 'equal',
	keywords: 'gt,>',
	title:'Gretter Than (Int)',
	subtitle: '>'
});

ctx.registerNode('lte', {
	import: 'equal',
	keywords: 'lte,<=',
	title:'Lower Than or Equal (Int)',
	subtitle: '<='
});

ctx.registerNode('gte', {
	import: 'equal',
	keywords: 'gte,>=',
	title:'Gretter Than or Equal (Int)',
	subtitle: '>='
});

ctx.registerNode('neq', {
	import: 'equal',
	keywords: 'neq,!=,<>',
	title:'Not Equal (Int)',
	subtitle: '!='
});




ctx.registerNode('bitleft', {
	import: 'core.operator',
	categories: ['Integer/Bitwise Operators'],
	keywords: 'bitwise left,left bitwise,<<',
	title:'<< (Int)',
	subtitle: '<<',
	inputs: [
		{id: 'input', type: 'core.type.int'},
		{id: 'shift', type: 'core.type.int'}
	],
	outputs: [
		{id: 'out', type: 'core.type.int'}
	]
});

ctx.registerNode('bitright', {
	import: 'bitleft',
	keywords: 'bitwise right,bitwise bit,>>',
	title:'>> (Int)',
	subtitle: '>>'
});

ctx.registerNode('bitand', {
	import: 'bitleft',
	keywords: 'bitwise and,right bitwise,&',
	title:'& (Int)',
	subtitle: '&'
});

});
