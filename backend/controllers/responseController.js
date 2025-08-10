const Response = require('../models/Response');

exports.submitResponse = async (req, res) => {
  try {
    const { formId, answers, respondent, metadata } = req.body;

   
    if (!formId || !answers) {
      return res.status(400).json({ 
        success: false,
        error: "formId and answers are required fields" 
      });
    }

    
    const response = new Response({
      formId,
      respondent: respondent || 'anonymous',
      answers: {
        categorize: answers.categorize || [],
        cloze: answers.cloze || [],
        comprehension: answers.comprehension || []
      },
      metadata: metadata || {}
    });

    
    await response.save();

    res.status(201).json({
      success: true,
      data: response
    });

  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

exports.getResponses = async (req, res) => {
  try {
    const { formId } = req.params;
    
    if (!formId) {
      return res.status(400).json({ 
        success: false,
        error: "formId parameter is required" 
      });
    }

    const responses = await Response.find({ formId })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: responses.length,
      data: responses
    });

  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};