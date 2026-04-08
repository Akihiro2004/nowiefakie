"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getQuiz, getLeaderboard } from "@/lib/firestore";
import { getScoreMessage } from "@/lib/questions";

const TOTAL = 10;

const RANK_MEDALS = ["🥇", "🥈", "🥉"];

export default function LeaderboardPage() {
  const { quizId } = useParams();
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState(null);
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!quizId) return;

    Promise.all([getQuiz(quizId), getLeaderboard(quizId)])
      .then(([quizData, leaderboardData]) => {
        if (!quizData) {
          setError("Kuis tidak ditemukan.");
        } else {
          setQuiz(quizData);
          setEntries(leaderboardData);
        }
      })
      .catch(() => setError("Gagal muat leaderboard. Cek internet lo ya."))
      .finally(() => setLoading(false));
  }, [quizId]);

  if (loading) {
    return (
      <PageShell>
        <div className="card p-12 flex flex-col items-center gap-4">
          <LoadingSpinner />
          <p style={{ color: "var(--text-secondary)" }}>Lagi muat leaderboard...</p>
        </div>
      </PageShell>
    );
  }

  if (error || !quiz) {
    return (
      <PageShell>
        <div className="card p-10 w-full max-w-md mx-auto text-center animate-scale-in">
          <div className="text-5xl mb-4">😕</div>
          <h1 className="text-2xl font-extrabold mb-3">Ada yang Error</h1>
          <p className="mb-8" style={{ color: "var(--text-secondary)" }}>
            {error}
          </p>
          <Link href="/" className="btn-primary w-full">
            🏠 Ke Beranda
          </Link>
        </div>
      </PageShell>
    );
  }

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/quiz/${quizId}`
      : `/quiz/${quizId}`;

  return (
    <PageShell>
      <div className="w-full max-w-lg mx-auto flex flex-col gap-6">
        <div className="card p-8 text-center animate-scale-in">
          <div className="text-5xl mb-3 animate-float">🏆</div>
          <h1 className="text-3xl font-extrabold mb-1">Leaderboard</h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Siapa yang paling kenal{" "}
            <span
              className="font-bold"
              style={{ color: "var(--brand-blue)" }}
            >
              {quiz.creatorName}
            </span>
            ?
          </p>

          {entries.length === 0 && (
            <div
              className="mt-6 rounded-xl p-5 text-sm"
              style={{
                background: "var(--brand-blue-light)",
                color: "var(--text-secondary)",
              }}
            >
              Belum ada yang main nih!{" "}
              <br />
              Share linknya ke temen-temen lo dulu 👇
            </div>
          )}
        </div>

        {entries.length >= 2 && (
          <div className="animate-fade-up delay-100">
            <Podium entries={entries.slice(0, Math.min(3, entries.length))} />
          </div>
        )}

        {entries.length > 0 && (
          <div className="card p-6 sm:p-8 animate-fade-up delay-200">
            <h2 className="text-lg font-bold mb-5">Semua Hasil</h2>
            <div className="flex flex-col gap-3">
              {entries.map((entry, i) => {
                const pct = Math.round((entry.score / TOTAL) * 100);
                const { emoji } = getScoreMessage(entry.score);
                let barColor = "var(--brand-red)";
                if (entry.score >= 8) barColor = "var(--brand-green)";
                else if (entry.score >= 6) barColor = "var(--brand-blue)";
                else if (entry.score >= 4) barColor = "var(--brand-yellow)";

                const ts = entry.completedAt?.toDate?.();
                const dateStr = ts
                  ? ts.toLocaleDateString("id-ID", {
                      month: "short",
                      day: "numeric",
                    })
                  : "";

                return (
                  <div
                    key={entry.id}
                    className="flex items-center gap-4 p-3 rounded-2xl transition-colors hover:bg-gray-50"
                    style={{ animationDelay: `${i * 0.06}s` }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0"
                      style={
                        i < 3
                          ? {
                              background: ["#fef9e7", "#f3f4f6", "#fef5e7"][i],
                              color: ["#b45309", "#374151", "#c2410c"][i],
                            }
                          : {
                              background: "var(--surface-alt)",
                              color: "var(--text-hint)",
                            }
                      }
                    >
                      {i < 3 ? RANK_MEDALS[i] : `#${i + 1}`}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm truncate">
                          {entry.playerName}
                        </span>
                        <span
                          className="text-xs font-bold ml-2 shrink-0"
                          style={{ color: barColor }}
                        >
                          {entry.score}/{TOTAL}
                        </span>
                      </div>
                      <div className="progress-track">
                        <div
                          style={{
                            height: "100%",
                            borderRadius: 99,
                            width: `${pct}%`,
                            background: barColor,
                            transition: "width .8s cubic-bezier(.4,0,.2,1)",
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0">
                      <span className="text-xl">{emoji}</span>
                      {dateStr && (
                        <span
                          className="text-xs"
                          style={{ color: "var(--text-hint)" }}
                        >
                          {dateStr}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="card p-6 animate-fade-up delay-300">
          <p className="text-sm font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>
            Share kuis ini ke lebih banyak temen:
          </p>
          <div className="flex items-center gap-2 mb-4">
            <div
              className="flex-1 rounded-xl p-3 text-sm font-medium overflow-hidden text-ellipsis whitespace-nowrap"
              style={{
                background: "var(--brand-blue-light)",
                color: "var(--brand-blue)",
                border: "2px solid var(--brand-blue)",
              }}
              title={shareUrl}
            >
              {shareUrl}
            </div>
            <CopyButton text={shareUrl} />
          </div>
          <div className="flex gap-2">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `Kamu kenal ${quiz.creatorName}? Cobain kuisnya deh! ${shareUrl}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline text-sm px-4 py-2 flex-1 text-center"
            >
              📱 WhatsApp
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                `Gue baru aja ngerjain kuis punya ${quiz.creatorName} di NowieFakie! Bisa ngalahin skor gue?`
              )}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline text-sm px-4 py-2 flex-1 text-center"
            >
              🐦 Twitter
            </a>
          </div>
        </div>

        <Link href="/" className="btn-outline w-full text-center animate-fade-up delay-400">
          🚀 Buat Kuis Sendiri
        </Link>
      </div>
    </PageShell>
  );
}

function Podium({ entries }) {
  const heights = ["h-28", "h-20", "h-16"];
  const colors = [
    { bg: "#fef9e7", border: "#fbbc04", text: "#b45309", glow: "rgba(251,188,4,.3)" },
    { bg: "#f3f4f6", border: "#9ca3af", text: "#374151", glow: "rgba(156,163,175,.3)" },
    { bg: "#fff7ed", border: "#fed7aa", text: "#c2410c", glow: "rgba(253,186,116,.3)" },
  ];

  const display =
    entries.length === 1
      ? [null, entries[0], null]
      : entries.length === 2
      ? [entries[1], entries[0], null]
      : [entries[1], entries[0], entries[2]];

  const displayColors = [colors[1], colors[0], colors[2]];
  const displayMedals = ["🥈", "🥇", "🥉"];
  const displayRanks = ["ke-2", "ke-1", "ke-3"];

  return (
    <div
      className="card p-6 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #e8f0fe 0%, #fff 60%)",
      }}
    >
      <h2 className="text-center text-sm font-bold mb-6" style={{ color: "var(--text-secondary)" }}>
        PODIUM TOP 3
      </h2>
      <div className="flex items-end justify-center gap-3">
        {display.map((entry, i) => {
          if (!entry) {
            return (
              <div key={i} className={`flex-1 max-w-27.5 ${heights[i]} rounded-t-2xl opacity-20`}
                style={{ background: "var(--border)" }} />
            );
          }
          const c = displayColors[i];
          const pct = Math.round((entry.score / TOTAL) * 100);
          return (
            <div
              key={entry.id}
              className={`flex-1 max-w-32.5 flex flex-col items-center ${heights[i]} rounded-t-2xl transition-transform hover:scale-105`}
              style={{
                background: c.bg,
                border: `2px solid ${c.border}`,
                boxShadow: `0 4px 20px ${c.glow}`,
              }}
            >
              <span className="text-3xl -mt-5 mb-1">{displayMedals[i]}</span>
              <span className="text-xs font-bold mb-1" style={{ color: c.text }}>
                {displayRanks[i]}
              </span>
              <span
                className="text-sm font-bold text-center px-2 leading-tight truncate w-full"
                title={entry.playerName}
              >
                {entry.playerName.length > 10
                  ? entry.playerName.slice(0, 9) + "..."
                  : entry.playerName}
              </span>
              <span className="text-xs font-semibold mt-1" style={{ color: c.text }}>
                {entry.score}/{TOTAL} · {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
    }
  };
  return (
    <button
      onClick={handleCopy}
      className="btn-primary px-4 py-3 text-sm shrink-0"
      style={{ minWidth: 80 }}
    >
      {copied ? "✓ Disalin!" : "Salin"}
    </button>
  );
}

function PageShell({ children }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 gap-8"
      style={{ background: "var(--surface-alt)" }}
    >
      <Link
        href="/"
        className="text-2xl font-extrabold gradient-text tracking-tight"
      >
        NowieFakie 👀
      </Link>
      {children}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin"
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--brand-blue)"
      strokeWidth="2.5"
    >
      <circle cx="12" cy="12" r="10" strokeOpacity=".2" />
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}
