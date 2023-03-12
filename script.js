"use strict";
// Import quizzes from json files
import greet from "./greetings.json" assert { type: "json" };
import count from "./counting.json" assert { type: "json" };
// Generic variable for query selector
const $ = (selector) => document.querySelector(selector);
// Set up selectors to be used in the game
const gameArea = $(".game-area");
const quizSelector = $(".quizzes");
const showNumbers = $(".show-numbers");
let message = $(".message");
let questionDiv = $(".question");
let answersDiv = $(".answers");
const startBtn = $(".start");
const nextBtn = $(".next");
const playAgainBtn = $(".play-again");
// Set up object to track player choices and performance
let player = {
  quiz: "",
  quizName: "",
  quizLength: 0,
  numQuestions: 0,
  questionCount: 1,
  correct: 0,
  incorrect: 0,
};
// Assign imported quizzes to variables
const greetings = greet;
const counting = count;

function nextQuestion() {
  // Show user progress throughout quiz
  message.innerHTML = `Question ${player.questionCount++} of ${
    player.numQuestions
  } questions`;
  answersDiv.innerHTML = "";
  // Continue asking questions as long as there are questions remaining in the quiz array
  if (player.quiz.length !== 0) {
    const currentQuestion = player.quiz.shift();
    createGame(currentQuestion);
    nextBtn.style.display = "none";
  } else {
    // If the quiz has ended inform the user how of their score and give them opportunity to play again
    message.innerHTML = `End of quiz<br />You scored ${player.correct} out of ${player.numQuestions}`;
    questionDiv.innerHTML = "";
    answersDiv.innerHTML = "";
    nextBtn.style.display = "none";
    playAgainBtn.style.display = "block";
    playAgainBtn.addEventListener("click", playQuiz);
  }
}

// Function to display question and answers
function createGame(question) {
  // Place the question inside the question div
  questionDiv.textContent = question.question;
  // Set game area text content to empty
  gameArea.textContent = "";
  // Hide start button
  startBtn.style.display = "none";
  // Store all possible answers inside an array
  let answers = question.answers;
  console.log(answers);
  //  Randomise the sequence of answers
  answers = answers.sort(() => Math.random() - 0.5);
  answers.forEach((answer) => {
    // Set up a variable to hold the correct answer
    let correctAnswer;
    //  Place the answer text inside buttons
    const button = document.createElement("button");
    button.classList.add("answer-btn");
    if (answer.correct === true) {
      // Assign the correct answer to the correctAnswer variable
      correctAnswer = answer.text;
    }
    button.textContent = answer.text;
    // Add all the answer buttons to the answersDiv element
    answersDiv.append(button);
    // Add event listener to each answer button
    button.addEventListener("click", (e) => {
      // If the clicked button contains the correct answer change the background colour to green, else change it to red. Disable all buttons once player has chosen their answer
      if (correctAnswer === e.target.textContent) {
        player.correct++;
        button.style.backgroundColor = "#04BF8A";
        disableBtns();
        nextBtn.style.display = "block";
      } else {
        player.incorrect++;
        button.style.backgroundColor = "#FF5F5D";
        disableBtns();
        nextBtn.style.display = "block";
      }
    });
  });
  // Show the message, questionDiv, and answersDiv in the game area
  gameArea.append(message);
  gameArea.append(questionDiv);
  gameArea.append(answersDiv);
}

// Function to disable buttons.  Run everytime the user clicks an answer button
function disableBtns() {
  const buttons = Array.from(answersDiv.children);
  buttons.forEach((button) => (button.disabled = true));
}

// Function that creates dropdown list and shows number of questions available to answer based on the quiz the player has chosen
function displayNumQuestions() {
  showNumbers.innerHTML = "";
  const label = document.createElement("label");
  label.textContent = "Choose number of questions to answer: ";
  const select = document.createElement("select");
  for (let i = 1; i <= player.quizLength; i++) {
    let option = document.createElement("option");
    option.value = i;
    option.text = +i;
    select.append(option);
  }
  showNumbers.append(label);
  showNumbers.append(select);
  select.addEventListener("change", (e) => {
    getNumberOfQuestions(e.target.value);
    startBtn.style.display = "block";
  });
}

// Get total number of questions in selected quiz
function getQuizLength(selection) {
  if (selection === "greetings") {
    return greetings.length;
  }
  if (selection === "counting") {
    return counting.length;
  }
}

// Get number of questions user has chosen to answer
function getNumberOfQuestions(number) {
  player.numQuestions = +number;
  let userChoice;
  if (player.quizName === "greetings") {
    shuffleQuiz(greetings);
    userChoice = greetings.slice(0, +number);
  }

  if (player.quizName === "counting") {
    shuffleQuiz(counting);
    userChoice = counting.slice(0, +number);
  }
  player.quiz = userChoice;
}

// Shuffle order of quiz questions
function shuffleQuiz(array) {
  return array.sort(() => 0.5 - Math.random());
}

// Function to play quiz
function playQuiz() {
  // Hide play again button
  playAgainBtn.style.display = "none";
  // Empty game area in readiness for new game
  gameArea.innerHTML = "";
  // Set starting message for player
  message.textContent = `Acoli quiz`;
  // Reset player information in readiness for new quiz
  // Add message and quiz selector to game area
  gameArea.append(message);
  gameArea.append(quizSelector);
  player = {
    quiz: "",
    quizName: "",
    quizLength: 0,
    numQuestions: 0,
    questionCount: 1,
    correct: 0,
    incorrect: 0,
  };
  // Reset quiz selection to default (nothing choosen)
  quizSelector.value = "";
  // Set quiz and number of questions based on user choice
  quizSelector.addEventListener("change", (e) => {
    player.quizName = e.target.value;
    player.quizLength = getQuizLength(player.quizName);
    // Display number of questions to user from chosen quiz
    displayNumQuestions();
    gameArea.append(showNumbers);
    // Start game
    startBtn.addEventListener("click", nextQuestion);
    nextBtn.addEventListener("click", nextQuestion);
  });
}

playQuiz();
