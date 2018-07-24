;(function() {
"use strict";


exLIB.package('os.file', function(pack){
	pack.Category('Arduino/SD Card/File')

	var c = this.Class('fileObject', 'File Object', function(){
		var m = this.Method('name', 'File.name()').Import('tpl.node.pure');
		m.Output('name', 'core.type.string');
		
		this.Method('close', 'File.close()').MakeEntry().MakeExit();

		m = this.Method('position', 'File.position()').Import('tpl.node.pure');
		m.Output('position', 'core.type.int');

		m = this.Method('printstring', 'File.print() (string)').MakeEntry().MakeExit();
		m.Input('string', 'core.type.string');
		m.Output('byte', 'core.type.int').Tooltip('number of bytes written');

		m = this.Method('seek', 'File.seek()').MakeEntry().MakeExit();
		m.Input('position', 'core.type.int');
		m.Output('success', 'core.exec');
		m.Output('fail', 'core.exec');

		m = this.Method('size', 'File.size()')
			.Import('tpl.node.pure')
			.Keywords('file size,size file');
		m.Output('size', 'core.type.int');

		m = this.Method('isDirectory', 'File.isDirectory()')
			.Import('tpl.node.pure')
		m.Output('isDirectory', 'core.type.bool');

		m = this.Method('openNextFile', 'File.openNextFile()')
			.MakeEntry().MakeExit();
		m.Output('nextFile', 'fileObject');

		m = this.Method('rewindDirectory', 'File.rewindDirectory()')
			.MakeEntry().MakeExit();
		
	});
	
		
	
});

exLIB.package('arduino.sdcard', function(pack){
	
	pack.Category('Arduino/SD Card').Symbol('lib/img/arduino.png').Color('#87663f');
	
	pack.Enum('openmode').Values(['FILE_READ', 'FILE_WRITE']);
	
	pack.Class('sdcard', 'Arduino SD Card', function(){
		var n = this.StaticMethod('begin', 'SD.Begin()').Keywords('sd card begin,sd begin').MakeEntry().MakeExit();
		n.Input('csPin', 'arduino.io.dpin').Tooltip('SPI Chip Select Pin');
		
		n = this.StaticMethod('open', 'SD.open()').MakeEntry();
		n.Input('path', 'core.type.string');
		n.Input('mode', 'openmode');
		n.Output('success', 'core.exec');
		n.Output('fail', 'core.exec');
		n.Output('fileObject', 'os.file.fileObject');

		n = this.StaticMethod('exists', 'SD.exists()').Keywords('file exists,dir exists,path exists').Import('tpl.node.pure');
		n.Input('path', 'core.type.string');
		n.Output('exists', 'core.type.bool');

		n = this.StaticMethod('mkdir', 'SD.mkdir()').Keywords('make directory, directory make').MakeEntry();
		n.Input('path', 'core.type.string');
		n.Output('success', 'core.exec');
		n.Output('fail', 'core.exec');

		n = this.StaticMethod('rmdir', 'SD.rmdir()').Keywords('remove directory,delete directory,directory remove,directory delete').MakeEntry();
		n.Input('path', 'core.type.string');
		n.Output('success', 'core.exec');
		n.Output('fail', 'core.exec');

		n = this.StaticMethod('remove', 'SD.remove()').Keywords('remove file,delete file,file remove,file delete').MakeEntry();
		n.Input('file', 'core.type.string');
		n.Output('success', 'core.exec');
		n.Output('fail', 'core.exec');

		
	});
	
	
});


})(this);



/*
;exLIB.load('arduino.sdcard', function(ctx){
	
ctx.registerType('arduino.cs', {
	inherits: 'core.object',
	label: 'Arduino ChipSelect Pin'
});

ctx.registerType('arduino.filemode', {
	inherits: 'core.type.enum',
	label: 'File Mode',
	values: ['FILE_READ', 'FILE_WRITE']
});


ctx.registerType('arduino.file', {
	inherits: 'core.object',
	label: 'SD Card File'
});


ctx.registerNode('begin', {
	import: 'arduino.base.base',
	categories: ['Arduino/SD Card'],
	keywords: 'sd card begin',
	title:'SD Begin',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'chipSelect', type: 'arduino.cs', label: 'Chip Select Pin'},
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'success', type: 'core.type.bool'}
	]
});

ctx.registerNode('exists', {
	import: 'arduino.base.base',
	categories: ['Arduino/SD Card'],
	keywords: 'exists',
	title:'SD Path/File Exists',
	inputs: [
		{id: 'path', type: 'core.type.string'}
	],
	outputs: [
		{id: 'exists', type: 'core.type.bool'}
	]
});

ctx.registerNode('mkdir', {
	import: 'arduino.base.base',
	categories: ['Arduino/SD Card'],
	keywords: 'mkdir, make dir',
	title:'SD Make directory',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'path', type: 'core.type.string'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'success', type: 'core.type.bool'}
	]
});

ctx.registerNode('remove', {
	import: 'arduino.base.base',
	categories: ['Arduino/SD Card'],
	keywords: 'remove file',
	title:'SD Delete File',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'file', type: 'core.type.string'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'success', type: 'core.type.bool'}
	]
});

ctx.registerNode('rmdir', {
	import: 'arduino.base.base',
	categories: ['Arduino/SD Card'],
	keywords: 'remove dir',
	title:'SD Delete Directory',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'path', type: 'core.type.string'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'success', type: 'core.type.bool'}
	]
});
*/

