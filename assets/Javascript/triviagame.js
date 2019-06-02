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



class triviaGame {
    constructor() {
        this.questionDisplayID = $(`#question`);
        this.timeID = $(`#time`);
        this.solutionButtonID = [$(`#A`), $(`#B`), $(`#C`), $(`#D`)]
        this.ApiLink = "https://opentdb.com/api.php?amount=10&category=18&type=multiple"
        this.correctSolutionIndex;
        this.defaultTime = 120;
        this.time = this.defaultTime;
        this.intervalId
        this.questionsArray;
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
            that.renderNewQuestion(0, this.defaultTime);
        });
    }


    renderNewQuestion(index, time) {
        console.log(`rendering questions ${index}`);
        this.questionDisplayID.text(this.questionsArray[index].question);
        let correctsolution = getRandomInt(4);
        console.log(`correct solution index ${correctsolution}`);
        this.solutionButtonID[correctsolution].text(this.questionsArray[index].correct_answer);
        this.correctSolutionIndex = correctsolution;
        //render the incorrect solution buttons
        let incorrectindex = 0;
        //for each buttonID
        for (let i = 0; i < this.solutionButtonID.length; i++) {
            //that is not the correct solutions button id
            if (correctsolution !== i) {
                this.solutionButtonID[i].text(this.questionsArray[index].incorrect_answers[incorrectindex])
                incorrectindex++;
            }
        }
        this.startInterval(time);
        console.log("finished rendering new question");

    }

    // start timer
    startInterval(timeForQuestion) {
        this.time = 120;
        clearInterval(this.intervalId);
        that.timeID.text(`Time left: ${this.time}`);
        this.intervalId = setInterval(that.decrement, 1000);
    }

    decrement() {
        that.time--;
        console.log(that.time);
        that.timeID.text(`Time left: ${that.time}`);
        if (that.time <= 0) {
            that.stop();
            alert("You took too long! Automatic lost this question but try another one!");
            that.wrong++
        }
        if (that.solutionAnswered == true) {
            that.stop();
        }
    }

    stop() {
        clearInterval(that.intervalId);
    }

    questionInputHandler(guessNumber) {
        if (this.correctSolutionIndex == guessNumber) {


        }
    }

    //end of class here
}
//end of class here 

var Game = new triviaGame();
var that = Game;

$(document).on('click', '#start', function () {
    console.log("starting game with new question");

});

$(document).on('click', '#A', function () {
    console.log("you clicked A 0");

});
$(document).on('click', '#B', function () {
    console.log("you clicked B 1");

});
$(document).on('click', '#C', function () {
    console.log("You clicked C 2");

});
$(document).on('click', '#D', function () {
    console.log("you clicked D 3");

});