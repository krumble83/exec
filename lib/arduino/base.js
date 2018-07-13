;exLIB.package('arduino.core', function(pack){
	
	pack.Category('Arduino').Symbol('lib/img/arduino.png').Color('#9c39da');
	
	var n = pack.Node('freememory', 'freeMemory()').Keywords('free memory').Tooltip('Get Arduino Free RAM');
	n.Output('freemem', 'core.type.int', 'Free Memory');

	
	n = pack.Node('delay', 'delay()').Keywords('delay,pause').Tooltip('Pause program for x ms').MakeEntry().MakeExit();
	n.Input('time', 'core.type.int', 'Time in ms');
	
	n = pack.Node('delaymicroseconds', 'delayMicroseconds()').Keywords('delay,pause').MakeEntry().MakeExit()
		.Tooltip('Pauses the program for the amount of time (in microseconds) specified as parameter. There are a thousand microseconds in a millisecond, and a million microseconds in a second.');
	n.Input('time', 'core.type.int', 'Time in ms').Tooltip('the number of microseconds to pause (unsigned int)');

	n = pack.Node('millis', 'millis()').Keywords('millis').Tooltip('Pause program for x ms');
	n.Output('time', 'core.type.int', 'Time in ms').Tooltip('Number of milliseconds since the program started (unsigned long)');
	
	n = pack.Node('micros', 'micros()').Keywords('micros').Tooltip('Pause program for x ms')
		.Tooltip('Returns the number of microseconds since the Arduino board began running the current program. This number will overflow (go back to zero), after approximately 70 minutes.');
	n.Output('time', 'core.type.int', 'Time in µs').Tooltip('Number of microseconds since the program started (unsigned long)');

	n = pack.Node('isgraph', 'isGraph()').Keywords('is graph')
		.Tooltip('Analyse if a char is printable with some content (space is printable but has no content). Returns true if thisChar is printable.');
	n.Input('input', 'core.type.int', 'Char');
	n.Output('isChar', 'core.type.bool').Tooltip('Number of milliseconds since the program started (unsigned long)');

	n = pack.Node('randomseed', 'randomSeed()').Keywords('random seed,seed').MakeEntry().MakeExit()
		.Tooltip('randomSeed() initializes the pseudo-random number generator, causing it to start at an arbitrary point in its random sequence. This sequence, while very long, and random, is always the same.');
	n.Input('seed', 'core.type.int');

	n = pack.Node('random', 'random()').Keywords('random seed,seed')
		.Tooltip('The random function generates pseudo-random numbers.<br /><br />min - lower bound of the random value, inclusive (optional)<br />max - upper bound of the random value, exclusive.');
	n.Input('min', 'core.type.int');
	n.Input('max', 'core.type.int');
	n.Output('out', 'core.type.int');
	
});


;exLIB.load('arduino.base', function(ctx){


ctx.registerNode('base', {
	import: 'core.function',
	color: '#87663f',
	symbol: 'lib/img/arduino.png'
});


ctx.registerNode('freememory', {
	import: 'arduino.base.base',
	categories: ['Arduino'],
	keywords: 'free memory',
	title:'freeMemory',
	inputs: [],
	outputs: [
		{id: 'freemem', type: 'core.type.int', label:'Free Memory'}	
	],
	tooltip: 'Get Arduino Free RAM'
});


ctx.registerNode('delay', {
	import: 'arduino.base.base',
	categories: ['Arduino'],
	keywords: 'delay,pause',
	title:'delay()',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'time', type: 'core.type.int', label:'Time in ms'}	
	],
	outputs: [
		{id: 'exit', type: 'core.exec'}
	],
	tooltip: 'Pause program for x ms'
});


ctx.registerNode('delaymicroseconds', {
	import: 'arduino.base.base',
	categories: ['Arduino'],
	keywords: 'delay,pause',
	title:'delayMicroseconds()',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'us', type: 'core.type.int', label:'the number of microseconds to pause (unsigned int)'}	
	],
	outputs: [
		{id: 'exit', type: 'core.exec'}
	],
	tooltip: 'Pauses the program for the amount of time (in microseconds) specified as parameter. There are a thousand microseconds in a millisecond, and a million microseconds in a second.'
});


ctx.registerNode('millis', {
	import: 'arduino.base.base',
	categories: ['Arduino'],
	keywords: 'millis',
	title:'millis()',
	inputs: [],
	outputs: [
		{id: 'millis', type: 'core.type.int', tooltip: 'Number of milliseconds since the program started (unsigned long)'}
	],
	tooltip: 'Returns the number of milliseconds since the Arduino board began running the current program. This number will overflow (go back to zero), after approximately 50 days.'
});


ctx.registerNode('micros', {
	import: 'arduino.base.base',
	categories: ['Arduino'],
	keywords: 'micros',
	title:'micros()',
	inputs: [],
	outputs: [
		{id: 'micros', type: 'core.type.int', tooltip: 'Number of microseconds since the Arduino board began running the current program.(unsigned long)'}
	],
	tooltip: 'Returns the number of microseconds since the Arduino board began running the current program. This number will overflow (go back to zero), after approximately 70 minutes.'
});


ctx.registerNode('isgraph', {
	import: 'arduino.base.base',
	categories: ['Arduino'],
	keywords: 'is graph',
	title:'isGraph',
	inputs: [
		{id: 'input', type: 'core.type.char', label:'Char'}	
	],
	outputs: [
		{id: 'isChar', type: 'core.type.bool'}
	],
	tooltip: 'Analyse if a char is printable with some content (space is printable but has no content). Returns true if thisChar is printable.'
});


ctx.registerNode('randomseed', {
	import: 'arduino.base.base',
	categories: ['Arduino'],
	keywords: 'random seed,seed',
	title:'randomSeed',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'seed', type: 'core.type.int'}	
	],
	outputs: [
		{id: 'exit', type: 'core.exec'}
	],
	tooltip: 'randomSeed() initializes the pseudo-random number generator, causing it to start at an arbitrary point in its random sequence. This sequence, while very long, and random, is always the same.'
});


ctx.registerNode('random', {
	import: 'arduino.base.base',
	categories: ['Arduino'],
	keywords: 'random',
	title:'random number',
	inputs: [
		{id: 'min', type: 'core.type.int'},
		{id: 'max', type: 'core.type.int'}	
	],
	outputs: [
		{id: 'out', type: 'core.type.int'}	
	],
	tooltip: 'The random function generates pseudo-random numbers.<br /><br />min - lower bound of the random value, inclusive (optional)<br />max - upper bound of the random value, exclusive'
});


});
