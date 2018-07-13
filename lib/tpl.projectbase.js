;Driver.load(function(ctx){
	
ctx.registerTemplate('project.function', {
	ctor: function(name){
		
	},
	nodes: [
		{
			id: ''
		}
	]
	
});

ctx.registerTemplate('project.graph', {
	ctor: function(name){
		var me = this;
		
		if(!name){
			var n = 'NewGraph';
			var a=0;
			var t = true;
			while(t != null){
				a++;
				t = $('#uiTabs').tabs('getTab', n + a);
			}
			name = n + a;
		}
		
		$('#uiTabs').tabs('add',{
			title: name,
			closable:true,
			iconCls : 'icon-graph-small',
			attributes: {svg: null}
		});
		var tab = $('#uiTabs').tabs('getTab', name);
		tab.panel('body').append('<div style="height:100%" id="svg_' + name + '">');
		var svg = SVG('svg_' + name).worksheet(function(){
			this.setTitle(name);
		});
		//$(tab).panel('doLayout');
		tab[0].SVG = svg;
		console.log(tab);
		
		$('#uiTree').tree('append', {
			parent: me.treeNodes.graphs,
			data: [{
				id: name ,
				text: name,
				tab: tab,
				iconCls : 'icon-graph-small',
				attributes: {draggable: false}
			}]
		});
		var node = $('#uiTree').tree('find', name);
		$('#uiTree').tree('beginEdit', node.target);	
	},
	nodes: []
});


});
