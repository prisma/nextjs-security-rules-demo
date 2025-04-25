import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export function encodeUserId(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET);
}

export function decodeUserId(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch {
    return null;
  }
} 