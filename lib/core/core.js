;exLIB.package('core', function(pack){
	
	pack.Type('device', 'Device').Color('#00f');
	pack.Type('exec', 'Exec').Color('#fff').Ctor('PinExec');
	pack.Type('object', 'Object').Color('#55f');
	pack.Type('wildcards', 'Wildcards').Color('#666').Ctor('PinWildcards');
	
	pack.Node('entrypoint', 'Function Entry').Ctor('NodeEntryPoint').Color('#7f2197').Symbol('lib/img/start.png').MakeExit();
	pack.Node('event', 'Event').Color('#f55');
	pack.Node('function').Color('#aaeea0').Symbol('lib/img/function.png');
	pack.Node('macro').Color('#555').Symbol('lib/img/macro.png');
	pack.Node('operator').Ctor('NodeOp').Color('#555').Symbol('lib/img/operator.png');
	pack.Node('reroute').Ctor('RereouteNode').Color('#aaeea0');
});

exLIB.package('special', function(pack){
	pack.Type('add').Color('#fff').Ctor('PinAdd');
		
});


exLIB.package('tpl', function(pack){
	
	pack.Node('node.function').Color('#78c8fe').Symbol('lib/img/function.png');
	pack.Node('node.pure').Color('#aaeea0').Symbol('lib/img/function.png');
	pack.Node('node.core').Color('#C3C3C3');
	pack.Node('node.system').Color('#87663f');
	pack.Node('node.entry').Color('#7f2197').Symbol('lib/img/start.png');

	pack.Node('node.eq').Import('core.operator').Keywords('equivalent,==,equal').Subtitle('==').Symbol('lib/img/op.eq.png');
	pack.Node('node.lt').Import('core.operator').Keywords('lt,<').Subtitle('<').Symbol('lib/img/op.lt.png');
	pack.Node('node.gt').Import('core.operator').Keywords('gt,>').Subtitle('>').Symbol('lib/img/op.gt.png');
	pack.Node('node.lte').Import('core.operator').Keywords('lte,<=').Subtitle('<=').Symbol('lib/img/op.lte.png');
	pack.Node('node.gte').Import('core.operator').Keywords('gte,>=').Subtitle('>=').Symbol('lib/img/op.gte.png');
	pack.Node('node.neq').Import('core.operator').Keywords('neq,<>,!=').Subtitle('<>').Symbol('lib/img/op.neq.png');

	pack.Node('node.add').Import('core.operator').Keywords('add,+').Subtitle('+').Symbol('lib/img/op.add.png');
	pack.Node('node.sub').Import('core.operator').Keywords('substract,-').Subtitle('-').Symbol('lib/img/op.sub.png');
	pack.Node('node.mul').Import('core.operator').Keywords('multiply,x,*').Subtitle('*').Symbol('lib/img/op.mul.png');
	pack.Node('node.div').Import('core.operator').Keywords('divide,/').Subtitle('/').Symbol('lib/img/op.div.png');
	pack.Node('node.mod').Import('core.operator').Keywords('modulo,%').Subtitle('%').Symbol('lib/img/op.mod.png');


	n = pack.NodeTpl('add', '* + *').Ctor('NodeOp').Color('#555').Symbol('lib/img/operator.png').Category('/Operator');
	n.Input('in1', '*1');
	n.Input('in2', '*1');
	n.Output('out', '*1');	
});

exLIB.package('core.type', function(pack){
	pack.Type('enum', 'Enum').Color('#fff').Editor('select');
	pack.Type('struct', 'Structure').Color('#0057c8').Ctor('PinStructure');
	
	pack.Type('EditorInput').Editor('Input');
	pack.Type('scalar').Tooltip('Any scalar value');
	
});

















;exLIB.load('core', function(ctx){
	
ctx.registerType('core.variable', {
});

ctx.registerType('core.exec', {
	label: 'Exec', 
	color: '#fff',
	ctor: 'PinExec'
});

ctx.registerType('core.device', {
	label: 'Device', 
	color: '#87663f'
});


ctx.registerType('special.add', {
	label: 'Add', 
	color: '#fff',
	ctor: 'PinAdd',
	tooltip: 'Add a new Pin'
});

ctx.registerType('core.type.enum', {
	label: 'Enum', 
	color: '#fff',
	ctor: 'PinSelect',
	values: []
});

ctx.registerType('core.type.struct', {
	label: 'Structure', 
	color: '#0057c8',
	categories: ['Structures'],
	break: true,
	make: true,
	members: []
});


ctx.registerType('core.wildcards', {
	ctor: 'PinWildcards',
	label: 'Wildcards', 
	color: '#777',
	ctype: 'void *'
});

ctx.registerType('core.type.editable', {
	inherits: 'core.variable',
	editor: 'input',
	editor_validators: function(e, input){
		//console.log(e.keyCode);
		if(e.keyCode == 13 && !e.shiftKey){
			e.preventDefault();
			this.parent(exSVG.Worksheet).setFocus();
		}
	}
});

ctx.registerType('core.type.scalars', {
	inherits: 'core.wildcards',
	label: 'Scalar types (bool, int, float, string)',
	accepts: ['core.type.bool', 'core.type.string', 'core.type.int', 'core.type.float']
});








ctx.registerNode('entrypoint', {
	ctor: 'NodeEntryPoint',
	title: 'Function Entry', 
	color: '#7f2197',
	inputs: [],
	outputs: [
		{id: 'exit', type: 'core.exec'}
	]
});

ctx.registerNode('callfunc', {
	title: '', 
	color: '#4d758f',
	symbol: 'lib/img/callfunc.png',
	inputs: [
		{id: 'entry', type: 'core.exec'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'}
	]
});


ctx.registerNode('event', {
	categories: [],
	title: 'Event', 
	color: '#f55',
	inputs: [],
	outputs: []
});

ctx.registerNode('function', {
	symbol: 'lib/img/function.png',
	color: '#aaeea0',
});

ctx.registerNode('macro', {
	symbol: 'lib/img/macro.png',
	color: '#555',
});

ctx.registerNode('operator', {
	symbol: 'lib/img/operator.png',
	color: '#555',
	ctor: 'NodeOp'
});

ctx.registerNode('reroute', {
	color: '#aaeea0',
	ctor: 'RereouteNode'
});


});