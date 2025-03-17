var input = require('readline-sync');
var f = require("./functions");

//intro
let validInput = false, loops = 0, gridSize = '';
while(!validInput){
  console.log("\x1Bc");
  console.log("Welcome to Battleship");
  console.log("Please Select a board size:");
  if (loops > 0) console.log("Please try again");
  gridSize = input.keyIn('4x4, 5x5 or 6x6: ');
  if(gridSize == '4' || gridSize == '5' || gridSize == '6') validInput = true;
  loops++;
}
validInput = false;
loops = 0;

//game init
let hitTotal = 0, target = '', targetX = 0, targetY = 0, running = true, board = [], win = false;
board = f.genBoard(gridSize);
switch (gridSize){
  case '4':
    f.placeShip(gridSize, 3);
    f.placeShip(gridSize, 2);
    hitTotal = 5;
    break;
  case '5':
    f.placeShip(gridSize, 3);
    f.placeShip(gridSize, 2);
    f.placeShip(gridSize, 2);
    hitTotal = 7;
    break;
  case '6':
    f.placeShip(gridSize, 3);
    f.placeShip(gridSize, 3);
    f.placeShip(gridSize, 2);
    f.placeShip(gridSize, 2);
    hitTotal = 10;
    break;
}

//gameplay
while(running){
  while(!validInput){
    console.log("\x1Bc");
    f.printBoard(board, false);
    console.log("Target:");
    if(loops > 0) console.log("Input the coordinates you would like to attack. (i.e. A0)");
    target = input.prompt();
    if(target.length == 2){ 
      targetX = target[1];
      targetY = target.toUpperCase().charCodeAt(0)-65;
      if (targetX < board.length && targetY < board.length) validInput = true;
    }
    loops++;
    if(target == "quit"){ running = false; console.log("\x1Bc"); break; }
  }
  validInput = false;
  loops = 0;
  board[targetY][targetX].hit = true;
  if (board[targetY][targetX].type == "bigShip" || board[targetY][targetX].type == "smallShip") hitTotal--;
  console.log(hitTotal);
  if(hitTotal == 0) {console.log("\x1Bc"); win = true; running = false;}
}

//outro
console.log("\x1Bc");
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