;exLIB.package('core.macro', function(){
	var me = this
	, n;
	
	this.Enum('localtype').Values(['string', 'int', 'float', 'bool']).Ctor('PinNolink');
	
	this.Category('Macro').Color('#C3C3C3');
	
	n = me.Node('localstring', 'Local String');
	n.Output('variable', 'core.type.string');
	
	n = me.Node('localint', 'Local Integer');
	n.Output('variable', 'core.type.int');

	n = me.Node('localfloat', 'Local Float');
	n.Output('variable', 'core.type.float');

	n = me.Node('localbool', 'Local Bool');
	n.Output('variable', 'core.type.bool');
	
	n = me.Node('localassign', 'Assign Variable').MakeEntry().MakeExit();
	n.Input('variable', 'core.wildcards').Group(1);
	n.Input('value', 'core.wildcards').Group(1);

	
});