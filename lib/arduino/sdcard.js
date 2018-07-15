
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