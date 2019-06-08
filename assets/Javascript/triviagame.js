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
        this.ApiLink = "https://opentdb.com/api.php?amount=11&difficulty=easy&type=multiple"
        this.correctSolutionIndex;
        this.defaultTime = 60;
        this.time = this.defaultTime;
        this.intervalId

        this.questionsArray;
        this.questionCount = 1;
        this.solutionAnswered = false;
        this.correct = 0;
        this.wrong = 0;
        this.gameOver = false;
        this.modal = $('#final');

    }

    // cat is a number between 0 - 20
    //dif is "easy" "medium" 'hard'
    linkBuilder(cat, diff) {
        if (cat !== undefined && diff !== undefined) {
            return `https://opentdb.com/api.php?amount=16&category=${cat}&difficulty=${diff}&type=multiple`
        }
        if (cat == undefined && diff !== undefined) {
            return `https://opentdb.com/api.php?amount=16&difficulty=${diff}&type=multiple`
        }
        if (cat !== undefined && diff == undefined) {
            return `https://opentdb.com/api.php?amount=16&category=${cat}&type=multiple`
        }
    }
    //Async ajax call to get new questions from question API
    //working 
    GetNewquestionArray(link) {
        console.log('making Ajax call to get questions');
        this.correct = 0;
        this.wrong = 0;
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
        this.questionDisplayID.text(this.apiDecoder(this.questionsArray[index].question));
        let correctsolution = getRandomInt(4);
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
        that.timeID.text(`Time left: ${that.time}`);
        if (that.time <= 0) {
            that.stop();
            that.handleModal('3');
            that.wrong++
            that.renderSolution();
            that.solutionAnswered = true;
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
            this.correct++;
            this.handleModal('1');
            this.renderSolution();
            this.solutionAnswered = true;
        } else if (this.correctSolutionIndex !== guessNumber) {
            this.wrong++;
            this.handleModal('0');
            this.renderSolution();
            this.solutionAnswered = true;
        }
    }

    handleModal(string) {
        console.log('handling modal switch');
        setTimeout(function(){
            if(string !== 2){
            $.modal.close();
            }
        }, 2000);
        //correct
        if (string === '1') {
            this.modal.modal({
                fadeDuration: 500,
            });
            $("#input").html(`<h4> you are correct.... This time</h4> <hr> <button id="CloseModal" value="close">
                Close
            </button>`);
        } //wrong
        else if (string === '0') {
            this.modal.modal({
                fadeDuration: 500
            });
            $("#input").html(`<h4> Yall wrong</h4> <hr> <button id="CloseModal" value="close">Close</button>`);
        }//final modal 
        else if (string === '2') {
            this.modal.modal({
                fadeDuration: 500
            });
            $("#input").html(`<h4> You finished Good job!</h4> <hr>
                    <p> You got ${this.correct} correct and ${this.wrong} wrong </p> <button  id="CloseModal" value="close">Close</button>
                    <button  id="restart">restart</button>`);
        }
        else if (string === '3') {
            this.modal.modal({
                fadeDuration: 500
            });
            $("#input").html(`<h4> You took too long!</h4> <hr>
                    <p> Try to answer the questions in the alloted time. Do you best its just a game 
                    set on easy dont worry </p> <button  id="CloseModal" value="close">Close</button>`);
        }

    }



    startButtonHandler() {
        if (this.solutionAnswered == true) {
            this.solutionAnswered = false;
            if (this.questionCount < this.questionsArray.length) {
                this.renderNewQuestion(this.questionCount, this.defaultTime);
                this.questionCount++;
            }
            else{
                console.log('printing final modal');
                this.handleModal('2');
                this.stop();
            }
        }
    }

    apiDecoder(theString) {
        return $('<textarea />').html(theString).text();
    }
    //end of class here
}
//end of class here 

var Game = new triviaGame();
var gamestart = false;
var that = Game;

$(document).on('click touchstart', '#start', function () {
    if (gamestart == true) {
        Game.startButtonHandler();
    }
    if (gamestart == false) {
        console.log("starting game with new question");
        Game.GetNewquestionArray(Game.ApiLink);
        gamestart = true;
    }
});

$(document).on('click touchstart', '#A', function () {
    console.log("you clicked A 0");
    Game.solutionInputHandler(0);

});
$(document).on('click touchstart', '#B', function () {
    console.log("you clicked B 1");
    Game.solutionInputHandler(1);

});
$(document).on('click touchstart', '#C', function () {
    console.log("You clicked C 2");
    Game.solutionInputHandler(2);

});
$(document).on('click touchstart', '#D', function () {
    console.log("you clicked D 3");
    Game.solutionInputHandler(3);

});

$(document).on('click touchstart', "#CloseModal", function(){
$.modal.close();
});

$(document).on('click touchstart', "#restart", function(){
Game.GetNewquestionArray(Game.ApiLink);
$.modal.close();

});