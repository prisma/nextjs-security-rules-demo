import { AuthorizedClient } from '@prisma/security-rules';

import type rules from '../prisma/rules.ts';

export const authorizedClient = new AuthorizedClient<typeof rules>({
  publicKey: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJoYXNoIjoiY2xpd3hpbTVwMDA1eHFoMGczbXZxcHlhay0yOTgzMTUxNDc4In0.adwd_x2_4BCETH5Spbb31s4-zWjFaW1CgFU-g7cLIaLuL4YtsjM8pBBtRUou82MIsmLoxC3pqlMJjn_njNthAw",
});