import { AuthorizedClient } from "@prisma/security-rules";

import type rules from "../prisma/rules.ts";

export const authorizedClient = new AuthorizedClient<typeof rules>({
  publicKey:
    "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJoYXNoIjoiY2xpd3hpbTVwMDA1eHFoMGczbXZxcHlhay00MDUzODYzMTg3In0.cUptoOsTLaUlRz3Et8iwcpEaG1hfMmELjnP73yty-QgCosVz_O_KuFI_tmE9POJPlPg6LXQpe80QS0UiqIFsDA",
});
