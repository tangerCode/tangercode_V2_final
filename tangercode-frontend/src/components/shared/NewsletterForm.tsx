"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { newsletterSchema, type NewsletterFormData } from "@/lib/validation";
import { toast } from "@/hooks/use-toast";
import { Send } from "lucide-react";

export function NewsletterForm() {
  const t = useTranslations("newsletter");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (_data: NewsletterFormData) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast({ title: t("success") });
      reset();
    } catch {
      toast({ title: "Erreur", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2">
      <div className="field flex-1" style={{ marginBottom: 0 }}>
        <input
          className="input"
          type="email"
          placeholder={t("placeholder")}
          {...register("email")}
        />
        {errors.email && <span className="text-xs text-red-400">{errors.email.message}</span>}
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading} aria-label={t("subscribe")}>
        <Send className="h-4 w-4" />
      </button>
    </form>
  );
}
