;(function() {
"use strict";

exLIB.package('kodi.xbmcgui', function(pack){
	
	pack.Category('Kodi Addon/XbmcGui/ListItem');
	
	pack.Class('ListItem', 'xbmcgui List Item', function(){
		var n = this.StaticMethod('listitem', 'Make List Item');
		n.Input('label', 'core.type.string');
		n.Input('iconImage', 'core.type.string');
		n.Input('label2', 'core.type.string').Optional();
		n.Input('thumbnailImage', 'core.type.string').Optional();
		n.Input('url', 'core.type.string').Optional();		
		n.Output('item', 'kodi.xbmcgui.ListItem');

		n = this.Method('setIconImage', 'setIconImage()')
			.MakeEntry()
			.MakeExit();
		n.Input('url', 'core.type.string');
		
		n = this.Method('addContextMenuItems', 'addContextMenuItems()')
			.MakeEntry()
			.MakeExit();
		n.Input('items', 'special.pair<core.type.string, core.type.string>');
		n.Input('replaceItems', 'core.type.bool');
		
		n = this.Method('addStreamInfoVideo', 'addStreamInfo() [video]')
			.MakeEntry()
			.MakeExit();
		n.Input('codec', 'core.type.string').Optional();
		n.Input('aspect', 'core.type.float').Optional();
		n.Input('width', 'core.type.int').Optional();
		n.Input('height', 'core.type.int').Optional();
		n.Input('duration', 'core.type.int').Optional();
		
		n = this.Method('addStreamInfoAudio', 'addStreamInfo() [audio]')
			.MakeEntry()
			.MakeExit();
		n.Input('codec', 'core.type.string').Optional();
		n.Input('language', 'core.type.string').Optional();
		n.Input('channels', 'core.type.int').Optional();
		
		n = this.Method('addStreamInfoSubtitle', 'addStreamInfo() [subtitle]')
			.MakeEntry()
			.MakeExit();
		n.Input('language', 'core.type.string');
		
		
		n = this.Method('getLabel', 'getLabel()');
		n.Output('label', 'core.type.string');
		
		n = this.Method('getLabel2', 'getLabel2()');
		n.Output('label', 'core.type.string');
		
		n = this.Method('getProperty', 'getProperty()');
		n.Input('name', 'core.type.string');
		n.Output('value', 'core.type.string');
		
		n = this.Method('getdescription', 'getdescription()');
		n.Output('description', 'core.type.string');
		
		n = this.Method('getduration', 'getduration()');
		n.Output('duration', 'core.type.int');
		
		n = this.Method('getfilename', 'getfilename()');
		n.Output('filename', 'core.type.string');
		
		n = this.Method('isSelected', 'isSelected()');
		n.Output('selected', 'core.type.bool');
		
		n = this.Method('select', 'select()')
			.MakeEntry()
			.MakeExit();
		n.Input('selected', 'core.type.bool');
		
		n = this.Method('setArt', 'setArt()')
			.MakeEntry()
			.MakeExit();
		n.Input('name', 'core.type.string');
		n.Input('value', 'core.wildcards');
		
		n = this.Method('setContentLookup', 'setContentLookup()')
			.MakeEntry()
			.MakeExit();
		n.Input('ContentLookup', 'core.type.bool');
		
		n = this.Method('setInfo', 'setInfo()')
			.MakeEntry()
			.MakeExit();
		n.Input('name', 'core.type.string');
		n.Input('value', 'core.wildcards');
		
		n = this.Method('setLabel', 'setLabel()')
			.MakeEntry()
			.MakeExit();
		n.Input('label', 'core.type.string');
		
		n = this.Method('setLabel2', 'setLabel2()')
			.MakeEntry()
			.MakeExit();
		n.Input('label2', 'core.type.string');
		
		n = this.Method('setMimeType', 'setMimeType()')
			.MakeEntry()
			.MakeExit();
		n.Input('mimeType', 'core.type.string');
		
		n = this.Method('setPath', 'setPath()')
			.MakeEntry()
			.MakeExit();
		n.Input('path', 'core.type.string');
		
		n = this.Method('setProperty', 'setProperty()')
			.MakeEntry()
			.MakeExit();
		n.Input('name', 'core.type.string');
		n.Input('value', 'core.type.string');
		
		n = this.Method('setSubtitles', 'setSubtitles()')
			.MakeEntry()
			.MakeExit();
		n.Input('subtitles', 'core.type.string').Array();
		
		n = this.Method('setThumbnailImage', 'setThumbnailImage()')
			.MakeEntry()
			.MakeExit();
		n.Input('thumbnailImage', 'core.type.string');
		
	});
	
	
});

})(this);
