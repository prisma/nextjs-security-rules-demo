/**
 * In your backend, as usual, you setup your database connection.
 * We require you to create a file that exports your PrismaClient.
 * Your PrismaClient should be extended with the Policy extension.
 * This file will be consumed when you deploy your Policy rules.
 */

import { defineRules } from "@prisma/security-rules";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { decodeUserId } from "../lib/jwt";

const rules = defineRules({
  prisma: new PrismaClient(),
  rules: {
    $allModels: false,
    user: true,
    post: {
      read: true,
      async create({ context }) {
        if (context?.userIdToken) {
          const userId = await decodeUserId(context.userIdToken);
          return userId !== null;
        }
        return false;
      },
      async update({ context }) {
        if (context) {
          const userId = await decodeUserId(context.userIdToken || '');
          return userId === context.authorIdOfPostToChange;
        }
        return false;
      },
      async delete({ context }) {
        if (context) {
          const userId = await decodeUserId(context.userIdToken || '');
          return userId === context.authorIdOfPostToChange;
        }
        return false;
      }
    },
  },
  contextSchema: z.object({
    userIdToken: z.string().optional(),
    authorIdOfPostToChange: z.string().optional(),
  }),
});

export default rules;