;exLIB.load('http.base', function(ctx){

ctx.registerNode('makeurl', {
	import: 'core.function',
	categories: ['Web/Http'],
	keywords: 'url make',
	title:'Make Url',
	inputs: [
		{id: 'urlin', type: 'core.type.string', label:'url[0]'}
	],
	outputs: [
		{id: 'url', type: 'core.type.string'},
		{id: 'add', type: 'special.add', target: 'urlin'}
	],
	tooltip: 'Make an url. All inputs will be merged with as "/" separator'
});

ctx.registerNode('spliturl', {
	import: 'core.function',
	categories: ['Web/Http'],
	keywords: 'url split',
	title:'Split Url',
	inputs: [
		{id: 'url', type: 'core.type.string'}
	],
	outputs: [
		{id: 'protocol', type: 'core.type.string'},
		{id: 'domain', type: 'core.type.string'},
		{id: 'parts', type: 'core.type.string[]'}
	],
	tooltip: 'Split an url. Input will be splitted with "/" as separator'
});


});