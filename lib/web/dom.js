;exLIB.package('web.dom', function(pack){
	
	//pack.Category('Web/Dom');
	
	pack.Type('element', 'Dom Element').Inherits('core.object');
	pack.Type('attribute', 'Dom Element Attribute');
	
	var ev = pack.Struct('event', 'Dom Event');
	ev.Pin('target', 'web.dom.element');
	
	var n = pack.Node('getDocument', 'document')
		.Keywords('get document,document')
		.Category('Web/Dom');
	n.Output('document', 'web.dom.element');
	
	n = pack.Node('getelementbyid', 'getElementById()')
		.Keywords('get element by id')
		.Category('Web/Dom/Selector')
		.MakeEntry().MakeExit();
	n.Input('parent', 'web.dom.element');
	n.Input('id', 'core.type.string');
	n.Output('element', 'web.dom.element');
	
	n = pack.Node('getelementsbytagname', 'getElementsByTagName()')
		.Import('getelementbyid')
		.Keywords('get elements by tag name,tagname');
	n.Input('id').Id('name');

	n = pack.Node('querySelector', 'querySelector()')
		.Keywords('query selector,select element')
		.Category('Web/Dom/Selector')
		.MakeEntry().MakeExit();
	n.Input('parent', 'web.dom.element');
	n.Input('selector', 'core.type.string');
	n.Output('element', 'web.dom.element');	
	
	n = pack.Node('querySelectorall', 'querySelectorAll()')
		.Keywords('query selector,select element')
		.Category('Web/Dom/Selector')
		.MakeEntry().MakeExit();
	n.Input('parent', 'web.dom.element');
	n.Input('selector', 'core.type.string');
	n.Output('element', 'web.dom.element[]');
	
	n = pack.Node('setattribute', 'setAttribute()')
		.Keywords('set attribute')
		.Category('Web/Dom/Attributes')
		.MakeEntry().MakeExit();
	n.Input('parent', 'web.dom.element');
	n.Input('attribute', 'core.type.string');
	n.Input('value', 'core.wildcards');
	
	n = pack.Node('getattribute', 'getAttribute()')
		.Keywords('get attribute')
		.Category('Web/Dom/Attributes')
		.MakeEntry().MakeExit();
	n.Input('parent', 'web.dom.element');
	n.Input('attribute', 'core.type.string');
	n.Output('value', 'web.dom.attribute');

	n = pack.Node('attributes', 'attributes')
		.Keywords('get attributes')
		.Category('Web/Dom/Attributes');
	n.Input('parent', 'web.dom.element');
	n.Output('attributes', 'core.type.pair[]');
	
	n = pack.Node('createelement', 'createElement()')
		.Keywords('get attribute')
		.Category('Web/Dom')
		.MakeEntry().MakeExit();
	n.Input('parent', 'web.dom.element');
	n.Input('tagname', 'core.type.string');
	n.Output('value', 'web.dom.element');
	
	n = pack.Node('appendchild', 'appendChild()')
		.Keywords('append child')
		.Category('Web/Dom')
		.MakeEntry().MakeExit();
	n.Input('parent', 'web.dom.element');
	n.Input('child', 'web.dom.element');
	n.Output('element', 'web.dom.element');
	
	n = pack.Node('removechild', 'removeChild()')
		.Keywords('remove child')
		.Category('Web/Dom')
		.MakeEntry().MakeExit();
	n.Input('parent', 'web.dom.element');
	n.Input('element', 'web.dom.element');
	n.Output('element', 'web.dom.element');
	
	n = pack.Node('parentnode', 'parentNode')
		.Keywords('parent node')
		.Category('Web/Dom');
	n.Input('parent', 'web.dom.element');
	n.Output('element', 'web.dom.element');

	n = pack.Node('addclass', 'Add Class')
		.Keywords('class add')
		.Category('Web/Dom/Class')
		.MakeEntry().MakeExit();
	n.Input('element', 'web.dom.element');
	n.Input('class', 'core.type.string');

	n = pack.Node('removeclass', 'Remove Class')
		.Keywords('class remove')
		.Category('Web/Dom/Class')
		.MakeEntry().MakeExit();
	n.Input('element', 'web.dom.element');
	n.Input('class', 'core.type.string');

	n = pack.Node('hasclass', 'Has Class')
		.Keywords('class')
		.Category('Web/Dom/Class')
		.MakeEntry().MakeExit();
	n.Input('element', 'web.dom.element');
	n.Input('class', 'core.type.string');
	n.Output('hasclass', 'core.type.bool');
});


