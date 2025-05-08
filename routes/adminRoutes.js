import express from 'express';
import {
  addUserToGroup,
  getAllGroupUsers,
  promoteUser,
  demoteAdmin,
  removeUserFromGroup,

} from '../controllers/adminGroupController.js';

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Admin route working!' });
});

/**
 * @swagger
 * tags:
 *   name: AdminGroup
 *   description: Admin controls for group management
 */

/**
 * @swagger
 * /admin/group/add:
 *   post:
 *     summary: Add user to group
 *     tags: [AdminGroup]
 *     parameters:
 *       - in: query
 *         name: g
 *         required: true
 *         schema:
 *           type: string
 *         description: Group ID
 *       - in: query
 *         name: u
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User added to group successfully
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Server error
 */
router.post('/group/add', addUserToGroup);

/**
 * @swagger
 * /admin/group/members:
 *   get:
 *     summary: Get all users in a group
 *     tags: [AdminGroup]
 *     parameters:
 *       - in: query
 *         name: g
 *         required: true
 *         schema:
 *           type: string
 *         description: Group ID
 *     responses:
 *       200:
 *         description: List of users in the group
 *       400:
 *         description: Missing group ID
 *       500:
 *         description: Server error
 */
router.get('/group/members', getAllGroupUsers);

/**
 * @swagger
 * /admin/group/promote:
 *   patch:
 *     summary: Promote a user to admin
 *     tags: [AdminGroup]
 *     parameters:
 *       - in: query
 *         name: adminId
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin user's ID performing the action
 *       - in: query
 *         name: u
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to be promoted
 *     responses:
 *       200:
 *         description: User promoted to admin
 *       400:
 *         description: Invalid request parameters
 *       403:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.patch('/group/promote', promoteUser);

/**
 * @swagger
 * /admin/group/demote:
 *   patch:
 *     summary: Demote an admin to a regular user
 *     tags: [AdminGroup]
 *     parameters:
 *       - in: query
 *         name: adminId
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin user's ID performing the action
 *       - in: query
 *         name: u
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to be demoted
 *     responses:
 *       200:
 *         description: User demoted successfully
 *       400:
 *         description: Invalid request parameters
 *       403:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.patch('/group/demote', demoteAdmin);

/**
 * @swagger
 * /admin/group/remove:
 *   delete:
 *     summary: Remove user from group
 *     tags: [AdminGroup]
 *     parameters:
 *       - in: query
 *         name: adminId
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin user's ID performing the action
 *       - in: query
 *         name: u
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to be removed
 *       - in: query
 *         name: g
 *         required: true
 *         schema:
 *           type: string
 *         description: Group ID
 *     responses:
 *       200:
 *         description: User removed from group
 *       400:
 *         description: Invalid parameters
 *       403:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.delete('/group/remove', removeUserFromGroup);


export default router;
