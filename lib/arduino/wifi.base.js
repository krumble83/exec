;exLIB.package('arduino.wifi', function(pack){
	
	pack.Category('Arduino/WiFi').Color('#87663f').Symbol('lib/img/esp8266.png');
		
	pack.Enum('status', 'Wifi Status').Values(['WL_CONNECTED', 'WL_NO_SHIELD', 'WL_IDLE_STATUS', 'WL_NO_SSID_AVAIL', 'WL_SCAN_COMPLETED', 'WL_CONNECT_FAILED', 'WL_CONNECTION_LOST', 'WL_DISCONNECTED']);
	
	pack.Class('connection', 'WiFi Network', function(){
		
		var n = this.StaticMethod('begin', 'WiFi.begin()').Keywords('wifi connect,connect wifi').MakeEntry().MakeExit();
		n.Input('ssid', 'core.type.string');
		n.Input('password', 'core.type.string');
		n.Output('status', 'status');

		n = this.StaticMethod('localip', 'WiFi.localIP()').Keywords('wifi ip,ip wifi,local ip');
		n.Output('localip', 'network.type.ip', 'WiFi local IP');
		
	});
	

	pack.Category('Arduino/WiFi/WiFi Client')
	//pack.Type('client', 'WiFi Client').Inherits('core.object');

	pack.Class('WiFiClient', 'WiFi Client', function(){

		n = this.Method('connect', 'WiFiClient.connect() (url)').Keywords('wifi,connect').MakeEntry().MakeExit();
		n.Input('host', 'core.type.string');
		n.Input('port', 'core.type.int');
		n.Output('success', 'core.type.bool');

		n = this.Method('connectip', 'WiFiClient.connect() (ip)').Keywords('wifi,connect').MakeEntry().MakeExit();
		n.Input('host', 'network.type.ip');
		n.Input('port', 'core.type.int');
		n.Output('success', 'core.type.bool');

		n = this.Method('connected', 'WiFiClient.connected()').Keywords('wifi,connected').Import('tpl.node.pure');
		n.Output('connected', 'core.type.bool');

		this.Method('stop', 'WiFiClient.stop()').Keywords('wifi,stop').MakeEntry().MakeExit();
	});
	

	pack.Macro('wificlientconnectmacro', function(){
		this.MakeEntry();
		this.Input('client', 'WiFiClient', 'WiFi Client');
		this.Input('host', 'core.type.string');
		this.Input('port', 'core.type.int');
		this.Input('retry', 'core.type.int').Optional().Value(1).Tooltip('Number of retries if connect fail. Set-it to 0 to infinite reties');
		this.Output('success', 'core.exec');
		this.Output('fail', 'core.exec');
		
		var n = this.Node('javascript.console.log');
		
	}).Title('WiFi Client Connect (M)').Category('Macro');

}).Require('component', 'wifi');
