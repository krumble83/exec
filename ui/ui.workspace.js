;(function(ctx){



var createTab = function(target, attributes, callback){
	var tab
	, me = this
	, title  = '<span style="display:none">g</span>' + target;

	$('#uiTabs').tabs('add',{
		title: target,
		closable:true,
		iconCls : 'icon-graph-small',
		attributes: attributes
	});
	tab = $('#uiTabs').tabs('getTab', target);
	tab.panel('body').append('<div style="height:100%;width:100%;background-color:#262626" id="svg_g' + target + '">');
	svg = SVG('svg_g' + target).worksheet(function(){
		this.setTitle(target);
		me.initWorksheetEvents(this);
		if(typeof callback == 'function')
			callback.call(this);		
	});
	return tab;
}




ctx.Workspace = function(){
	var me = this;
};	

ctx.Workspace.prototype.init = function(){
	var me = this;
	me.treeNodes = {};
	me.tmp = {};
	me.initDeviceTree();
	return this;
};

/*
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
*/

ctx.Workspace.prototype.addGraph = function(name, callback){
	var me = this
	, node
	, svg
	, askName = false;
	
	if(!name){
		askName = true;
		var n = 'NewGraph';
		var a=0;
		while(this.mProject.Get().Graphs(n+a)){
			a++;
		}
		name = n + a;
	}
	
	var g = this.mProject.Graph(name);

	$('#uiTree').tree('append', {
		parent: me.treeNodes.graphs,
		data: [{
			id: name ,
			text: name,
			iconCls : 'icon-graph-small',
			attributes: {draggable: false, name: name}
		}]
	});
	node = $('#uiTree').tree('find', name);
	g.uidata.tree = node;
	
	this.openGraph(name, function(){
		$('#uiTree').tree('beginEdit', node.target);
	});	
};

ctx.Workspace.prototype.openGraph = function(name, callback){
	var me = this
	, node = $('#uiTree').tree('find', name)
	, g = this.mProject.Get().Graphs(name);
	
	if(!g.uidata.svg){
		node.attributes.tab = createTab.call(me, name, {draggable: false}, function(){
			g.uidata.svg = this;
			if(typeof callback == 'function')
				callback();
		});
	}
}


ctx.Workspace.prototype.openProject = function(project){
	var me = this;
	me.mProject = project;
	me.initTree();
}


ctx.Workspace.prototype.initWorksheetEvents = function(worksheet){
	var me = this;
	worksheet.on('node-selected.workspace', function(e){
		console.log('node selected ', worksheet.getSelection().length());
		var selection = worksheet.getSelection()
		
		if(selection.length() != 1){
			me.clearProperties();
			return;
		}
		if(selection.length() == 1)
			me.showNodeProperties(selection.first());
	});

	worksheet.on('node-unselected.workspace', function(){
		console.log('node unselected ', worksheet.getSelection().length());
		me.clearProperties();
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



/*
[{
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
							var m = $('#exMenu')
							, menu = new MenuObject(m[0]);
							
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
				children: [{}]
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
					draggable: false,
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
			}
		]
*/


ctx.Workspace.prototype.initTree = function(){
	var me = this
	, data = []
	, lastEvent;
	
	var dragF = function(e){
		lastEvent = e;
	};
	
	var t = {
		text: 'Graphs',
		id: 'graphs',
		attributes: {
			root: true,
			tool: function(){me.addGraph();},
			draggable: false,
			callbacks: {
				drag: function(treenode, worksheet, e){
					var n = worksheet.parent(exSVG.Worksheet).addNode('core.callfunc', e);
					n.setData('title', treenode.text);
				},
				contextMenu: function(e, node){
					var m = $('#exMenu')
					, menu = new MenuObject(m[0]);
					
					menu.clear();
					menu.addTitleItem('Graph Actions');
					menu.addItem('Open', 'open', function(){
						
					});
					menu.addItem('Delete', 'delete', function(){
						
					});
					menu.addItem('Rename', 'rename', function(){
						
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
		children: []
	};
	
	this.mProject.Get().Graphs().each(function(){
		t.children.push({
			text: this.Id(),
			id: this.Id(),
			iconCls : 'icon-graph-small',
			attributes: {draggable: false}
		});
	})
	data.push(t);

	t = {
		text: 'Functions',
		id: 'functions',
		attributes: {
			root: true,
			tool: function(){me.addFunction();},
			draggable: false
		},
		children: []
	};
	
	this.mProject.Get().Functions().each(function(){
		t.children.push({
			text: this.Id(),
			id: this.Id()
		});
	})	
	data.push(t);

	t = {
		text: 'Variables',
		id: 'variables',
		attributes: {
			root: true,
			tool: function(){me.addVariable();},
			draggable: false
		},
		children: []
	};
	
	this.mProject.Get().Variables().each(function(){
		t.children.push({
			text: this.Id(),
			id: this.Id()
		});
	})	
	data.push(t);

	t = {
		text: 'Macros',
		id: 'macros',
		attributes: {
			root: true,
			tool: function(){me.addMacro();},
			draggable: false
		},
		children: []
	};
	
	this.mProject.Get().Macros().each(function(){
		t.children.push({
			text: this.Id(),
			id: this.Id()
		});
	})	
	data.push(t);
	
	$('#uiTree').tree({
		dnd: true,
		data: data,
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

	var names = ['graphs', 'functions', 'variables', 'macros'];//, 'lvariables'];
	
	$.each(names, function(i, name){
		//console.log(a, b);
		var node = me.getTreeSection(name);
		$(node.target).addClass('uiRoot').parent().addClass('uiBody');
		var bt = $('<div class="uiAdd ' + name + '">');
		bt.appendTo(node.target);
		bt.on('click', function(){
			if(typeof node.attributes.tool == 'function')
				node.attributes.tool();
		});
		me.treeNodes[node.id] = node.target;
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
