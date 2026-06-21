"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { contactSchema, type ContactFormData } from "@/lib/validation";
import { toast } from "@/hooks/use-toast";

interface ContactFormProps {
  variant?: "page" | "quick";
}

export function ContactForm({ variant = "page" }: ContactFormProps) {
  const t = useTranslations("contact");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (_data: ContactFormData) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call in later phase
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({ title: t("success"), variant: "default" });
      reset();
    } catch {
      toast({ title: t("error"), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (variant === "quick") {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="card" style={{ padding: 24 }}>
        <h3 className="mb-4 text-lg font-semibold">Contact rapide</h3>
        <div className="field">
          <label htmlFor="quick-name">{t("name")}</label>
          <input id="quick-name" className="input" type="text" placeholder="Votre nom" {...register("name")} />
          {errors.name && <span className="text-xs text-red-400">{errors.name.message}</span>}
        </div>
        <div className="field">
          <label htmlFor="quick-email">{t("email")}</label>
          <input id="quick-email" className="input" type="email" placeholder="vous@email.com" {...register("email")} />
          {errors.email && <span className="text-xs text-red-400">{errors.email.message}</span>}
        </div>
        <div className="field">
          <label htmlFor="quick-message">{t("message")}</label>
          <textarea id="quick-message" className="textarea" placeholder="Décrivez votre projet…" rows={3} {...register("message")} />
          {errors.message && <span className="text-xs text-red-400">{errors.message.message}</span>}
        </div>
        <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
          {loading ? "..." : t("submit")}
        </button>
      </form>
    );
  }

  // Page variant
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card" noValidate>
      <div className="grid grid-2" style={{ gap: "0 18px" }}>
        <div className="field">
          <label htmlFor="name">{t("name")}</label>
          <input id="name" className="input" type="text" placeholder="Votre nom" {...register("name")} />
          {errors.name && <span className="text-xs text-red-400">{errors.name.message}</span>}
        </div>
        <div className="field">
          <label htmlFor="email">{t("email")}</label>
          <input id="email" className="input" type="email" placeholder="vous@email.com" {...register("email")} />
          {errors.email && <span className="text-xs text-red-400">{errors.email.message}</span>}
        </div>
      </div>
      <div className="grid grid-2" style={{ gap: "0 18px" }}>
        <div className="field">
          <label htmlFor="phone">{t("phone")}</label>
          <input id="phone" className="input" type="tel" placeholder="+212…" {...register("phone")} />
        </div>
        <div className="field">
          <label htmlFor="company">{t("company")}</label>
          <input id="company" className="input" type="text" placeholder="Votre société" {...register("company")} />
        </div>
      </div>
      <div className="field">
        <label htmlFor="service">{t("service")}</label>
        <select id="service" className="select" {...register("service_interested")}>
          <option value="">--</option>
          <option value="website">Site web</option>
          <option value="platform">Plateforme web</option>
          <option value="erp">ERP sur mesure</option>
          <option value="mobile">Application mobile</option>
          <option value="other">Autre</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="subject">{t("subject")}</label>
        <input id="subject" className="input" type="text" placeholder="Objet de votre message" {...register("subject")} />
        {errors.subject && <span className="text-xs text-red-400">{errors.subject.message}</span>}
      </div>
      <div className="field">
        <label htmlFor="message">{t("message")}</label>
        <textarea id="message" className="textarea" placeholder="Décrivez votre projet, vos objectifs, vos délais…" rows={6} {...register("message")} />
        {errors.message && <span className="text-xs text-red-400">{errors.message.message}</span>}
      </div>
      <div className="rounded-[10px] mb-4 flex h-[70px] items-center justify-center" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-soft)" }}>
        <span className="font-mono text-xs tracking-wider" style={{ color: "var(--text-muted)" }}>reCAPTCHA</span>
      </div>
      <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
        {loading ? "..." : t("submit")}
      </button>
    </form>
  );
}
