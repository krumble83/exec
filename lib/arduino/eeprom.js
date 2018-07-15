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