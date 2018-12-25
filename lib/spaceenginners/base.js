;(function() {
"use strict";

exLIB.package('se.ingame', function(pack){
	
	pack.Category('Space Enginners Script');
	
	pack.Class('Vector3D', 'Vector 3D', function(){
		this.Member('x', 'core.type.float').Getter().Setter();
		this.Member('y', 'core.type.float').Getter().Setter();
		this.Member('z', 'core.type.float').Getter().Setter();	
	});
	
	pack.Class('IMyEntity', 'MyEntity', function(){
		var n = this.Method('position', 'Get Position');
		n.Output('position', 'Vector3D');
	});
	
	pack.Class('IMyFunctionalBlock', 'Functional Block', function(){		
		this.Member('Enabled', 'core.type.bool').Getter();

		var n = this.Method('RequestEnable')
			.MakeEntry().MakeExit();
		n.Input('enable', 'core.type.bool');
	});

	
	pack.Class('ITerminalAction', 'Terminal Block', function(){

	});	

	pack.Class('ITerminalProperty', 'Terminal Property', function(){
		this.Member('Id', 'core.type.string').Getter();
		this.Member('TypeName', 'core.type.string').Getter();
	});	

	pack.Class('IMyInventory', 'Inventory', function(){

	});	


	pack.Class('TerminalActionParameter', 'Terminal Action Parameter', function(){

	});	
	

	pack.Category('Space Enginners Script/Terminal Block');
	pack.Class('IMyTerminalBlock', 'Terminal Block', function(){
		
		this.Member('CustomName', 'core.type.string').Getter();
		this.Member('CustomNameWithFaction', 'core.type.string').Getter();
		this.Member('DetailedInfo', 'core.type.string').Getter();
		this.Member('CustomInfo', 'core.type.string').Getter();
		this.Member('CustomData', 'core.type.string').Getter().Setter();
		this.Member('ShowOnHUD', 'core.type.bool').Getter();

		var n = this.Method('HasLocalPlayerAccess', 'Has Local Player Access ?');
		n.Output('access', 'core.type.bool');
		
		n = this.Method('HasPlayerAccess', 'Has Player Access ?');
		n.Input('playerId', 'core.type.int');
		n.Output('access', 'core.type.bool');
		
		n = this.Method('SetCustomName', 'Set Custom Name')
		.MakeEntry().MakeExit();
		n.Input('name', 'core.type.string');


		n = this.Method('GetActions', 'GetActions()')
		n.Input('resultList', 'ITerminalAction').Array();


		n = this.Method('SearchActionsOfName', 'Search Actions Of Name')
		n.Input('name', 'core.type.string');
		n.Input('resultList', 'ITerminalAction').Array();
		
		n = this.Method('GetActionWithName', 'Get Action With Name')
		n.Input('name', 'core.type.string');
		n.Output('action', 'ITerminalAction');

		n = this.Method('GetProperty', 'Get Block Property')
		n.Input('id', 'core.type.string');
		n.Output('property', 'ITerminalProperty');

		n = this.Method('GetProperties', 'Get Block Properties')
		n.Output('resultList', 'ITerminalProperty').Array();




		
		n = this.Method('ApplyAction', 'Apply Action')
		.MakeEntry().MakeExit();
		n.Input('action', 'core.type.string');
		n.Input('parameters', 'TerminalActionParameter').Array().Optional();

		n = this.Method('HasAction', 'Has Action ?')
		n.Input('action', 'core.type.string');
		n.Output('value', 'core.type.bool');

		n = this.Method('HasInventory', 'HasInventory()')
		n.Output('value', 'core.type.bool');
		
		n = this.Method('GetInventory', 'GetInventory()')
		n.Input('index', 'core.type.int');
		n.Output('inventory', 'IMyInventory');

		n = this.Method('GetInventoryCount', 'GetInventoryCount()')
		n.Output('count', 'core.type.int');


	});



	pack.Category('Space Enginners Script/GridTerminalSystem');
	pack.Class('GridTerminalSystem', 'Terminal Block', function(){
		var n = this.StaticMethod('GetBlockWithName', 'GetBlockWithName()');
		n.Input('name', 'core.type.string');
		n.Output('block', 'IMyTerminalBlock');
	});	
	
});

})(this);
