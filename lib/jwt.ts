/**
 * DEMO IMPLEMENTATION
 * This is a simplified version for demonstration purposes only.
 * In a real application, replace this with proper JWT implementation.
 * Note that this must be able to run in CLoudflare Workers when deployed via `/prisma/rules.ts`.
 */

export async function encodeUserId(userId: string): Promise<string> {
  // Simple base64 encoding with a prefix to make it look like a token
  return `DEMO.${btoa(userId)}.DEMO`;
}

export async function decodeUserId(token: string): Promise<string | null> {
  try {
    // Extract the base64 encoded userId from between the DEMO parts
    const parts = token.split('.');
    if (parts.length !== 3 || parts[0] !== 'DEMO' || parts[2] !== 'DEMO') {
      return null;
    }
    return atob(parts[1]);
  } catch {
    return null;
  }
}