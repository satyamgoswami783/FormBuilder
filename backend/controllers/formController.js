const Form = require('../models/Form');

// Create form
exports.createForm = async (req, res) => {
  try {
    const form = new Form(req.body);
    await form.save();
    res.status(201).json(form);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all forms
exports.getForms = async (req, res) => {
  try {
    const forms = await Form.find();
    res.json(forms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get form by ID
exports.getFormById = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ error: 'Form not found' });
    res.json(form);
  } catch (err) {
    // If error is due to invalid ObjectId, return 404
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Form not found' });
    }
    res.status(500).json({ error: err.message });
  }
};