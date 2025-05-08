import express from 'express';
import { signup, verifyEmail } from '../controllers/index.js';
import { removeSelfFromGroup } from '../controllers/adminGroupController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - name
 *               - email
 *               - password
 *               - country
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               name:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: Password123
 *               country:
 *                 type: string
 *                 example: USA
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Email already in use or validation error
 */
router.post('/signup', signup);

// /**
//  * @swagger
//  * /users/verify-email:
//  *   get:
//  *     summary: Verify user's email
//  *     tags: [Users]
//  *     parameters:
//  *       - in: query
//  *         name: token
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: Email verification token
//  *     responses:
//  *       200:
//  *         description: Email verified successfully
//  *       400:
//  *         description: Invalid or expired token
//  */
router.get('/verify-email', verifyEmail);


/**
 * @swagger
 * /users/group/leave:
 *   delete:
 *     summary: Leave a group
 *     tags: [Users]
 *     description: Allows the authenticated user to remove themselves from a group.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: g
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the group to leave
 *     responses:
 *       200:
 *         description: Successfully left the group
 *       401:
 *         description: Unauthorized or invalid token
 *       403:
 *         description: You are not a member of this group
 *       404:
 *         description: Group not found
 */

router.delete('/group/leave', removeSelfFromGroup);

export default router;
