lazorApp.factory('lazorDeserializer', function(){
	function getType(cell){
		switch(cell & 7){
			case 1: return 'lazor';
			case 2: return 'target';
			case 3: return 'shield';
			case 4: return 'mirror';
			case 5: return 'doubleMirror';
		}
		return 'empty';
	}
	function getFacing(cell){
		var facingOnly = cell & (3 << 4);
		facingOnly >>=4;
		switch(facingOnly){
			case 0: return 'north';
			case 1: return 'east';
			case 2: return 'south';
			case 3: return 'west';
		}
	}
	function getColor(cell){
		if( cell & (1 << 3)){
			return 'red';
		}
		return 'silver';
	}
	return{
		deserialize: function(data){
			data = atob(data);
			var board = [];
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
					thisRow.push({type:t,facing:f,color:c,row:row,col:col});
				}
				board.push(thisRow);
			}
			return board;
		}
	}
});

lazorApp.factory('lazorSerializer', function(){
	function cellToByte(cell){
		if(cell.type == 'empty')return 0;
		var type = ['','lazor','target','shield','mirror','doubleMirror'].indexOf(cell.type);
		var color = ['silver','red'].indexOf(cell.color)<<3;
		
		var facing = ['north','east','south','west'].indexOf(cell.facing) << 4;
		return type | color | facing;
	}
	return{
		serialize: function(board){
			var row,col;
			var raw = "";
			for(row = 0; row < 8; row++){
				for(col = 0; col < 10; col++){
					var i = cellToByte(board[row][col]);
					raw += String.fromCharCode(i);
				}
			}
			console.log(btoa(raw));
		}
	}
});