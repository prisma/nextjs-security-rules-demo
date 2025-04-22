# Next.js & Policy Demo

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Set up the project and add a DB:

```
npm install
npx prisma init --db
# copy DATABASE_URL into .env
npx prisma migrate dev
npm run rules:deploy
# update publicKey in lib/db.ts
npm run seed
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can create new users or log in with an existing one from [`seed.ts`](/lib/seed.ts), e.g.:

- Email: `sarah.johnson@example.com`
- Password: `password123`
