"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";

const forgotSchema = z.object({
  email: z.string().email("Email invalide"),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotFormData) => {
    setIsSubmitting(true);
    try {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
      const response = await fetch(
        `${API_BASE_URL}/admin/auth/password-reset/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email }),
        },
      );

      if (response.ok) {
        setSent(true);
      } else {
        toast({
          title: "Erreur",
          description:
            "Impossible d'envoyer l'email de reinitialisation.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Erreur",
        description: "Service momentanement indisponible.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card card">
        <Link href="/" className="logo">
          <span className="bracket">&lt;</span>
          <span className="word">TANGER&nbsp;CODE</span>
          <span className="bracket">/&gt;</span>
        </Link>
        <p
          className="center muted"
          style={{ margin: "6px 0 26px", fontSize: ".9rem" }}
        >
          Mot de passe oublie
        </p>

        {sent ? (
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                marginBottom: 20,
                color: "var(--text-secondary)",
                lineHeight: 1.7,
              }}
            >
              Si un compte est associe a cet email, vous recevrez un lien de
              reinitialisation.
            </p>
            <Link href="/admin/login" className="btn btn-primary btn-block">
              Retour a la connexion
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                className="input"
                type="email"
                placeholder="admin@tangercode.ma"
                {...register("email")}
              />
              {errors.email && (
                <span
                  style={{
                    fontSize: ".78rem",
                    color: "var(--error)",
                    marginTop: 4,
                    display: "block",
                  }}
                >
                  {errors.email.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              disabled={isSubmitting}
              style={{ marginBottom: 12 }}
            >
              {isSubmitting ? "Envoi..." : "Envoyer le lien"}
            </button>

            <Link
              href="/admin/login"
              className="link-arrow"
              style={{
                display: "block",
                textAlign: "center",
                fontSize: ".88rem",
              }}
            >
              Retour a la connexion
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
