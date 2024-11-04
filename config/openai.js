const OpenAI = require('openai');

require('dotenv').config()

module.exports = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], 
});

