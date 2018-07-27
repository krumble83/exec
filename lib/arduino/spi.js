;(function() {
"use strict";

exLIB.package('arduino.spi', function(pack){
	
	pack.Category('Arduino/SPI').Symbol('lib/img/arduino.png').Color('#87663f');
	
	pack.Enum('dataorder', 'Data Order').Values(['MSBFIRST', 'LSBFIRST']);
	pack.Enum('datamode', 'Data Mode').Values(['SPI_MODE0', 'SPI_MODE1', 'SPI_MODE2', 'SPI_MODE3']);
	pack.Enum('interruptmode', 'Interrupt Mode').Values(['LOW', 'CHANGE', 'RISING', 'FALLING', 'HIGH']);
	
	var s = pack.Struct('setting', 'SPI Setting')
	s.Member('speedMaximum', 'core.type.int', 'BUS Max Speed');
	s.Member('dataOrder', 'arduino.spi.dataorder', 'DataOrder');
	s.Member('dataMode', 'arduino.spi.datamode', 'SPI DataMode');
	
	var n = pack.Node('begintransaction', 'SPI.Begin()').Keywords('spi begin transaction').MakeEntry().MakeExit();
	n.Input('spisetting', 'arduino.spi.setting', 'SPI Settings');
	
	pack.Node('end', 'SPI.end()').Keywords('spi end').MakeEntry().MakeExit();
	pack.Node('endtransaction', 'SPI.End()').Keywords('spi end transaction').MakeEntry().MakeExit();
});


})(this);

/*
;exLIB.load('arduino.spi', function(ctx){
	
ctx.registerType('arduino.spi.dataorder', {
	inherits: 'core.type.enum',
	label: 'Data Order',
	values: ['MSBFIRST', 'LSBFIRST']
});

ctx.registerType('arduino.spi.datamode', {
	inherits: 'core.type.enum',
	label: 'Data Mode',
	values: ['SPI_MODE0', 'SPI_MODE1', 'SPI_MODE2', 'SPI_MODE3']
});

ctx.registerType('arduino.spi.setting', {
	inherits: 'core.type.struct',
	categories: ['Arduino/SPI'],
	label: 'SPI Setting',
	members: [
		{id: 'speedMaximum', type: 'core.type.int', label: 'BUS Max Speed'},
		{id: 'dataOrder', type: 'arduino.spi.dataorder', label: 'DataOrder'},
		{id: 'dataMode', type: 'arduino.spi.datamode', label: 'SPI DataMode'},
	]
});

ctx.registerNode('beginTransaction', {
	import: 'arduino.base.base',
	categories: ['Arduino/SPI'],
	keywords: 'spi begin transaction',
	title:'SPI Begin Transaction',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'spisetting', type: 'arduino.spi.setting', label: 'SPI Settings'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'}
	]
});

ctx.registerNode('begin', {
	import: 'arduino.base.base',
	categories: ['Arduino/SPI'],
	keywords: 'spi begin',
	title:'SPI Begin',
	inputs: [
		{id: 'entry', type: 'core.exec'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'}
	]
});

ctx.registerNode('end', {
	import: 'arduino.base.base',
	categories: ['Arduino/SPI'],
	keywords: 'spi end',
	title:'SPI End',
	inputs: [
		{id: 'entry', type: 'core.exec'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'}
	]
});

ctx.registerNode('endtransaction', {
	import: 'arduino.base.base',
	categories: ['Arduino/SPI'],
	keywords: 'spi end transaction',
	title:'SPI End Transaction',
	inputs: [
		{id: 'entry', type: 'core.exec'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'}
	]
});

ctx.registerNode('setbyteorder', {
	import: 'arduino.base.base',
	categories: ['Arduino/SPI'],
	keywords: 'spi set byte order',
	title:'SPI Set Byte Order',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'entry', type: 'arduino.spi.dataorder'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'}
	]
});

});
*/