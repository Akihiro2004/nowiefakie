"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { QUESTIONS } from "@/lib/questions";
import { createQuiz } from "@/lib/firestore";

const STEPS = {
  NAME: "name",
  QUIZ: "quiz",
  SHARE: "share",
};

const OPTION_LETTERS = ["A", "B", "C", "D"];

export default function CreateQuizPage() {
  const router = useRouter();

  const [step, setStep] = useState(STEPS.NAME);
  const [creatorName, setCreatorName] = useState("");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const totalQ = QUESTIONS.length;
  const progress = ((currentQ + (step === STEPS.QUIZ ? 0 : 0)) / totalQ) * 100;

  const handleNameSubmit = (e) => {
    e.preventDefault();
    const name = creatorName.trim();
    if (!name) return setError("Isi nama kamu dulu dong!");
    if (name.length > 40) return setError("Nama terlalu panjang (maks 40 karakter).");
    setError("");
    setStep(STEPS.QUIZ);
  };

  const handleSelectOption = useCallback(
    (optionIndex) => {
      setAnswers((prev) => ({
        ...prev,
        [QUESTIONS[currentQ].id]: optionIndex,
      }));
    },
    [currentQ]
  );

  const handleNext = () => {
    if (answers[QUESTIONS[currentQ].id] === undefined) {
      setError("Pilih jawaban dulu dong!");
      return;
    }
    setError("");
    if (currentQ < totalQ - 1) {
      setCurrentQ((q) => q + 1);
    } else {
      handlePublish();
    }
  };

  const handleBack = () => {
    setError("");
    if (currentQ > 0) {
      setCurrentQ((q) => q - 1);
    } else {
      setStep(STEPS.NAME);
    }
  };

  const handlePublish = async () => {
    setLoading(true);
    setError("");
    try {
      const quizId = await createQuiz(creatorName.trim(), answers);
      const origin =
        typeof window !== "undefined"
          ? window.location.origin
          : process.env.NEXT_PUBLIC_APP_URL ?? "";
      setShareUrl(`${origin}/quiz/${quizId}`);
      setStep(STEPS.SHARE);
    } catch (err) {
      console.error(err);
      setError("Aduh, ada yang error. Cek koneksi kamu terus coba lagi ya.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
    }
  };

  if (step === STEPS.NAME) {
    return (
      <PageShell>
        <div className="card p-8 sm:p-10 w-full max-w-lg mx-auto animate-scale-in">
          <div className="text-center mb-8">
            <span className="text-5xl mb-4 block animate-float">👋</span>
            <h1 className="text-3xl font-extrabold mb-2">
              Buat Kuis Kamu
            </h1>
            <p style={{ color: "var(--text-secondary)" }}>
              Pertama, kenalin dulu siapa yang bikin kuis ini.
            </p>
          </div>

          <form onSubmit={handleNameSubmit} className="flex flex-col gap-5">
            <div>
              <label
                htmlFor="creator-name"
                className="block text-sm font-semibold mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Nama kamu
              </label>
              <input
                id="creator-name"
                type="text"
                className="input-field"
                placeholder="Contoh: Budi, Rina, Joko..."
                value={creatorName}
                onChange={(e) => {
                  setCreatorName(e.target.value);
                  setError("");
                }}
                maxLength={40}
                autoFocus
              />
            </div>

            {error && (
              <p className="text-sm font-medium" style={{ color: "var(--brand-red)" }}>
                {error}
              </p>
            )}

            <button type="submit" className="btn-primary">
              Mulai Sekarang! →
            </button>

            <p className="text-center text-sm" style={{ color: "var(--text-hint)" }}>
              Kamu bakal jawab 10 pertanyaan tentang diri kamu sendiri.{" "}
              <br />
              Nanti temen kamu yang nebak jawaban kamu!
            </p>
          </form>
        </div>

        <BackToHome />
      </PageShell>
    );
  }

  if (step === STEPS.QUIZ) {
    const q = QUESTIONS[currentQ];
    const selected = answers[q.id];
    const progressPct = ((currentQ + 1) / totalQ) * 100;

    return (
      <PageShell>
        <div className="w-full max-w-lg mx-auto flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center gap-1 text-sm font-semibold transition-colors hover:opacity-70"
              style={{ color: "var(--text-secondary)" }}
            >
              ← Kembali
            </button>
            <span className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
              {currentQ + 1} / {totalQ}
            </span>
          </div>

          <div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex gap-1 mt-3 justify-center">
              {QUESTIONS.map((_, i) => (
                <span
                  key={i}
                  className={`step-dot ${
                    i < currentQ ? "done" : i === currentQ ? "active" : ""
                  }`}
                />
              ))}
            </div>
          </div>

          <div
            className="card p-8 sm:p-10 animate-fade-up"
            key={currentQ}
          >
            <span
              className="badge badge-blue mb-5 inline-block"
            >
              Pertanyaan {currentQ + 1}
            </span>
            <h2 className="text-2xl font-bold mb-8 leading-snug">
              {q.question}
            </h2>

            <div className="flex flex-col gap-3">
              {q.options.map((option, i) => (
                <button
                  key={i}
                  className={`option-btn ${selected === i ? "selected" : ""}`}
                  onClick={() => {
                    handleSelectOption(i);
                    setError("");
                  }}
                >
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 transition-colors"
                    style={{
                      background:
                        selected === i
                          ? "var(--brand-blue)"
                          : "var(--brand-blue-light)",
                      color: selected === i ? "#fff" : "var(--brand-blue)",
                    }}
                  >
                    {OPTION_LETTERS[i]}
                  </span>
                  {option}
                </button>
              ))}
            </div>

            {error && (
              <p
                className="text-sm font-medium mt-4"
                style={{ color: "var(--brand-red)" }}
              >
                {error}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleBack}
              className="btn-outline flex-1"
            >
              ← Kembali
            </button>
            <button
              onClick={handleNext}
              disabled={loading}
              className="btn-primary flex-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Spinner /> Menyimpan...
                </span>
              ) : currentQ === totalQ - 1 ? (
                "Publish Kuis 🚀"
              ) : (
                "Lanjut →"
              )}
            </button>
          </div>
        </div>

        <BackToHome />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="card p-8 sm:p-10 w-full max-w-lg mx-auto text-center animate-scale-in">
        <div className="text-6xl mb-4 animate-float">🎉</div>
        <h1 className="text-3xl font-extrabold mb-2">Kuis kamu udah live!</h1>
        <p className="mb-8" style={{ color: "var(--text-secondary)" }}>
          Share link ini ke temen-temen dan liat siapa yang beneran kenal{" "}
          <span className="font-semibold" style={{ color: "var(--brand-blue)" }}>
            {creatorName}
          </span>
          .
        </p>

        <div className="flex items-center gap-2 mb-6">
          <div
            className="flex-1 rounded-xl p-3 text-sm font-medium text-left overflow-hidden text-ellipsis whitespace-nowrap"
            style={{
              background: "var(--brand-blue-light)",
              color: "var(--brand-blue)",
              border: "2px solid var(--brand-blue)",
            }}
            title={shareUrl}
          >
            {shareUrl}
          </div>
          <button
            onClick={handleCopy}
            className="btn-primary px-5 py-3 text-sm shrink-0"
            style={{ minWidth: 90 }}
          >
            {copied ? "✓ Disalin!" : "Salin"}
          </button>
        </div>

        <div className="flex gap-3 justify-center mb-8">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              `Kamu beneran kenal aku? 👀 Coba jawab kuis aku dong! ${shareUrl}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline text-sm px-5 py-2"
          >
            📱 WhatsApp
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              `Kamu beneran kenal aku? 👀 Coba kuis aku!`
            )}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline text-sm px-5 py-2"
          >
            🐦 Twitter
          </a>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href={`/quiz/${encodeURIComponent(shareUrl.split("/quiz/")[1])}/leaderboard`}
            className="btn-outline w-full"
          >
            📊 Lihat Leaderboard
          </Link>
          <Link href="/" className="btn-outline w-full">
            🏠 Balik ke Beranda
          </Link>
        </div>

        <p
          className="mt-6 text-xs"
          style={{ color: "var(--text-hint)" }}
        >
          Tip: Simpen link ini! Itu satu-satunya cara akses leaderboard kamu.
        </p>
      </div>
    </PageShell>
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

function BackToHome() {
  return (
    <Link
      href="/"
      className="text-sm font-medium transition-opacity hover:opacity-60"
      style={{ color: "var(--text-secondary)" }}
    >
      ← Balik ke Beranda
    </Link>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <circle cx="12" cy="12" r="10" strokeOpacity=".25" />
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}
