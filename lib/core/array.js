
;exLIB.package('core.array', function(pack){

	pack.Symbol('lib/img/array.png').Category('Utilities/Array');
	
	n = pack.Node('get', 'Get array item')
		.Keywords('array get,get array,get item,arrayget')
		.Color('#C3C3C3');
	n.Input('array', 'core.wildcards[]').Group(1).Tooltip('The array to get the item from');
	n.Input('index', 'core.type.int').Tooltip('The index in the array to get the item from');
	n.Output('item', 'core.wildcards').Group(1)

	n = pack.Node('set', 'Set Array Item')
		.Keywords('array set item,set item array,item set array')
		.Color('#C3C3C3')
		.MakeEntry()
		.MakeExit();
	n.Input('array', 'core.wildcards[]').Group(1).Tooltip('The array to perform the operation on');
	n.Input('index', 'core.type.int').Tooltip('The index to assign the item to');
	n.Input('item', 'core.wildcards').Group(1).Tooltip('The item to assign to the index of the array.');
	n.Input('fit', 'core.type.bool', 'Size to fit').Tooltip('If true, the array will expend if index gretter than the current size of the array.').Optional();
	
	n = pack.Node('make', 'Make Array')
		.Keywords('array create,create array,makearray,arraymake')
		.Color('#C3C3C3');
	n.Input('item', 'core.wildcards', 'Item [0]').Group(1);
	n.Output('array', 'core.wildcards[]').Group(1);
	n.Output('add', 'special.add', 'Add Item').attr('target', 'item').Tooltip('Add a new Item to Array.');

	n = pack.Node('each', 'For Each Array Item')
		.Keywords('foreach,array each,each array,each item,eachitem')
		.Color('#C3C3C3')
		.MakeEntry();
	n.Input('array', 'core.wildcards[]').Group(1);
	n.Output('exec', 'core.exec', 'Loop Body');
	
	n = pack.Node('length', 'Length')
		.Import('core.operator')
		.Keywords('array length,array size,length,size')
		.Color('#C3C3C3')
	n.Input('array', 'core.wildcards[]', ' ');
	n.Output('size', 'core.type.int', ' ');
	

});

