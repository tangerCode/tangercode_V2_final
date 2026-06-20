import { Inter, JetBrains_Mono, Cairo } from "next/font/google";

const cabinetGrotesk = {
  variable: "--font-cabinet",
  className: "",
  style: { fontFamily: "'Cabinet Grotesk', system-ui, sans-serif" },
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
  display: "swap",
});

export { cabinetGrotesk, inter, jetbrainsMono, cairo };
