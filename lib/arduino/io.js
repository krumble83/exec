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
