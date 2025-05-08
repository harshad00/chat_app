// controllers/adminGroupController.js
import { User, Group } from '../models/index.js';

// Add user to group
export const addUserToGroup = async (req, res) => {
  try {
    const { g: groupId, u: userId } = req.query; // Extracting from query params

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    if (!group.members.includes(userId)) {
      group.members.push(userId);
      await group.save();
    }

    res.status(200).json({ message: 'User added to group', group });
  } catch (err) {
    res.status(500).json({ message: 'Error adding user to group', error: err.message });
  }
};

// Show all users in group
export const getAllGroupUsers = async (req, res) => {
  try {
    const { g: groupId } = req.query; // Extracting from query params
    const group = await Group.findById(groupId).populate('members', 'firstName name email role');

    if (!group) return res.status(404).json({ message: 'Group not found' });

    res.status(200).json({ members: group.members });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching group members', error: err.message });
  }
};

// Promote user to admin
export const promoteUser = async (req, res) => {
  try {
    const { adminId, u: userId } = req.query; // Extracting admin ID and user ID from query params

    // Check if the admin exists
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: 'Only an admin can promote a user' });
    }

    // Check if the user exists and is in the group
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Promote user to admin
    user.role = 'admin';
    await user.save();

    res.status(200).json({ message: 'User promoted to admin', user });
  } catch (err) {
    res.status(500).json({ message: 'Error promoting user', error: err.message });
  }
};

// Demote admin to user
export const demoteAdmin = async (req, res) => {
  try {
    const { adminId, u: userId } = req.query; // Extracting admin ID and user ID from query params

    // Check if the admin exists
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: 'Only an admin can demote another admin' });
    }

    // Check if the user exists and is an admin
    const user = await User.findById(userId);
    if (!user || user.role !== 'admin') {
      return res.status(404).json({ message: 'Admin not found or user is not an admin' });
    }

    // Demote admin to user
    user.role = 'user';
    await user.save();

    res.status(200).json({ message: 'Admin demoted to user', user });
  } catch (err) {
    res.status(500).json({ message: 'Error demoting admin', error: err.message });
  }
};

export const removeUserFromGroup = async (req, res) => {
    try {
      const { adminId, u: userId, g: groupId } = req.query;
  
      // Check if the requestor is an admin
      const adminUser = await User.findById(adminId);
      if (!adminUser || adminUser.role !== 'admin') {
        return res.status(403).json({ message: 'Only admins can remove users from a group' });
      }
  
      // Find the user to remove
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      // If the user is also an admin, demote first
      if (user.role === 'admin') {
        user.role = 'user';
        await user.save();
      }
  
      // Remove user from group
      const group = await Group.findById(groupId);
      if (!group) return res.status(404).json({ message: 'Group not found' });
  
      group.members = group.members.filter(id => id.toString() !== userId);
      await group.save();
  
      res.status(200).json({ message: 'User removed from group', group });
    } catch (err) {
      res.status(500).json({ message: 'Error removing user from group', error: err.message });
    }
};
  
export const removeSelfFromGroup = async (req, res) => {
    try {
      const { g: groupId, u: userId } = req.query;
  
      const group = await Group.findById(groupId);
      if (!group) return res.status(404).json({ message: 'Group not found' });
  
      // Check if user is a member
      const isMember = group.members.includes(userId);
      if (!isMember) return res.status(403).json({ message: 'You are not a member of this group' });
  
      // Remove user from members
      group.members = group.members.filter(memberId => memberId.toString() !== userId);
      await group.save();
  
      res.status(200).json({ message: 'You have been removed from the group', group });
    } catch (err) {
      res.status(500).json({ message: 'Error removing user from group', error: err.message });
    }
  };