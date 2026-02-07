"use client";
import { useState } from "react";
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function PasswordGate() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);

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
        // Rate limited
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
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-xl font-bold mb-4 text-primary-600">Enter Site Password</h2>
        <input
          id="site_pw"
          type="password"
          autoComplete="current-password"
          className="w-full px-3 py-2 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Password"
          disabled={isLoading}
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {remainingAttempts !== null && remainingAttempts > 0 && (
          <p className="text-yellow-600 text-sm mb-2">
            {remainingAttempts} attempt{remainingAttempts !== 1 ? 's' : ''} remaining
          </p>
        )}
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "Authenticating..." : "Login"}
        </button>
      </form>
    </div>
  );
}
