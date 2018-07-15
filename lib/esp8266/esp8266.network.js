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

	
	n = pack.Node('wificlientconnect', 'WiFi Client Connect').Keywords('wifi,connect').MakeEntry().MakeExit();
	n.Input('client', 'esp8266.wifi.client', 'WiFi Client');
	n.Input('host', 'core.type.string');
	n.Input('port', 'core.type.int');
	n.Output('success', 'core.type.bool');

	n = pack.Node('wificlientstop', 'WiFi Client Stop').Keywords('wifi,stop').MakeEntry().MakeExit();
	n.Input('client', 'esp8266.wifi.client', 'WiFi Client');



	pack.Macro('wificlientconnectmacro', function(){
		this.MakeEntry();
		this.Input('client', 'esp8266.wifi.client', 'WiFi Client');
		this.Input('host', 'core.type.string');
		this.Input('port', 'core.type.int');
		this.Input('retry', 'core.type.int').Optional().Value(1).Tooltip('Number of retries if connect fail. Set-it to 0 to infinite reties');
		this.Output('success', 'core.exec');
		this.Output('fail', 'core.exec');
		this.ImportNode('javascript.console.log');
		
	}).Title('WiFi Client Connect (M)').Category('Macro');

});
