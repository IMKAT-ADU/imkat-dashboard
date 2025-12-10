'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

export function LoginForm() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (code.length !== 4) {
      setError('Please enter a valid 4-digit code');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Invalid code');
        setCode('');
        setIsLoading(false);
        return;
      }

      // Wait a moment for the cookie to be set, then verify before redirecting
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify the token was actually set
      const verifyResponse = await fetch('/api/auth/verify', {
        credentials: 'include',
      });

      if (!verifyResponse.ok) {
        setError('Failed to verify token. Please try again.');
        setCode('');
        setIsLoading(false);
        return;
      }

      // Login successful and verified, redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Access Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Enter your 4-digit access code to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center">
            <InputOTP
              maxLength={4}
              value={code}
              onChange={setCode}
              onComplete={(value) => {
                // Auto-submit when 4 digits are entered
                if (value.length === 4) {
                  // Trigger form submission
                  setTimeout(() => {
                    const submitButton = document.querySelector('button[type="submit"]');
                    if (submitButton instanceof HTMLButtonElement) {
                      submitButton.click();
                    }
                  }, 100);
                }
              }}
              disabled={isLoading}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={isLoading || code.length !== 4}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify Code'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
