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
	
	n = pack.Node('digitalread', 'digitalRead()').Keywords('digitalread,read').MakeEntry().MakeExit();
	n.Input('pin', 'arduino.io.dpin', 'Digital Pin');
	n.Output('value', 'core.type.bool');	

	n = pack.Node('pwm', 'analogWrite() (pwm)').Keywords('analogwrite,pwm write,write analog').MakeEntry().MakeExit();
	n.Input('pin', 'arduino.io.dpin', 'Digital Pin');
	n.Input('dutyCycle', 'core.type.int').Tooltip('Between 0 (always off) and 255 (always on). Allowed data types: int');

	n = pack.Node('analogRead', 'analogRead()').Keywords('read analog').Import('tpl.node.pure');
	n.Input('pin', 'arduino.io.apin', 'Analog Pin');
	n.Output('value', 'core.type.int').Tooltip('int(0 to 1023)');;

	n = pack.Node('pulseIn', 'pulseIn()').MakeEntry().MakeExit();
	n.Input('pin', 'arduino.io.dpin');
	n.Input('value', 'core.type.bool').Label('LOW/HIGH');
	n.Input('timeout', 'core.type.int');
	n.Output('pulseLength', 'core.type.int');	
	
});
