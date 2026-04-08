import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <section
        className="relative flex flex-col items-center justify-center min-h-screen px-4 py-20 text-center overflow-hidden"
        style={{ background: "#fff" }}
      >
        <div aria-hidden className="absolute top-20 left-1/4 text-4xl animate-float delay-100 select-none">👀</div>
        <div aria-hidden className="absolute top-28 right-1/4 text-3xl animate-float delay-400 select-none">💬</div>
        <div aria-hidden className="absolute bottom-28 left-1/5 text-3xl animate-float delay-200 select-none">🏆</div>
        <div aria-hidden className="absolute bottom-36 right-1/5 text-2xl animate-float delay-500 select-none">🤔</div>

        <div className="animate-fade-up mb-5">
          <span className="badge badge-blue text-sm px-4 py-2">Gratis dan Tanpa Daftar 🎉</span>
        </div>

        <h1
          className="animate-fade-up delay-100 text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight mb-5 max-w-3xl"
          style={{ letterSpacing: "-0.02em" }}
        >
          Emangnya Temen Lo{" "}
          <span className="gradient-text">Beneran Kenal</span> Lo?
        </h1>

        <p
          className="animate-fade-up delay-200 text-xl md:text-2xl max-w-xl mb-10 leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          Buat kuis personal, share linknya, dan ranking semua temen lo.
          Ketahuan deh mana yang{" "}
          <span className="font-semibold" style={{ color: "var(--brand-blue)" }}>
            asli
          </span>{" "}
          dan mana yang fake 😈
        </p>

        <div className="animate-fade-up delay-300 flex flex-col sm:flex-row gap-4 items-center">
          <Link href="/create" className="btn-primary text-lg px-10 py-4">
            Buat Kuis Sekarang 🚀
          </Link>
          <a href="#cara-main" className="btn-outline text-lg px-8 py-4">
            Cara Mainnya
          </a>
        </div>

        <p
          className="animate-fade-up delay-400 mt-10 text-sm"
          style={{ color: "var(--text-hint)" }}
        >
          10 pertanyaan &middot; Langsung ada hasilnya &middot; Gratis selamanya
        </p>
      </section>

      <section
        id="cara-main"
        className="py-20 px-4"
        style={{ background: "var(--surface-alt)" }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="badge badge-purple mb-4">Cara Main</span>
            <h2 className="text-4xl font-extrabold" style={{ letterSpacing: "-0.02em" }}>
              Tiga langkah aja 🔍
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                emoji: "✍️",
                title: "Buat Kuis Lo",
                desc: "Jawab 10 pertanyaan tentang diri lo. Nanti temen-temen lo yang nebak jawabannya.",
                color: "var(--brand-blue)",
                bg: "var(--brand-blue-light)",
              },
              {
                step: "02",
                emoji: "🔗",
                title: "Share Linknya",
                desc: "Kirim link kuis lo ke temen via WhatsApp, Instagram, atau terserah lo.",
                color: "var(--brand-purple)",
                bg: "var(--brand-purple-light)",
              },
              {
                step: "03",
                emoji: "🏆",
                title: "Cek Leaderboard",
                desc: "Liat siapa yang dapet nilai tertinggi. Yang beneran kenal lo bakal keliatan.",
                color: "var(--brand-green)",
                bg: "var(--brand-green-light)",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="card p-8 flex flex-col items-center text-center group hover:shadow-lg transition-shadow duration-300"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform"
                  style={{ background: item.bg }}
                >
                  {item.emoji}
                </div>
                <span
                  className="text-xs font-bold tracking-widest mb-2"
                  style={{ color: item.color }}
                >
                  LANGKAH {item.step}
                </span>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p style={{ color: "var(--text-secondary)", lineHeight: "1.7" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="py-20 px-4"
        style={{ background: "var(--brand-blue)" }}
      >
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-extrabold mb-4" style={{ letterSpacing: "-0.02em" }}>
            Nilai Lo Ngomong Apa? 🎯
          </h2>
          <p className="text-xl mb-12 max-w-lg mx-auto" style={{ opacity: 0.85 }}>
            Setiap temen dapet nilai dari 10. Ini artinya tiap skor:
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { range: "10 / 10", emoji: "🔮", title: "Baca Pikiran!", color: "#fff" },
              { range: "8 - 9 / 10", emoji: "🏆", title: "Teman Sejati!", color: "#fbbc04" },
              { range: "6 - 7 / 10", emoji: "😊", title: "Lumayan!", color: "#34a853" },
              { range: "4 - 5 / 10", emoji: "👀", title: "Hmm...", color: "#ff9800" },
              { range: "2 - 3 / 10", emoji: "😬", title: "Teman Palsu Alert!", color: "#ea4335" },
              { range: "0 - 1 / 10", emoji: "💀", title: "Emang Kenal?!", color: "#f06292" },
            ].map((s, i) => (
              <div
                key={i}
                className="rounded-2xl p-5 text-left"
                style={{ background: "rgba(255,255,255,.15)" }}
              >
                <div className="text-3xl mb-2">{s.emoji}</div>
                <div className="text-sm font-bold mb-1" style={{ color: s.color }}>
                  {s.range}
                </div>
                <div className="text-base font-semibold">{s.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 text-center" style={{ background: "var(--surface)" }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-6xl mb-6 animate-float">🤝</div>
          <h2 className="text-4xl font-extrabold mb-4" style={{ letterSpacing: "-0.02em" }}>
            Siap nguji temen lo?
          </h2>
          <p className="text-xl mb-10" style={{ color: "var(--text-secondary)" }}>
            Cuma butuh 2 menit buat bikin kuis. Temen lo yang ngerjain sisanya.
          </p>
          <Link href="/create" className="btn-primary text-lg px-12 py-4">
            Yuk Mulai 🎉
          </Link>
        </div>
      </section>

      <footer
        className="py-6 px-4 text-center border-t"
        style={{ borderColor: "var(--border)", color: "var(--text-hint)" }}
      >
        <p className="text-sm">
          Dibuat dengan <span className="text-red-400">♥</span> &middot;{" "}
          <span className="font-semibold" style={{ color: "var(--text-secondary)" }}>
            NowieFakie
          </span>
        </p>
      </footer>
    </main>
  );
}