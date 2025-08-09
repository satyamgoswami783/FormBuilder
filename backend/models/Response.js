const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema({
  formId: { type: String, required: true },
  respondent: { type: String, default: "anonymous" },
  answers: {
    categorize: { type: mongoose.Schema.Types.Mixed, required: true },
    cloze: { type: Array, required: true },
    comprehension: { type: Array, required: true },
  },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Response', ResponseSchema);