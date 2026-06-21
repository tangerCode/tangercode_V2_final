"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type CookiePrefs = {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
};

const defaultPrefs: CookiePrefs = { essential: true, analytics: true, marketing: false };

export function CookieBanner() {
  const t = useTranslations("cookie");
  const [show, setShow] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [prefs, setPrefs] = useState<CookiePrefs>(defaultPrefs);

  useEffect(() => {
    const stored = localStorage.getItem("tangercode-cookie-prefs");
    if (!stored) {
      const timer = setTimeout(() => setShow(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const savePrefs = (p: CookiePrefs) => {
    localStorage.setItem("tangercode-cookie-prefs", JSON.stringify(p));
    setShow(false);
    setDialogOpen(false);

    if (!p.analytics) {
      // Disable GA4
      if (typeof window !== "undefined") {
        (window as any)["ga-disable-GA4"] = true;
      }
    }
  };

  const acceptAll = () => savePrefs({ essential: true, analytics: true, marketing: true });
  const refuseAll = () => savePrefs({ essential: true, analytics: false, marketing: false });

  return (
    <>
      <div className={`cookie${show ? " show" : ""}`}>
        <p>{t("message")}</p>
        <div className="flex items-center gap-2">
          <button className="btn btn-primary btn-sm" onClick={acceptAll}>
            {t("acceptAll")}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={refuseAll}>
            {t("refuse")}
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setDialogOpen(true)}
          >
            {t("customize")}
          </button>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("customizeTitle") || "Personnaliser les cookies"}</DialogTitle>
            <DialogDescription>
              {t("customizeDesc") || "Gérez vos préférences de cookies."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">{t("essential") || "Essentiels"}</Label>
                <p className="text-xs text-muted-foreground">
                  {t("essentialDesc") || "Nécessaires au fonctionnement du site."}
                </p>
              </div>
              <Switch checked={prefs.essential} disabled />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">{t("analytics") || "Analytics"}</Label>
                <p className="text-xs text-muted-foreground">
                  {t("analyticsDesc") || "Nous aident à améliorer le site."}
                </p>
              </div>
              <Switch
                checked={prefs.analytics}
                onCheckedChange={(checked) => setPrefs({ ...prefs, analytics: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">{t("marketing") || "Marketing"}</Label>
                <p className="text-xs text-muted-foreground">
                  {t("marketingDesc") || "Pour des publicités personnalisées."}
                </p>
              </div>
              <Switch
                checked={prefs.marketing}
                onCheckedChange={(checked) => setPrefs({ ...prefs, marketing: checked })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button className="btn btn-ghost btn-sm" onClick={() => setDialogOpen(false)}>
              {t("cancel") || "Annuler"}
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => savePrefs(prefs)}>
              {t("save") || "Enregistrer"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
