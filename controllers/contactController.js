
const { findOrCreateContact } = require('../services/contactService');

async function identify(req, res) {
  const { email, phoneNumber } = req.body;

  try {
    const contact = await findOrCreateContact(email, phoneNumber);
    res.status(200).json({ contact });
  } catch (error) {
    console.error('Error in identify:', error); // Log the detailed error
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
}

module.exports = {
  identify,
};
