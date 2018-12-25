;(function() {
"use strict";


exLIB.package('arduino.serial', function(pack){
	
	pack.Category('Arduino/Serial').Symbol('lib/img/arduino.png').Color('#87663f');
	
	pack.Type('connection', 'Arduino Serial Connection').Inherits('core.object');
	pack.Type('port', 'Arduino Serial Port Component').Inherits('core.component');

	
	var n = pack.Node('available', 'Serial.available()')
		.Import('tpl.node.pure')
		.Keywords('serial available')
	n.Input('serialConnection', 'connection');
	n.Output('bytes', 'core.type.int');
	
	
	n = pack.Node('begin', 'Serial.begin()')
		.Import('tpl.node.function')
		.MakeEntry().MakeExit()
		.Keywords('serial available')
	n.Input('serialPort', 'port');
	n.Input('bauds', 'core.type.int');
	n.Output('serialConnection', 'connection');

	n = pack.Node('writeByte', 'Serial Write Byte')
		.Import('tpl.node.function')
		.MakeEntry().MakeExit()
		.Keywords('serial write byte')
	n.Input('serialConnection', 'connection');
	n.Input('byte', 'core.type.byte');

	n = pack.Node('writeBytes', 'Serial Write Bytes Array')
		.Import('tpl.node.function')
		.MakeEntry().MakeExit()
		.Keywords('serial write byte')
	n.Input('serialConnection', 'connection');
	n.Input('byte', 'core.type.byte').Array();	
	
	
	
});


})(this);


