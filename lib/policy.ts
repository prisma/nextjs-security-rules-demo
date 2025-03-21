/**
 * In your backend, as usual, you setup your database connection.
 * We require you to create a file that exports your PrismaClient.
 * Your PrismaClient should be extended with the Policy extension.
 * This file will be consumed when you deploy your Policy rules.
 */

import { PolicyClient } from "@prisma/extension-policy";
import { prisma } from "./prisma";

// export const policy = new PolicyClient<typeof prisma>({
//   publicKey: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJoYXNoIjoiY2xpd3hpbTVwMDA1eHFoMGczbXZxcHlhay0yOTM3OTgwODY3In0.Re_LF6bx9usxlUMxACFIzgeNG3nqt1wQJKoTSCDMexm0TaAEt88DETuUfXW1p5X6ZlcRSz3TStoGlma8_gDsDQ",
// });

// lib/prisma.ts

const globalForPolicy = global as unknown as { policy: PolicyClient<typeof prisma> };

export const policy =
  globalForPolicy.policy || new PolicyClient<typeof prisma>({
    publicKey: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJoYXNoIjoiY2xpd3hpbTVwMDA1eHFoMGczbXZxcHlhay0yOTM3OTgwODY3In0.Re_LF6bx9usxlUMxACFIzgeNG3nqt1wQJKoTSCDMexm0TaAEt88DETuUfXW1p5X6ZlcRSz3TStoGlma8_gDsDQ",
  });  

if (process.env.NODE_ENV !== "production") globalForPolicy.policy = policy;