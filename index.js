var Word = require("./word.js");
var inquirer = require("inquirer");

var letterArray = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
var gameWords = ["team fortress", "half life", "doom eternal", "cyberpunk", "borderlands", "grand theft auto", "assassins creed", "the legend of zelda", "monster hunter world", "the elder scrolls", "counter strike", "hitman", "dark souls"];

var randomChoice = Math.floor(Math.random() * gameWords.length);
var randomWord = gameWords[randomChoice];

computerWord = new Word(randomWord);
var requireNewWord = false;
var incorrectLetters = [];
var correctLetters = [];
var guessesLeft = 10;

function knowledge() {
    if (requireNewWord) {
        var randomChoice = Math.floor(Math.random() * gameWords.length);
        var randomWord = gameWords[randomChoice];

        computerWord = new Word(randomWord);
        requireNewWord = false;
    }

    var wordComplete = [];
    computerWord.objArray.forEach(completeCheck);

    if (wordComplete.includes(false)) {
        inquirer
            .prompt([{
                type: "input",
                message: "Guess a letter between A-Z!",
                name: "userinput"
            }])
            .then(function (input) {

                if (!letterArray.includes(input.userinput) || input.userinput.length > 1) {
                    console.log("\nTry again!\n");
                    knowledge();
                } else {

                    if (incorrectLetters.includes(input.userinput) || correctLetters.includes(input.userinput) || input.userinput === "") {
                        console.log("\nAlready Guessed or Nothing Entered\n");
                        knowledge();
                    } else {

                        var wordCheckArray = [];

                        computerWord.userGuess(input.userinput);

                        computerWord.objArray.forEach(wordCheck);
                        if (wordCheckArray.join('') === wordComplete.join('')) {
                            console.log("\nIncorrect\n");
                            incorrectLetters.push(input.userinput);
                            guessesLeft--;
                        } else {
                            console.log("\nCorrect!\n");
                            correctLetters.push(input.userinput);
                        }

                        computerWord.log();
                        console.log("Guesses Left: " + guessesLeft + "\n");
                        console.log("Letters Guessed: " + incorrectLetters.join(" ") + "\n");

                        if (guessesLeft > 0) {
                            knowledge();
                        } else {
                            console.log("You Lose!\n");

                            restartGame();
                        }

                        function wordCheck(key) {
                            wordCheckArray.push(key.guessed);
                        }
                    }
                }
            })
    } else {
        console.log("YOU WIN!\n");

        restartGame();
    }

    function completeCheck(key) {
        wordComplete.push(key.guessed);
    }

}

function restartGame() {
    inquirer
        .prompt([{
            type: "list",
            message: "Would you like to:",
            choices: ["Play Again", "Exit"],
            name: "restart"
        }])
        .then(function (input) {
            if (input.restart === "Play Again") {
                requireNewWord = true;
                incorrectLetters = [];
                correctLetters = [];
                guessesLeft = 10;
                knowledge();
            } else {
                return
            }
        })
}

knowledge();