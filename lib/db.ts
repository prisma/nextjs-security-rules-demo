import { AuthorizedClient } from "@prisma/security-rules";

import type rules from "../prisma/rules.ts";

export const authorizedClient = new AuthorizedClient<typeof rules>({
  publicKey:
    "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJoYXNoIjoiY2x5cm9tbDA0MDF3eDQzanZic2JwN2Z5Zi0zNzIyNjY4MDg4In0._Jz17nRe2b2SmrJ0Ve_-RTp3nKlqlM-Ie9hLQDhXB81r_aRa4U4cGdEuaXIV6uAdQwfvKBT_m3PdNnvl_MvEDg",
});
