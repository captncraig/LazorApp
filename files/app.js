'use strict';

var lazorApp = angular.module('lazorApp', []);

function LazorCtrl($scope, $http, lazorDeserializer,neighbors,lazorSerializer) {
	$scope.board = [];
	
	$http.get('../newGame').success(function(data){
		$scope.board = lazorDeserializer.deserialize(data);
	});
	
	$scope.move = function(){
		var str = lazorSerializer.serialize($scope.board);
		$http.get('../path?brd='+str).success(function(data){
			var i;
			for(i = 0; i<data.length; i++){
				var move = data[i];
				var row = Math.floor(move.Cell / 10);
				var col = move.Cell % 10;
				if(move.ExitDirection == 0 || move.EnterDirection == 0) $scope.board[row][col].upLazor = true;
				if(move.ExitDirection == 16 || move.EnterDirection == 16) $scope.board[row][col].rightLazor = true;
				if(move.ExitDirection == 32 || move.EnterDirection == 32) $scope.board[row][col].downLazor = true;
				if(move.ExitDirection == 48 || move.EnterDirection == 48) $scope.board[row][col].leftLazor = true;
			}
		})
	};
	
	var clickState = 0; 
	var selected = null;
	var possibleSet = [];
	
	function unselect(){
		selected.overlay = '';
		possibleSet.forEach(function(cell){
			cell.overlay = '';
		});
		possibleSet = [];
	}
	
	function swap(a,b){
		var f,t,c;
		f = a.facing;
		t = a.type;
		c = a.color;
		a.facing = b.facing;
		a.type = b.type;
		a.color = b.color;
		b.facing = f;
		b.type = t;
		b.color = c;
	}
	
	$scope.handleClick = function(cell){
		if(clickState == 0 && cell.type != 'empty'){
			cell.overlay = 'selected';
			selected = cell;
			clickState = 1;
			possibleSet = neighbors.getNeighbors(cell,$scope.board);
		}
		else if(clickState == 1){
			if(cell == selected){
				unselect();
				clickState = 0;
			}
			else if(_(possibleSet).contains(cell)){
				swap(cell,selected);
				unselect();
				clickState = 0;
			}
		}
	}
}

lazorApp.factory('neighbors', function(){
	return{
		getNeighbors: function(cell,board){
			if(cell.type == 'lazor')return [];
			var arr = [];
			var row = cell.row -1, col;
			for(;row <= cell.row + 1; row++){
				if(row < 0 || row > 7) continue;
				for(col = cell.col -1;col<=cell.col+1; col++){
					if(col <0 || col > 9) continue;
					if(row == cell.row && col == cell.col) continue;
					var target = board[row][col];
					if(target.type == 'empty' || (cell.type == 'doubleMirror' && (target.type == 'mirror' || target.type == 'shield'))){
						target.overlay = 'possible';
						arr.push(target);
					}
				}
			}
			return arr;
		}
	};
});