;exLIB.load('web.dom', function(ctx){


/****************************************************************************************
	Data types
****************************************************************************************/	
ctx.registerType('web.dom.element', {
	inherits: 'core.object',
	label: 'HTML Element', 
});

ctx.registerType('web.dom.event', {
	inherits: 'core.type.struct',
	label: 'Dom Event'
});



/****************************************************************************************
	Selectors
****************************************************************************************/
ctx.registerNode('getDocument', {
	categories: ['Web/Dom'],
	keywords: 'make bool',
	title:'get current Document',
	color: '#555',
	inputs: [
	],
	outputs: [
		{id: 'document', type: 'web.dom.element'}
	]
});

ctx.registerNode('getelementbyid', {
	categories: ['Web/Dom/Selectors'],
	keywords: 'random',
	title:'getElementById',
	color: '#aaeea0',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'parent', type: 'web.dom.element'},
		{id: 'id', type: 'core.type.string'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'element', type: 'web.dom.element'}
	]
});

ctx.registerNode('getelementsbytagname', {
	categories: ['Web/Dom/Selectors'],
	keywords: 'random',
	title:'getElementsByTagName',
	color: '#aaeea0',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'parent', type: 'web.dom.element'},
		{id: 'name', type: 'core.type.string'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'element', type: 'web.dom.element[]'}
	]
});


ctx.registerNode('querySelector', {
	categories: ['Web/Dom/Selectors'],
	keywords: 'random',
	title:'querySelector',
	color: '#aaeea0',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'parent', type: 'web.dom.element'},
		{id: 'selector', type: 'core.type.string'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'element', type: 'web.dom.element'}
	]
});

ctx.registerNode('querySelectorAll', {
	categories: ['Web/Dom/Selectors'],
	keywords: 'random',
	title:'querySelectorAll',
	color: '#aaeea0',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'parent', type: 'web.dom.element'},
		{id: 'selector', type: 'core.type.string'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'element', type: 'web.dom.element[]'}
	]
});



/****************************************************************************************
	Attributes
****************************************************************************************/
ctx.registerNode('setAttribute', {
	categories: ['Web/Dom/Attributes'],
	keywords: 'random',
	title:'setAttribute',
	color: '#aaeea0',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'parent', type: 'web.dom.element'},
		{id: 'attribute', type: 'core.type.string'},
		{id: 'value', type: 'core.type.scalars'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'element', type: 'web.dom.element'}
	]
});


ctx.registerNode('setAttributeInt', {
	categories: ['Web/Dom/Attributes'],
	keywords: 'random',
	title:'setAttribute (integer)',
	color: '#aaeea0',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'parent', type: 'web.dom.element'},
		{id: 'attribute', type: 'core.type.string'},
		{id: 'value', type: 'core.type.int'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'element', type: 'web.dom.element'}
	]
});

ctx.registerNode('setAttributestring', {
	categories: ['Web/Dom/Attributes'],
	keywords: 'random',
	title:'setAttribute (String)',
	color: '#aaeea0',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'parent', type: 'web.dom.element'},
		{id: 'attribute', type: 'core.type.string'},
		{id: 'value', type: 'core.type.string'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'element', type: 'web.dom.element'}
	]
});

ctx.registerNode('setAttributefloat', {
	categories: ['Web/Dom/Attributes'],
	keywords: 'random',
	title:'setAttribute (Float)',
	color: '#aaeea0',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'parent', type: 'web.dom.element'},
		{id: 'attribute', type: 'core.type.string'},
		{id: 'value', type: 'core.type.float'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'element', type: 'web.dom.element'}
	]
});

ctx.registerNode('setAttributebool', {
	categories: ['Web/Dom/Attributes'],
	keywords: 'random',
	title:'setAttribute (Bool)',
	color: '#aaeea0',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'parent', type: 'web.dom.element'},
		{id: 'attribute', type: 'core.type.string'},
		{id: 'value', type: 'core.type.bool'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'element', type: 'web.dom.element'}
	]
});




ctx.registerNode('getAttributestring', {
	categories: ['Web/Dom/Attributes'],
	keywords: 'random',
	title:'getAttribute (String)',
	color: '#aaeea0',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'parent', type: 'web.dom.element'},
		{id: 'attribute', type: 'core.type.string'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'value', type: 'core.type.string'}
	]
});

ctx.registerNode('getAttributeint', {
	categories: ['Web/Dom/Attributes'],
	keywords: 'attribute',
	title:'getAttribute (Int)',
	color: '#aaeea0',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'parent', type: 'web.dom.element'},
		{id: 'attribute', type: 'core.type.string'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'value', type: 'core.type.int'}
	]
});

ctx.registerNode('getAttributebool', {
	categories: ['Web/Dom/Attributes'],
	keywords: 'random',
	title:'getAttribute (Bool)',
	color: '#aaeea0',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'parent', type: 'web.dom.element'},
		{id: 'attribute', type: 'core.type.string'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'value', type: 'core.type.bool'}
	]
});

ctx.registerNode('getAttributefloat', {
	categories: ['Web/Dom/Attributes'],
	keywords: 'random',
	title:'getAttribute (Float)',
	color: '#aaeea0',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'parent', type: 'web.dom.element'},
		{id: 'attribute', type: 'core.type.string'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'value', type: 'core.type.float'}
	]
});



