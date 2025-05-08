import { User } from '../../models/index.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import sendVerificationEmail from '../../utils/sendVerificationEmail.js';

const signup = async (req, res) => {
  try {
    const { firstName, name, email, password, country , role} = req.body;

    if (!firstName || !name || !email || !password || !country) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await User.create({
      firstName,
      name,
      email,
      password: hashedPassword,
      country,
      verificationToken,
      role
    });

    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({ message: 'Signup successful. Please check your email to verify.' });

  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

export default signup;
