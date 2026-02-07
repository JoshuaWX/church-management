"use client";
import { useState } from "react";
import { Eye, EyeOff, Lock } from 'lucide-react'
import { RCCGLogo } from './RCCGLogo'
import Image from 'next/image'

export default function PasswordGate() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const pw = (document.getElementById("site_pw") as HTMLInputElement).value;
      
      if (!pw.trim()) {
        setError("Please enter a password");
        setIsLoading(false);
        return;
      }

      const res = await fetch("/api/password-gate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });

      if (res.ok) {
        window.location.reload();
      } else if (res.status === 429) {
        const data = await res.json();
        setError(data.error || "Too many attempts. Please try again later.");
        setRemainingAttempts(0);
      } else {
        const data = await res.json();
        setError(data.error || "Authentication failed");
        if (typeof data.remainingAttempts === 'number') {
          setRemainingAttempts(data.remainingAttempts);
        }
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      {/* Chapel background photo */}
      <Image
        src="/images/ruc-chapel.jpg"
        alt="RUC Chapel"
        fill
        className="object-cover object-center sm:object-center"
        sizes="100vw"
        priority
        quality={85}
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-primary-900/70 backdrop-blur-[2px]" />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo / Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white shadow-xl mb-4 p-2">
            <RCCGLogo size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight drop-shadow-lg">
            Bible-Study HUB
          </h1>
          <p className="text-white/70 text-sm mt-1 font-medium drop-shadow">
            Redeemed Christian Church of God
          </p>
        </div>

        {/* Login Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 space-y-5"
        >
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900">Welcome back</h2>
            <p className="text-sm text-gray-500 mt-1">Enter the site password to continue</p>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="site_pw" className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                id="site_pw"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                className="input pl-10 pr-10"
                placeholder="Enter password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Error Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2.5" role="alert">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}
          {remainingAttempts !== null && remainingAttempts > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5" role="status">
              <p className="text-amber-700 text-sm font-medium">
                {remainingAttempts} attempt{remainingAttempts !== 1 ? 's' : ''} remaining
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white mr-2" />
                Authenticating...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-white/50 text-xs mt-6 drop-shadow">
          Protected access &bull; Contact your fellowship leader for credentials
        </p>
      </div>
    </div>
  );
}
