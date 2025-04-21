import { seedUserData } from '../lib/demo/seed';

async function main() {
  const userId = 'c7f4752c-1955-4b80-ae92-268e946047df';
  
  try {
    console.log('Starting data seeding...');
    const result = await seedUserData(userId);
    console.log('Seeding result:', result);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

main();