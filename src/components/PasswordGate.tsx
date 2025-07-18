"use client";
import { useState, useEffect } from "react";
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function PasswordGate() {
  const [error, setError] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setError("");
          const pw = (document.getElementById("site_pw") as HTMLInputElement).value;
          const res = await fetch("/api/password-gate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: pw }),
          });
          if (res.ok) {
            window.location.reload();
          } else {
            setError("Incorrect password");
          }
        }}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-xl font-bold mb-4 text-primary-600">Enter Site Password</h2>
        <input
          id="site_pw"
          type="password"
          className="w-full px-3 py-2 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Password"
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button type="submit" className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700">Login</button>
      </form>
    </div>
  );
}
