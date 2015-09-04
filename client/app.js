var questions = angular.module('questions', ['ngRoute']);

//routing to partial pages 
questions.config(function($routeProvider){
	$routeProvider
	.when('/', { templateUrl: 'partials/home.html'})
	.when('/new_question', { templateUrl: 'partials/new_question.html' })
	.when('/question/:id', { templateUrl: 'partials/question.html' })
	.when('/question/:id/new_answer', { templateUrl: 'partials/new_answer.html' });	
});

var questions_array = [];

//controllers///////////////////////////////////////////////////////////////////////////////////

//home controller
questions.controller('Home', function($scope, HomeFactory){
	//this is done automatically when the home controller/home page is loaded
	HomeFactory.getQuestions(function(data){
		$scope.questions = data;
	});
});

//new question controller
questions.controller('NewQuestion', function($scope, $location, NewQuestionFactory){

	$scope.addQuestion = function(){
		NewQuestionFactory.addQuestion($scope.new_question);
		// console.log($scope.new_question);
		// console.log($scope.errors);
		if ($scope.errors.message == ""){
			message = true;
			console.log('no error and now going to redirect');
			$location.path('/');
		}
		else { 
			console.log('there is an error');
			message = false;
			return false; 
		}
	};
	$scope.errors = NewQuestionFactory.getErrors();
});

//answers controller
questions.controller('Answers', function($scope, $routeParams, AnswerFactory){

	// console.log($routeParams.id);
	AnswerFactory.getAnswers($routeParams.id, function(data){
		$scope.answers = data;
	});

	$scope.likeAnswer = function(id){
		//sending answer id
		// console.log(id);
		AnswerFactory.likeAnswer(id, function(data){
			//reload all the answers with updated amout of likes 
			AnswerFactory.getAnswers($routeParams.id, function(data){
				$scope.answers = data;
			});
		});
	};
});

//new answer controller
questions.controller('NewAnswer', function($scope, $routeParams, $location, NewAnswerFactory){
	NewAnswerFactory.getQuestion($routeParams.id, function(data){
		$scope.question = data;
	});

	$scope.addAnswer = function(id){
		NewAnswerFactory.addAnswer(id, $scope.new_answer);
		//if there is no error message than redirect
		if ($scope.errors.message == ""){
			console.log('no error and now going to redirect');
			$location.path('/question/'+id);
		}
		else { 
			console.log('there is an error'); 
			return false;
		}
	};
	$scope.errors = NewAnswerFactory.getErrors();
});

//factories ///////////////////////////////////////////////////////////////////////////////////

//Home factory
questions.factory('HomeFactory', function($http){
	var factory = {};
	factory.getQuestions = function(callback){
		$http.get('/get_questions').success(function(output){
			questions_array = output;
			callback(questions_array);
		});
	};
	return factory;
});

//new question factory
questions.factory('NewQuestionFactory', function($http){
	var factory = {};
	var errors = { message: '' };
	factory.addQuestion = function(info) {
		var question = info.question;
		if(question.length < 11) {
			errors.message = 'Error: Not a vaild question, must be at least 10 characters long';
			return false;
		} 
		else {
			info.name = person;
			$http.post('/add_question', info).success(function(output){
				// console.log(output);
				questions_array.push({
					_id: output,
					question: info.question,
					details: info.details,
					created_at: Date.now()
				});
			});	
			//unset errors and alert successful post
			errors.message = '';
			success_message = true;
		}	
	};
	factory.getErrors = function(){
		return errors;
	};
	return factory;
});

//answer factory
questions.factory('AnswerFactory', function($http){
	var factory = {};
	var answers = [];
	factory.getAnswers = function(id, callback){
		$http.get('/get_answers/'+id).success(function(output){
			answers = output;
			callback(answers[0]);
		});
	};

	factory.likeAnswer = function(id, callback){
		// console.log(id);
		$http.get('/like_answer/'+id).success(function(output){
			callback(output);
			});
		};
	return factory;
});

//new answer factory
questions.factory('NewAnswerFactory', function($http){
	var factory = {};
	//if there are errors-- add to message within the object
	var errors = {message: ''};
	var question;
	factory.getQuestion = function(id, callback){
		$http.get('/get_question/'+id).success(function(output){
			question = output;
			callback(question[0]);
		});
	};
	factory.addAnswer = function(id, info){
		var answer = info.answer;
		//validation for answer length
		if(answer.length < 6) {
			errors.message = "Error: Answer must be at least 5 characters";
			return false;
		} 
		else {
			info.id = id;
			info.name = person;
			$http.post('/add_answer', info).success(function(output){
				console.log(output);
			});
			errors.message = '';
		}
	};
	factory.getErrors = function(){
		return errors;
	};
	return factory;
});