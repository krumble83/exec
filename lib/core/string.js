
;exLIB.package('core.string', function(pack){

	pack.Category('String');
	
	pack.Enum('searchcase', 'SearchCase').Values(['IgnoreCase', 'CaseSentitive']);

	;exLIB.package('core.type', function(){
		var t = this.Type('string', 'String')
			.Inherits('core.type.scalar')
			.Color('#f0f')
			.Tooltip('Any sequence of characters');
		t.Editor('input')
			.data('keydown', function(e, input){
				//console.log(e.keyCode);
				if(e.keyCode == 13 && !e.shiftKey){
					e.preventDefault();
					input.blur();
					this.parent(exSVG.Worksheet).focus();
				}
			});
			t.MakeLiteralNode('core.string');
	});
	
	var n = pack.Node('split', 'Split string').Import('tpl.node.pure').Keywords('break,explode');
	n.Input('source', 'core.type.string');
	n.Input('separator', 'core.type.string').Tooltip('The delimiter string');
	n.Output('result', 'core.type.string').Array();

	n = pack.Node('join', 'Join strings').Import('tpl.node.pure').Keywords('join,merge,combine');
	n.Input('source', 'core.type.string').Array();
	n.Input('separator', 'core.type.string').Tooltip('The delimiter string');
	n.Output('result', 'core.type.string');


	n = pack.Node('replace', 'Replace in strings').Import('tpl.node.pure').Keywords('replace');
	n.Input('source', 'core.type.string');
	n.Input('search', 'core.type.string');
	n.Input('replace', 'core.type.string');
	n.Input('usecase', 'core.type.bool', 'Case Sensitive');
	n.Output('result', 'core.type.string');
	
	
	n = pack.Node('contains', 'Contains').Import('tpl.node.pure');
	n.Input('source', 'core.type.string');
	n.Input('search', 'core.type.string');
	n.Input('usecase', 'core.type.bool', 'Case Sensitive');
	n.Input('start', 'core.type.int').Optional().Tooltip('Start search from this position.');
	n.Input('end', 'core.type.int').Optional().Tooltip('Stop search at this position.');
	n.Output('result', 'core.type.bool');


	n = pack.Node('length', 'String Length').Import('tpl.node.pure').Keywords('size,count');
	n.Input('string', 'core.type.string');
	n.Output('length', 'core.type.int');	

	n = pack.Node('tolower', 'To Lower').Import('tpl.node.pure').Keywords('lower,tolower');
	n.Input('input', 'core.type.string');
	n.Output('output', 'core.type.string');	

	n = pack.Node('toupper', 'To Upper').Import('tpl.node.pure').Keywords('upper,toupper');
	n.Input('input', 'core.type.string');
	n.Output('output', 'core.type.string');	

	n = pack.Node('toint', 'To Int').Import('tpl.node.pure');
	n.Input('input', 'core.type.string');
	n.Output('integer', 'core.type.int');
	
	n = pack.Node('eq').ImportTpl('tpl.op.eq', 'core.type.string', 'String');
	
});

