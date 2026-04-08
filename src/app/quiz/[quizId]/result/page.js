"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { QUESTIONS, getScoreMessage } from "@/lib/questions";
import { getQuiz, getAttempt } from "@/lib/firestore";

const OPTION_LETTERS = ["A", "B", "C", "D"];

const CONFETTI_COLORS = [
  "#1a73e8",
  "#fbbc04",
  "#34a853",
  "#ea4335",
  "#9334ea",
  "#00bcd4",
];

export default function ResultPage() {
  const { quizId } = useParams();
  const searchParams = useSearchParams();
  const attemptId = searchParams.get("a");

  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [error, setError] = useState("");
  const [confetti, setConfetti] = useState([]);
  const [displayScore, setDisplayScore] = useState(0);
  const hasLaunched = useRef(false);

  useEffect(() => {
    if (!quizId || !attemptId) {
      setError("Link hasil ini gak valid.");
      setLoading(false);
      return;
    }

    Promise.all([getQuiz(quizId), getAttempt(attemptId)])
      .then(([quizData, attemptData]) => {
        if (!quizData || !attemptData) {
          setError("Hasil gak ketemu. Link ini mungkin gak valid.");
        } else {
          setQuiz(quizData);
          setAttempt(attemptData);
        }
      })
      .catch(() => setError("Gagal muat hasil. Cek internet kamu ya."))
      .finally(() => setLoading(false));
  }, [quizId, attemptId]);

  useEffect(() => {
    if (!attempt) return;
    const target = attempt.score;
    let current = 0;
    const interval = setInterval(() => {
      current++;
      setDisplayScore(current);
      if (current >= target) clearInterval(interval);
    }, 120);
    return () => clearInterval(interval);
  }, [attempt]);

  useEffect(() => {
    if (!attempt || hasLaunched.current) return;
    if (attempt.score < 6) return;
    hasLaunched.current = true;

    const pieces = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: 6 + Math.random() * 8,
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 1.5,
      rotate: Math.random() * 360,
      isCircle: Math.random() > 0.5,
    }));
    setConfetti(pieces);

    const timer = setTimeout(
      () => setConfetti([]),
      6000
    );
    return () => clearTimeout(timer);
  }, [attempt]);

  if (loading) {
    return (
      <PageShell>
        <div className="card p-12 flex flex-col items-center gap-4">
          <LoadingSpinner />
          <p style={{ color: "var(--text-secondary)" }}>Lagi muat hasil kamu...</p>
        </div>
      </PageShell>
    );
  }

  if (error || !quiz || !attempt) {
    return (
      <PageShell>
        <div className="card p-10 w-full max-w-md mx-auto text-center animate-scale-in">
          <div className="text-5xl mb-4">😕</div>
          <h1 className="text-2xl font-extrabold mb-3">Aduh!</h1>
          <p className="mb-8" style={{ color: "var(--text-secondary)" }}>
            {error || "Ada yang error nih."}
          </p>
          <Link href="/" className="btn-primary w-full">
            🏠 Ke Beranda
          </Link>
        </div>
      </PageShell>
    );
  }

  const { emoji, title, message } = getScoreMessage(attempt.score);
  const totalQ = QUESTIONS.length;
  const pct = Math.round((attempt.score / totalQ) * 100);

  let ringColor = "var(--brand-red)";
  if (attempt.score >= 8) ringColor = "var(--brand-green)";
  else if (attempt.score >= 6) ringColor = "var(--brand-blue)";
  else if (attempt.score >= 4) ringColor = "var(--brand-yellow)";

  const circumference = 2 * Math.PI * 52;
  const dashOffset = circumference - (pct / 100) * circumference;

  return (
    <PageShell>
      {confetti.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            background: p.color,
            width: p.size,
            height: p.size,
            borderRadius: p.isCircle ? "50%" : "2px",
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}

      <div className="w-full max-w-lg mx-auto flex flex-col gap-6">
        <div className="card p-8 sm:p-10 text-center animate-scale-in">
          <p
            className="text-sm font-semibold mb-1"
            style={{ color: "var(--text-secondary)" }}
          >
            Hasil {attempt.playerName} untuk kuis{" "}
            <span style={{ color: "var(--brand-blue)" }}>{quiz.creatorName}</span>
          </p>

          <div className="flex justify-center my-6">
            <div className="score-ring" style={{ width: 140, height: 140 }}>
              <svg width="140" height="140" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="var(--border)"
                  strokeWidth="8"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke={ringColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  transform="rotate(-90 60 60)"
                  style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)" }}
                />
              </svg>
              <div
                className="absolute inset-0 flex flex-col items-center justify-center animate-count-up"
                style={{ position: "absolute", inset: 0 }}
              >
                <span className="text-4xl font-extrabold" style={{ color: ringColor }}>
                  {displayScore}
                </span>
                <span
                  className="text-xs font-semibold"
                  style={{ color: "var(--text-hint)" }}
                >
                  / {totalQ}
                </span>
              </div>
            </div>
          </div>

          <div className="text-5xl mb-3 animate-float">{emoji}</div>
          <h1 className="text-3xl font-extrabold mb-2">{title}</h1>
          <p style={{ color: "var(--text-secondary)" }}>{message}</p>

          <div
            className="mt-6 rounded-xl py-3 px-4 text-sm font-semibold"
            style={{
              background:
                attempt.score >= 6
                  ? "var(--brand-green-light)"
                  : "var(--brand-red-light)",
              color:
                attempt.score >= 6
                  ? "var(--brand-green)"
                  : "var(--brand-red)",
            }}
          >
            {attempt.score} benar dari {totalQ} pertanyaan ({pct}%)
          </div>
        </div>

        <div className="card p-6 sm:p-8 animate-fade-up delay-200">
          <h2 className="text-xl font-bold mb-6">Rekap Jawaban 📝</h2>
          <div className="flex flex-col gap-5">
            {QUESTIONS.map((q, i) => {
              const creatorAns = quiz.answers[q.id];
              const playerAns = attempt.answers[q.id];
              const isCorrect = creatorAns === playerAns;

              return (
                <div key={q.id} className="border-b last:border-0 pb-5 last:pb-0" style={{ borderColor: "var(--border)" }}>
                  <div className="flex items-start gap-3 mb-3">
                    <span
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 mt-0.5"
                      style={{
                        background: isCorrect
                          ? "var(--brand-green-light)"
                          : "var(--brand-red-light)",
                        color: isCorrect
                          ? "var(--brand-green)"
                          : "var(--brand-red)",
                      }}
                    >
                      {isCorrect ? "✓" : "✗"}
                    </span>
                    <p className="text-sm font-semibold leading-snug">
                      {q.question}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 ml-10">
                    <div
                      className="rounded-xl p-3 text-sm flex items-center gap-2"
                      style={{
                        background: "var(--brand-green-light)",
                        color: "var(--brand-green)",
                      }}
                    >
                      <span className="font-bold text-xs shrink-0">
                        {OPTION_LETTERS[creatorAns]}
                      </span>
                      <span className="font-medium">{q.options[creatorAns]}</span>
                      <span className="ml-auto text-xs font-semibold shrink-0">
                        ✓ Jawaban {quiz.creatorName}
                      </span>
                    </div>

                    {!isCorrect && playerAns !== undefined && (
                      <div
                        className="rounded-xl p-3 text-sm flex items-center gap-2"
                        style={{
                          background: "var(--brand-red-light)",
                          color: "var(--brand-red)",
                        }}
                      >
                        <span className="font-bold text-xs shrink-0">
                          {OPTION_LETTERS[playerAns]}
                        </span>
                        <span className="font-medium">{q.options[playerAns]}</span>
                        <span className="ml-auto text-xs font-semibold shrink-0">
                          ✗ Jawaban kamu
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3 animate-fade-up delay-300">
          <Link
            href={`/quiz/${quizId}/leaderboard`}
            className="btn-primary w-full text-center"
          >
            📊 Lihat Leaderboard Lengkap
          </Link>
          <Link href="/" className="btn-outline w-full text-center">
            🚀 Buat Kuis Sendiri
          </Link>
        </div>
      </div>
    </PageShell>
  );
}


function PageShell({ children }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 gap-8 relative overflow-hidden"
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
