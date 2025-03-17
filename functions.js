let board = [];
function genBoard (size){
  for (i = 0; i < size; i++){ 
    board.push([]); 
  }
  for (i = 0; i < size; i++){
    for(j = 0; j < size; j++){
      board[i].push({
        type: 'sea',
        hit: false,
      });
    }
  }
  return board;
}

function printBoard(board, debug){
  if (debug) board.map(row => row.map(cell => {
    if (cell.type == "bigShip" || cell.type == "smallShip") cell.hit = true; 
  }))
  let userBoard = {}, rowLetter = 65;
  board.map(row => {
    userBoard[String.fromCharCode(rowLetter)] = row.map(cell => {
      if (cell.hit == false) return '-';
      else {
        if (cell.type == "sea") return "❗";
        if (cell.type == "smallShip") return "🟠";
        if (cell.type == "bigShip") return "🔵";
      }
    // return cell;
    });
    rowLetter++;
  });
  console.log("\x1Bc");
  console.table(userBoard);
}

function genCoord(fieldSize){
  return Math.floor(Math.random()*fieldSize);
}

function placeShip(boardSize, shipSize){
  let areaClear = false, shipCell = 0, northSouth = false;
  while(!areaClear){
    areaClear = true;
    if(Math.random()*10 >= 5){
      northSouth = true;
      }
    if(northSouth){
      let shipX = genCoord(boardSize),
          shipY = genCoord(boardSize - shipSize);
      while (shipCell < shipSize){
            pickedSpot = board[shipX][shipY+shipCell];
        if (pickedSpot.type != 'sea'){
          areaClear = false;
        }
        shipCell++;
      }
      shipCell = 0;
      if(areaClear){
        while (shipCell < shipSize){
          if (shipSize == 3) board[shipX][shipY+shipCell].type = "bigShip";
          if (shipSize == 2) board[shipX][shipY+shipCell].type = "smallShip";
          shipCell++;
        }
        shipCell = 0;
      }
    }else{
      let shipX = genCoord(boardSize - shipSize),
          shipY = genCoord(boardSize);
      while (shipCell < shipSize){
        pickedSpot = board[shipX + shipCell][shipY];
        if (pickedSpot.type != "sea"){
          areaClear = false;
        }
        shipCell++;
      }
      shipCell = 0;
      if(areaClear){
        while (shipCell < shipSize){
          if (shipSize == 3) board[shipX+shipCell][shipY].type = "bigShip";
          if (shipSize == 2) board[shipX+shipCell][shipY].type = "smallShip";
          shipCell++;
        }
        shipCell = 0;
      }
    }
  }
}

module.exports = {
  genBoard,
  printBoard,
  placeShip
};