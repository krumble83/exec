;exLIB.package('web.dom', function(pack){
	
	//pack.Category('Web/Dom');

	pack.Type('window', 'Window Element').Inherits('core.object');


	pack.Interface('eventTarget');
	
	pack.Type('eventTarget', 'Dom EventTarget').Inherits('core.object');
	pack.Type('node', 'Dom Node').Inherits('eventTarget');	
	pack.Type('element', 'Dom Element').Inherits('node');
	pack.Type('htmlelement', 'Dom Html Element').Inherits('element');
		
	pack.Type('document', 'Dom Document').Inherits('element');
	pack.Type('body', 'Dom Document').Inherits('element');
	pack.Type('attribute', 'Dom Element Attribute');
	
	var ev = pack.Struct('event', 'Dom Event');
	ev.Member('target', 'element');
	
	var n = pack.Node('getDocument', 'document')
		.Import('tpl.node.pure')
		.Keywords('get document,document')
		.Category('Web/Dom');
	n.Output('document', 'document');
	

	var n = pack.Node('getBody', 'body')
		.Import('tpl.node.pure')
		.Keywords('get body,body')
		.Category('Web/Dom');
	n.Input('document', 'document');
	n.Output('body', 'element');
	
	/***************************************************
	/*   Selectors
	***************************************************/

	pack.Category('Web/Dom/Selector');
	
	n = pack.Node('getelementbyid', 'getElementById()')
		.Import('tpl.node.pure')
		.Keywords('get element by id')
	n.Input('parent', 'element');
	n.Input('id', 'core.type.string');
	n.Output('element', 'element');
	
	n = pack.Node('getelementsbytagname', 'getElementsByTagName()')
		.Import('tpl.node.pure')
		.Title('getElementsByTagName()')
		.Keywords('get elements by tag name,tagname');
	n.Input('parent', 'element');
	n.Input('tagName', 'core.type.string');
	n.Output('elements', 'web.dom.element').Array();

	n = pack.Node('querySelector', 'querySelector()')
		.Import('tpl.node.function')
		.Keywords('query selector,select element')
		.MakeEntry().MakeExit();
	n.Input('parent', 'element');
	n.Input('selector', 'core.type.string');
	n.Output('element', 'element');	
	
	n = pack.Node('querySelectorall', 'querySelectorAll()')
		.Import('tpl.node.function')
		.Keywords('query selector,select element')
		.MakeEntry().MakeExit();
	n.Input('parent', 'element');
	n.Input('selector', 'core.type.string');
	n.Output('element', 'web.dom.element').Array();


	/***************************************************
	/*   Attributes
	***************************************************/

	pack.Category('Web/Dom/Attributes');
	
	n = pack.Node('nodeName', 'nodeName')
		.Import('tpl.node.pure')
		.Keywords('nodename')
	n.Input('element', 'element');
	n.Output('nodeName', 'core.type.string');

	n = pack.Node('setattribute', 'setAttribute()')
		.Import('tpl.node.function')
		.Keywords('set attribute')
		.MakeEntry().MakeExit();
	n.Input('parent', 'element');
	n.Input('attribute', 'core.type.string');
	n.Input('value', 'core.wildcards');
	
	n = pack.Node('getattribute', 'getAttribute()')
		.Import('tpl.node.pure')
		.Keywords('get attribute')
		.MakeEntry().MakeExit();
	n.Input('parent', 'element');
	n.Input('attribute', 'core.type.string');
	n.Output('value', 'core.wildcards');

	n = pack.Node('attributes', 'attributes')
		.Import('tpl.node.pure')
		.Keywords('get attributes')
	n.Input('parent', 'element');
	n.Output('attributes', 'core.type.pair').Array();

	

	/***************************************************
	/*   Elements
	***************************************************/

	pack.Category('Web/Dom/Elements');
	
	n = pack.Node('createelement', 'createElement()').Subtitle('Target is self')
		.Import('tpl.node.pure')
		.Keywords('get attribute')
	n.Input('target', 'document');
	n.Input('tagname', 'core.type.string');
	n.Input('is', 'core.type.string').Optional();
	n.Output('element', 'element');
		
	n = pack.Node('appendchild', 'appendChild()')
		.Import('tpl.node.function')
		.Keywords('append child,child append')
		.MakeEntry().MakeExit();
	n.Input('parent', 'element');
	n.Input('child', 'element', 'Child [0]');
	n.Output('add', 'special.add', 'Add Child').attr('target', 'child').Tooltip('Add a new Children.');

	n = pack.Node('appendchildsarray', 'appendChildsArray()')
		.Import('tpl.node.function')
		.Keywords('append childs,childs append')
		.MakeEntry().MakeExit();
	n.Input('parent', 'element');
	n.Input('childs', 'web.dom.element').Array();

	
	n = pack.Node('removechild', 'removeChild()')
		.Import('tpl.node.function')
		.Keywords('remove child')
		.MakeEntry().MakeExit();
	n.Input('parent', 'element');
	n.Input('element', 'element');
	
	n = pack.Node('parentnode', 'parentNode')
		.Import('tpl.node.pure')
		.Keywords('parent node')
	n.Input('node', 'element');
	n.Output('parent', 'element');

	n = pack.Node('children', 'Get Childrens')
		.Import('tpl.node.pure')
		.Keywords('childs,childrens,children')
	n.Input('parent', 'element');
	n.Output('childs', 'web.dom.element').Array();

	n = pack.Node('firstChild', 'firstChild')
		.Import('tpl.node.pure')
		.Keywords('child,children')
	n.Input('parent', 'element');
	n.Output('firstChild', 'element');
	
	n = pack.Node('lastChild', 'lastChild')
		.Import('tpl.node.pure')
		.Keywords('child,children')
	n.Input('parent', 'element');
	n.Output('lastChild', 'element');



	/***************************************************
	/*   Sibling
	***************************************************/
	
	pack.Category('Web/Dom/Sibling');
	
	n = pack.Node('nextSibling', 'nextSibling')
		.Import('tpl.node.pure')
	n.Input('node', 'element');
	n.Output('nextSibling', 'element');
	
	n = pack.Node('prevSibling', 'prevSibling')
		.Import('tpl.node.pure')
	n.Input('node', 'element');
	n.Output('prevSibling', 'element');

	
	/***************************************************
	/*   Class
	***************************************************/
	pack.Category('Web/Dom/Class');
	
	n = pack.Node('addclass', 'Add Class')
		.Import('tpl.node.function')
		.Keywords('class add')
		.MakeEntry().MakeExit();
	n.Input('element', 'element');
	n.Input('className', 'core.type.string');

	n = pack.Node('removeclass', 'Remove Class')
		.Import('tpl.node.function')
		.Keywords('class remove')
		.MakeEntry().MakeExit();
	n.Input('element', 'element');
	n.Input('className', 'core.type.string');

	n = pack.Node('hasclass', 'Has Class')
		.Import('tpl.node.pure')
		.Keywords('class')
	n.Input('element', 'element');
	n.Input('className', 'core.type.string');
	n.Output('hasClass', 'core.type.bool');
	


	/***************************************************
	/*   Others
	***************************************************/
	
	pack.Category('Web/Dom');

	n = pack.Node('isvalid', 'IsValidElement')
		.Import('tpl.node.pure')
		.Keywords('nodename')
		.Tooltip('Check if the element is a valid Dom Element')
	n.Input('element', 'element');
	n.Output('valid', 'core.type.bool');

	
	n = pack.Node('innerHtml', 'innerHTML')
		.Import('tpl.node.pure')
	n.Input('element', 'element');
	n.Output('text', 'core.type.string');
	
	
	/***************************************************
	/*   Events
	***************************************************/

	pack.Type('event', 'Dom Event');
	
	pack.Type('mouseevent', 'Dom Mouse Event').Inherits('web.dom.event');
	pack.Enum('mouseeventenum').Values(['mouseover', 'mousemove', 'mouseleave', 'click', 'wheel']);

	pack.Type('keyevent', 'Dom Key Event').Inherits('web.dom.event');
	pack.Enum('keyeventenum').Values(['keyup', 'keydown', 'keypress']);
	
	pack.Type('touchevent', 'Dom Mouse Event').Inherits('web.dom.event');

	pack.Category('Web/Dom/Events');
	
	n = pack.Node('eventoof', 'Off Event')
		.Import('tpl.node.function')
		.Keywords('event')
		.MakeEntry().MakeExit();
	n.Input('element', 'element');
	n.Input('capture', 'core.type.bool').Optional().Tooltip('indicating that events of this type will be dispatched to the registered listener before being dispatched to any EventTarget beneath it in the DOM tree');
	n.Input('once', 'core.type.bool').Optional().Tooltip('indicating that the listener should be invoked at most once after being added. If true, the listener would be automatically removed when invoked.');
	n.Input('passive', 'core.type.bool').Optional().Tooltip('if true, indicates that the function specified by listener will never call preventDefault(). If a passive listener does call preventDefault(), the user agent will do nothing other than generate a console warning');
	

	n = pack.Node('onmouseevent', 'On Mouse Event')
		.Import('tpl.node.function')
		.Keywords('event')
		.MakeEntry().MakeExit();
	n.Input('element', 'element');
	n.Input('eventName', 'web.dom.mouseeventenum');
	n.Input('capture', 'core.type.bool').Optional().Tooltip('indicating that events of this type will be dispatched to the registered listener before being dispatched to any EventTarget beneath it in the DOM tree');
	n.Input('once', 'core.type.bool').Optional().Tooltip('indicating that the listener should be invoked at most once after being added. If true, the listener would be automatically removed when invoked.');
	n.Input('passive', 'core.type.bool').Optional().Tooltip('if true, indicates that the function specified by listener will never call preventDefault(). If a passive listener does call preventDefault(), the user agent will do nothing other than generate a console warning');
	
	n.Output('Do', 'core.exec').Tooltip('Action to do when event is triggered.');
	n.Output('event', 'web.dom.mouseevent', 'Mouse Event');

	n = pack.Node('onkeyevent', 'On Key Event')
		.Import('onmouseevent');
	n.Input('eventName').Type('web.dom.keyeventenum');
	n.Output('event').Type('web.dom.keyevent').Label('Key Event');
});

