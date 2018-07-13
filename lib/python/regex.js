;exLIB.package('python.regex', function(pack){
	
	pack.Category('Python/Regular Expression').Symbol('lib/img/re.png').Color('#87663f');
	
	pack.Type('regexp', 'Python Regular Expression').Inherits('core.object');
	pack.Type('groups', 'Python Regex group').Inherits('core.object');
	pack.Type('flag', 'Python Regex flag').Inherits('core.object');
	
	var n = pack.Node('flag.make', 'Make Regular Expression Flag').Keywords('regex flag, regexp flag, flag regexp');
	n.Input('DOTALL', 'core.type.bool').Tooltip('Make . match any character, including newlines');
	n.Input('IGNORECASE', 'core.type.bool').Tooltip('Do case-insensitive matches');
	n.Input('LOCALE', 'core.type.bool').Tooltip('Do a locale-aware match');
	n.Input('MULTILINE', 'core.type.bool').Tooltip('Multi-line matching, affecting ^ and $');
	n.Input('VERBOSE', 'core.type.bool').Tooltip('Enable verbose REs, which can be organized more cleanly and understandably.');
	n.Input('UNICODE', 'core.type.bool').Tooltip('Makes several escapes like \w, \b, \s and \d dependent on the Unicode character database.');
	n.Output('flags', 'python.regex.flag');
		
	n = pack.Node('make', 'Make Regular Expression').Keywords('regex,regular expression,python regex,python regular expression');
	n.Input('pattern', 'core.type.string');
	n.Input('flags', 'python.regex.flag');
	n.Output('expression', 'python.regex.regexp');
	
	n = pack.Node('search', 'Regex.search()').Keywords('regex search').MakeEntry().MakeExit();
	n.Input('expression', 'python.regex.regexp');
	n.Output('start', 'core.type.int').Tooltip('Return the starting position of the match');	
	n.Output('end', 'core.type.int').Tooltip('Return the ending position of the match');
	n.Output('span', 'python.type.tuple').Tooltip('Return a tuple containing the (start, end) positions of the match');
	n.Output('groups', 'python.regex.groups');
	
	pack.Node('match', 'Regex.match()').Import('search').Keywords('regex match');
	pack.Node('findall', 'Regex.findall()').Import('search').Keywords('regex match');

	n = pack.Node('split', 'Regex.split()').Keywords('regexp search').MakeEntry().MakeExit();
	n.Input('expression', 'python.regex.regexp');
	n.Input('maxsplit', 'core.python.int');
	n.Output('result', 'core.type.string[]');
	
	n = pack.Node('sub', 'Regex.sub()').Keywords('regexp sub,sub regexp').MakeEntry().MakeExit();
	n.Input('expression', 'python.regex.regexp');
	n.Input('string', 'core.type.string');
	n.Input('replacement', 'core.type.string');
	n.Input('count', 'core.type.int').Tooltip('The optional argument count is the maximum number of pattern occurrences to be replaced; count must be a non-negative integer. The default value of 0 means to replace all occurrences.');
	n.Output('result', 'core.type.string');	
	
	n = pack.Node('subn', 'Regex.subn()').Import('sub').Keywords('regexp subn,subn regexp')
		.Tooltip('The subn() method does the same work as sub(), but returns a 2-tuple containing the new string value and the number of replacements that were performed');
	n.Output('result', 'python.type.tuple').Tooltip('The optional argument count is the maximum number of pattern occurrences to be replaced; count must be a non-negative integer. The default value of 0 means to replace all occurrences.');

	n = pack.Node('group_group', 'Regex get String').Keywords('regexp group string');
	n.Input('groups', 'python.regex.groups');
	n.Input('group', 'core.type.int');
	n.Output('string', 'core.type.string');		

	n = pack.Node('group_string', 'Regex get sub group').Keywords('regexp group');
	n.Input('groupsin', 'python.regex.groups');
	n.Input('group', 'core.type.int');
	n.Output('out', 'python.regex.groups');		
	
});


