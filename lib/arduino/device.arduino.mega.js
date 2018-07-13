;Driver.load(function(ctx){

ctx.registerDevice('arduino.mega', {
	inherits: 'arduino.base',
	categories: ['Arduino'],
	title: 'Arduino Mega',
	provide: ['core.*'],
	devices: [
		{id: 'entry', type: 'core.exec'},
		{id: 'time', type: 'core.type.int', label:'Time in ms'}	
	]
});

ctx.registerComponent('arduino.mega', {
	inherits: 'arduino.base',
	categories: ['Arduino'],
	title: 'Arduino Mega',
	provide: ['network.wifi', 'core.*', 'arduino.'],
	devices: [{
			id: 'serial1', 
			categories: ['Serial'],
			label: 'Serial Port 1', 
			provide: ['hardware.serial.connection'],
			outputs: [
					{id: 'serial1', type:'hardware.serial.connection'}
				],
		},
		{id: 'serial2', type: 'core.exec', provide: ['hardware.serial.connection']},
		{id: 'serial3', type: 'core.exec', provide: ['hardware.serial.connection']},
		{
			id: 'dpin', 
			type: 'arduino.dpin', 
			label:'Digital Pin',
			properties: {
				pinnum: {type: UINT_8, editor: 
					{
						type: 'select',
						values: function(){
							//TODO: get availables pins
						}
					}
				}
			}
		}	
	],
	functions : {
		setup: {
			flags : 0,
			inputs: [],
			outputs: []
		},
		loop: {
			flags : 0,
			inputs: [],
			outputs: []
		}
	}
});

});