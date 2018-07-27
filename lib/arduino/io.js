;(function() {
"use strict";


exLIB.package('arduino.io', function(pack){
	
	pack.Category('Arduino/Digital IO Pin').Symbol('lib/img/arduino.png').Color('#87663f');
		
	pack.Type('dpin', 'Arduino Digital Pin').Inherits('core.component');
	
	pack.Enum('pinmode', 'Pin Mode').Values(['INPUT', 'OUTPUT', 'INPUT_PULLUP']);

	
	var n = pack.Node('pinmode', 'pinMode()')
		.Keywords('pinmode, pin mode')
		.MakeEntry().MakeExit();
	n.Input('pin', 'dpin', 'Digital Pin');
	n.Input('mode', 'pinmode');
	
	n = pack.Node('digitalwrite', 'digitalwrite()').Keywords('digitalwrite').MakeEntry().MakeExit();
	n.Input('pin', 'dpin', 'Digital Pin');
	n.Input('value', 'core.type.bool');
	
	n = pack.Node('digitalread', 'digitalRead()').Keywords('digitalread,read').MakeEntry().MakeExit();
	n.Input('pin', 'dpin', 'Digital Pin');
	n.Output('value', 'core.type.bool');	

	/*
	n = pack.Node('pwm', 'analogWrite() (pwm)').Keywords('analogwrite,pwm write,write analog').MakeEntry().MakeExit();
	n.Input('pin', 'arduino.io.dpin', 'Digital Pin');
	n.Input('dutyCycle', 'core.type.int').Tooltip('Between 0 (always off) and 255 (always on). Allowed data types: int');
	*/

	n = pack.Node('pulseIn', 'pulseIn()').MakeEntry().MakeExit();
	n.Input('pin', 'dpin');
	n.Input('value', 'core.type.bool').Label('LOW/HIGH');
	n.Input('timeout', 'core.type.int');
	n.Output('pulseLength', 'core.type.int');	
	
});


exLIB.package('arduino.io.ai', function(pack){
	
	pack.Category('Arduino/Analog IO Pin').Symbol('lib/img/arduino.png').Color('#87663f');
		
	pack.Type('apin', 'Arduino Analog Pin').Inherits('core.component');
		
	var n = pack.Node('analogRead', 'analogRead()').Keywords('read analog').Import('tpl.node.pure');
	n.Input('pin', 'apin', 'Analog Pin');
	n.Output('value', 'core.type.int').Tooltip('int(0 to 1023)');;
	
});


})(this);
