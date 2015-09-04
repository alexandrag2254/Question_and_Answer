var mongoose = require('mongoose');
var Question = mongoose.model('Question');

module.exports = (function() {
return{
	get_questions: function(req, res){
		Question.find(function(err, results){
			if(err) {
				res.send(err);
			} else {
				res.json(results);
			}
		});
	},
	add_question: function(req, res){
		var a = new Question(req.body);
		a.save(function(err, result){
			if(err){
				res.send(err);
			} else {
				res.json(result._id);
			}
		});
	},
	//getting answer to specific question
	get_answers: function(req, res){
		Question.find({ _id : req.params.id }, function(err, results){
			if(err){
				res.send(err);
			} else {
				res.json(results);
			}
		});
	},
	//getting specific question
	get_question: function(req, res){
		Question.find({ _id : req.params.id }, function(err, results){
			if(err){
				res.send(err);
			} else {
				res.json(results);
			}
		});
	},
	add_answer: function(req, res){
		var query = { _id :  req.body.id };
		var new_answer = {
			answer: req.body.answer,
			details: req.body.details,
			name: req.body.name
		}
		Question.update(query, { $addToSet : { answers : new_answer }}, function(err, status){
			if(err){
				res.send(err);
			} else {
				res.json(status);
			}
		});
	},

	like_answer: function(req, res){
		var query = { "answers._id" : req.id };
		Question.update(query, { $inc : { "answers.$.likes" : 1 }}, function(err, status){
			if(err){
				res.send(err);
			} else {
				res.json(status);
			}
		});
	}
}
})();
