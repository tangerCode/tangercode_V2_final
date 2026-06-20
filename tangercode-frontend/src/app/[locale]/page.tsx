import { setRequestLocale } from "next-intl/server";

type Props = {
  params: { locale: string };
};

export default function HomePage({ params }: Props) {
  setRequestLocale(params.locale);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4" style={{ background: "#0A1628" }}>
      <div className="mb-8 text-center">
        <span style={{ fontFamily: "monospace", color: "#00D4FF", fontSize: "0.875rem", letterSpacing: "0.2em" }}>
          &lt;
          <span style={{ fontFamily: "'Cabinet Grotesk', system-ui, sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "#F8FAFC" }}>
            TANGER&nbsp;CODE
          </span>
          /&gt;
        </span>
      </div>

      <h1 className="grad-text" style={{ fontFamily: "'Cabinet Grotesk', system-ui, sans-serif", fontSize: "clamp(2rem, 5vw, 3.75rem)", fontWeight: 800, letterSpacing: "-0.02em" }}>
        TANGER CODE
      </h1>

      <p style={{ marginTop: "1.5rem", maxWidth: "32rem", textAlign: "center", fontSize: "1.125rem", color: "#94A3B8", fontFamily: "system-ui, sans-serif" }}>
        {params.locale === "fr" && "Sites web, plateformes, ERP et applications mobiles sur mesure. Bas\u00e9 \u00e0 Tanger, d\u00e9ploy\u00e9 dans le monde."}
        {params.locale === "en" && "Custom websites, platforms, ERP and mobile applications. Based in Tangier, deployed worldwide."}
        {params.locale === "ar" && "\u0645\u0648\u0627\u0642\u0639 \u0648\u064a\u0628\u060c \u0645\u0646\u0635\u0627\u062a\u060c \u0623\u0646\u0638\u0645\u0629 \u062a\u062e\u0637\u064a\u0637 \u0645\u0648\u0627\u0631\u062f \u0627\u0644\u0645\u0624\u0633\u0633\u0627\u062a \u0648\u062a\u0637\u0628\u064a\u0642\u0627\u062a \u062c\u0648\u0627\u0644 \u062d\u0633\u0628 \u0627\u0644\u0637\u0644\u0628."}
      </p>

      <div style={{ marginTop: "3rem", display: "flex", alignItems: "center", gap: "0.75rem", borderRadius: "9999px", border: "1px solid rgba(30,58,95,0.5)", background: "#0F1F3D", padding: "0.75rem 1.5rem" }}>
        <span style={{ height: "0.625rem", width: "0.625rem", borderRadius: "9999px", background: "#10B981", animation: "pulse 2s infinite" }} />
        <span style={{ fontFamily: "monospace", fontSize: "0.875rem", color: "#94A3B8" }}>Coming Soon</span>
      </div>
    </main>
  );
}
