function genBoard (size){
  let board = [];
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

function placeShip(board, boardSize, shipSize){
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
  return board;
}

function placeShips(board){
  let gridSize = board.length;
  switch (gridSize){
    case 4:
      //? each call of 'placeShip' places a ship, reserving that space for the ship.
      //? the sequential individual calls are necessary to avoid crossing ships and the number of ships required per board size 
      //? isn't mathematically related
      board = placeShip(board, gridSize, 3);
      board = placeShip(board, gridSize, 2);
      break;
    case 5:
      board = placeShip(board, gridSize, 3);
      board = placeShip(board, gridSize, 2);
      board = placeShip(board, gridSize, 2);
      break;
    case 6:
      board = placeShip(board, gridSize, 3);
      board = placeShip(board, gridSize, 3);
      board = placeShip(board, gridSize, 2);
      board = placeShip(board, gridSize, 2);
      break;
  }
  return board;
}

function getBoardSize(input){
  let validInput = false, loops = 0, userInput;
  while(!validInput){
    //?console.clear(); didn't work for one of my systems.
    console.log("\x1Bc");
    console.log("Welcome to Battleship");
    console.log("Please select a board size:");
    console.log("4x4, 5x5 or 6x6");
    if (loops > 0) console.log("Select 4, 5, or 6");
    userInput = input.keyIn();
    if(['4','5','6'].includes(userInput)) return userInput;
    loops++;
  }
}

function getValidTarget(board, input){
  let validInput = false, loops = 0, target, targetedAgain = false; 
  while(!validInput){
    // ? console.clear(); didn't work on my powershell, so I upgraded.
    console.log("\x1Bc");
    printBoard(board, false);
    console.log("Target:");
    if(targetedAgain == true){
      console.log("You've already hit that square!! Pick another");
      targetedAgain = false;
    }
    if(loops > 0) console.log("Input the coordinates you would like to attack. (i.e. A0)");
    target = input.prompt();
    if(target.length == 2){ 
      const targetX = target[1];
      const targetY = target.toUpperCase().charCodeAt(0)-65;
      if(board[targetY][targetX].hit == true) targetedAgain = true;
      else if (targetX < board.length && targetY < board.length) validInput = true;
      else loops++;
    }
    else loops++;
    if(target == "quit")return "quit";
  }
  return target;
}

function runGame(board, input){
  let target, targetX, targetY, hitTotal;
  if(board.length == 4) hitTotal = 5;
  if(board.length == 5) hitTotal = 7;
  if(board.length == 6) hitTotal = 10;
  while(true){
    target = getValidTarget(board, input);
    if(target == "quit") return false;
    targetX = target[1];
    targetY = target.toUpperCase().charCodeAt(0)-65;
    board[targetY][targetX].hit = true;
    if (board[targetY][targetX].type == "bigShip" || board[targetY][targetX].type == "smallShip") hitTotal--;
    console.log(hitTotal);
    if(hitTotal == 0) return true;
  }
}

function endGame(win){
  //? again, console.clear(); didn't work for me
  console.log("\x1Bc");

  //?prettier may be ruining this output on the second line of the 'you win'
  if(win)console.log(`\`\`\`txt
  ========
  __   _______ _   _   _    _ _____ _   _
  \\ \\ / /  _  | | | | | |  | |_   _| \\ | |
   \\ V /| | | | | | | | |  | | | | |  \\| |
    \\ / | | | | | | | | |/\\| | | | | . ' |
    | | \\ \\_/ / |_| | \\  /\\  /_| |_| |\\  |
    \\_/  \\___/ \\___/   \\/  \\/ \\___/\\_| \\_/
  ========
  \`\`\``);
}

function main(input){
  const boardSize = getBoardSize(input);
  let board = genBoard(boardSize);
  board = placeShips(board);
  endGame(runGame(board, input));
}

module.exports = {
  main
};