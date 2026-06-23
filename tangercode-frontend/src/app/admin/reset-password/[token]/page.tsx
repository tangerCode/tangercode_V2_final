"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const resetSchema = z
  .object({
    password: z.string().min(8, "Minimum 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type ResetFormData = z.infer<typeof resetSchema>;

export default function ResetPasswordPage({
  params,
}: {
  params: { token: string };
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: ResetFormData) => {
    setIsSubmitting(true);
    try {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
      const response = await fetch(
        `${API_BASE_URL}/auth/password-reset/confirm/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: params.token,
            password: data.password,
          }),
        },
      );

      if (response.ok) {
        toast({
          title: "Mot de passe reinitialise",
          description: "Vous pouvez maintenant vous connecter.",
        });
        router.push("/admin/login");
      } else {
        toast({
          title: "Erreur",
          description: "Le lien est invalide ou a expire.",
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
          Nouveau mot de passe
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="field">
            <label htmlFor="password">Mot de passe</label>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                className="input"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                className="icon-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword
                    ? "Cacher le mot de passe"
                    : "Afficher le mot de passe"
                }
                style={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 32,
                  height: 32,
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <span
                style={{
                  fontSize: ".78rem",
                  color: "var(--error)",
                  marginTop: 4,
                  display: "block",
                }}
              >
                {errors.password.message}
              </span>
            )}
          </div>

          <div className="field">
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <input
              id="confirmPassword"
              className="input"
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <span
                style={{
                  fontSize: ".78rem",
                  color: "var(--error)",
                  marginTop: 4,
                  display: "block",
                }}
              >
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={isSubmitting}
            style={{ marginBottom: 12 }}
          >
            {isSubmitting ? "Reinitialisation..." : "Reinitialiser le mot de passe"}
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
      </div>
    </div>
  );
}
