let ourForm = null;
let questionSection = null;

let questionNumber = null;
let questionStatement = null;
let optionLabels = null;
let nextButton = null;
let userScore = 0;




document.addEventListener('DOMContentLoaded', ()=>{
	fixeTheNavbar();

	startButton = document.getElementById('findButton');		
	ourForm = document.getElementById('userSelectForm');
	questionSection = document.querySelector('.questionDetails');

	questionNumber = document.getElementById('questionNumber');
	questionStatement = document.getElementById('questionStatement');
	optionLabels = document.querySelectorAll('#answerOptions .answerInputLabel');	
	nextButton = document.getElementById('nextButton');

	ourForm.addEventListener('submit', function (event){
		console.log('hello');
		event.preventDefault();		
		prepareTheView();
		startTheQuiz();		
	});

});




function prepareTheView () {
	ourForm.classList.add('hideMe');
	let ourHeader = document.querySelector('.ourHeader');
	questionSection.classList.remove('hideMe');
	setTimeout(()=>{
		questionSection.classList.add('questionDetailsVisible');	
	}, 100);
	document.querySelector('.optionContainer').classList.remove('hideMe');
	ourHeader.classList.add('reduceHeaderHeight');
}


function fillQuestionData (questions, index) {
	/*console.log(questions);
	console.log(questionNumber, questionStatement, optionLabels);*/

	if (index>9) {
		showResult();
		return;
	}

	questionNumber.innerText = index + 1;
	questionStatement.innerHTML = questions[index].question;

	for(let i = 0; i < optionLabels.length; i++){
		if (i == 0) {
			optionLabels[i].innerHTML = questions[index].correct_answer;
		}else{
			optionLabels[i].innerHTML = questions[index].incorrect_answers[i-1];	
		}				
	}

	for(let i = 0; i < optionLabels.length; i++){
		let random = Math.floor(Math.random()*optionLabels.length);
		let temp = optionLabels[i].innerHTML;
		optionLabels[i].innerHTML = optionLabels[random].innerHTML;
		optionLabels[random].innerHTML = temp;
	}

	nextButton.onclick = function (){
			if(answerIsTrue(questions[index].correct_answer)){
				userScore+=1;
			}
			let radioButtons = document.getElementsByName('answer');
			for(button of radioButtons){				
				button.checked = false;
			}
			fillQuestionData(questions, index+1);
		};
}

function answerIsTrue(correct_answer){
	let radioButtons = document.getElementsByName('answer');
	let selected = null;
	for(button of radioButtons){
		if (button.checked) {
			selected = button;
			break;
		}
	}

	let selectedAnswer = selected.nextElementSibling.innerText;
	console.log(selectedAnswer, correct_answer);
	return selectedAnswer === correct_answer;

}

async function getQuestionDataFromServer(category, level){
	let url = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${level}&type=multiple`;
	let response = await fetch(url);
	let jsonResponse = await response.json();
	return jsonResponse.results;
}


function startTheQuiz () {
	let selectedCategory = document.getElementById('categorySelector').value;
	let selectedDifficulty = document.getElementById('difficultySelector').value;
	
	let questions = getQuestionDataFromServer(selectedCategory, selectedDifficulty);
	questions.then((questionsArray)=>{
		fillQuestionData(questionsArray, 0);	
	});
	
}


function showResult () {
	document.querySelector('.resultContainer').classList.remove('hideMe');
	let questionHeading = document.querySelector('.questionDetails h3');
	questionHeading.innerHTML = 'The result has arrived.';
	questionStatement.innerHTML = `You answered ${userScore} questions correctly.`;
	document.querySelector('.optionContainer').classList.add('hideMe');
	let ratingStars = document.querySelectorAll('.resultContainer .fa-star');
	let starCount = 1;

	for(star of ratingStars){
		if (starCount>userScore) {
			break;
		}else{
			star.classList.add('yellow');
		}
		starCount+=1;
	}

	document.getElementById('reloadButton').addEventListener('click', ()=>{
		window.location.reload();
	});
}

// Fixing the navbar to the top
function fixeTheNavbar(){
	if ($(window).width() > 992) {
	  $(window).scroll(function(){  
	     if ($(this).scrollTop() > 40) {
	        $('#navbar_top').addClass("fixed-top");
	        // add padding top to show content behind navbar
	        $('body').css('padding-top', $('.navbar').outerHeight() + 'px');
	      }else{
	        $('#navbar_top').removeClass("fixed-top");
	         // remove padding top from body
	        $('body').css('padding-top', '0');
	      }   
	  });
	} // end if
}