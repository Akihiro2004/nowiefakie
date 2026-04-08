import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata = {
  title: "NowieFakie - Emangnya Temen Kamu Kenal Kamu?",
  description:
    "Buat kuis personal, share ke temen, dan cari tau siapa yang beneran kenal kamu. Ketahuan deh mana yang fake!",
  openGraph: {
    title: "NowieFakie - Emangnya Temen Kamu Kenal Kamu?",
    description: "Buat kuis, share, dan ketahuin mana temen fake kamu 👀",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${poppins.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
