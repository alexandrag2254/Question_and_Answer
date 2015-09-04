var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

//only one schema for questions with associated answers to these questions
var QuestionSchema = new mongoose.Schema({
	question: String,
	description: String,
	name: String,
	answers: [{
		answer: String,
		details: String,
		name: String,
		likes: {type: Number, default: 0 },
		created_at: {type: Date, default: Date.now }
	}],
	created_at: {type: Date, default: Date.now },
	hidden: Boolean
});
mongoose.model('Question', QuestionSchema);