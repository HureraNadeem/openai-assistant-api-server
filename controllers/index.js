const openai = require('../config/openai');

exports.createAssistant = async (req, res) => {
  try {
    const assistant = await openai.beta.assistants.create({
      name: 'Summarizer',
      description: 'A text Summarizer',
      model: 'gpt-4-1106-preview',
      instructions: 'You are an assistant that summarizes text.',
      tools: [],
    });

    res.status(201).json(assistant);
  } catch (error) {
    console.error('Error creating assistant:', error);
    res.status(500).json({ error: 'Failed to create assistant' });
  }
};

exports.createThread = async (req, res) => {
  try {
    const emptyThread = await openai.beta.threads.create();
    res.status(201).json(emptyThread);
  } catch (error) {
    console.error('Error creating assistant:', error);
    res.status(500).json({ error: 'Failed to create thread' });
  }
};

exports.converse = async (req, res) => {
  try {
    const reqBody = req.body;
    const { threadId } = req.params;
    const { assistantId, userMessage } = reqBody;

    if (!threadId) {
      return res.status(400).json({ error: 'Thread Id was not provided.' });
    }
    if (!assistantId) {
      return res.status(400).json({ error: 'Assistant Id was not provided.' });
    }

    // Add message in thread
    const newlyAddedMessageInThread = await openai.beta.threads.messages.create(
      threadId,
      {
        role: 'user',
        content: userMessage,
      },
    );

    // Create a run and make it streaming
    const stream = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
      stream: true,
    });

    for await (const event of stream) {
      if (event.event === 'thread.message.completed') {
        const messageId = event.data.id;

        const assistantResponse = await openai.beta.threads.messages.retrieve(
          threadId,
          messageId,
        );
        return res.status(201).json({ data: assistantResponse.content[0].text.value });
      }
    }
    res.status(500).json({ error: 'Failed to converse with assistant' });
  } catch (error) {
    console.error('Error conversing with assistant', error);
    res.status(500).json({ error: 'Failed to converse with assistant' });
  }
};

exports.getThreadConversation = async (req, res) => {
  try {
    const { threadId } = req.params;

    const formatMessages = (messages) => {
      if (!messages.length) return [];
      return messages.map((message) => {
        return {
          role: message.role,
          message: message.content[0].text.value,
        };
      });
    };

    const threadMessages = await openai.beta.threads.messages.list(threadId);

    const formattedMessages = formatMessages(threadMessages.data);

    res.status(201).json(formattedMessages);
  } catch (error) {
    console.error('Error conversing with assistant', error);
    res.status(500).json({ error: 'Failed to converse with assistant' });
  }
};
