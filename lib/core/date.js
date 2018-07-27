;(function() {
"use strict";

exLIB.package('core.date', function(pack){
	var s;
	
	pack.Category('Date Time').Symbol('lib/img/date.png');

	exLIB.package('core.type', function(p){
		s = p.Struct('date', 'DateTime');
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
	

	
/******************************************************************
	Common
******************************************************************/	
	var n = pack.Node('min').ImportTpl('tpl.min', 'core.type.date', 'DateTime');
	n = pack.Node('max').ImportTpl('tpl.max', 'core.type.date', 'DateTime');
	n = pack.Node('clamp').ImportTpl('tpl.clamp', 'core.type.date', 'DateTime');
	n = pack.Node('between').ImportTpl('tpl.between', 'core.type.date', 'DateTime');
		
/******************************************************************
	Arithmetic Operators
******************************************************************/	
	pack.Category('Date Time/Arithmetic');
	n = pack.Node('add').ImportTpl('tpl.op.add', 'core.type.date', 'DateTime');
	n = pack.Node('sub').ImportTpl('tpl.op.sub', 'core.type.date', 'DateTime');

/******************************************************************
	Comparators
******************************************************************/	
	pack.Category('Date Time/Comparators');
	n = pack.Node('eq').ImportTpl('tpl.op.eq', 'core.type.date', 'DateTime');
	n = pack.Node('neq').ImportTpl('tpl.op.neq', 'core.type.date', 'DateTime');
	n = pack.Node('lt').ImportTpl('tpl.op.lt', 'core.type.date', 'DateTime');
	n = pack.Node('gt').ImportTpl('tpl.op.gt', 'core.type.date', 'DateTime');
	n = pack.Node('lte').ImportTpl('tpl.op.lte', 'core.type.date', 'DateTime');
	n = pack.Node('gte').ImportTpl('tpl.op.gte', 'core.type.date', 'DateTime');

});


})(this);
