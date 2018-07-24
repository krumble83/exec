;exLIB.package('arduino.device', function(pack){

	return;


	var dev = pack.Device('duemilanove', 'Arduino Duemilanove Board').Category('Arduino')
	dev.Provide('type:core.type.int', 'type:core.type.string')
	
	dev.Function('setup', 'void');
	dev.Function('loop', 'void');
	
	dev.Component('serial').Label('Serial Port').Require('component:d0', 'component:d1');
	dev.Component('di0', 'Digital Input D0').Require('component:do0');
	dev.Component('di1', 'Digital Input D1').Require('component:do1');
	dev.Component('di2', 'Digital Input D2').Require('component:do2');
	dev.Component('di3', 'Digital Input D3').Require('component:do3');
	dev.Component('di4', 'Digital Input D4').Require('component:do4');
	dev.Component('di5', 'Digital Input D5').Require('component:do5');
	dev.Component('di6', 'Digital Input D6').Require('component:do6');
	dev.Component('di7', 'Digital Input D7').Require('component:do7');
	dev.Component('di8', 'Digital Input D8').Require('component:do8');
	dev.Component('di9', 'Digital Input D9').Require('component:do9');
	dev.Component('di10', 'Digital Input D10').Require('component:do10');
	dev.Component('di11', 'Digital Input D11').Require('component:do11');
	dev.Component('di12', 'Digital Input D12').Require('component:do12');
	dev.Component('di13', 'Digital Input D13').Require('component:do13');

	dev.Component('do0', 'Digital Output D0').Require('component:di0');
	dev.Component('do1', 'Digital Output D1').Require('component:di1');
	dev.Component('do2', 'Digital Output D2').Require('component:di2');
	dev.Component('do3', 'Digital Output D3').Require('component:di3');
	dev.Component('do4', 'Digital Output D4').Require('component:di4');
	dev.Component('do5', 'Digital Output D5').Require('component:di5');
	dev.Component('do6', 'Digital Output D6').Require('component:di6');
	dev.Component('do7', 'Digital Output D7').Require('component:di7');
	dev.Component('do8', 'Digital Output D8').Require('component:di8');
	dev.Component('do9', 'Digital Output D9').Require('component:di9');
	dev.Component('do10', 'Digital Output D10').Require('component:di10');
	dev.Component('do11', 'Digital Output D11').Require('component:di11');
	dev.Component('do12', 'Digital Output D12').Require('component:di12');
	dev.Component('do13', 'Digital Output D13').Require('component:di13');

	dev.Component('a0', 'Analog Input A0');
	dev.Component('a1', 'Analog Input A1');
	dev.Component('a2', 'Analog Input A2');
	dev.Component('a3', 'Analog Input A3');
	dev.Component('a4', 'Analog Input A4');
	dev.Component('a5', 'Analog Input A5');

	dev.Component('pwm3', 'PWM Output on D3').Require('component:di3').Require('component:do3');
	dev.Component('pwm5', 'PWM Output on D5').Require('component:di5').Require('component:do5');
	dev.Component('pwm6', 'PWM Output on D6').Require('component:di6').Require('component:do6');
	dev.Component('pwm9', 'PWM Output on D9').Require('component:di9').Require('component:do9');
	dev.Component('pwm10', 'PWM Output on D10').Require('component:di10').Require('component:do10');
	dev.Component(':pwm11', 'PWM Output on D11').Require('component:di11').Require('component:do11');

	
	dev.Component('spi0').Label('SPI Port')
		.Require('component:di11').Require('component:do11')
		.Require('component:di12').Require('component:do12')
		.Require('component:di13').Require('component:do13')
		
	dev.Component('component:i2c').Label('I²c Port').Require('component:a4').Require('component:a5');
});
