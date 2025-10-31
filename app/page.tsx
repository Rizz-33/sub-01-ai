"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

type GenerateResponse = { quote: string };

export default function HomePage() {
  const [theme, setTheme] = useState("");

  const { mutate, data, isPending, isError, error, reset } = useMutation<GenerateResponse, Error, string>({
    mutationFn: async (t: string) => {
      const res = await fetch("/api/generateQuote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: t }),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || "Failed to generate quote");
      }
      return (await res.json()) as GenerateResponse;
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!theme.trim()) return;
    reset();
    mutate(theme.trim());
  };

  return (
    <main className="w-full max-w-xl">
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-semibold mb-4">MotivAI</h1>
        <p className="text-sm text-gray-600 mb-6">Generate motivational quotes by theme.</p>

        <form onSubmit={onSubmit} className="flex gap-2 mb-4">
          <input
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="Enter a theme (e.g., success, discipline)"
            className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!theme.trim() || isPending}
            className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:opacity-50"
          >
            {isPending ? "Generating..." : "Generate"}
          </button>
        </form>

        {!theme.trim() && (
          <p className="text-xs text-gray-500">Tip: try themes like perseverance, creativity, or focus.</p>
        )}

        {isError && (
          <div className="mt-4 text-sm text-red-600">{error?.message || "Something went wrong."}</div>
        )}

        {isPending && (
          <div className="mt-6 flex items-center gap-2 text-gray-600">
            <span className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full" />
            Generating your quote...
          </div>
        )}

        {data?.quote && !isPending && (
          <div className="mt-6 p-4 rounded-lg border bg-gray-50">
            <blockquote className="text-lg italic">"{data.quote}"</blockquote>
          </div>
        )}
      </div>
    </main>
  );
}


