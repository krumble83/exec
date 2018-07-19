;exLIB.package('core', function(pack){
	
	pack.Type('device', 'Device').Color('#00f');
	pack.Type('exec', 'Exec').Color('#fff').Ctor('PinExec');
	pack.Type('object', 'Object').Color('#55f');
	pack.Type('wildcards', 'Wildcards').Color('#666').Ctor('PinWildcards');
	
	pack.Node('entrypoint', 'Function Entry').Ctor('NodeEntryPoint').Color('#7f2197').Symbol('lib/img/start.png').MakeExit();
	pack.Node('macro').Color('#555').Symbol('lib/img/macro.png');
	pack.Node('operator').Ctor('NodeOp').Color('#555')//.Symbol('lib/img/operator.png');
	pack.Node('reroute').Ctor('RereouteNode').Color('#aaeea0');

});

exLIB.package('special', function(pack){
	
	this.Type('add').Color('#fff').Ctor('PinAdd');
	
	var n = this.Node('reroutenode', 'Add reroute Node...').Ctor('RereouteNode').Category('/');
	var p = n.Input('in', 'core.wildcards').Group(1);
	p = n.Output('out', 'core.wildcards').Group(1);
	p = n.Input('inout', 'core.wildcards').Group(1);
	p.Ctor('PinReroute');

	var n = this.Node('rampnode', 'Add Ramp...').Ctor('RampNode').Category('/');
	n.Input('t0', 'core.wildcards', 'Track 1').Ctor('RampPin');
	n.Input('t1', 'core.wildcards', 'Track 2').Ctor('RampPin');
	
});


exLIB.package('tpl', function(pack){
	
	pack.Node('node.function').Color('#78c8fe').Symbol('lib/img/function.png');
	pack.Node('node.pure').Color('#aaeea0').Symbol('lib/img/function.png');
	//pack.Node('node.entry').Color('#7f2197').Symbol('lib/img/start.png');

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


	n = pack.NodeTpl('op.add').Ctor('NodeOp').Color('#555').Symbol('lib/img/op.add.png').Keywords('add,+').Subtitle('+');
	n.Input('input', '*1');
	n.Input('in', '*1', ' ');
	n.Output('output', '*1');
	n.Output('add', 'special.add', 'Add Item').attr('target', 'in').Tooltip('Add a new value.');


	n = pack.NodeTpl('op.sub').Ctor('NodeOp').Color('#555').Symbol('lib/img/op.sub.png').Keywords('sub,-').Subtitle('-');
	n.Input('in1', '*1');
	n.Input('in2', '*1');
	n.Output('out', '*1');

	n = pack.NodeTpl('op.mul').Ctor('NodeOp').Color('#555').Symbol('lib/img/op.mul.png').Keywords('multiply,*,x').Subtitle('x');
	n.Input('in1', '*1');
	n.Input('in2', '*1');
	n.Output('out', '*1');

	n = pack.NodeTpl('op.div').Ctor('NodeOp').Color('#555').Symbol('lib/img/op.div.png').Keywords('divide,/').Subtitle('/');
	n.Input('in1', '*1');
	n.Input('in2', '*1');
	n.Output('out', '*1');

	n = pack.NodeTpl('op.mod').Ctor('NodeOp').Color('#555').Symbol('lib/img/op.mod.png').Keywords('modulo,%').Subtitle('%');
	n.Input('in1', '*1');
	n.Input('in2', '*1');
	n.Output('out', '*1');
});

exLIB.package('core.type', function(pack){
	pack.Enum('enum', 'Enum').Color('#8000FF').Tooltip('Enum').Editor('select');
	
	var n = pack.Node('intToEnum', 'Int To Enum').Import('tpl.node.pure').Category('Utilities/Enum');
		n.Input('int', 'core.type.int');
		n.Output('value', 'core.type.enum');
	
	pack.Struct('struct', 'Structure').Color('#0057c8').Ctor('PinStructure');
	
	//pack.Type('EditorInput').Editor('Input');
	pack.Type('scalar').Tooltip('Any scalar value');
	
});

