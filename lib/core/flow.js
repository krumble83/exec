;exLIB.package('core.flow', function(pack){
	
	pack.Category('Utilities/Flow Control').Color('#C3C3C3');
	
	var n = pack.Node('if', 'If (Condition)')
		.Keywords('if,branch,condition')
		.Symbol('lib/core/if.png')
		.MakeEntry();
	n.Input('condition', 'core.type.bool');
	n.Output('then', 'core.exec');
	n.Output('else', 'core.exec');
	
	n = pack.Node('forloop', 'ForLoop')
		.Symbol('lib/img/forloop.png')
		.Keywords('for,loop')
		.MakeEntry();
	n.Input('startIndex', 'core.type.int');
	n.Input('endIndex', 'core.type.int', 'End Index');
	n.Input('breakLoop', 'core.exec');
	n.Output('loopBody', 'core.exec');
	n.Output('index', 'core.type.int').Tooltip('Current loop Index');
	n.Output('completed', 'core.exec');

	n = pack.Node('flipflop', 'FlipFlop')
		.Keywords('flipflop')
		.MakeEntry()
		.Tooltip('Alternate between A and B')
		.Symbol('lib/core/flipflop.png');
	n.Output('a', 'core.exec');
	n.Output('b', 'core.exec');
	n.Output('isA', 'core.type.bool');
	
	n = pack.Node('doonce', 'DoOnce')
		.Keywords('do once,one time')
		.MakeEntry()
		.Symbol('lib/core/doonce.png');
	n.Input('reset', 'core.exec');
	n.Input('startClosed', 'core.type.bool');
	n.Output('completed', 'core.exec');
	
	n = pack.Node('while', 'While')
		.Keywords('while,loop,as long as')
		.MakeEntry()
		.Symbol('lib/core/while.png');
	n.Input('condition', 'core.type.bool');
	n.Output('loop', 'core.exec', 'Do while');
	n.Output('completed', 'core.exec');
	
	n = pack.Node('sequence', 'Sequence')
		.Symbol('lib/img/sequence.png')
		.Keywords('sequence')
		.MakeEntry()
		.Tooltip('Execute a serie of pins in order.\r\nClick the Add pin button to add a new sequence');
	n.Output('then', 'core.exec', 'Then [0]').Group(1);
	n.Output('add', 'special.add', 'Add pin').attr('target', 'then').Tooltip('Add a new action to the sequence.');
	
	n = pack.Node('selectBool', 'Select (Bool)')
		.Keywords('select bool')
		.Symbol('lib/core/select.png');
	n.Input('a', 'core.wildcards').Group(1);
	n.Input('b', 'core.wildcards').Group(1);
	n.Input('pickA', 'core.type.bool');
	n.Output('returnValue', 'core.wildcards').Group(1);

	n = pack.Node('selectInt', 'Select (Int)')
		.Keywords('select int')
		.Symbol('lib/core/selectint.png');
	n.Input('in_0', 'core.wildcards', '[0]').Group(1);
	n.Input('in_1', 'core.wildcards', '[1]').Group(1);
	n.Input('pick', 'core.type.int');
	n.Output('returnValue', 'core.wildcards').Group(1);
	n.Output('add', 'special.add', 'Add pin').attr('target', 'in_0').Tooltip('Add a new input.');

	
	n = pack.Node('switch', 'Switch on Int').Keywords('switch').MakeEntry();
	n.Input('selection', 'core.type.int');
	n.Output('default', 'core.exec');	
	n.Output('out', 'core.exec', 'value 0');	
	n.Output('add', 'special.add', 'Add').attr('target', 'out');	
});
