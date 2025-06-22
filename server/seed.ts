import dotenv from 'dotenv';
import connectDB from './utils/db';
import { StoreItem } from './models/storeItem.model';
import { User } from './models/user.model';

dotenv.config();
connectDB();

const storeItems = [
  { 
    title: 'Advanced CSS Cheatsheet', 
    description: 'A comprehensive cheatsheet covering Flexbox, Grid, and modern CSS properties. Perfect for quick reference.', 
    price: 30, 
    type: 'pdf',
    filePath: '/resources/css-cheatsheet.pdf' 
  },
  { 
    title: 'React Project Template', 
    description: 'A production-ready starter kit for React projects, pre-configured with TypeScript, ESLint, and testing libraries.', 
    price: 100, 
    type: 'template',
    filePath: '/resources/react-template.zip'
  },
  { 
    title: 'Node.js API Notes', 
    description: 'In-depth notes on building scalable and secure RESTful APIs with Node.js, Express, and MongoDB.', 
    price: 50, 
    type: 'notes',
    filePath: '/resources/nodejs-notes.md'
  },
   { 
    title: 'Docker for Web Devs', 
    description: 'A complete guide to containerizing your web applications with Docker for consistent development and deployment.', 
    price: 75, 
    type: 'pdf',
    filePath: '/resources/docker-guide.pdf'
  },
];

const importData = async () => {
  try {
    // Clear existing data
    await StoreItem.deleteMany();
    await User.deleteMany({ email: { $ne: 'admin@codesphere.com' } }); // Keep admin user

    // Insert new store items
    await StoreItem.insertMany(storeItems);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await StoreItem.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
} 