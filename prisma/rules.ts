/**
 * In your backend, as usual, you setup your database connection.
 * We require you to create a file that exports your PrismaClient.
 * Your PrismaClient should be extended with the Policy extension.
 * This file will be consumed when you deploy your Policy rules.
 */

import { defineRules } from "@prisma/security-rules";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const rules = defineRules({
  prisma: new PrismaClient(),
  rules: {
    $allModels: false,
    user: {
      create: true,
      read: true,
      update: true,
      delete: true,
    },
    post: {
      read: true,
      create({ context }) {
        if (context?.userId) {
          return true;
        }
        return false;
      },
      update: true,
      delete: true,
    },
  },
  contextSchema: z.object({
    userId: z.string(),
  }),
});

export default rules;


// {
//   rules: {
//     user: {
//       read({ context }) {
//         console.log(`user,read - context: `, context);
//         return true;
//       },
//     },
//     post: {
//       read({ }) {
//         return true;
//       },
//       create({ }) {
//         return true;
//       },
//       update({ context }) {
//         return context.userId === context.authorIdOfPostToChange;
//       },
//       delete({ context }) {
//         return context.userId === context.authorIdOfPostToChange;
//       },
//     },
//   },
//   contextSchema: z.object({
//     userId: z.string(),
//     authorIdOfPostToChange: z.string().optional(),
//   }),
// }