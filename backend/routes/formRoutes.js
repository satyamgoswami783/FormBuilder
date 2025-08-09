const express = require('express');
const { createForm, getForms, getFormById } = require('../controllers/formController');
const router = express.Router();

router.post('/', createForm);
router.get('/', getForms);
router.get('/:id', getFormById);

module.exports = router;