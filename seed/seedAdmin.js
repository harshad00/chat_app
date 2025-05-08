// seed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from '../db/conn.js';
import { User } from '../models/index.js';

dotenv.config();
await connectDB();

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@example.com' });

    if (adminExists) {
      console.log('Admin already exists');
    } else {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);

      const admin = new User({
        firstName: 'Admin',
        name: 'Super',
        email: 'admin@example.com',
        country: 'Global',
        password: hashedPassword,
        isVerified: true,
        role: 'admin',
      });

      await admin.save();
      console.log('✅ Admin created successfully');
    }
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
  } finally {
    mongoose.disconnect();
  }
};

seedAdmin();
