'use strict';

var lazorApp = angular.module('lazorApp', []);

function LazorCtrl($scope, $http, lazorDeserializer,neighbors,lazorSerializer, $timeout) {
	$scope.board = [];
	
	$http.get('../newGame').success(function(data){
		$scope.board = lazorDeserializer.deserialize(data);
	});
	
	$scope.clickState = 0; 
	var selected = null;
	var possibleSet = [];
	var currentColor = 'silver';
	
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
		if($scope.clickState == 0 && cell.type != 'empty' && cell.color == currentColor){
			cell.overlay = 'selected';
			selected = cell;
			$scope.clickState = 1;
			possibleSet = neighbors.getNeighbors(cell,$scope.board);
		}
		else if($scope.clickState == 1){
			if(cell == selected){
				unselect();
				$scope.clickState = 0;
			}
			else if(_(possibleSet).contains(cell)){
				swap(cell,selected);
				finishMove();
			}
		}
	}
	
	function finishMove(){
		unselect();
		fireLazor();
	}
	
	function nextTurn(){
		$scope.clickState = 0;
		currentColor = currentColor == 'silver' ? 'red' : 'silver';
		var cellToRemove = $scope.killTarget;
		if(cellToRemove){
			cellToRemove.overlay = '';
			cellToRemove.type = 'empty';
			cellToRemove.facing = '';
			cellToRemove.color = '';
		}
		_($scope.lazorCells).each(function(cell){
			cell.upLazor = cell.rightLazor = cell.downLazor = cell.leftLazor = false;
		});
	}
	
	$scope.lazorCells = [];
	$scope.killTarget = null;
	
	function fireLazor(){
		var str = lazorSerializer.serialize($scope.board);
		var that = this;
		$http.get('../path?brd='+str).success(function(data){
			$scope.lazorCells = [];
			$scope.killTarget = null;
			var i;
			for(i = 0; i<data.length; i++){
				var move = data[i];
				var row = Math.floor(move.Cell / 10);
				var col = move.Cell % 10;
				var cell = $scope.board[row][col];
				$scope.lazorCells.push(cell);
				if(move.ExitDirection == 0 || move.EnterDirection == 0) 	cell.upLazor = true;
				if(move.ExitDirection == 16 || move.EnterDirection == 16) 	cell.rightLazor = true;
				if(move.ExitDirection == 32 || move.EnterDirection == 32) 	cell.downLazor = true;
				if(move.ExitDirection == 48 || move.EnterDirection == 48) 	cell.leftLazor = true;
				if(i==data.length -1 && move.IsDestroyed ){
					$scope.killTarget = cell;
					cell.overlay = 'dead';
				}
			}
			$timeout(nextTurn,1000);
		})
	}
	
	$scope.rotateLeft = function(){
		selected.facing = ["west","north","east","south"][["north","east","south","west"].indexOf(selected.facing)];
		finishMove();
	}
	$scope.rotateRight = function(){
		selected.facing = ["east","south","west","north"][["north","east","south","west"].indexOf(selected.facing)];
		finishMove();
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