;exLIB.load('python.base', function(ctx){


/*
ctx.registerType('python.regexp', {
	inherits: 'core.object',
	label: 'Python Regular Expression'
});

ctx.registerType('python.regexp_flag', {
	inherits: 'core.object',
	label: 'Python Regex flag'
});

*/

ctx.registerType('python.regexp.groups', {
	inherits: 'core.object',
	label: 'Python Regex group'
});


ctx.registerType('python.type.regexp', {
	inherits: 'core.type.struct',
	categories: ['Python/Regular Expression'],
	label: 'Python Regular Expression',
	members: [
		{id: 'pattern', type: 'core.type.string'},
		{id: 'flags', type: 'python.type.regexp.flag'}
	]
});

ctx.registerType('python.type.regexp.flag', {
	inherits: 'core.type.struct',
	categories: ['Python/Regular Expression'],
	label: 'Python Regex Flag',
	members: [
		{id: 'DOTALL', type: 'core.type.bool', tooltip:'Make . match any character, including newlines'},
		{id: 'IGNORECASE', type: 'core.type.bool', tooltip:'Do case-insensitive matches'},
		{id: 'LOCALE', type: 'core.type.bool', tooltip:'Do a locale-aware match'},
		{id: 'MULTILINE', type: 'core.type.bool', tooltip:'Multi-line matching, affecting ^ and $'},
		{id: 'VERBOSE', type: 'core.type.bool', tooltip:'Enable verbose REs, which can be organized more cleanly and understandably.'},
		{id: 'UNICODE', type: 'core.type.bool', tooltip:'Makes several escapes like \w, \b, \s and \d dependent on the Unicode character database.'},
	]
});




ctx.registerNode('python_regexp', {
	color: '#87663f',
	symbol: 'lib/img/re.png'
});

/*
ctx.registerNode('regexp_make_flag', {
	inherits: 'python_regexp',
	categories: ['Python/Regular Expression'],
	keywords: 'regex flag, regexp flag, flag regexp',
	title:'Make Regular Expression Flag',
	inputs: [
		{id: 'DOTALL', type: 'core.type.bool', tooltip:'Make . match any character, including newlines'},
		{id: 'IGNORECASE', type: 'core.type.bool', tooltip:'Do case-insensitive matches'},
		{id: 'LOCALE', type: 'core.type.bool', tooltip:'Do a locale-aware match'},
		{id: 'MULTILINE', type: 'core.type.bool', tooltip:'Multi-line matching, affecting ^ and $'},
		{id: 'VERBOSE', type: 'core.type.bool', tooltip:'Enable verbose REs, which can be organized more cleanly and understandably.'},
		{id: 'UNICODE', type: 'core.type.bool', tooltip:'Makes several escapes like \w, \b, \s and \d dependent on the Unicode character database.'},
	],
	outputs: [
		{id: 'flags', type: 'python.regexp_flag'}
	]
});


ctx.registerNode('regexp_make', {
	inherits: 'python_regexp',
	categories: ['Python/Regular Expression'],
	keywords: 'regex,regular expression,python regex,python regular expression',
	title:'Make Regular Expression ',
	inputs: [
		{id: 'pattern', type: 'core.type.string'},
		{id: 'flags', type: 'python.type.regexp.flag'}
	],
	outputs: [
		{id: 'expression', type: 'python.type.regexp'}
	]
});
*/

ctx.registerNode('regexp_search', {
	import: 'python_regexp',
	categories: ['Python/Regular Expression'],
	keywords: 'search regexp,find regexp',
	title:'Regex.search()',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'expression', type: 'python.type.regexp'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'start', type: 'core.type.int', tooltip:'Return the starting position of the match'},
		{id: 'end', type: 'core.type.int', tooltip:'Return the ending position of the match'},
		{id: 'span', type: 'python.type.tuple', tooltip:'Return a tuple containing the (start, end) positions of the match'},
		{id: 'groups', type: 'python.regexp.groups', tooltip:''}
	]
});

ctx.registerNode('regexp_match', {
	import: 'regexp_search',
	categories: ['Python/Regular Expression'],
	title:'Regex.match()',
	keywords: 'match regexp,search regexp,find regexp'
	
});

ctx.registerNode('regexp_findall', {
	import: 'regexp_search',
	categories: ['Python/Regular Expression'],
	title:'Regex.findall()',
	keywords: 'match regexp,search regexp,find regexp,findall regexp'
});


ctx.registerNode('regexp_split', {
	import: 'python_regexp',
	categories: ['Python/Regular Expression'],
	keywords: 'regexp split,split regexp',
	title:'Regex.split()',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'expression', type: 'python.type.regexp'},
		{id: 'maxsplit', type: 'core.python.int'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'result', type: 'core.type.string[]', tooltip:''}
	]
});


ctx.registerNode('regexp_sub', {
	import: 'python_regexp',
	categories: ['Python/Regular Expression'],
	keywords: 'regexp sub,sub regexp',
	title:'Regex.sub()',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'expression', type: 'python.type.regexp'},
		{id: 'string', type: 'core.type.string'},
		{id: 'replacement', type: 'core.type.string'},
		{id: 'count', type: 'core.type.int', tooltip: 'The optional argument count is the maximum number of pattern occurrences to be replaced; count must be a non-negative integer. The default value of 0 means to replace all occurrences.'}
		
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'result', type: 'core.type.string', tooltip:''}
	],
	tooltip: 'Find all the matches for a pattern, and replace them with a different string'
});


ctx.registerNode('regexp_subn', {
	import: 'python_regexp',
	categories: ['Python/Regular Expression'],
	keywords: 'regexp subn,subn regexp',
	title:'Regex.subn()',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'expression', type: 'python.type.regexp'},
		{id: 'string', type: 'core.type.string'},
		{id: 'replacement', type: 'core.type.string'},
		{id: 'count', type: 'core.type.int', tooltip: 'The optional argument count is the maximum number of pattern occurrences to be replaced; count must be a non-negative integer. The default value of 0 means to replace all occurrences.'}
		
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'result', type: 'python.type.tuple', tooltip: 'A 2-tuple containing the new string value and the number of replacements that were performed'}
	],
	tooltip: 'The subn() method does the same work as sub(), but returns a 2-tuple containing the new string value and the number of replacements that were performed'
});


ctx.registerNode('regexp_group_string', {
	import: 'python_regexp',
	categories: ['Python/Regular Expression'],
	keywords: 'get string,regex string',
	title:'Regex get String)',
	inputs: [
		{id: 'groups', type: 'python.regexp.groups'},
		{id: 'group', type: 'core.type.int'}
	],
	outputs: [
		{id: 'string', type: 'core.type.string'}
	]
});

ctx.registerNode('regexp_group_group', {
	import: 'python_regexp',
	categories: ['Python/Regular Expression'],
	keywords: 'subgroup regex',
	title:'Regex get sub group)',
	inputs: [
		{id: 'groupsin', type: 'python.regexp.groups'},
		{id: 'group', type: 'core.type.int'}
	],
	outputs: [
		{id: 'groupsout', type: 'python.regexp.groups'}
	]
});

});
