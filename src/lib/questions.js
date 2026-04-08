export const QUESTIONS = [
  {
    id: "q1",
    question: "Makanan favorit aku yang paling bikin nyaman? 🍕",
    options: [
      "Pizza, kapanpun dimanapun",
      "Es krim, tanpa nego",
      "Mie instan tengah malem",
      "Ayam goreng, harus crispy",
    ],
  },
  {
    id: "q2",
    question: "Ketakutan terbesar aku itu apa? 😱",
    options: [
      "Ketinggian, no thanks banget",
      "Ditinggal dan dilupain orang",
      "Malu besar di depan orang banyak",
      "Serangga kecil-kecil 🕷️",
    ],
  },
  {
    id: "q3",
    question: "Minggu ideal aku itu kayak gimana? ☀️",
    options: [
      "Tidur sampe siang, jelas",
      "Jalan ke tempat baru yang belum pernah didatangin",
      "Nonton Netflix sambil rebahan seharian",
      "Ngumpul bareng temen-temen",
    ],
  },
  {
    id: "q4",
    question: "Genre tontonan favorit aku? 🎬",
    options: [
      "Thriller dan horor",
      "Komedi, butuh ketawa terus",
      "Romance yang baper-baperan",
      "Dokumenter atau true crime",
    ],
  },
  {
    id: "q5",
    question: "Pilih vibe lagu yang paling cocok sama hidup aku 🎵",
    options: [
      "Pop upbeat yang bikin semangat 🎉",
      "Lo-fi santai buat fokus 😌",
      "Ballad mellow yang bikin nangis 💙",
      "Lagu hype buat olahraga 💪",
    ],
  },
  {
    id: "q6",
    question: "Hal yang paling bikin aku sebel? 🙄",
    options: [
      "Internet lemot",
      "Orang yang suka telat mulu",
      "Suara ngunyah yang berisik",
      "Orang yang suka kasih saran tanpa diminta",
    ],
  },
  {
    id: "q7",
    question: "Love language aku itu apa? 💕",
    options: [
      "Kata-kata yang bikin meleleh",
      "Quality time bareng",
      "Dibantu tanpa harus minta",
      "Dikasih hadiah yang thoughtful",
    ],
  },
  {
    id: "q8",
    question: "Cara aku handle stress? 😤",
    options: [
      "Curhat panjang lebar ke orang",
      "Diem dan ngejauhin semua",
      "Olahraga atau jalan-jalan",
      "Makan apapun yang ada",
    ],
  },
  {
    id: "q9",
    question: "Kalau dapet uang 1 miliar, hal pertama yang aku lakuin? 💰",
    options: [
      "Langsung traveling ke mana-mana",
      "Investasi semua dengan bijak",
      "Manjain diri sendiri dan orang tersayang",
      "Prioritas keluarga dulu",
    ],
  },
  {
    id: "q10",
    question: "Peran aku di circle pertemanan? 👥",
    options: [
      "Si lawak yang selalu bikin ketawa",
      "Si emak atau bapak yang paling bertanggung jawab",
      "Si visioner penuh ide liar",
      "Si kalem yang nyantai aja",
    ],
  },
];

export function getScoreMessage(score) {
  if (score === 10)
    return { emoji: "🔮", title: "Baca Pikiran!", message: "Kalian kayak punya otak yang sama. Gila sih." };
  if (score >= 8)
    return { emoji: "🏆", title: "Teman Sejati!", message: "Lo tau banget dia dalam-dalamnya. Langka banget nih." };
  if (score >= 6)
    return { emoji: "😊", title: "Lumayan!", message: "Lo cukup perhatian kok. Solid." };
  if (score >= 4)
    return { emoji: "👀", title: "Hmm...", message: "Kayaknya perlu lebih sering ngobrol deh." };
  if (score >= 2)
    return { emoji: "😬", title: "Teman Palsu Alert!", message: "Kalian beneran sering ngobrol gak sih?" };
  return { emoji: "💀", title: "Emang Kenal?!", message: "Ini serius nyoba atau nggak sih? Kita yang khawatir." };
}