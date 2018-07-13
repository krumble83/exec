;exLIB.package('core.flow', function(pack){
	
	pack.Category('Utilities/Flow Control');
	
	var n = pack.Node('if', 'If (Condition)').Color('#C3C3C3').Keywords('if,branch,condition').MakeEntry();
	n.Input('condition', 'core.type.bool');
	n.Output('then', 'core.exec');
	n.Output('else', 'core.exec');
	
	n = pack.Node('forloop', 'ForLoop')
		.Color('#C3C3C3')
		.Symbol('lib/img/forloop.png')
		.Keywords('for,loop')
		.MakeEntry();
	n.Input('startIndex', 'core.type.int');
	n.Input('endIndex', 'core.type.int', 'End Index');
	n.Input('breakLoop', 'core.exec');
	n.Output('loopBody', 'core.exec');
	n.Output('index', 'core.type.int').Tooltip('Current loop Index');
	n.Output('completed', 'core.exec');

	n = pack.Node('flipflop', 'FlipFlop').Import('core.function').Keywords('flipflop').MakeEntry();
	n.Output('a', 'core.exec');
	n.Output('b', 'core.exec');
	n.Output('isA', 'core.type.bool');
	
	n = pack.Node('doonce', 'DoOnce').Keywords('do once,one time').MakeEntry();
	n.Input('reset', 'core.exec');
	n.Input('startClosed', 'core.type.bool');
	n.Output('completed', 'core.exec');
	
	n = pack.Node('while', 'While').Keywords('while,loop,as long as').MakeEntry();
	n.Input('condition', 'core.type.bool');
	n.Output('loop', 'core.exec', 'Do while');
	n.Output('completed', 'core.exec');
	
	n = pack.Node('sequence', 'Sequence')
		.Color('#C3C3C3')
		.Symbol('lib/img/sequence.png')
		.Keywords('sequence')
		.MakeEntry()
		.Tooltip('Execute a serie of pins in order<br />Click the Add pin button to add a new sequence');
	n.Output('then', 'core.exec', 'Then [0]').Group(1);
	n.Output('add', 'special.add', 'Add pin').attr('target', 'then').Tooltip('Add a new action to the sequence.');
	
	n = pack.Node('select', 'Select').Import('core.function').Keywords('select');
	n.Input('a', 'core.wildcards').Group(1);
	n.Input('b', 'core.wildcards').Group(1);
	n.Input('pickA', 'core.type.bool');
	n.Output('returnValue', 'core.wildcards').Group(1);
	
	n = pack.Node('switch', 'Switch on Int').Import('core.function').Keywords('switch').MakeEntry();
	n.Input('selection', 'core.type.int');
	n.Output('default', 'core.exec');	
	n.Output('out', 'core.exec', 'value 0');	
	n.Output('add', 'special.add', 'Add').attr('target', 'out');	
});

















;exLIB.load('core.flow', function(ctx){

ctx.registerNode('if', {
	import: 'core.function',
	categories: ['Utilities/Flow Control'],
	keywords: 'if,branch,condition',
	title:'If (Condition)', 
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'condition', type: 'core.type.bool'}
	],
	outputs: [
		{id: 'then', type: 'core.exec'},
		{id: 'else', type: 'core.exec'}
	]
});


ctx.registerNode('switch', {
	import: 'core.function',
	categories: ['Utilities/Flow Control'],
	keywords: 'switch',
	title:'Switch on Int',
	inputs: [
		{id: 'exec', type: 'core.exec'},
		{id: 'selection', type: 'core.type.int'}
	],
	outputs: [
		{id: 'default', type: 'core.exec'},
		{id: 'out', type: 'core.exec', label: 'value 0'},
		{id: 'add', type: 'special.add', label: 'Add', target: 'out'}
	]
});

ctx.registerNode('forloop', {
	import: 'core.function',
	categories: ['Utilities/Flow Control'],
	keywords: 'for,loop',
	title:'ForLoop', 
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'firstid', type: 'core.type.int', label: 'First Index'},
		{id: 'lastid', type: 'core.type.int', label: 'Last Index'},
		{id: 'break', type: 'core.exec', label:'Break'}
	],
	outputs: [
		{id: 'loop', type: 'core.exec', label: 'Loop Body'},
		{id: 'index', type: 'core.type.int', label: 'Index'},
		{id: 'complete', type: 'core.exec', label: 'Completed'}
	]
});

ctx.registerNode('flipflop', {
	import: 'core.function',
	categories: ['Utilities/Flow Control'],
	keywords: 'flipflop',
	title:'FlipFlop',
	inputs: [
		{id: 'exec', type: 'core.exec'}
	],
	outputs: [
		{id: 'a', type: 'core.exec'},
		{id: 'b', type: 'core.exec'},
		{id: 'isa', type: 'core.type.bool', label:'isA'}
	]
});

ctx.registerNode('doonce', {
	import: 'core.macro',
	categories: ['Utilities/Flow Control'],
	keywords: 'do once,one time',
	title:'DoOnce',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'reset', type: 'core.exec'},
		{id: 'closed', type: 'core.type.bool', label:'Start Closed'}
	],
	outputs: [
		{id: 'completed', type: 'core.exec'}
	]
});

ctx.registerNode('while', {
	import: 'core.macro',
	categories: ['Utilities/Flow Control'],
	keywords: 'while,loop,as long as',
	title:'While',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'condition', type: 'core.type.bool'}
	],
	outputs: [
		{id: 'loop', type: 'core.exec', label: 'Do while'},
		{id: 'completed', type: 'core.exec'}
	]
});

ctx.registerNode('sequence', {
	import: 'core.function',
	categories: ['Utilities/Flow Control'],
	keywords: 'sequence,then',
	title:'Sequence',
	inputs: [
		{id: 'entry', type: 'core.exec'}
	],
	outputs: [
		{id: 'then', type: 'core.exec', label: 'Then [0]'},
		{id: 'add', type: 'special.add', label: 'Add pin', target: 'then', tooltip: 'Add a new action to the sequence.'}
	],
	tooltip: 'Execute a serie of pins in order<br />Click the Add pin button to add a new sequence'
});

ctx.registerNode('select', {
	import: 'core.function',
	categories: ['Utilities/Flow Control'],
	keywords: 'select',
	title:'Select', 
	inputs: [
		{id: 'a', type: 'core.wildcards', group: 1},
		{id: 'b', type: 'core.wildcards', group: 1},
		{id: 'pickA', type: 'core.type.bool'}
	],
	outputs: [
		{id: 'out', type: 'core.wildcards', label:'Return Value', group: 1}
	]
});

});