/****************************************************************************************
	File
****************************************************************************************/
/*
ctx.registerNode('open', {
	import: 'arduino.base.base',
	categories: ['Arduino/SD Card'],
	keywords: 'open file',
	title:'SDFile Open',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'file', type: 'core.type.string', label:'File Name'},
		{id: 'mode', type: 'arduino.filemode'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'file', type: 'arduino.file'}
	]
});

ctx.registerNode('closefile', {
	import: 'arduino.base.base',
	categories: ['Arduino/SD Card'],
	keywords: 'sd card close file,close file',
	title:'SDFile Close',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'file', type: 'arduino.file'},
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
	]
});

ctx.registerNode('filename', {
	import: 'arduino.base.base',
	categories: ['Arduino/SD Card'],
	keywords: 'file name',
	title:'SDFile Get Name',
	inputs: [
		{id: 'file', type: 'arduino.file'},
	],
	outputs: [
		{id: 'name', type: 'core.type.string'},
	]
});

ctx.registerNode('available', {
	import: 'arduino.base.base',
	categories: ['Arduino/SD Card'],
	keywords: 'available',
	title:'SDFile Available',
	inputs: [
		{id: 'file', type: 'arduino.file'},
	],
	outputs: [
		{id: 'bytes', type: 'core.type.int'},
	]
});

ctx.registerNode('flush', {
	import: 'arduino.base.base',
	categories: ['Arduino/SD Card'],
	keywords: 'flush',
	title:'SDFile Flush',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'file', type: 'arduino.file'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'}
	]
});

ctx.registerNode('peek', {
	import: 'arduino.base.base',
	categories: ['Arduino/SD Card'],
	keywords: 'peek',
	title:'SDFile Peek',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'file', type: 'arduino.file'},
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'success', type: 'core.type.bool'},
		{id: 'byte', type: 'core.type.byte'}
	]
});

ctx.registerNode('position', {
	import: 'arduino.base.base',
	categories: ['Arduino/SD Card'],
	keywords: 'position',
	title:'SDFile Position',
	inputs: [
		{id: 'file', type: 'arduino.file'}
	],
	outputs: [
		{id: 'position', type: 'core.type.byte'}
	]
});

ctx.registerNode('println', {
	import: 'arduino.base.base',
	categories: ['Arduino/SD Card'],
	keywords: 'println',
	title:'SDFile Println',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'file', type: 'arduino.file'},
		{id: 'string', type: 'core.type.string'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'size', type: 'core.type.byte'}
	]
});

ctx.registerNode('seek', {
	import: 'arduino.base.base',
	categories: ['Arduino/SD Card'],
	keywords: 'seek',
	title:'SDFile Seek',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'file', type: 'arduino.file'},
		{id: 'position', type: 'core.type.int'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'success', type: 'core.type.bool'}
	]
});

ctx.registerNode('size', {
	import: 'arduino.base.base',
	categories: ['Arduino/SD Card'],
	keywords: 'size',
	title:'SDFile Size',
	inputs: [
		{id: 'file', type: 'arduino.file'}
	],
	outputs: [
		{id: 'size', type: 'core.type.int'}
	]
});

ctx.registerNode('read', {
	import: 'arduino.base.base',
	categories: ['Arduino/SD Card'],
	keywords: 'read',
	title:'SDFile Read (Byte)',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'file', type: 'arduino.file'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'success', type: 'core.type.bool'},
		{id: 'out', type: 'core.type.byte'}
	]
});

ctx.registerNode('readbuffer', {
	import: 'arduino.base.base',
	categories: ['Arduino/SD Card'],
	keywords: 'read buffer',
	title:'SDFile Read (Buffer)',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'file', type: 'arduino.file'},
		{id: 'buffer', type: 'core.type.byte[]'},
		{id: 'len', type: 'core.type.int'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'success', type: 'core.type.bool'}
	]
});

ctx.registerNode('write', {
	import: 'arduino.base.base',
	categories: ['Arduino/SD Card'],
	keywords: 'read',
	title:'SDFile Write (Byte)',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'file', type: 'arduino.file'},
		{id: 'byte', type: 'core.type.byte'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'success', type: 'core.type.bool'}
	]
});

ctx.registerNode('writebuffer', {
	import: 'arduino.base.base',
	categories: ['Arduino/SD Card'],
	keywords: 'write buffer',
	title:'SDFile Write (Buffer)',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'file', type: 'arduino.file'},
		{id: 'buffer', type: 'core.type.byte[]'},
		{id: 'len', type: 'core.type.int'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'success', type: 'core.type.bool'}
	]
});

ctx.registerNode('isdir', {
	import: 'arduino.base.base',
	categories: ['Arduino/SD Card'],
	keywords: 'isdir,is directory',
	title:'SDFile Is Directory',
	inputs: [
		{id: 'file', type: 'arduino.file'}
	],
	outputs: [
		{id: 'isDir', type: 'core.type.bool'}
	]
});

});
*/