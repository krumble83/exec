;exLIB.package('core.date', function(pack){
	var s;
	
	pack.Category('Date Time').Symbol('lib/img/date.png');

	exLIB.package('core.type', function(p){
		s = p.Struct('date', 'DateTime Structure');
		s.Member('year', 'core.type.int', 'Year');
		s.Member('month', 'core.type.int', 'Month');
		s.Member('day', 'core.type.int', 'Day');
		s.Member('hour', 'core.type.int', 'Hour');
		s.Member('minutes', 'core.type.int', 'Minute');
		s.Member('seconds', 'core.type.int', 'Seconds');
		s.MakeAccessorNodes('core.date');
	});
	
	var n = pack.Node('now', 'Now').Keywords('date');
	n.Output('value', 'core.type.date');
	
	n = pack.Node('getyear', 'Get Year').Keywords('year,get year');
	n.Input('date', 'core.type.date');
	n.Output('year', 'core.type.int');

	n = pack.Node('getmonth', 'Get Month').Keywords('month,get month');
	n.Input('date', 'core.type.date');
	n.Output('month', 'core.type.int');

	n = pack.Node('getday', 'Get Day').Keywords('day,get day');
	n.Input('date', 'core.type.date');
	n.Output('day', 'core.type.int');
	
	n = pack.Node('gethour', 'Get Hour (24h)').Keywords('hour, get hour');
	n.Input('date', 'core.type.date');
	n.Output('hour', 'core.type.int');	
	
	n = pack.Node('gethour12', 'Get Hour (12h)').Keywords('hour, get hour');
	n.Input('date', 'core.type.date');
	n.Output('hour', 'core.type.int');
	
	n = pack.Node('getminute', 'Get Minutes').Keywords('minutes,get minute');
	n.Input('date', 'core.type.date');
	n.Output('minutes', 'core.type.int');

	n = pack.Node('getsecond', 'Get Seconds').Keywords('seconds,get seconds');
	n.Input('date', 'core.type.date');
	n.Output('seconds', 'core.type.int');


	pack.Category('Date Time/Operation')
	n = pack.Node('add', 'Add (DateTime)').Keywords('add')
		.Ctor('NodeOp').Subtitle('+');
	n.Input('in1', 'core.type.date');
	n.Input('in2', 'core.type.date');
	n.Output('out', 'core.type.date');
	
	pack.Node('sub').Import('add').Title('Substarct (DateTime)').Keywords('substract')
		.Ctor('NodeOp').Subtitle('-');
	

	pack.Category('Date Time/Comparator')
	n = pack.Node('equal', 'Equal (DateTime)').Keywords('equal')
		.Ctor('NodeOp').Subtitle('==');
	n.Input('in1', 'core.type.date');
	n.Input('in2', 'core.type.date');
	n.Output('out', 'core.type.bool');
	
	pack.Node('lt').Import('equal').Title('Lower Than (DateTime)').Keywords('lt,<').Subtitle('<');
	pack.Node('gt').Import('equal').Title('Gretter Than (DateTime)').Keywords('gt,>').Subtitle('>');
	pack.Node('lte').Import('equal').Title('Lower Than or Equal (DateTime)').Keywords('lte,<=').Subtitle('<=');
	pack.Node('gte').Import('equal').Title('Gretter Than or Equal (DateTime)').Keywords('gte,>=').Subtitle('>=');
	pack.Node('neq').Import('equal').Title('Not Equal (DateTime)').Keywords('neq,!=,<>').Subtitle('!=');
	
	
});

