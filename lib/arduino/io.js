;exLIB.package('arduino.io', function(pack){
	
	pack.Category('Arduino/IO Pin').Symbol('lib/img/arduino.png').Color('#87663f');
	
	pack.Device('dpin', 'Arduino Digital Pin');
	pack.Device('apin', 'Arduino Analog Pin');
	
	pack.Type('dpin', 'Arduino Digital Pin').Inherits('core.object');
	pack.Type('apin', 'Arduino Analog Pin').Inherits('core.object');
	
	pack.Enum('pinmode', 'Pin Mode').Values(['INPUT', 'OUTPUT', 'INPUT_PULLUP']);

	
	var n = pack.Node('pinmode', 'pinMode()')
		.Keywords('pinmode, pin mode')
		.MakeEntry().MakeExit();
	n.Input('pin', 'arduino.io.dpin', 'Digital Pin');
	n.Input('mode', 'arduino.io.pinmode');
	
	n = pack.Node('digitalwrite', 'digitalwrite()').Keywords('digitalwrite').MakeEntry().MakeExit();
	n.Input('pin', 'arduino.io.dpin', 'Digital Pin');
	n.Input('value', 'core.type.bool');
	n.Output('pinout', 'arduino.io.dpin', 'Digital Pin');
	
	n = pack.Node('digitalread', 'digitalRead()').Keywords('digitalread,read').MakeEntry().MakeExit();
	n.Input('pin', 'arduino.io.dpin', 'Digital Pin');
	n.Output('value', 'core.type.bool');	

	n = pack.Node('pwm', 'analogWrite() (pwm)').Keywords('analogwrite,pwm write,write analog').MakeEntry().MakeExit();
	n.Input('pin', 'arduino.io.dpin', 'Digital Pin');
	n.Input('value', 'core.type.int');

	n = pack.Node('analogread', 'analogRead()').Keywords('analogread,read').MakeEntry().MakeExit();
	n.Input('pin', 'arduino.io.apin', 'Analog Pin');
	n.Output('value', 'core.type.int');

	n = pack.Node('pulseln', 'pulseln()').MakeEntry().MakeExit();
	n.Input('pin', 'arduino.io.dpin', 'Analog Pin');
	n.Input('value', 'core.type.bool').Label('LOW/HIGH');
	n.Input('timeout', 'core.type.int');
	n.Output('value', 'core.type.int');	
	
});


;exLIB.load('arduino.io', function(ctx){
	
ctx.registerType('arduino.dpin', {
	inherits: 'core.device',
	label: 'Arduino Digital Pin'
});

ctx.registerType('arduino.apin', {
	inherits: 'core.device',
	label: 'Arduino Analog Pin'
});


ctx.registerType('arduino.io.pinmode', {
	inherits: 'core.type.enum',
	label: 'Pin Mode',
	values: ['INPUT', 'OUTPUT', 'INPUT_PULLUP']
});


ctx.registerNode('pinmode', {
	import: 'arduino.base.base',
	categories: ['Arduino/IO Pin'],
	keywords: 'pinmode, pin mode',
	title:'Set Pin Mode',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'pinin', type: 'arduino.dpin', label:'Digital Pin'},
		{id: 'mode', type: 'arduino.io.pinmode'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'pinout', type: 'arduino.dpin', label:'Digital Pin'}
	]
});


ctx.registerNode('digitalwrite', {
	import: 'arduino.base.base',
	categories: ['Arduino/IO Pin'],
	keywords: 'digitalwrite',
	title:'Digital Write',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'pin', type: 'arduino.dpin', label:'Digital Pin'},
		{id: 'value', type: 'core.type.bool'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'}	
	]
});


ctx.registerNode('digitalread', {
	import: 'arduino.base.base',
	categories: ['Arduino/IO Pin'],
	keywords: 'digitalread,read',
	title:'Digital Read',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'pin', type: 'arduino.dpin', label:'Digital Pin'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'value', type: 'core.type.bool'}
	]
});


ctx.registerNode('io.pwm', {
	import: 'arduino.base.base',
	categories: ['Arduino/IO Pin'],
	keywords: 'analogwrite,pwm write,write analog',
	title:'Analog Write (pwm)',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'pin', type: 'arduino.apin', label:'Analog Pin'},
		{id: 'value', type: 'core.type.int'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'}	
	]
});


ctx.registerNode('analogread', {
	import: 'arduino.base.base',
	categories: ['Arduino/IO Pin'],
	keywords: 'analogread,read',
	title:'Analog Read',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'pin', type: 'arduino.apin', label:'Analog Pin'}	
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'value', type: 'core.type.int'}
	]
});


ctx.registerNode('pulseln', {
	import: 'arduino.base.base',
	categories: ['Arduino/IO Pin'],
	keywords: 'pulsein',
	title:'Pulse In',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'pin', type: 'arduino.apin', label:'Arduino Pin'},
		{id: 'value', type: 'core.type.bool', label:'LOW/HIGH'},
		{id: 'timeout', type: 'core.type.int'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'value', type: 'core.type.int'}
	]
});

});