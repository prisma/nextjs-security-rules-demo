import { AuthorizedClient } from "@prisma/security-rules";
import type rules from "../prisma/rules.ts";
import dotenv from "dotenv";

dotenv.config();

export const authorizedClient = new AuthorizedClient<typeof rules>({
  publicKey: process.env.NEXT_PUBLIC_SECURITY_RULES_PUBLIC_KEY!,
});
