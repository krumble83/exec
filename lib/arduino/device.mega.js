;(function() {
"use strict";

exLIB.package('arduino.device', function(pack){
	
	var dev = pack.Device('mega.beginer', 'Arduino Mega Board (Beginer)').Category('Arduino')
	
	dev.Provide('platform', 'arduino');
	
	dev.Provide('type'
		, 'core.type.int'
		, 'core.type.string'
	);
	
	dev.Provide('library'
		, 'arduino.base'
	);

	//dev.Function('setup');
	//dev.Function('loop');
	
	
/******************************************************************
	Serial ports
******************************************************************/		
	dev.Component('serial', 'Serial Ports', function(){
		
		this.Provide('component', 'arduino.serial.port');
		
		
		this.Component('serial', 'Serial Port').Require('component', 'di0,di1,do0,do1');
		this.Component('serial1', 'Serial Port 1').Require('component', 'di19,do19,di18,do18');
		this.Component('serial2', 'Serial Port 2').Require('component', 'di16,di17,do16,do17');
		this.Component('serial3', 'Serial Port 3').Require('component', 'di14,di15,do14,do15');
	});
	
/******************************************************************
	Digital i/o
******************************************************************/
	dev.Component('dpin', 'Digital Inputs', function(){
		
		this.Provide('component', 'arduino.io.dpin');
		
		this.Component('di0', 'Digital Input D0').Require('component', 'do0').Provide('component', 'arduino.io.dpin');
		this.Component('di1', 'Digital Input D1').Require('component', 'do1');
		this.Component('di2', 'Digital Input D2').Require('component', 'do2');
		this.Component('di3', 'Digital Input D3').Require('component', 'do3');
		this.Component('di4', 'Digital Input D4').Require('component', 'do4');
		this.Component('di5', 'Digital Input D5').Require('component', 'do5');
		this.Component('di6', 'Digital Input D6').Require('component', 'do6');
		this.Component('di7', 'Digital Input D7').Require('component', 'do7');
		this.Component('di8', 'Digital Input D8').Require('component', 'do8');
		this.Component('di9', 'Digital Input D9').Require('component', 'do9');
		this.Component('di10', 'Digital Input D10').Require('component', 'do10');
		this.Component('di11', 'Digital Input D11').Require('component', 'do11');
		this.Component('di12', 'Digital Input D12').Require('component', 'do12');
		this.Component('di13', 'Digital Input D13').Require('component', 'do13');
		this.Component('di14', 'Digital Input D14').Require('component', 'do14');
		this.Component('di15', 'Digital Input D15').Require('component', 'do15');
		this.Component('di16', 'Digital Input D16').Require('component', 'do16');
		this.Component('di17', 'Digital Input D17').Require('component', 'do17');
		this.Component('di18', 'Digital Input D18').Require('component', 'do18');
		this.Component('di19', 'Digital Input D19').Require('component', 'do19');
		this.Component('di20', 'Digital Input D20').Require('component', 'do20');
		this.Component('di21', 'Digital Input D21').Require('component', 'do21');
		this.Component('di22', 'Digital Input D22').Require('component', 'do22');
		this.Component('di23', 'Digital Input D23').Require('component', 'do23');
		this.Component('di24', 'Digital Input D24').Require('component', 'do24');
		this.Component('di25', 'Digital Input D25').Require('component', 'do25');
		this.Component('di26', 'Digital Input D26').Require('component', 'do26');
		this.Component('di27', 'Digital Input D27').Require('component', 'do27');
		this.Component('di28', 'Digital Input D28').Require('component', 'do28');
		this.Component('di29', 'Digital Input D29').Require('component', 'do29');
		this.Component('di30', 'Digital Input D30').Require('component', 'do30');
		this.Component('di31', 'Digital Input D31').Require('component', 'do31');
		this.Component('di32', 'Digital Input D32').Require('component', 'do32');
		this.Component('di33', 'Digital Input D33').Require('component', 'do33');
		this.Component('di34', 'Digital Input D34').Require('component', 'do34');
		this.Component('di35', 'Digital Input D35').Require('component', 'do35');
		this.Component('di36', 'Digital Input D36').Require('component', 'do36');
		this.Component('di37', 'Digital Input D37').Require('component', 'do37');
		this.Component('di38', 'Digital Input D38').Require('component', 'do38');
		this.Component('di39', 'Digital Input D39').Require('component', 'do39');
		this.Component('di40', 'Digital Input D40').Require('component', 'do40');
		this.Component('di41', 'Digital Input D41').Require('component', 'do41');
		this.Component('di42', 'Digital Input D42').Require('component', 'do42');
		this.Component('di43', 'Digital Input D43').Require('component', 'do43');
		this.Component('di44', 'Digital Input D44').Require('component', 'do44');
		this.Component('di45', 'Digital Input D45').Require('component', 'do45');
		this.Component('di46', 'Digital Input D46').Require('component', 'do46');
		this.Component('di47', 'Digital Input D47').Require('component', 'do47');
		this.Component('di48', 'Digital Input D48').Require('component', 'do48');
		this.Component('di49', 'Digital Input D49').Require('component', 'do49');
		this.Component('di50', 'Digital Input D50').Require('component', 'do50');
		this.Component('di51', 'Digital Input D51').Require('component', 'do51');
		this.Component('di52', 'Digital Input D52').Require('component', 'do52');
		this.Component('di53', 'Digital Input D53').Require('component', 'do53');
	});

	dev.Component('do', 'Digital Outputs', function(){	
		
		this.Provide('component', 'arduino.io.dpin');
		
		this.Component('do0', 'Digital Output D0').Require('component', 'di0');
		this.Component('do1', 'Digital Output D1').Require('component', 'di1');
		this.Component('do2', 'Digital Output D2').Require('component', 'di2');
		this.Component('do3', 'Digital Output D3').Require('component', 'di3');
		this.Component('do4', 'Digital Output D4').Require('component', 'di4');
		this.Component('do5', 'Digital Output D5').Require('component', 'di5');
		this.Component('do6', 'Digital Output D6').Require('component', 'di6');
		this.Component('do7', 'Digital Output D7').Require('component', 'di7');
		this.Component('do8', 'Digital Output D8').Require('component', 'di8');
		this.Component('do9', 'Digital Output D9').Require('component', 'di9');
		this.Component('do10', 'Digital Output D10').Require('component', 'di10');
		this.Component('do11', 'Digital Output D11').Require('component', 'di11');
		this.Component('do12', 'Digital Output D12').Require('component', 'di12');
		this.Component('do13', 'Digital Output D13').Require('component', 'di13');
		this.Component('do14', 'Digital Output D14').Require('component', 'di14');
		this.Component('do15', 'Digital Output D15').Require('component', 'di15');
		this.Component('do16', 'Digital Output D16').Require('component', 'di16');
		this.Component('do17', 'Digital Output D17').Require('component', 'di17');
		this.Component('do18', 'Digital Output D18').Require('component', 'di18');
		this.Component('do19', 'Digital Output D19').Require('component', 'di19');
		this.Component('do20', 'Digital Output D20').Require('component', 'di20');
		this.Component('do21', 'Digital Output D21').Require('component', 'di21');
		this.Component('do22', 'Digital Output D22').Require('component', 'di22');
		this.Component('do23', 'Digital Output D23').Require('component', 'di23');
		this.Component('do24', 'Digital Output D24').Require('component', 'di24');
		this.Component('do25', 'Digital Output D25').Require('component', 'di25');
		this.Component('do26', 'Digital Output D26').Require('component', 'di26');
		this.Component('do27', 'Digital Output D27').Require('component', 'di27');
		this.Component('do28', 'Digital Output D28').Require('component', 'di28');
		this.Component('do29', 'Digital Output D29').Require('component', 'di29');
		this.Component('do30', 'Digital Output D30').Require('component', 'di30');
		this.Component('do31', 'Digital Output D31').Require('component', 'di31');
		this.Component('do32', 'Digital Output D32').Require('component', 'di32');
		this.Component('do33', 'Digital Output D33').Require('component', 'di33');
		this.Component('do34', 'Digital Output D34').Require('component', 'di34');
		this.Component('do35', 'Digital Output D35').Require('component', 'di35');
		this.Component('do36', 'Digital Output D36').Require('component', 'di36');
		this.Component('do37', 'Digital Output D37').Require('component', 'di37');
		this.Component('do38', 'Digital Output D38').Require('component', 'di38');
		this.Component('do39', 'Digital Output D39').Require('component', 'di39');
		this.Component('do40', 'Digital Output D40').Require('component', 'di40');
		this.Component('do41', 'Digital Output D41').Require('component', 'di41');
		this.Component('do42', 'Digital Output D42').Require('component', 'di42');
		this.Component('do43', 'Digital Output D43').Require('component', 'di43');
		this.Component('do44', 'Digital Output D44').Require('component', 'di44');
		this.Component('do45', 'Digital Output D45').Require('component', 'di45');
		this.Component('do46', 'Digital Output D46').Require('component', 'di46');
		this.Component('do47', 'Digital Output D47').Require('component', 'di47');
		this.Component('do48', 'Digital Output D48').Require('component', 'di48');
		this.Component('do49', 'Digital Output D49').Require('component', 'di49');
		this.Component('do50', 'Digital Output D50').Require('component', 'di50');
		this.Component('do51', 'Digital Output D51').Require('component', 'di51');
		this.Component('do52', 'Digital Output D52').Require('component', 'di52');
		this.Component('do53', 'Digital Output D53').Require('component', 'di53');
	});
	
/******************************************************************
	Analog inputs
******************************************************************/	
	dev.Component('ai', 'Analog Inputs', function(){
		
		this.Provide('component', 'arduino.io.apin');
		
		this.Component('a0', 'Analog Input A0');
		this.Component('a1', 'Analog Input A1');
		this.Component('a2', 'Analog Input A2');
		this.Component('a3', 'Analog Input A3');
		this.Component('a4', 'Analog Input A4');
		this.Component('a5', 'Analog Input A5');
		this.Component('a6', 'Analog Input A6');
		this.Component('a7', 'Analog Input A7');
		this.Component('a8', 'Analog Input A8');
		this.Component('a9', 'Analog Input A9');
		this.Component('a10', 'Analog Input A10');
		this.Component('a11', 'Analog Input A11');
		this.Component('a12', 'Analog Input A12');
		this.Component('a13', 'Analog Input A13');
		this.Component('a14', 'Analog Input A14');
		this.Component('a15', 'Analog Input A15');
	});
	
/******************************************************************
	Pwm
******************************************************************/	
	dev.Component('pwm', 'Pulse Width Modulation (PWM)', function(){
		
		this.Provide('component', 'arduino.io.apin');
		
		this.Component('pwm2', 'PWM Output on D2').Require('component', 'di2,do2');
		this.Component('pwm3', 'PWM Output on D3').Require('component', 'di3,do3');
		this.Component('pwm4', 'PWM Output on D4').Require('component', 'di4,do4');
		this.Component('pwm5', 'PWM Output on D5').Require('component', 'di5,do5');
		this.Component('pwm6', 'PWM Output on D6').Require('component', 'di6,do6');
		this.Component('pwm7', 'PWM Output on D7').Require('component', 'di7,do7');
		this.Component('pwm8', 'PWM Output on D8').Require('component', 'di8,do8');
		this.Component('pwm9', 'PWM Output on D9').Require('component', 'di9,do9');
		this.Component('pwm10', 'PWM Output on D10').Require('component', 'di10,do10');
		this.Component('pwm11', 'PWM Output on D11').Require('component', 'di11,do11');
		this.Component('pwm12', 'PWM Output on D12').Require('component', 'di12,do12');
		this.Component('pwm13', 'PWM Output on D13').Require('component', 'di13,do13');
		this.Component('pwm44', 'PWM Output on D44').Require('component', 'di44,do44');
		this.Component('pwm45', 'PWM Output on D45').Require('component', 'di45,do45');
		this.Component('pwm46', 'PWM Output on D46').Require('component', 'di46,do46');
	});

	
/******************************************************************
	Others ports
******************************************************************/		
	dev.Component('other', 'Other Ports', function(){
		this.Component('spi0', 'SPI Port').Provide('type', 'arduino.io.spi').Require('component', 'di50,do50,di51,do51,di52,do52');
		this.Component('twi0').Label('TWI Port').Provide('type', 'arduino.io.twi').Require('component', 'di20,do20,di21,do21');
		this.Component('i2c').Label('I²c Port').Provide('type', 'arduino.io.i2c').Require('component', 'a4,a5');
	});
});



})(this);
