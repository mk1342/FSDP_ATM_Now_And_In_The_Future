import { getAllResponses, saveResponse } from '../models/FormModel.js';

// Handle POST
export const submitForm = (req, res) => {
  try {
    const { timestamp, answer1, answer2, answer3, answer4, sessionID } = req.body;


    if (!timestamp || !sessionID || !answer1 || !answer2 || !answer3 || !answer4) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const newResponse = saveResponse({ timestamp, answer1, answer2, answer3, answer4, sessionID});

    res.status(200).json({ success: true, saved: newResponse });
  } catch (err) {
    console.error('Error saving submission:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};
// Handle GET
export const getResponses = (req, res) => {
  try {
    const responses = getAllResponses();
    res.status(200).json(responses);
  } catch (err) {
    console.error('Error reading responses:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};
