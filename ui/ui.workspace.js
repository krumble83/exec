;(function(ctx){



var createTab = function(target, svg){
	var tab
	, me = this
	, title  = '<span style="display:none">g</span>' + target;

	$('#uiTabs').tabs('add',{
		title: target,
		closable:true,
		iconCls : 'icon-graph-small',
		attributes: {svg: null},
		onResize : function(){
			if(tab)
				tab[0].SVG.doLayout();
		}
	});
	tab = $('#uiTabs').tabs('getTab', target);
	tab.panel('body').append('<div style="height:100%;width:100%" id="svg_g' + target + '">');
	svg = SVG('svg_g' + target).worksheet(function(){
		this.setTitle(target);
		this.doLayout();

		me.initWorksheetEvents(this);
		tab[0].SVG = this;
	});
	$(tab).panel('doLayout');
	return svg;
}




ctx.Workspace = function(){
	var me = this;
	me.mProject = new Project;
};	

ctx.Workspace.prototype.init = function(){
	var me = this;
	me.treeNodes = {};
	me.tmp = {};
	me.initTree();
	me.initDeviceTree();
	this.getConfig();


	me.mIframe = document.querySelector('#uiiframe');
	if(!me.mIframe){
		me.mIframe = document.createElement('iframe');
		me.mIframe.setAttribute('id', 'uiiframe');

		me.mIframe.setAttribute('id', 'uiiframe');
		document.body.appendChild(me.mIframe);
		me.mIframe.src = 'test.html';
		//me.mIframe.contentDocument.location.reload();
		//me.mIframe.setAttribute('style', ''
		
	}
	//me.test();
};


ctx.Workspace.prototype.createProject = function(projectId){
	if(!projectId){
		$('#uiProjectCreateWin').window('open').css('display', '');
		$('[data-button="ok"]', $('#uiProjectCreateWin')).click(function(){
			alert('create project');
		});
		return;
	}
};

ctx.Workspace.prototype.addDevice = function(deviceId){
	$('#uiDevicesList').css('display', '');$('#uiDevicesList').datalist()
};


ctx.Workspace.prototype.addGraph = function(name, opened){
	var me = this
	, tab
	, svg
	, askName = false;
	
	if(!name || $('#uiTabs').tabs('getTab', name)){
		askName = true;
		var n = name || 'NewGraph';
		var a=0;
		var t = true;
		while(t != null){
			a++;
			t = $('#uiTabs').tabs('getTab', n + a);
		}
		name = n + a;
	}

	$('#uiTree').tree('append', {
		parent: me.treeNodes.graphs,
		data: [{
			id: name ,
			text: name,
			iconCls : 'icon-graph-small',
			attributes: {draggable: false, name: name}
		}]
	});
	var node = $('#uiTree').tree('find', name);
	if(askName)
		$('#uiTree').tree('beginEdit', node.target);
	
	node.attributes.tab = createTab.call(me, name);
	return node.attributes.tab;
};



ctx.Workspace.prototype.initWorksheetEvents = function(worksheet){
	var me = this;
	worksheet.on('node-selected.workspace', function(e){
		console.log('node selected ', worksheet.getSelection().length());
		var node = e.detail.node;
		
		if(worksheet.getSelection().length() != 1){
			me.clearProperties();
			return;
		}
		me.showNodeProperties(worksheet.getSelection().first());
	});

	worksheet.on('node-unselected.workspace', function(){
		console.log('node unselected ', worksheet.getSelection().length());
		if(worksheet.getSelection().length() != 1){
			me.clearProperties();
		}
	});
	
};


ctx.Workspace.prototype.clearProperties = function(){
	$('#uiPropertyGrid').propertygrid('loadData', {'total':0, 'rows':[]});
}


ctx.Workspace.prototype.showNodeProperties = function(node){
	//console.log($.fn.datagrid.defaults.editors);
	//console.log(node.getProperty());
	var opts = $('#uiPropertyGrid').propertygrid('getColumnOption', 'name');
	opts.width = 60;
	$('#uiPropertyGrid').panel('doLayout');
	
	$('#uiPropertyGrid').propertygrid('loadData', {total:4, rows:[
		{name: 'Description', value: '', group: 'General', editor: 'textarea'},
		{name: 'Category', value: '', group: 'General', editor: 'combobox'},
		{name: 'SSN', value: '123-456-7890', group: 'Inputs', editor: 'pins'},
		{name: 'SSN2', value: '123-456-7890', group: 'Outputs', editor: 'pins'}
	]});
}


ctx.Workspace.prototype.openGraph = function(name){
	
}


ctx.Workspace.prototype.initTree = function(){
	var me = this;
	var lastEvent;
	
	var dragF = function(e){
		lastEvent = e;
	}
	
	$('#uiTree').tree({
		dnd: true,
		data: [{
			text: 'Graphs',
			id: 'graphs',
			attributes: {
				root: true,
				callback: function(){me.addGraph();},
				draggable: false
			}
		},{
			text: 'Functions',
			id: 'functions',
			attributes: {
				root: true,
				draggable: false,
				callbacks: {
					drag: function(treenode, worksheet, e){
						var n = worksheet.parent(exSVG.Worksheet).addNode('core.callfunc', e);
						n.setData('title', treenode.text);
					},
					contextMenu: function(e, node){
						var m = $('#exMenu');
						var menu = new MenuObject(m[0]);
						menu.clear();
						menu.addTitleItem('Function Actions');
						menu.addItem('Open', 'open', function(){
							
						});
						menu.addItem('Delete', 'delete', function(){
							
						});
						menu.addItem('Duplicate', 'duplicate', function(){
							
						});
						menu.sep();
						menu.addItem('Add New', 'new', function(){
							
						});
						
						menu.showAt({x: e.clientX, y: e.clientY});						
					},
				}
			},
			children: [{
				text: 'Item11 avec tres long titre',
				iconCls: 'icon-function'
			},{
				text: 'Item12',
				iconCls: 'icon-function'
			}]
		},{
			text: 'Macros',
			id: 'macros',
			attributes: {
				root: true,
				draggable: false
			},
			children: [{
				text: 'Item11'
			},{
				text: 'Item12'
			}]
		},{
			text: 'Variables',
			id: 'variables',
			attributes: {
				root: true,
				callbacks: {
					drag: function(treenode, worksheet, e){
						var m = $('#exMenu');
						var menu = new MenuObject(m[0]);
						menu.clear();
						menu.addTitleItem('Build Menu');
						menu.addItem('Get', 'get', function(){
							var n = worksheet.parent(exSVG.Worksheet).addNode(treenode.attributes.type + '.getter', e);
							n.setName(treenode.text);
						});
						menu.addItem('Set', 'set', function(){
							var n = worksheet.parent(exSVG.Worksheet).addNode(treenode.attributes.type + '.setter', e);
							n.setName(treenode.text);							
						});
						menu.showAt({x: e.clientX, y: e.clientY});
					},
				}
			},
			children: [{
				text: 'String',
				attributes:{
					type: 'core.type.string'
				}
			},{
				text: 'Integer',
				attributes:{
					type: 'core.type.int'
				}
			},{
				text: 'SerailConnection',
				attributes:{
					type: 'arduino.serial.connection'
				}
			}]
		},{
			text: 'Locales Variables',
			id: 'lvariables',
			attributes: {
				root: true,
				draggable: false
			},
			children: []
		}],
		onBeforeDrag: function(node){
			//console.log(node);
			if(node.attributes && node.attributes.draggable === false)
				return false;
		},
		
		onAfterEdit: function(){
			//$(this).tree('beginEdit');
		},
		
		onStartDrag: function(node){
			console.log(node);
			document.addEventListener('mousemove', dragF);

		},
		
		onStopDrag: function(node, e){
			if(!lastEvent || !lastEvent.target)
				return;
			console.log(lastEvent.target.instance);
			document.removeEventListener('mousemove', dragF);
			if(!lastEvent.target.instance)
				return;
			console.log(node);
			if(node.attributes && node.attributes.callbacks && node.attributes.callbacks.drag){
				
			}
			else{
				console.log($(this).tree('getParent', node.target));
				$(this).tree('getParent', node.target).attributes.callbacks.drag(node, lastEvent.target.instance, lastEvent);
			}
			lastEvent = null;
			return true;
		},
		onContextMenu: function(e, node){
			//console.log(e);
			e.preventDefault();
			if(node.attributes && node.attributes.root)
				return;

			$(this).tree('select', node.target);

			if(node.attributes && node.attributes.callbacks && node.attributes.callbacks.contextMenu){
				node.attributes.callbacks.contextMenu.call(this, e, node);
				return;
			}
			var parent = $(this).tree('getParent', node.target);
			if(parent.attributes && parent.attributes.callbacks && parent.attributes.callbacks.contextMenu){
				parent.attributes.callbacks.contextMenu.call(this, e, node);
				return;
			}
		},
		onDblClick: function(node){
			console.log(node);
			if(node.attributes && node.attributes.name){
				console.log();
				var tab = $('#uiTabs').tabs('getTab', node.attributes.name);
				if(tab)
					$('#uiTabs').tabs('select', tab.target);
			}
		}
	});

	var names = ['graphs', 'variables', 'functions', 'macros', 'lvariables'];
	
	$.each(names, function(i, name){
		//console.log(a, b);
		var node = me.getTreeSection(name);
		$(node.target).addClass('uiRoot').parent().addClass('uiBody');
		var bt = $('<div class="uiAdd ' + name + '">');
		bt.appendTo(node.target);
		bt.on('click', function(){
			if(typeof node.attributes.callback == 'function')
				node.attributes.callback();
		});
		me.treeNodes[node.id] = node.target;
	});

	$('#uiTree').find('.tree-node').each(function(){
		/*$(this).draggable({
			handle:'clone'
		});*/
		var opts = $(this).draggable('options');
		//opts.onStopDrag = function(){console.log('rrr')};
		//console.log(opts);
	});	
}


ctx.Workspace.prototype.initDeviceTree = function(){
	var me = this;
	var lastEvent;
	
	var dragF = function(e){
		lastEvent = e;
	}

	$('#uiDeviceTree').tree({
		dnd: true,
		data: [{
			text: 'Device',
			id: 'device',
			attributes: {
				root: true,
				callbacks: {
					drag: function(treenode, worksheet, e){
						var n = worksheet.parent(exSVG.Worksheet).addNode(treenode.attributes.type + '.getter', e);
						n.setName(treenode.text);
					},
				}
			},
			children: [{
				text: 'Serial Port',
				attributes:{
					type: 'arduino.serial.port'
				}
			},{
				text: 'Integer',
				attributes:{
					type: 'core.type.int'
				}
			}]
		}],
		onBeforeDrag: function(node){
			//console.log(node);
			if(node.attributes && node.attributes.draggable === false)
				return false;
		},
		
		onStartDrag: function(node){
			console.log(node);
			document.addEventListener('mousemove', dragF);

		},
		
		onStopDrag: function(node, e){
			if(!lastEvent || !lastEvent.target)
				return;
			console.log(lastEvent.target.instance);
			document.removeEventListener('mousemove', dragF);
			if(!lastEvent.target.instance)
				return;
			console.log(node);
			if(node.attributes && node.attributes.callbacks && node.attributes.callbacks.drag){
				
			}
			else{
				console.log($(this).tree('getParent', node.target));
				$(this).tree('getParent', node.target).attributes.callbacks.drag(node, lastEvent.target.instance, lastEvent);
			}
			lastEvent = null;
			return true;
		},
		onContextMenu: function(e, node){
			//console.log(e);
			e.preventDefault();
			if(node.attributes && node.attributes.root)
				return;

			$(this).tree('select', node.target);

			if(node.attributes && node.attributes.callbacks && node.attributes.callbacks.contextMenu){
				node.attributes.callbacks.contextMenu.call(this, e, node);
				return;
			}
			var parent = $(this).tree('getParent', node.target);
			if(parent.attributes && parent.attributes.callbacks && parent.attributes.callbacks.contextMenu){
				parent.attributes.callbacks.contextMenu.call(this, e, node);
				return;
			}
		},
		onDblClick: function(node){
			console.log(node);
			if(node.attributes && node.attributes.name){
				console.log();
				var tab = $('#uiTabs').tabs('getTab', node.attributes.name);
				if(tab)
					$('#uiTabs').tabs('select', tab.target);
			}
		}
	});	
	
	
}


ctx.Workspace.prototype.getTreeSection = function(name){
	return $('#uiTree').tree('find', name)
}

ctx.Workspace.prototype.getConfig = function(name, dflt){
	if(document.cookie == false)
		return dflt;
}

})(window);
