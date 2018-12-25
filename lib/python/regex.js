;exLIB.package('python.regex', function(pack){
	
	pack.Category('Python/Regular Expression').Symbol('lib/img/re.png').Color('#87663f');
	
	pack.Type('regexp', 'Python Regular Expression').Inherits('core.object');
	pack.Type('groups', 'Python Regex group').Inherits('core.object');
	pack.Type('flag', 'Python Regex flag').Inherits('core.object');
	
	var n = pack.Node('flag.make', 'Make Regular Expression Flag').Keywords('regex flag, regexp flag, flag regexp');
	n.Input('DOTALL', 'core.type.bool').Tooltip('Make . match any character, including newlines');
	n.Input('IGNORECASE', 'core.type.bool').Optional().Tooltip('Do case-insensitive matches');
	n.Input('LOCALE', 'core.type.bool').Optional().Tooltip('Do a locale-aware match');
	n.Input('MULTILINE', 'core.type.bool').Optional().Tooltip('Multi-line matching, affecting ^ and $');
	n.Input('VERBOSE', 'core.type.bool').Optional().Tooltip('Enable verbose REs, which can be organized more cleanly and understandably.');
	n.Input('UNICODE', 'core.type.bool').Optional().Tooltip('Makes several escapes like \w, \b, \s and \d dependent on the Unicode character database.');
	n.Output('flags', 'python.regex.flag');
		
	n = pack.Node('make', 'Make Regular Expression').Keywords('regex,regular expression,python regex,python regular expression');
	n.Input('pattern', 'core.type.string');
	n.Input('flags', 'python.regex.flag');
	n.Output('expression', 'python.regex.regexp');
	
	n = pack.Node('search', 'Regex.search()').Keywords('regex search').MakeEntry().MakeExit();
	n.Input('expression', 'regexp');
	n.Input('in', 'core.type.string');
	n.Output('start', 'core.type.int').Tooltip('Return the starting position of the match');	
	n.Output('end', 'core.type.int').Tooltip('Return the ending position of the match');
	//n.Output('span', 'python.type.tuple').Tooltip('Return a tuple containing the (start, end) positions of the match');
	n.Output('groups', 'groups');
	
	pack.Node('match', 'Regex.match()').Import('search').Keywords('regex match');
	
	n = pack.Node('findall', 'Regex.findall()')
		.Import('search')
		.Keywords('regex match');
	n.Output('out', 'core.type.string').Array();

	n = pack.Node('split', 'Regex.split()').Keywords('regexp search').MakeEntry().MakeExit();
	n.Input('expression', 'python.regex.regexp');
	n.Input('maxsplit', 'core.python.int');
	n.Output('result', 'core.type.string').Array();
	
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

