// routes/verifyEmail.js
import express from 'express';
import { User } from '../models/index.js';

const router = express.Router();

/**
 * @swagger
 * /verify-email:
 *   get:
 *     summary: Verify user's email
 *     tags: [Users]
 *     description: Verifies a user's email using a token sent to their email address.
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The verification token from the email link
 *     responses:
 *       200:
 *         description: Email successfully verified
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: "✅ Email successfully verified. You can now log in."
 *       400:
 *         description: Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid or expired token
 *       500:
 *         description: Internal server error
 */
router.get('/verify-email', async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: 'Verification token missing' });
  }

  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    user.verificationToken = undefined;
    user.isVerified = true;
    await user.save();

    res.send('✅ Email successfully verified. You can now log in.');
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
