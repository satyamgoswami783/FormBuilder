const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  type: { type: String, required: true }, // 'categorize' | 'cloze' | 'comprehension'
  text: String,
  image: String, // Base64 or URL
  options: [String], // For categorize
  categories: [String], // For categorize
  clozeText: String, // For cloze ("The ___ is blue.")
  clozeAnswers: [String], // For cloze
  passage: String, // For comprehension
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
  // You can make this more strict with sub-schemas for each question type if you want!
});

module.exports = mongoose.model('Form', FormSchema);

module.exports = mongoose.model('Form', FormSchema);