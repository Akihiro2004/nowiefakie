import {
  collection,
  doc,
  setDoc,
  getDoc,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export async function createQuiz(creatorName, answers) {
  const quizRef = doc(collection(db, "quizzes"));
  await setDoc(quizRef, {
    creatorName,
    answers,
    createdAt: serverTimestamp(),
  });
  return quizRef.id;
}

export async function getQuiz(quizId) {
  const quizRef = doc(db, "quizzes", quizId);
  const snap = await getDoc(quizRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function submitAttempt(quizId, playerName, answers, score) {
  const ref = await addDoc(collection(db, "attempts"), {
    quizId,
    playerName,
    answers,
    score,
    totalQuestions: 10,
    completedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getAttempt(attemptId) {
  const ref = doc(db, "attempts", attemptId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function getLeaderboard(quizId) {
  const q = query(
    collection(db, "attempts"),
    where("quizId", "==", quizId),
    orderBy("score", "desc"),
    orderBy("completedAt", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
