import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient().$extends(withAccelerate());

async function main() {
  // Create 10 users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        password: await bcrypt.hash('password123', 10),

      },
    }),
    prisma.user.create({
      data: {
        name: 'Michael Chen',
        email: 'michael.chen@example.com',
        password: await bcrypt.hash('password123', 10),

      },
    }),
    prisma.user.create({
      data: {
        name: 'Emma Wilson',
        email: 'emma.wilson@example.com',
        password: await bcrypt.hash('password123', 10),

      },
    }),
    prisma.user.create({
      data: {
        name: 'David Rodriguez',
        email: 'david.rodriguez@example.com',
        password: await bcrypt.hash('password123', 10),

      },
    }),
    prisma.user.create({
      data: {
        name: 'Lisa Patel',
        email: 'lisa.patel@example.com',
        password: await bcrypt.hash('password123', 10),

      },
    }),
    prisma.user.create({
      data: {
        name: 'James Kim',
        email: 'james.kim@example.com',
        password: await bcrypt.hash('password123', 10),

      },
    }),
    prisma.user.create({
      data: {
        name: 'Sophia Martinez',
        email: 'sophia.martinez@example.com',
        password: await bcrypt.hash('password123', 10),

      },
    }),
    prisma.user.create({
      data: {
        name: 'William Thompson',
        email: 'william.thompson@example.com',
        password: await bcrypt.hash('password123', 10),

      },
    }),
    prisma.user.create({
      data: {
        name: 'Olivia Anderson',
        email: 'olivia.anderson@example.com',
        password: await bcrypt.hash('password123', 10),

      },
    }),
    prisma.user.create({
      data: {
        name: 'Daniel Lee',
        email: 'daniel.lee@example.com',
        password: await bcrypt.hash('password123', 10),

      },
    }),
  ]);

  // Create 5 posts
  await Promise.all([
    prisma.post.create({
      data: {
        title: 'Getting Started with Web Development',
        content: 'Web development is an exciting journey that combines creativity with technical skills. In this post, we\'ll explore the fundamental concepts that every aspiring web developer should know.',
        published: true,
        authorId: users[0].id,
      },
    }),
    prisma.post.create({
      data: {
        title: 'The Future of Artificial Intelligence',
        content: 'AI continues to transform industries and our daily lives. From machine learning to neural networks, we\'re witnessing unprecedented advances in technology that are reshaping our world.',
        published: true,
        authorId: users[1].id,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Sustainable Living Tips',
        content: 'Making small changes in our daily lives can have a big impact on the environment. Here are practical tips for reducing your carbon footprint and living more sustainably.',
        published: false,
        authorId: users[2].id,
      },
    }),
    prisma.post.create({
      data: {
        title: 'The Art of Photography',
        content: 'Photography is more than just clicking a button. It\'s about understanding light, composition, and storytelling. Learn how to capture moments that tell compelling stories.',
        published: true,
        authorId: users[3].id,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Healthy Cooking at Home',
        content: 'Cooking healthy meals doesn\'t have to be complicated or time-consuming. Discover simple recipes and techniques that will help you maintain a nutritious diet while enjoying delicious food.',
        published: true,
        authorId: users[4].id,
      },
    }),
  ]);

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
