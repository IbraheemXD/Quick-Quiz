let questionIndex, randomQuestion;
const container = document.querySelector(".container");
const starter = document.querySelector(".starter-1");
const quizContainer = document.querySelector(".quiz-container");
const nextButton = document.querySelector(".btn-next");
const startButton = document.querySelector(".btn-start-1");
const heading = document.querySelector(".heading-primary");
const questElem = document.querySelector(".question");
const optionElem = document.querySelectorAll(".option");
const timerElem = document.querySelector(".timer");
const finishScreen = document.querySelector(".finish-screen");
const scoreContainer = document.querySelector(".score-container");
const scoreElem = document.querySelector(".score");
const total_score_Elem = document.querySelector(".total_score");
const rating_Elem = document.querySelector(".rating");
const discription = document.querySelector(".discription");
const category_selector = document.querySelector(".category-selector");
const loading_screen = document.querySelector(".loading-screen");
const progress_bar = document.querySelector(".progress-bar");

let defaultTimer = 20;
let time = defaultTimer;
let score = 0;
// START THE GAME /////////////////////////////

start();

function start() {
  startButton.addEventListener("click", function () {
    toggleHideClass(loading_screen);
    getQuiz().then((quiz) => {
      randomQuestion = quiz;
      toggleHideClass(container, heading, quizContainer);
      document.body.classList.add("color-2");

      questionIndex = 0;

      timer();
      showQuestion(questionIndex);
      showNext();
      selectAnswer();
      questionCounter();
    });
  });
}

async function getQuiz() {
  let url =
    category_selector.value == "any"
      ? "https://opentdb.com/api.php?amount=10&type=multiple"
      : `https://opentdb.com/api.php?amount=10&type=multiple&category=${category_selector.value}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const getQuiz = data.results;
    let quiz = [];
    for (const item of getQuiz) {
      const formatQuiz = {
        question: item.question,
        answer: item.correct_answer,
        options: [item.correct_answer, ...item.incorrect_answers],
      };
      quiz.push(formatQuiz);
    }

    return quiz;
  } catch (err) {
    console.log(err);
  } finally {
    toggleHideClass(loading_screen);
  }
}

// TIMER //////////////

function timer() {
  timerElem.textContent = defaultTimer;
  setInterval(() => {
    if (time !== 1) {
      time--;
      timerElem.textContent = ("0" + time).slice(-2);
    } else {
      hideAndSeek();
      answer();
      timerElem.textContent = "00";
    }
  }, 1000);
}

// QUIZ PART /////////////

async function showQuestion(index) {
  const options = randomQuestion[index].options.sort(() => Math.random() - 0.5);
  questElem.innerHTML = `${questionIndex + 1}. ${
    randomQuestion[index].question
  }`;
  //show options
  let count = 0;
  let option_number = ["A) ", "B) ", "C) ", "D) "];
  for (const text of options) {
    count++;
    document.querySelector(`.option-${count}`).innerHTML =
      option_number[count - 1] + text;
  }
}

function showNext() {
  nextButton.onclick = () => {
    if (questionIndex < randomQuestion.length - 1) {
      questionIndex++;
      questionCounter();
      showQuestion(questionIndex);
      // disable/enable
      optionElem.forEach((elem) => {
        elem.disabled = false;
        elem.classList.remove("correct", "incorrect", "correct-2");
      });
      nextButton.disabled = true;
      time = defaultTimer;
    } else {
      // finish screen
      toggleHideClass(quizContainer, scoreContainer);
      scoreCounter();
    }
  };
}

// enable next button on time out
function hideAndSeek() {
  nextButton.disabled = false;
  optionElem.forEach((elem) => {
    elem.disabled = true;
  });
}

function toggleHideClass(...element) {
  element.forEach((e) => {
    e.classList.toggle("hide");
  });
}

function selectAnswer() {
  optionElem.forEach((element) => {
    element.onclick = () => {
      timerElem.textContent = "00";
      time = 1;

      if (
        element.textContent.slice(3) == randomQuestion[questionIndex].answer
      ) {
        element.classList.add("correct");
        element.innerHTML =
          element.textContent +
          '<i class="far fa-check-circle icon icon-2"></i>';
        score += 10;
      } else {
        element.classList.add("incorrect");
        element.innerHTML =
          element.textContent +
          '<i class="far fa-times-circle icon icon-2"></i>';
        answer();
      }

      hideAndSeek();
    };
  });
}

function answer() {
  // choose the correct answer if wrong selected
  optionElem.forEach((e) => {
    if (e.textContent.slice(3) == randomQuestion[questionIndex].answer) {
      e.innerHTML =
        e.textContent + '<i class="far fa-check-circle icon icon-2"></i>';
      e.classList.add("correct");
    }
  });
}

// FINAL RESULT ///////////////////////

function questionCounter() {
  const question_num = document.querySelector(".question_num");
  const total_questions = document.querySelector(".total_questions");

  total_questions.textContent = randomQuestion.length;
  question_num.textContent = questionIndex + 1;
}

function scoreCounter() {
  scoreElem.textContent = score;
  const total_score = randomQuestion.length * 10;
  total_score_Elem.textContent = total_score;

  let score_value = Math.round(((score / total_score) * 100) / 20);
  let star = "⭐";
  let rating = star.repeat(score_value);
  rating_Elem.textContent = rating;

  if (score_value == 5) {
    discription.textContent = "Yo Einstein 🙌 in the house";
  } else if (score_value > 2 && score_value < 5) {
    discription.textContent =
      "Congratulations 👏 you answer most of them right";
  } else {
    discription.textContent = "Not Lucky? Try again";
  }
}
