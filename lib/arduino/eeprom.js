;exLIB.package('arduino.eeprom', function(pack){
	
	pack.Category('Arduino/EEPROM').Symbol('lib/img/arduino.png').Color('#9c39da');
	
	var n = pack.Node('read', 'EEPROM.read()').Keywords('eeprom read')
		.Tooltip('Reads a byte from the EEPROM. Locations that have never been written to have the value of 255.');
	n.Input('address', 'core.type.int').Tooltip('the location to read from, starting from 0 (int)');
	n.Output('value', 'core.type.byte').Tooltip('the value stored in that location (byte)');

	n = pack.Node('write', 'EEPROM.write()').Keywords('eeprom write').MakeEntry().MakeExit()
		.Tooltip('Write a byte to the EEPROM.');
	n.Input('address', 'core.type.int').Tooltip('the location to write to, starting from 0 (int)');
	n.Input('value', 'core.type.byte').Tooltip('the value to write, from 0 to 255 (byte)');

	n = pack.Node('put', 'EEPROM.put()').Keywords('eeprom put').MakeEntry().MakeExit()
		.Tooltip('Write any data type or object to the EEPROM.');
	n.Input('address', 'core.type.int').Tooltip('the location to write to, starting from 0 (int)');
	n.Input('value', 'core.wildcards').Tooltip('The variable to fill EEPROM with');
	
	n = pack.Node('length', 'EEPROM Size').Keywords('eeprom write').Tooltip('Return the Size of the Arduino integrated EEPROM.');
	n.Output('length', 'core.type.int').Tooltip('Size of the Arduino integrated EEPROM.');
	
});


;exLIB.load('arduino.eeprom', function(ctx){
	
ctx.registerNode('read', {
	import: 'arduino.base.base',
	categories: ['Arduino/EEPROM'],
	keywords: 'read eeprom,eprom',
	title:'EEPROM.read()',
	inputs: [
		{id: 'address', type: 'core.type.int', tooltip: 'the location to read from, starting from 0 (int)'}	
	],
	outputs: [
		{id: 'value', type: 'core.type.byte', tooltip: 'the value stored in that location (byte)'}
	],
	tooltip: 'Reads a byte from the EEPROM. Locations that have never been written to have the value of 255.'
});

ctx.registerNode('write', {
	import: 'arduino.base.base',
	categories: ['Arduino/EEPROM'],
	keywords: 'eeprom read byte,read eeprom byte',
	title: 'EEPROM.write()',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'address', type: 'core.type.int', tooltip: 'the location to write to, starting from 0 (int)'},	
		{id: 'value', type: 'core.type.byte', tootltip:'the value to write, from 0 to 255 (byte)'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'}
	],
	tooltip: 'Write a byte to the EEPROM.'
});

ctx.registerNode('update', {
	import: 'arduino.eeprom.write',
	keywords: 'eeprom update, update eeprom',
	title:'EEPROM.update()',
});


ctx.registerNode('get', {
	import: 'arduino.base.base',
	categories: ['Arduino/EEPROM'],
	keywords: 'get eeprom,eprom get',
	title:'EEPROM.get()',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'address', type: 'core.type.int', tooltip: 'EEPROM Adress to read data from'},
		{id: 'varin', type: 'core.wildcards', group: 1, label: 'Variable', tooltip: 'The variable to fill with EEPROM Data'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'varout', type: 'core.wildcards', group: 1, label: 'Variable', tooltip: 'Filled variable with EEPROM Data'}
	],
	tooltip: 'Read any data type or object from the EEPROM.'
});

ctx.registerNode('put', {
	import: 'arduino.base.base',
	categories: ['Arduino/EEPROM'],
	keywords: 'put eeprom,eprom put',
	title:'EEPROM.put()',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'address', type: 'core.type.int', tooltip: 'EEPROM Adress to write data'},
		{id: 'variable', type: 'core.wildcards', tooltip: 'The variable to fill EEPROM with'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'}
	],
	tooltip: 'Write any data type or object to the EEPROM'
});


ctx.registerNode('length', {
	import: 'arduino.base.base',
	categories: ['Arduino/EEPROM'],
	keywords: 'eeprom length,eprom size,length eeprom,size eeprom,eprom length,',
	title:'EEPROM Size',
	inputs: [],
	outputs: [
		{id: 'length', type: 'core.type.int', tootltip: 'Size of the Arduino integrated EEPROM'}
	],
	tootltip: 'Return the Size of the Arduino integrated EEPROM'
});

});

