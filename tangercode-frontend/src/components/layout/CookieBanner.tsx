"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export function CookieBanner() {
  const t = useTranslations("cookie");
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("tangercode-cookie-accepted");
    if (!accepted) {
      const timer = setTimeout(() => setShow(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("tangercode-cookie-accepted", "true");
    setShow(false);
  };

  return (
    <div className={`cookie${show ? " show" : ""}`}>
      <p>{t("message")}</p>
      <button className="btn btn-primary btn-sm" onClick={accept}>
        {t("accept")}
      </button>
    </div>
  );
}
