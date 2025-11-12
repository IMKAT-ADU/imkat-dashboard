import { NextRequest, NextResponse } from 'next/server';
import { validateCode, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Code is required' },
        { status: 400 }
      );
    }

    const isValid = await validateCode(code);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid code' },
        { status: 401 }
      );
    }

    const token = generateToken();

    const response = NextResponse.json(
      { success: true, token },
      { status: 200 }
    );

    // Set token as HTTP-only cookie for security
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400, // 24 hours
      path: '/',
    });

    console.log(`[Login] Cookie set, response ready`);

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
