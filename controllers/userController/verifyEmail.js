import { User } from '../../models/index.js';

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully!' });

  } catch (err) {
    console.error('Email verification error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

export default verifyEmail;
