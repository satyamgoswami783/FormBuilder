const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  type: { type: String, required: true },
  text: String,
  image: String, 
  options: [String], 
  categories: [String], 
  clozeText: String, 
  clozeAnswers: [String],
  passage: String, 
  comprehensionQuestions: [{
    question: String,
    answer: String
  }]
});



const FormSchema = new mongoose.Schema({
  title: String,
  description: String,
  headerImage: String,
  questions: [mongoose.Schema.Types.Mixed]
  
});

module.exports = mongoose.model('Form', FormSchema);

module.exports = mongoose.model('Form', FormSchema);