/****************************************************************************************
	Element manipulation
****************************************************************************************/	
ctx.registerNode('createelement', {
	categories: ['Web/Dom/Element'],
	keywords: 'random',
	title:'createElement',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'parent', type: 'web.dom.element'},
		{id: 'tagname', type: 'core.type.string', label: 'Tag Name'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'element', type: 'web.dom.element'}
	]
});

ctx.registerNode('appendchild', {
	categories: ['Web/Dom/Element'],
	keywords: 'random',
	title:'appendChild',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'parent', type: 'web.dom.element'},
		{id: 'child', type: 'web.dom.element'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'element', type: 'web.dom.element'}
	]
});


/****************************************************************************************
	Events
****************************************************************************************/

ctx.registerNode('mouseevent', {
	import: 'core.function',
	categories: ['Web/Dom/Event'],
	keywords: 'create mouse event,mouseevent',
	title:'MouseEvent (Create)',
	inputs: [
		{id: 'onEvent', type: 'core.exec'},
		{id: 'parent', type: 'web.dom.element'},
		{id: 'event', type: 'core.type.string'}
	],
	outputs: [
		{id: 'event', type: 'web.dom.event'}
	]
});

ctx.registerNode('fireevent', {
	import: 'core.function',
	categories: ['Web/Dom/Event'],
	keywords: 'create mouse event,mouseevent',
	title:'MouseEvent (Create)',
	inputs: [
		{id: 'onEvent', type: 'core.exec'},
		{id: 'parent', type: 'web.dom.element'},
		{id: 'event', type: 'core.type.string'}
	],
	outputs: [
		{id: 'onEvent', type: 'core.exec'},
		{id: 'event', type: 'web.dom.event'}
	]
});

ctx.registerNode('attachevent', {
	categories: ['Web/Dom/Event'],
	keywords: 'random',
	title:'On Dom Event',
	color: '#ff5555',
	inputs: [
		{id: 'parent', type: 'web.dom.element'},
		{id: 'event', type: 'core.type.string'}
	],
	outputs: [
		{id: 'onEvent', type: 'core.exec'},
		{id: 'event', type: 'web.dom.event'}
	]
});

ctx.registerNode('preventdefault', {
	categories: ['Web/Dom/Event'],
	keywords: 'random',
	title:'PreventDefault (event)',
	color: '#aaeea0',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'event', type: 'web.dom.event'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'event', type: 'web.dom.event'}
	]
});

ctx.registerNode('stoppropagation', {
	categories: ['Web/Dom/Event'],
	keywords: 'stop propagation',
	title:'stopPropagation (event)',
	color: '#aaeea0',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'event', type: 'web.dom.event'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'event', type: 'web.dom.event'}
	]
});

ctx.registerNode('stopimmediatepropagation', {
	categories: ['Web/Dom/Event'],
	keywords: 'stop propagation',
	title:'stopImmediatePropagation (event)',
	color: '#aaeea0',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'event', type: 'web.dom.event'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'event', type: 'web.dom.event'}
	]
});

ctx.registerNode('detachEvent', {
	categories: ['Web/Dom/Event'],
	keywords: 'detach event',
	title:'detach Event (event)',
	color: '#aaeea0',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'event', type: 'web.dom.event'},
		{id: 'event', type: 'core.type.string'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'}
	]
});


// Classes
ctx.registerNode('hasclass', {
	categories: ['Web/Dom/Macro'],
	keywords: 'has class',
	title:'Has class',
	color: '#aaeea0',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'element', type: 'web.dom.element'},
		{id: 'classname', type: 'core.type.string'}
	],
	outputs: [
		{id: 'true', type: 'core.exec'},
		{id: 'false', type: 'core.exec'}
	]
});

ctx.registerNode('addclass', {
	categories: ['Web/Dom/Macro'],
	keywords: 'add class',
	title:'addClass',
	color: '#aaeea0',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'element', type: 'web.dom.element'},
		{id: 'classname', type: 'core.type.string'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'}
	]
});

ctx.registerNode('removeclass', {
	categories: ['Web/Dom/Macro'],
	keywords: 'remove class',
	title:'Remove Class',
	color: '#aaeea0',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'element', type: 'web.dom.element'},
		{id: 'classname', type: 'core.type.string'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'}
	]
});

ctx.registerNode('toggleclass', {
	categories: ['Web/Dom/Macro'],
	keywords: 'toggle class',
	title:'Toggle Class',
	color: '#aaeea0',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'element', type: 'web.dom.element'},
		{id: 'classname', type: 'core.type.string'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'}
	]
});

ctx.registerNode('getclasses', {
	categories: ['Web/Dom/Macro'],
	keywords: 'get classes',
	title:'Get Classes',
	color: '#aaeea0',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'element', type: 'web.dom.element'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'classes', type: 'core.type.string[]'}
	]
});
});