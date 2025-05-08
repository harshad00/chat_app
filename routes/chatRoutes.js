import express from 'express';
import { sendMessage, getMessages } from '../controllers/chatController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Chat messaging endpoints
 */

/**
 * @swagger
 * /chat/send:
 *   post:
 *     summary: Send a message
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sender
 *               - receiver
 *               - message
 *             properties:
 *               sender:
 *                 type: string
 *                 example: 60f6d84c2b3a5c1a88abc123
 *               receiver:
 *                 type: string
 *                 example: 60f6d84c2b3a5c1a88abc456
 *               message:
 *                 type: string
 *                 example: "Hey! How are you?"
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/send', sendMessage);

/**
 * @swagger
 * /chat/messages:
 *   get:
 *     summary: Get messages between two users
 *     tags: [Chat]
 *     parameters:
 *       - in: query
 *         name: user1
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the first user
 *       - in: query
 *         name: user2
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the second user
 *     responses:
 *       200:
 *         description: List of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   sender:
 *                     type: string
 *                   receiver:
 *                     type: string
 *                   message:
 *                     type: string
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: Missing query parameters
 *       500:
 *         description: Server error
 */
router.get('/messages', getMessages);

export default router;
