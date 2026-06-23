import Link from "next/link";

export default function NotFound() {
  return (
    <div className="err-wrap">
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 50% 50% at 50% 40%,rgba(0,212,255,0.10),transparent 60%)" }} />
      <div className="container" style={{ position: "relative", zIndex: 2, maxWidth: 640 }}>
        <span className="logo"><span className="bracket">&lt;</span><span className="word">TANGER&nbsp;CODE</span><span className="bracket">/&gt;</span></span>
        <div className="err-code grad-text" style={{ margin: "24px 0 8px" }}>404</div>
        <div className="err-term">
          <div className="bar"><i style={{ background: "#ff5f56" }} /><i style={{ background: "#ffbd2e" }} /><i style={{ background: "#27c93f" }} /></div>
          <div className="body">
            <span className="tok-c">$</span> <span className="tok-f">find</span> /page <span className="tok-c">--name</span> &quot;introuvable&quot;<br />
            <span style={{ color: "var(--error)" }}>Error 404:</span> Page not found<br />
            <span className="tok-c">$</span> <span style={{ opacity: 0.6 }}>redirection conseillee…</span><span className="blink" style={{ color: "var(--cyan)" }}>_</span>
          </div>
        </div>
        <h1 className="h2" style={{ marginBottom: 12 }}>Oups ! Page introuvable</h1>
        <p className="muted" style={{ maxWidth: "46ch", margin: "0 auto 28px" }}>La page que vous cherchez a ete deplacee, supprimee, ou n a jamais existe. Pas de panique, on vous ramene en terrain connu.</p>
        <div className="hero-cta">
          <Link href="/fr" className="btn btn-primary btn-lg">Retour a l accueil</Link>
          <Link href="/fr/services" className="btn btn-ghost btn-lg">Voir nos services</Link>
        </div>
      </div>
    </div>
  );
}
