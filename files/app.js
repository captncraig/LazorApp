'use strict';


var lazorApp = angular.module('lazorApp', []);

function LazorCtrl($scope, $http) {
	$scope.board = [];
	
	$http.get('../newGame').success(function(data){
		data = atob(data);
		$scope.board = [];
		var col,row;
		for(row = 0; row<8; row++){
			var thisRow = [];
			for(col = 0; col <10; col++){
				var cell = data.charCodeAt(col + row*10)
				var t = getType(cell);
				var f = '', c = ''
				if(t != 'empty'){
					f = getFacing(cell);
					c = getColor(cell);
				}
				thisRow.push({type:t,facing:f,color:c});
			}
			$scope.board.push(thisRow);
		}
	});
}

function getType(cell){
	switch(cell & 7){
		case 1:
			return 'lazor';
		case 2:
			return 'target';
		case 3:
			return 'shield';
		case 4:
			return 'mirror';
		case 5: 
			return 'doubleMirror';
	}
	return 'empty';
}

function getFacing(cell){
	var facingOnly = cell & (3 << 4);
	facingOnly >>=4;
	switch(facingOnly){
		case 0:
			return 'noth';
		case 1:
			return 'east';
		case 2:
			return 'south';
		case 3:
			return 'west';
	}
}
function getColor(cell){
	if( cell & (1 << 3)){
		return 'red';
	}
	return 'silver';
	
}