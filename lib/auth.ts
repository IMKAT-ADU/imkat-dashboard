import jwt from 'jsonwebtoken';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export async function validateCode(code: string): Promise<boolean> {
  try {
    const accessCode = await prisma.accessCode.findUnique({
      where: { code },
    });
    return accessCode !== null && accessCode.isActive;
  } catch (error) {
    console.error('[Auth] Code validation error:', error);
    return false;
  }
}

export function generateToken(): string {
  const token = jwt.sign(
    { authenticated: true },
    JWT_SECRET,
  );
  return token;
}

export function verifyToken(token: string): boolean {
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch (error) {
    console.log(`[Auth] Token verification failed:`, error instanceof Error ? error.message : error);
    return false;
  }
}

export function decodeToken(token: string) {
  try {
    const decoded = jwt.decode(token);
    return decoded;
  } catch (error) {
    return null;
  }
}
