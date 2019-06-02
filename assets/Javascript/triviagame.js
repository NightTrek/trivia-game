//utils
var getRandomInt = function (max) {
    return Math.floor(Math.random() * Math.floor(max));
}



// One class called trivia game.
//constructor uses a method call to get ajacks questions from trivia api
//builds an array of ten questions 
//keeps track of player score
//guess handler. displaying the correct or incorrect answer 
//basic question rendering

//page identifiers 
// .question
// #A
// #B
// #C
// #D

// any catagory multiple choice 15 questions 
// https://opentdb.com/api.php?amount=16&type=multiple
//easier viersion of above
//https://opentdb.com/api.php?amount=16&difficulty=easy&type=multiple

//computers multiple choice 11 questions
//https://opentdb.com/api.php?amount=11&category=18&type=multiple

class triviaGame {
    constructor() {
        this.questionDisplayID = $(`#question`);
        this.timeID = $(`#time`);
        this.solutionButtonID = [$(`#A`), $(`#B`), $(`#C`), $(`#D`)]
        this.ApiLink = "https://opentdb.com/api.php?amount=16&difficulty=easy&type=multiple"
        this.correctSolutionIndex;
        this.defaultTime = 60;
        this.time = this.defaultTime;
        this.intervalId

        this.questionsArray;
        this.questionCount = 1;
        this.GetNewquestionArray(this.ApiLink);
        this.solutionAnswered = false;
        this.correct = 0;
        this.wrong = 0;

    }

    //Async ajax call to get new questions from question API
    //working 
    GetNewquestionArray(link) {
        console.log('making Ajax call to get questions');
        $.ajax({
            url: link,
            method: "GET"
        }).then(function (response) {
            let results = response.results;
            console.log(results);
            that.questionsArray = results;
            that.renderNewQuestion(0, that.defaultTime);
        });
    }

    //rendering functions

    //render a new question with a specific interval
    renderNewQuestion(index, time) {
        console.log(`rendering questions ${index}`);
        this.questionDisplayID.text(this.apiDecoder(this.questionsArray[index].question));
        let correctsolution = getRandomInt(4);
        console.log(`correct solution index ${correctsolution}`);
        this.solutionButtonID[correctsolution].text(this.apiDecoder(this.questionsArray[index].correct_answer)).attr('style', "outline: solid black");
        this.correctSolutionIndex = correctsolution;
        //render the incorrect solution buttons
        let incorrectindex = 0;
        //for each buttonID
        for (let i = 0; i < this.solutionButtonID.length; i++) {
            //that is not the correct solutions button id
            if (correctsolution !== i) {
                this.solutionButtonID[i].text(this.apiDecoder(this.questionsArray[index].incorrect_answers[incorrectindex])).attr('style', "outline: solid black");
                incorrectindex++;
            }
        }
        this.startInterval(time);
        console.log("finished rendering new question");

    }

    //render the solution by coloring the solution outline green and the incorrect solutions red
    renderSolution() {
        this.solutionButtonID[this.correctSolutionIndex].attr('style', "outline: solid green");
        let incorrectindex = 0;
        for (let i = 0; i < this.solutionButtonID.length; i++) {
            //that is not the correct solutions button id
            if (that.correctSolutionIndex !== i) {
                this.solutionButtonID[i].attr('style', "outline: solid red");
                incorrectindex++;
            }
        }

    }

    // start timer
    startInterval(timeForQuestion) {
        that.time = timeForQuestion;
        clearInterval(that.intervalId);
        that.timeID.text(`Time left: ${that.time}`);
        that.intervalId = setInterval(that.decrement, 1000);
    }

    decrement() {
        that.time--;
        console.log(that.time);
        that.timeID.text(`Time left: ${that.time}`);
        if (that.time <= 0) {
            that.stop();
            alert("You took too long! Automatic lost this question but try another one!");
            that.wrong++
            that.renderSolution();
            this.solutionAnswered = true;
        }
        if (that.solutionAnswered == true) {
            that.stop();
        }
    }

    stop() {
        clearInterval(that.intervalId);
    }

    solutionInputHandler(guessNumber) {
        if (this.correctSolutionIndex == guessNumber) {
            alert("correct guess");
            this.correct++;
            this.renderSolution();
            this.solutionAnswered = true;
        } else if (this.correctSolutionIndex !== guessNumber) {
            alert("wrong guess");
            this.wrong++;
            this.renderSolution();
            this.solutionAnswered = true;
        }
    }

    startButtonHandler(){
        if(this.solutionAnswered == true){
            this.solutionAnswered = false;
            if(this.questionCount <= this.questionsArray.length){
                this.renderNewQuestion(this.questionCount, this.defaultTime);
                this.questionCount++;
            }
            if(this.questionCount == this.questionsArray.length){
                alert(`game over you got ${this.correct} questions right and ${this.wrong} questions wrong`);
                this.stop();
            }
        }
    }

    apiDecoder(theString){
        return $('<textarea />').html(theString).text();
    }
    //end of class here
}
//end of class here 

var Game = new triviaGame();
var that = Game;

$(document).on('click', '#start', function () {
    console.log("starting game with new question");
    Game.startButtonHandler();

});

$(document).on('click', '#A', function () {
    console.log("you clicked A 0");
    Game.solutionInputHandler(0);

});
$(document).on('click', '#B', function () {
    console.log("you clicked B 1");
    Game.solutionInputHandler(1);

});
$(document).on('click', '#C', function () {
    console.log("You clicked C 2");
    Game.solutionInputHandler(2);

});
$(document).on('click', '#D', function () {
    console.log("you clicked D 3");
    Game.solutionInputHandler(3);

});