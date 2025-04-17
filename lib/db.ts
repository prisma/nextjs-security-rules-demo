import { AuthorizedClient } from '@prisma/security-rules';

import type { rules } from '../prisma/rules.ts';

export const authorizedClient = new AuthorizedClient<typeof rules>({
  publicKey: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJoYXNoIjoiY2xpd3hpbTVwMDA1eHFoMGczbXZxcHlhay00NTc2MDU0NTkifQ.4U3Z3atOLc5my9AZHriMkxBxSN9opser4vA4qj_vMVqJU9fR8HVT4CEI_XYCPpJTwFBo8fKo5exph1o420oYBw",
});