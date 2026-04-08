"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { QUESTIONS } from "@/lib/questions";
import { getQuiz, submitAttempt } from "@/lib/firestore";

const OPTION_LETTERS = ["A", "B", "C", "D"];

const STEPS = {
  LOADING: "loading",
  NOT_FOUND: "not_found",
  NAME: "name",
  QUIZ: "quiz",
  SUBMITTING: "submitting",
};

export default function TakeQuizPage() {
  const router = useRouter();
  const { quizId } = useParams();

  const [step, setStep] = useState(STEPS.LOADING);
  const [quiz, setQuiz] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (!quizId) return;
    getQuiz(quizId)
      .then((data) => {
        if (!data) {
          setStep(STEPS.NOT_FOUND);
        } else {
          setQuiz(data);
          setStep(STEPS.NAME);
        }
      })
      .catch(() => setStep(STEPS.NOT_FOUND));
  }, [quizId]);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    const name = playerName.trim();
    if (!name) return setError("Tulis nama lo dulu dong!");
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
      setError("");
    },
    [currentQ]
  );

  const handleNext = () => {
    if (answers[QUESTIONS[currentQ].id] === undefined) {
      setError("Pilih jawaban dulu!");
      return;
    }
    setError("");
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ((q) => q + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    setError("");
    if (currentQ > 0) setCurrentQ((q) => q - 1);
    else setStep(STEPS.NAME);
  };

  const handleSubmit = async () => {
    setStep(STEPS.SUBMITTING);
    try {
      const score = QUESTIONS.reduce((acc, q) => {
        return answers[q.id] === quiz.answers[q.id] ? acc + 1 : acc;
      }, 0);

      const attemptId = await submitAttempt(
        quizId,
        playerName.trim(),
        answers,
        score
      );

      router.push(`/quiz/${quizId}/result?a=${attemptId}`);
    } catch (err) {
      console.error(err);
      setStep(STEPS.QUIZ);
      setError("Gagal kirim. Cek koneksi internet lo ya.");
    }
  };

  if (step === STEPS.LOADING) {
    return (
      <PageShell>
        <div className="card p-12 flex flex-col items-center gap-4 animate-pulse-blue">
          <LoadingSpinner />
          <p style={{ color: "var(--text-secondary)" }}>Lagi loading kuis...</p>
        </div>
      </PageShell>
    );
  }

  if (step === STEPS.NOT_FOUND) {
    return (
      <PageShell>
        <div className="card p-10 w-full max-w-md mx-auto text-center animate-scale-in">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-extrabold mb-3">Kuis Tidak Ditemukan</h1>
          <p className="mb-8" style={{ color: "var(--text-secondary)" }}>
            Kayaknya link kuis ini gak valid atau udah kadaluarsa.
          </p>
          <Link href="/" className="btn-primary w-full">
            🏠 Ke Beranda
          </Link>
        </div>
      </PageShell>
    );
  }

  if (step === STEPS.SUBMITTING) {
    return (
      <PageShell>
        <div className="card p-12 flex flex-col items-center gap-4">
          <div className="text-5xl animate-float">⏳</div>
          <h2 className="text-xl font-bold">Lagi ngitung nilai lo...</h2>
          <p style={{ color: "var(--text-secondary)" }}>Sebentar ya!</p>
        </div>
      </PageShell>
    );
  }

  if (step === STEPS.NAME) {
    return (
      <PageShell>
        <div className="card p-8 sm:p-10 w-full max-w-lg mx-auto animate-scale-in">
          <div
            className="rounded-2xl p-5 mb-8 text-center"
            style={{ background: "var(--brand-blue-light)" }}
          >
            <span className="text-4xl block mb-2">🧑‍💻</span>
            <p className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
              Kuis dari
            </p>
            <h2
              className="text-2xl font-extrabold"
              style={{ color: "var(--brand-blue)" }}
            >
              {quiz.creatorName}
            </h2>
          </div>

          <p
            className="text-center text-lg font-semibold mb-2"
          >
            Seberapa kenal lo sama{" "}
            <span style={{ color: "var(--brand-blue)" }}>{quiz.creatorName}</span>?
          </p>
          <p
            className="text-center mb-8"
            style={{ color: "var(--text-secondary)" }}
          >
            Jawab {QUESTIONS.length} pertanyaan — coba tebak pilihan{" "}
            {quiz.creatorName}!
          </p>

          <form onSubmit={handleNameSubmit} className="flex flex-col gap-5">
            <div>
              <label
                htmlFor="player-name"
                className="block text-sm font-semibold mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Nama lo
              </label>
              <input
                id="player-name"
                type="text"
                className="input-field"
                placeholder="Nama lo siapa?"
                value={playerName}
                onChange={(e) => {
                  setPlayerName(e.target.value);
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
              Mulai Kuis 🧠
            </button>
          </form>
        </div>

        <Link
          href="/"
          className="text-sm font-medium hover:opacity-60 transition-opacity"
          style={{ color: "var(--text-secondary)" }}
        >
          ← Balik ke Beranda
        </Link>
      </PageShell>
    );
  }

  const q = QUESTIONS[currentQ];
  const selected = answers[q.id];
  const progressPct = ((currentQ + 1) / QUESTIONS.length) * 100;

  return (
    <PageShell>
      <div className="w-full max-w-lg mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-sm font-semibold transition-opacity hover:opacity-60"
            style={{ color: "var(--text-secondary)" }}
          >
            ← Kembali
          </button>
          <div className="text-center">
            <p className="text-xs font-semibold" style={{ color: "var(--text-hint)" }}>
              Nebak untuk
            </p>
            <p className="text-sm font-bold" style={{ color: "var(--brand-blue)" }}>
              {quiz.creatorName}
            </p>
          </div>
          <span className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
            {currentQ + 1} / {QUESTIONS.length}
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

        <div className="card p-8 sm:p-10 animate-fade-up" key={currentQ}>
          <span className="badge badge-purple mb-5 inline-block">
            Pertanyaan {currentQ + 1}
          </span>
          <h2 className="text-2xl font-bold mb-2 leading-snug">
            {q.question}
          </h2>
          <p className="text-sm mb-8" style={{ color: "var(--text-hint)" }}>
            Kira-kira{" "}
            <strong style={{ color: "var(--brand-blue)" }}>{quiz.creatorName}</strong>{" "}
            pilih yang mana?
          </p>

          <div className="flex flex-col gap-3">
            {q.options.map((option, i) => (
              <button
                key={i}
                className={`option-btn ${selected === i ? "selected" : ""}`}
                onClick={() => handleSelectOption(i)}
              >
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 transition-colors"
                  style={{
                    background:
                      selected === i
                        ? "var(--brand-purple)"
                        : "var(--brand-purple-light)",
                    color: selected === i ? "#fff" : "var(--brand-purple)",
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
          <button onClick={handleBack} className="btn-outline flex-1">
            ← Kembali
          </button>
          <button onClick={handleNext} className="btn-primary flex-2">
            {currentQ === QUESTIONS.length - 1 ? "Kirim Jawaban 🎯" : "Lanjut →"}
          </button>
        </div>
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
