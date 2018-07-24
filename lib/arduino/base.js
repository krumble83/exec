;(function() {
"use strict";

exLIB.package('arduino.core', function(pack){
	
	pack.Category('Arduino').Symbol('lib/img/arduino.png').Color('#87663f');
	
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
	
});

})(this);
