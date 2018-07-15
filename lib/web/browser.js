
/*
;exLIB.load('web.browser', function(ctx){
	
ctx.registerType('web.browser.browser', {
	inherits: 'core.object',
	label: 'Object'
});

ctx.registerType('web.browser.navigator', {
	inherits: 'core.object',
	label: 'Object'
});

ctx.registerNode('getbrowser', {
	import: 'core.function',
	categories: ['Web'],
	keywords: 'get browser',
	title:'Visitor Browser',
	inputs: [
	],
	outputs: [
		{id: 'instance', type: 'web.browser.browser', label:'Instance'}
	]
});

ctx.registerNode('getnavigator', {
	import: 'core.function',
	categories: ['Web'],
	keywords: 'get navigator,navigator',
	title:'Visitor Navigator',
	inputs: [
		{id: 'webbrowser', type: 'web.browser.browser', label:'Web Browser'}
	],
	outputs: [
		{id: 'instance', type: 'web.browser.navigator', label:'Instance'}
	]
});




/****************************************************************************************
	Macros
****************************************************************************************
ctx.registerNode('loadscript', {
	import: 'core.macro',
	categories: ['Web/Macro'],
	keywords: 'javascript load,js',
	title:'Load Javascript file',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'url', type: 'core.type.string'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'onLoad', type: 'core.exec'},
		{id: 'success', type: 'core.type.bool'}
	]
});

ctx.registerNode('loadcss', {
	categories: ['Web/Macro'],
	keywords: 'css load file',
	title:'Load Css file',
	color: '#aaeea0',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'url', type: 'core.type.string'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'onLoad', type: 'core.exec'}
	]
});


});
*/