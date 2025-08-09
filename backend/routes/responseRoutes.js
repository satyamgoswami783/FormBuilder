const express = require('express');
const router = express.Router();
const Response = require('../models/Response');

// Submit a response
router.post('/', async (req, res) => {
  try {
    const { formId, answers, respondent, metadata } = req.body;

    if (!formId || !answers) {
      return res.status(400).json({ 
        success: false,
        message: 'formId and answers are required'
      });
    }

    if (!answers.categorize || !answers.cloze || !answers.comprehension) {
      return res.status(400).json({
        success: false,
        message: 'Answers must contain categorize, cloze, and comprehension fields'
      });
    }

    const response = new Response({
      formId,
      respondent: respondent || 'anonymous',
      answers,
      metadata: metadata || {}
    });

    const saved = await response.save();

    res.status(201).json({
      success: true,
      message: "Response submitted successfully",
      data: saved
    });
  } catch (err) {
    console.error('Error saving response:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while saving response',
      error: err.message
    });
  }
});

// Get all responses for a form
router.get('/:formId', async (req, res) => {
  try {
    const { formId } = req.params;
    if (!formId) {
      return res.status(400).json({
        success: false,
        message: 'formId parameter is required'
      });
    }

    const responses = await Response.find({ formId }).sort({ submittedAt: -1 }).lean();
    res.status(200).json({
      success: true,
      count: responses.length,
      data: responses
    });
  } catch (err) {
    console.error('Error fetching responses:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching responses',
      error: err.message
    });
  }
});

module.exports = router;