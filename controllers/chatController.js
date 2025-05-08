import Chat from '../models/Chat.js';

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;

    const chat = await Chat.create({ sender, receiver, message });
    res.status(201).json({ message: 'Message sent', chat });
  } catch (err) {
    res.status(500).json({ message: 'Error sending message', error: err.message });
  }
};

// Get all messages between two users
export const getMessages = async (req, res) => {
  try {
    const { user1, user2 } = req.query;

    const messages = await Chat.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json({ messages });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching messages', error: err.message });
  }
};
