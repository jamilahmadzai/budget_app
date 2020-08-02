var randomItem;

var Question = function(question, answers, correctAnswer) {
  this.question = question;
  this.answers = answers;
  this.correctAnswer = correctAnswer;
};

var question1 = new Question(
  "What is Javascript?",
  ["styling lang", "serverscript lang", "database lang", "clientScript lang"],
  3
);
var question2 = new Question(
  "Which of the following is a JS framework?",
  ["CSS", "JQuery", "Panda", "HTML"],
  1
);
var question3 = new Question(
  "What is the function equivalent to in JS?",
  ["object", "integer", "array", "string"],
  0
);

var questions = [question1, question2, question3];

function questionGenerator() {
  randomItem = questions[Math.floor(Math.random() * questions.length)];
  console.log(randomItem.question);
  for (var i = 0; i < randomItem.answers.length; i++) {
    console.log(i + ". " + randomItem.answers[i]);
  }
}

questionGenerator();
var selectedAns = parseInt(prompt("Please enter the correct answer."));
//console.log(selectedAns);
if (selectedAns === randomItem.correctAnswer) {
  console.log("That is correct!!!!");
} else {
  console.log("That is incorrect :(");
}