/*


ctx.registerNode('writebyte', {
	import: 'arduino.base.base',
	categories: ['Arduino/Serial'],
	keywords: 'serial write byte,byte,write serial byte',
	title:'Serial.write() (Byte)',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'connection', type: 'arduino.serial.connection', label: 'Connection'},
		{id: 'byte', type: 'core.type.byte', tooltip: 'Data to write on the serial port'}	
	],
	outputs: [
		{id: 'exit', type: 'core.exec'}
	],
	tooltip: 'Writes binary data to the serial port. This data is sent as a byte; to send the characters representing the digits of a number use the print() function instead.'
	
	
	
	
;exLIB.load('arduino.serial', function(ctx){

ctx.registerType('arduino.serial.connection', {
	inherits: 'core.object',
	label: 'Arduino Serial Connection Instance'
});


ctx.registerType('arduino.serial.port', {
	inherits: 'core.device',
	label: 'Arduino Serial Port Device'
});


ctx.registerNode('availableforwrite', {
	import: 'arduino.base.base',
	categories: ['Arduino/Serial'],
	keywords: 'serial available,available serial',
	title:'Serial.availableForWrite()',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'connection', type: 'arduino.serial.connection', label: 'Connection'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'byte', type: 'core.type.byte', tooltip: 'The number of bytes available to read.'}
	],
	tooltip: 'Get the number of bytes (characters) available for writing in the serial buffer without blocking the write operation.'
});


ctx.registerNode('end', {
	import: 'arduino.base.base',
	categories: ['Arduino/Serial'],
	keywords: 'serial end,serial.end,end serial',
	title:'Serial.end()',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'connection', type: 'arduino.serial.connection', label: 'Connection'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'}
	],
	tooltip: 'Disables serial communication, allowing the RX and TX pins to be used for general input and output. To re-enable serial communication, call Serial.begin().'
});


ctx.registerNode('find', {
	import: 'arduino.base.base',
	categories: ['Arduino/Serial'],
	keywords: 'serial find,find serial',
	title:'Serial.find()',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'connection', type: 'arduino.serial.connection', label: 'Connection'},
		{id: 'target', type: 'core.type.string'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'found', type: 'core.type.bool'}
	],
	tooltip: 'Serial.find() reads data from the serial buffer until the target string of given length is found. The function returns true if target string is found, false if it times out.'
});


ctx.registerNode('finduntil', {
	import: 'arduino.base.base',
	categories: ['Arduino/Serial'],
	keywords: 'serial find until,find until serial',
	title:'Serial.findUntil()',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'connection', type: 'arduino.serial.connection', label: 'Connection'},
		{id: 'target', type: 'core.type.string'},
		{id: 'terminal', type: 'core.type.string'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'found', type: 'core.type.bool'}
	],
	tooltip: 'Serial.findUntil() reads data from the serial buffer until a target string of given length or terminator string is found.<br /><br />The function returns true if the target string is found, false if it times out.'
});


ctx.registerNode('flush', {
	import: 'arduino.base.base',
	categories: ['Arduino/Serial'],
	keywords: 'serial flush,flush serial',
	title:'Serial.flush()',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'connection', type: 'arduino.serial.connection', label: 'Connection'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'}
	],
	tooltip: 'Waits for the transmission of outgoing serial data to complete. (Prior to Arduino 1.0, this instead removed any buffered incoming serial data.)'
});


ctx.registerNode('parsefloat', {
	import: 'arduino.base.base',
	categories: ['Arduino/Serial'],
	keywords: 'serial parse float,parse float serial',
	title:'Serial.parseFloat()',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'connection', type: 'arduino.serial.connection', label: 'Connection'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'value', type: 'core.type.float'}
	],
	tooltip: 'Serial.parseFloat() returns the first valid floating point number from the Serial buffer. Characters that are not digits (or the minus sign) are skipped. parseFloat() is terminated by the first character that is not a floating point number.'
});


ctx.registerNode('parseint', {
	import: 'arduino.base.base',
	categories: ['Arduino/Serial'],
	keywords: 'serial parse int,parse int serial',
	title:'Serial.parseInt()',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'connection', type: 'arduino.serial.connection', label: 'Connection'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'value', type: 'core.type.int'}
	],
	tooltip: 'Looks for the next valid integer in the incoming serial stream.parseInt() inherits from the Stream utility class.'
});


ctx.registerNode('peek', {
	import: 'arduino.base.base',
	categories: ['Arduino/Serial'],
	keywords: 'serial peek,peek serial',
	title:'Serial.peek()',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'connection', type: 'arduino.serial.connection', label: 'Connection'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'int', type: 'core.type.int'}
	],
	tooltip: 'Returns the next byte (character) of incoming serial data without removing it from the internal serial buffer. That is, successive calls to peek() will return the same character, as will the next call to read(). peek() inherits from the Stream utility class.'
});


ctx.registerNode('print', {
	import: 'arduino.base.base',
	categories: ['Arduino/Serial'],
	keywords: 'serial print string,print string serial',
	title:'Serial.print()',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'connection', type: 'arduino.serial.connection', label: 'Connection'},
		{id: 'string', type: 'core.type.string'}	
	],
	outputs: [
		{id: 'exit', type: 'core.exec'}
	],
	tooltip: 'Prints data to the serial port as human-readable ASCII text.'
});


ctx.registerNode('println', {
	import: 'arduino.base.base',
	categories: ['Arduino/Serial'],
	keywords: 'serial println string,println string serial',
	title:'Serial.println()',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'connection', type: 'arduino.serial.connection', label: 'Connection'},
		{id: 'string', type: 'core.type.string'}	
	],
	outputs: [
		{id: 'exit', type: 'core.exec'}
	],
	tooltip: 'Prints data to the serial port as human-readable ASCII text followed by a carriage return character (ASCII 13, or "\r") and a newline character (ASCII 10, or "\n"). This command takes the same forms as Serial.print().'
});


ctx.registerNode('read', {
	import: 'arduino.base.base',
	categories: ['Arduino/Serial'],
	keywords: 'serial read,read serial',
	title:'Serial.read()',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'connection', type: 'arduino.serial.connection', label: 'Connection'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'out', type: 'core.type.int'}	
	],
	tooltip: 'Reads incoming serial data. read() inherits from the Stream utility class.'
});


ctx.registerNode('readbytes', {
	import: 'arduino.base.base',
	categories: ['Arduino/Serial'],
	keywords: 'serial read byte,byte read serial',
	title:'Serial.readBytes()',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'connection', type: 'arduino.serial.connection', label: 'Connection'},
		{id: 'length', type: 'core.type.int', tooltip: 'the number of bytes to read'},
		{id: 'bufferin', type: 'core.type.byte[]', tooltip: 'the buffer to store the bytes in'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'bytesread', type: 'core.type.int'},
		{id: 'bufferout', type: 'core.type.byte[]'}	
	],
	tooltip: 'Serial.readBytes() reads characters from the serial port into a buffer. The function terminates if the determined length has been read, or it times out (see Serial.setTimeout()).'
});


ctx.registerNode('readbytesuntil', {
	import: 'arduino.base.base',
	categories: ['Arduino/Serial'],
	keywords: 'serial read byte until,read byte until',
	title:'Serial.readBytes()',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'connection', type: 'arduino.serial.connection', label: 'Connection'},
		{id: 'length', type: 'core.type.int', tooltip: 'the number of bytes to read'},
		{id: 'bufferin', type: 'core.type.byte[]', tooltip: 'the buffer to store the bytes in'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'bytesread', type: 'core.type.int'},
		{id: 'bufferout', type: 'core.type.byte[]'}	
	],
	tooltip: 'Serial.readBytes() reads characters from the serial port into a buffer. The function terminates if the determined length has been read, or it times out (see Serial.setTimeout()).'
});


ctx.registerNode('settimeout', {
	import: 'arduino.base.base',
	categories: ['Arduino/Serial'],
	keywords: 'serial set time out,timeout serial,time out serial',
	title:'Serial.setTimeout()',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'connection', type: 'arduino.serial.connection', label: 'Connection'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'timeout', type: 'core.type.int'}
	],
	tooltip: 'Serial.setTimeout() sets the maximum milliseconds to wait for serial data when using serial.readBytesUntil() or serial.readBytes(). It defaults to 1000 milliseconds.'
});


ctx.registerNode('writebyte', {
	import: 'arduino.base.base',
	categories: ['Arduino/Serial'],
	keywords: 'serial write byte,byte,write serial byte',
	title:'Serial.write() (Byte)',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'connection', type: 'arduino.serial.connection', label: 'Connection'},
		{id: 'byte', type: 'core.type.byte', tooltip: 'Data to write on the serial port'}	
	],
	outputs: [
		{id: 'exit', type: 'core.exec'}
	],
	tooltip: 'Writes binary data to the serial port. This data is sent as a byte; to send the characters representing the digits of a number use the print() function instead.'
});


ctx.registerNode('writebytebuffer', {
	import: 'arduino.base.base',
	categories: ['Arduino/Serial'],
	keywords: 'serial write byte buffer,byte buffer,write byte buffer serial',
	title:'Serial.write() (Byte buffer)',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'connection', type: 'arduino.serial.connection', label: 'Connection'},
		{id: 'bytes', type: 'core.type.byte[]', label: 'Byte Buffer', tooltip: 'Buffer to send to serial port<br />Array of byte'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'size', type: 'core.type.int', label:'bytes written'}
	],
	tooltip: 'Writes binary data to the serial port. This data is sent as a byte buffer; to send the characters representing the digits of a number use the print() function instead.'
});


});
*/