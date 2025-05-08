// seed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User, Group } from '../models/index.js';
// import Group from './models/Group.js';
import bcrypt from 'bcrypt';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;
console.log("MONGO_URI:", MONGO_URI);

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // 1. Create default admin
    let admin = await User.findOne({ email: 'admin@chat.com' });
    if (!admin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      admin = await User.create({
        firstName: 'Admin',
        name: 'Chat',
        email: 'admin@chat.com',
        country: 'India',
        password: hashedPassword,
        role: 'admin',
        isVerified: true,
      });
      console.log('✅ Admin user created');
    } else {
      console.log('ℹ️ Admin already exists');
    }

    // 2. Create default group and add admin
    let group = await Group.findOne({ name: 'general' });
    if (!group) {
      group = await Group.create({
        name: 'general',
        members: [admin._id],
      });
      console.log('✅ Default group created with admin added');
    } else {
      // If group exists, ensure admin is a member
      if (!group.members.includes(admin._id)) {
        group.members.push(admin._id);
        await group.save();
        console.log('✅ Admin added to existing group');
      } else {
        console.log('ℹ️ Admin already in group');
      }
    }

    await mongoose.disconnect();
    console.log('🚀 Seeding complete');
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seed();
