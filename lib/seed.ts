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

  // Create 3 posts for each user (2 published, 1 unpublished)
  for (const user of users) {
    await Promise.all([
      // First published post
      prisma.post.create({
        data: {
          title: `${user.name}'s First Blog Post`,
          content: 'This is a published post discussing various topics in technology and development. The content explores innovative ideas and practical solutions.',
          published: true,
          authorId: user.id,
        },
      }),
      // Second published post
      prisma.post.create({
        data: {
          title: `${user.name}'s Technical Deep Dive`,
          content: 'A detailed technical analysis of modern development practices and methodologies. This post shares insights and best practices.',
          published: true,
          authorId: user.id,
        },
      }),
      // Unpublished draft post
      prisma.post.create({
        data: {
          title: `${user.name}'s Draft Post`,
          content: 'This is a work in progress post that hasn\'t been published yet. It contains draft content that needs to be reviewed and finalized.',
          published: false,
          authorId: user.id,
        },
      }),
    ]);
  }

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
