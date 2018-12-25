;(function() {
"use strict";

exLIB.package('kodi.xbmcplugin', function(pack){
	
	pack.Category('Kodi Addon/Xbmc Plugin');

	pack.Class('xbmcplugin', 'xbmcplugin', function(){
		var n = this.StaticMethod('addDirectoryItem', 'xbmcplugin.addDirectoryItem()')
			.MakeEntry()
			.MakeExit();
		n.Input('handle', 'core.type.int');
		n.Input('url', 'core.type.string');
		n.Input('item', 'kodi.xbmcgui.ListItem');
		n.Input('isFolder', 'core.type.bool').Optional();
		n.Input('totalItems', 'core.type.int').Optional();
		

		n = this.StaticMethod('addDirectoryItems', 'xbmcplugin.addDirectoryItems()')
			.MakeEntry()
			.MakeExit();
		n.Input('handle', 'core.type.int');
		n.Input('url', 'core.type.string');
		n.Input('items', 'kodi.xbmcgui.ListItem').Array();
		n.Input('totalItems', 'core.type.int').Optional();

		n = this.StaticMethod('endOfDirectory', 'xbmcplugin.endOfDirectory()')
			.MakeEntry()
			.MakeExit();
		n.Input('handle', 'core.type.int');
		
		n = this.StaticMethod('setContent', 'xbmcplugin.setContent()')
			.MakeEntry()
			.MakeExit();
		n.Input('handle', 'core.type.int');
		n.Input('type', 'core.type.string');
		
	});	

	
});

})(this);
