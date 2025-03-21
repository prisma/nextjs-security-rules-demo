/**
 * In your backend, as usual, you setup your database connection.
 * We require you to create a file that exports your PrismaClient.
 * Your PrismaClient should be extended with the Policy extension.
 * This file will be consumed when you deploy your Policy rules.
 */

import { z } from "zod";

import { withPolicy } from "@prisma/extension-policy";
import { PrismaClient } from "@prisma/client";

// We create a Prisma Client instance and hook Policy on it
export const prisma = new PrismaClient().$extends(
  withPolicy({
    // We define the rules that are going to be deployed
    // Once deployed, you get a `publicKey` for the rules
    // The rules define which operations are allowed or not
    rules: {
      // User model can only be read by users themselves
      user: {
        // For example, we define readonly rules for User
        // We can enforce rules based on the user context
        // set via $policy.setUserContext({ userId: "<uuid>" });
        read({ context }) {
          console.log(`user,read - context: `, context);
          return true;
          // Note: This currently has a bug, context isn't passed
          // return { $where: { id: context.userId } };
        },
        // We can also define rules for create, update, and delete
        // create: true,
      },
      post: {
        read({ context }) {
          console.log(`post,read - context: `, context);
          return context.userId === "cm8iizddw00005e0vlpqps7yj";
        },
      },
      // You control what you expose to the Policy Client
      // $allModels: true,
    },
    // We define the context schema for the Policy Client
    // It will be validated when you set the user context
    contextSchema: z.object({
      userId: z.string(),
    }),
  }),
);
