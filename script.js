var answer;
var guessCount;
var currentGuess;
var gameOver;
var keys;

keys = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"]
];

function makeKeyBoard()
{
  var board = document.getElementById("keyboard");
  // Traverse the 3 rows of keys
  for (var r = 0; r < keys.length; r++)
  {
    // Create a row in the keyboard table
    var row = document.createElement("TR");
    row.id = "keyrow" + r;
    // Traverse each key in the row
    for (var k = 0; k < keys[r].length; k++)
    {
      // Create a cell in the table for each key
      var key = document.createElement("TD");
      key.id = keys[r][k] + "_key";
      key.className = "key";
      key.innerHTML = keys[r][k].toUpperCase();
      row.appendChild(key); // Add the key to the row
    }
    board.appendChild(row); // Add the completed row to the table
  }
}

function makeGameBoard()
{
  var board = document.getElementById("gameboard");

  // Create a 6x5 table
  for (var r = 0; r < 6; r++)
  {
    var row = document.createElement("TR");
    for (var c = 0; c < 5; c++)
    {
      var space = document.createElement("TD");
      // Identify each space with (x,y) coordinates, ex: t01, t43, etc.
      space.id = "t" + r + "" + c;
      space.className = "space";
      row.appendChild(space); // Add space to the row
    }
    board.appendChild(row); // Add row to the board
  }
}

// When game begins, pick a random word from answers list
function pickAnswer()
{
  return answers[Math.floor(Math.random() * answers.length)];
}

// Check if guess is in word list
function isValid(word)
{
  return answers.includes(word) || words.includes(word);
}

function processGuess(guess)
{
  /*
  0 = not in word
  1 = in word, in right place
  2 = in word, in wrong place
  */
  var code = [0, 0, 0, 0, 0];

  // Edit the code list so each letter in the guess is labeled as 0, 1, or 2
  for (var i = 0; i < 5; i++)
  {
    if (guess[i] == answer[i])
      code[i] = 1;
    else if (answer.includes(guess[i]))
      code[i] = 2;
  }

  return code;
}

function colorTable(word)
{
  var r = guessCount;
  //            grey,       green,      yellow
  var colors = ["#787c7e", "#6aaa64", "#c9b458"]

  code = processGuess(word);

  // Loop through each letter in the word,
  // then color each space from from column 0 to 4
  for (var c = 0; c < 5; c++)
  {
    // color gameboard
    var space = document.getElementById("t" + r + "" + c);
    space.style.backgroundColor = colors[code[c]];
    space.style.borderColor = colors[code[c]];
    space.style.color = "white";

    // color keyboard
    var key = word[c] + "_key";
    document.getElementById(key).style.backgroundColor = colors[code[c]];
    document.getElementById(key).style.color = "white";
  }
}

function guess(word)
{
  if (!isValid(word))
    return false;

  colorTable(word);
  guessCount++;
  currentGuess = "";

  if (word == answer)
    gameOver = true;
}

// Process keystroke
function inputLetter(letter)
{
  if (gameOver)
    return;

  letter = letter.toUpperCase();
  var space;

  // Check that the key is a valid alphabetical letter
  if (letter.length == 1 && letter.match(/[A-Z]/i) && currentGuess.length < 5)
  {
    // Fill the letter into the table
    space = "t" + guessCount + "" + currentGuess.length;
    document.getElementById(space).innerHTML = letter;

    currentGuess += letter; // Add the letter to the guess string
  }
  else if (letter == "BACKSPACE" && currentGuess.length > 0)  // if backspace, delete letter
  {
    currentGuess = currentGuess.substring(0, currentGuess.length-1);

    space = "t" + guessCount + "" + currentGuess.length;
    document.getElementById(space).innerHTML = "";
  }
  else if (letter == "ENTER") // if enter, input guess
  {
    if (currentGuess.length == 5)
    {
      guess(currentGuess.toLowerCase());
    }
  }

}

function run()
{
  if (!gameOver)
    document.addEventListener("keydown", function(event){inputLetter(event.key)})
}

function newGame()
{
  answer = pickAnswer();
  guessCount = 0;
  currentGuess = "";
  gameOver = false;
  run();
}

makeGameBoard();
makeKeyBoard();
newGame();
