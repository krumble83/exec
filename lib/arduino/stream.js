;exLIB.package('arduino.stream', function(pack){
	
	pack.Symbol('lib/img/arduino.png').Color('#87663f');
		
	var c = pack.Class('stream', 'Arduino Stream')
	
	var n = c.Method('available', 'available()');
	n.Output('bytes', 'core.type.int');

	n = c.Method('read', 'read()').MakeEntry().MakeExit();
	n.Output('byte', 'core.type.byte');

	n = c.Method('flush', 'flush()').MakeEntry().MakeExit();

	n = c.Method('find', 'find()');
	n.Input('byte', 'core.type.byte');
	n.Output('found', 'core.type.bool');

	n = c.Method('findUntil', 'findUntil()');

	n = c.Method('peek', 'peek()');
	n.Output('byte', 'core.type.byte');	
	
	n = c.Method('readBytes', 'readBytes()');
	n.Input('buffer', 'core.type.byte').Array();
	n.Input('length', 'core.type.int');
	n.Output('size', 'core.type.int');
	
	n = c.Method('readBytesUntil', 'readBytesUntil()');
	n.Input('char', 'core.type.byte');
	n.Input('buffer', 'core.type.byte').Array();
	n.Input('length', 'core.type.int');
	n.Output('size', 'core.type.int');

	n = c.Method('readString', 'readString()');
	n.Output('string', 'core.type.string');

	n = c.Method('readStringUntil', 'readStringUntil()');
	n.Output('string', 'core.type.string');

	n = c.Method('parseInt', 'parseInt()');
	n.Input('skipChar', 'core.type.byte');
	n.Output('output', 'core.type.int');
	
	n = c.Method('parseFloat', 'parseFloat()');
	n.Input('skipChar', 'core.type.byte');
	n.Output('output', 'core.type.float');

	n = c.Method('setTimeout', 'setTimeout()');
	n.Input('timeout', 'core.type.int');
	
});