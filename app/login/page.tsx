"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Mode = "login" | "register";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("login");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((response) => {
        if (response.ok) {
          router.replace("/");
        }
      })
      .catch(() => {});
  }, [router]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setError(null);
    setLoading(true);

    try {
      const response = await fetch(
        mode === "login" ? "/api/auth/login" : "/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ login, password }),
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);

        setError(data?.error ?? "Что-то пошло не так");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Сервер недоступен");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-[#111111] p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            {mode === "login" ? "Вход" : "Регистрация"}
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            {mode === "login"
              ? "Войдите, чтобы управлять бойцами"
              : "Создайте аккаунт тренера"}
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl bg-zinc-900 p-1">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError(null);
            }}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              mode === "login"
                ? "bg-[#ef4444] text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Вход
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setError(null);
            }}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              mode === "register"
                ? "bg-[#ef4444] text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Регистрация
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-zinc-400">Логин</label>

            <input
              type="text"
              required
              minLength={3}
              autoComplete="username"
              value={login}
              onChange={(event) => setLogin(event.target.value)}
              placeholder="Минимум 3 символа"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none transition-colors focus:border-[#ef4444]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">Пароль</label>

            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Минимум 6 символов"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none transition-colors focus:border-[#ef4444]"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-900 bg-red-950/50 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#ef4444] px-4 py-3 font-semibold text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Подождите..."
              : mode === "login"
                ? "Войти"
                : "Создать аккаунт"}
          </button>
        </form>
      </div>
    </div>
  );
}
