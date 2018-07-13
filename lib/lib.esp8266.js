;exLIB.package('esp8266.wifi', function(pack){
	
	pack.Category('Esp8266/WiFi').Color('#9c39da').Symbol('lib/img/esp8266.png');
		
	pack.Enum('wifistatus', 'Wifi Status').Values(['WL_CONNECTED']);
	
	var n = pack.Node('wificonnect', 'WiFi Connect').Keywords('wifi,connect').MakeEntry().MakeExit();
	n.Input('ssid', 'core.type.string');
	n.Input('password', 'core.type.string');
	n.Output('status', 'esp8266.wifi.wifistatus');

	n = pack.Node('wifiip', 'WiFi Local Ip').Keywords('wifi,ip');
	n.Output('localip', 'network.type.ip', 'WiFi local IP');


	pack.Category('Esp8266/WiFi/WiFi Client')
	pack.Type('client', 'WiFi Client').Inherits('core.object');

	
	n = pack.Node('wificlientconnect', 'WiFi Client Connect').Keywords('wifi,connect').MakeEntry();
	n.Input('client', 'esp8266.wifi.client', 'WiFi Client');
	n.Input('host', 'core.type.string');
	n.Input('port', 'core.type.int');
	n.Output('success', 'core.exec');
	n.Output('fail', 'core.exec');

	n = pack.Node('wificlientstop', 'WiFi Client Stop').Keywords('wifi,stop').MakeEntry().MakeExit();
	n.Input('client', 'esp8266.wifi.client', 'WiFi Client');



	pack.Macro('wificlientconnectmacro', function(){
		this.MakeEntry();
		this.Input('client', 'esp8266.wifi.client', 'WiFi Client');
		this.Input('host', 'core.type.string');
		this.Input('port', 'core.type.int');
		this.Input('retry', 'core.type.int').Optional().Value(1);
		this.Output('success', 'core.exec');
		this.Output('fail', 'core.exec');
		this.ImportNode('javascript.console.log');
		
	}).Title('WiFi Client Connect (M)').Category('Macro');
	
	
	

	
});


;exLIB.load('esp8266', function(ctx){

ctx.registerType('esp8266.httpcode', {
	inherits: 'core.type.enum',
	label: 'HTTP Code',
	values: ['200 - OK', 'CHANGE', 'RISING', 'FALLING', 'HIGH']
});

ctx.registerType('esp8266.serverconnection', {
	inherits: 'core.object',
	label: 'Server Connection'
});

ctx.registerNode('wificonnect', {
	import: 'core.function',
	categories: ['Esp8266'],
	keywords: 'wifi,connect',
	title:'WiFi Connect',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'ssid', type: 'core.type.string'},
		{id: 'password', type: 'core.type.string'}
	],
	outputs: [
		{id: 'connected', type: 'core.exec'},
		{id: 'timeout', type: 'core.exec'},
		{id: 'address', type: 'network.type.ip', label: 'IP Address', tooltip: 'Local IP address, available only on Succes'}
	]
});

ctx.registerNode('serverrequest', {
	import: 'core.event',
	categories: ['Esp8266'],
	keywords: 'wifi,connect',
	title:'On Server Request',
	inputs: [
		{id: 'url', type: 'core.type.string'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
		{id: 'request', type: 'esp8266.serverconnection'}
	]
});

ctx.registerNode('serverresponse', {
	import: 'core.function',
	categories: ['Esp8266'],
	keywords: 'wifi,connect',
	title:'Server Response',
	inputs: [
		{id: 'entry', type: 'core.exec'},
		{id: 'request', type: 'esp8266.serverconnection'},
		{id: 'responsecode', type: 'esp8266.httpcode'},
		{id: 'mimetype', type: 'core.type.string'},
		{id: 'response', type: 'core.type.string'}
	],
	outputs: [
		{id: 'exit', type: 'core.exec'},
	]
});
});
