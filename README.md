# Next.js & Prisma Postgres Security Rules Demo

This repo demonstrates usage of [Prisma Postgres security rules](https://pris.ly/security-rules-ea) which enables database access from the frontend.

> **Note**: Security rules is a new feature of Prisma Postgres that's currently in Early Access and not yet suitable for production use. If you try it out, please [share your feedback](https://pris./ly/discord) with us to help shape its API and overall DX.

The app is based on [Next.js 15](https://nextjs.org/docs) with App Router, [NextAuth.js](https://next-auth.js.org/). It purposely uses `"use client"` in its component to demonstrate how the database can be securely accessed from the frontend.

## Getting started

### 1. Clone the repo & install dependencies

Run the following commands to set up the repo on your local machine:

```
git clone git@github.com:prisma/nextjs-security-rules-demo.git
cd nextjs-security-rules-demo
npm install
```

### 2. Create Prisma Postgres database

Create a new Prisma Postgres database with this command:

```
npx prisma init --db
```

If you don't have a [Prisma Console](https://console.prisma.io/) account yet, or if you are not logged in, the command will prompt you to log in using one of the available authentication providers. A browser window will open so you can log in or create an account. Return to the CLI after you have completed this step.

Once logged in (or if you were already logged in), the CLI will prompt you to:

- Select a **region** (e.g. `us-east-1`)
- Enter a **project name**

After successful creation, you will see output similar to the following:

<details><summary>CLI output</summary>

```
Let's set up your Prisma Postgres database!
? Select your region: ap-northeast-1 - Asia Pacific (Tokyo)
? Enter a project name: testing-migration
✔ Success! Your Prisma Postgres database is ready ✅

We found an existing schema.prisma file in your current project directory.

--- Database URL ---

Connect Prisma ORM to your Prisma Postgres database with this URL:

prisma+postgres://accelerate.prisma-data.net/?api_key=...

--- Next steps ---

Go to https://pris.ly/ppg-init for detailed instructions.

1. Install and use the Prisma Accelerate extension
Prisma Postgres requires the Prisma Accelerate extension for querying. If you haven't already installed it, install it in your project:
npm install @prisma/extension-accelerate

...and add it to your Prisma Client instance:
import { withAccelerate } from "@prisma/extension-accelerate"

const prisma = new PrismaClient().$extends(withAccelerate())

2. Apply migrations
Run the following command to create and apply a migration:
npx prisma migrate dev

3. Manage your data
View and edit your data locally by running this command:
npx prisma studio

...or online in Console:
https://console.prisma.io/{workspaceId}/{projectId}/studio

4. Send queries from your app
If you already have an existing app with Prisma ORM, you can now run it and it will send queries against your newly created Prisma Postgres instance.

5. Learn more
For more info, visit the Prisma Postgres docs: https://pris.ly/ppg-docs
```

</details>

Locate and copy the database URL provided in the CLI output, you will need it in the next step. 

### 3. Configure environment variables 

Then, create a `.env` file in the project root by renaming `.env.example`:

```bash
mv .env.example .env
```

#### 3.1. Configure database connedction

Now, paste the URL from the previous step into it as a value for the `DATABASE_URL` environment variable. For example:

```bash
# .env
DATABASE_URL=prisma+postgres://accelerate.prisma-data.net/?api_key=ey...
```

#### 3.2. Configure NextAuth

Next, add the following environment variables to `.env`:

```bash
# .env
DATABASE_URL=prisma+postgres://accelerate.prisma-data.net/?api_key=ey...

NEXTAUTH_URL="http://localhost:3000" # for running locally
NEXTAUTH_SECRET="fgkv9eqocqWZyJL05FpquUFu5jlGXRZaQWHw4jBzOYM=" # generate your own string in production
```

### 4. Run a migration & seed the database

Run the following command to create tables in your database. This creates the `User` and `Post` tables that are defined in [`prisma/schema.prisma`](./prisma/schema.prisma):

```
npx prisma migrate dev --name init
```

Now seed the database:

```
npm run seed
```

### 5. Deploy the security rules

The [`prisma/rules.ts`](./prisma/rules.ts) file defines a set of security rules. For the rules to take effect on your Prisma Postgres instance, you need to deploy them with the following command:

```
npm run rules:deploy
```

> **Note**: For convenience, the command is defined as an npm script in `package.json`. The full command looks as follows: `prisma rules --early-access deploy my_rules -f ./prisma/rules.ts`.

This command outputs a public key. This key is used to instantite the authorized database client in [`lib/db.ts`](./lib/db.ts):

```ts
export const authorizedClient = new AuthorizedClient<typeof rules>({
  publicKey: process.env.NEXT_PUBLIC_SECURITY_RULES_PUBLIC_KEY,
});
```

The key is read as an environment variable, so go back to your `.env` file and add it there:

```bash
NEXT_PUBLIC_SECURITY_RULES_PUBLIC_KEY="ey..."
```

### 6. Run the app

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can create new users or log in with an existing one from [`seed.ts`](/lib/seed.ts), e.g.:

- **Email:** `sarah.johnson@example.com`
- **Password:** `password123`

## Security rules

The authorization logic for this app is defined in [`prisma/rules.ts`](./prisma/rules.ts):

```ts
const rules = defineRules({
  prisma: new PrismaClient(),
  rules: {
    $allModels: false,
    user: true,
    post: {
      read: true,
      create({ context }) {
        if (context?.userId) {
          return true;
        }
        return false;
      },
      update({ context }) {
        if (context) {
          return context.userId === context.authorIdOfPostToChange;
        }
        return false;
      },
      delete({ context }) {
        if (context) {
          return context.userId === context.authorIdOfPostToChange;
        }
        return false;
      }
    },
  },
  contextSchema: z.object({
    userId: z.string().optional(),
    authorIdOfPostToChange: z.string().optional(),
  }),
});
```

The `userId` and `authorIdOfPostToChange` fields on the `context` object are set in our application code, e.g. in the `publishPost` Server Action:

```ts
async function publishPost() {
  "use server";

  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "You need to be authenticated to publish this post." };
  }

  authorizedClient.$rules.setGlobalContext({
    userId: session?.user.id || "",
    authorIdOfPostToChange: post?.author?.id || "",
  });
  await authorizedClient.post.update({
    where: { id: postId },
    data: { published: true },
  });
  redirect("/");
}
```

Before the query is executed against the database, it runs through the rules engine where the permission logic for the `update` operation on `post` models is evaluated:

```ts
const rules = defineRules({
  // ...
  rules: {
    post: {
      // ...
      update({ context }) {
        if (context) {
          return context.userId === context.authorIdOfPostToChange;
        }
        return false;
      },
      // ...
    },
  },
  // ...
});
```

If you want to change the rules, you need to [deploy](./package.json#L10) them again for the changes to take effect:

```
npm run rules:deploy
```

## Feedback

Please join our [Discord](https://pris./ly/discord) to share your questions, thoughts and other feedback with us.