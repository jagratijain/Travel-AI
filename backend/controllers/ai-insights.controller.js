import axios from 'axios';
import dotenv from "dotenv";
dotenv.config();

export const generateRecommendation = async (req, res) => {
  try {
    const { message, packageDestinations } = req.body;

    // Validate required fields
    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }
    console.log(packageDestinations);
    // Construct the prompt
    const prompt = packageDestinations 
      ? `${message} among places ${packageDestinations} (provide brief responses)`
      : `${message} (provide brief responses)`;


    const model = process.env.GEMINI_MODEL;

    // Make request to Gemini API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ 
          parts: [{ text: prompt }] 
        }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000 // 30 second timeout
      }
    );

    // Extract the generated text
    const generatedText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      throw new Error('No content generated from Gemini API');
    }

    // Return successful response
    res.json({
      success: true,
      recommendation: generatedText
    });

  } catch (error) {
    console.error('Error generating recommendation:', error);
    
    // Handle different types of errors
    if (error.response) {
      // Gemini API returned an error
      res.status(500).json({
        success: false,
        error: 'Failed to generate recommendation from AI service',
        details: error.response.data
      });
    } else if (error.request) {
      // Network error
      res.status(503).json({
        success: false,
        error: 'Unable to reach AI service. Please try again later.'
      });
    } else {
      // Other error
      res.status(500).json({
        success: false,
        error: 'An unexpected error occurred while generating recommendations'
      });
    }
  }
};

export const generateChatResponse = async (req, res) => {
  try {
    const { message, packageDestination, conversationHistory = [] } = req.body;

    // Validate required fields
    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    // Build conversation context for Gemini
    const buildConversationContext = () => {
      let context = [];
      
      // Add conversation history
      conversationHistory.forEach((msg, index) => {
        if (msg.type === 'sent') {
          context.push({
            role: 'user',
            parts: [{ text: msg.text }]
          });
        } else if (msg.type === 'received') {
          context.push({
            role: 'model',
            parts: [{ text: typeof msg.text === 'string' ? msg.text : 'Previous response' }]
          });
        }
      });

      // Add current message with context
      const contextualMessage = packageDestination 
        ? `${message} in ${packageDestination} (give response in brief)`
        : `${message} (give response in brief)`;

      context.push({
        role: 'user',
        parts: [{ text: contextualMessage }]
      });

      return context;
    };

    const model = process.env.GEMINI_MODEL;

    // Make request to Gemini API with conversation context
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: buildConversationContext(),
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000 // 30 second timeout
      }
    );

    // Extract the generated text
    const generatedText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      throw new Error('No content generated from Gemini API');
    }

    // Return successful response
    res.json({
      success: true,
      response: generatedText,
      conversationId: req.body.conversationId || Date.now().toString()
    });

  } catch (error) {
    console.error('Error generating chat response:', error);
    
    // Handle different types of errors
    if (error.response) {
      // Gemini API returned an error
      res.status(500).json({
        success: false,
        error: 'Failed to generate response from AI service',
        details: error.response.data
      });
    } else if (error.request) {
      // Network error
      res.status(503).json({
        success: false,
        error: 'Unable to reach AI service. Please try again later.'
      });
    } else {
      // Other error
      res.status(500).json({
        success: false,
        error: 'An unexpected error occurred while generating chat response'
      });
    }
  }
};
