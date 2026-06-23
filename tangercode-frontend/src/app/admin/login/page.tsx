"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { login as loginApi } from "@/lib/api/auth";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login: loginStore } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [failCount, setFailCount] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const onSubmit = async (data: LoginFormData) => {
    if (failCount >= 5) {
      toast({
        title: "Trop de tentatives",
        description: "Veuillez reessayer dans quelques minutes.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { access, refresh, user } = await loginApi({
        email: data.email,
        password: data.password,
      });

      await fetch("/api/auth/set-cookie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });

      loginStore(access, refresh, user);
      setFailCount(0);

      const searchParams = new URLSearchParams(window.location.search);
      const redirectTo = searchParams.get("redirect") || "/admin";
      router.push(redirectTo);
    } catch {
      setFailCount((c) => c + 1);
      toast({
        title: "Echec de connexion",
        description: "Email ou mot de passe incorrect.",
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
          Espace d&apos;administration
        </p>
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

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
              fontSize: ".85rem",
            }}
          >
            <label
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                color: "var(--text-secondary)",
              }}
            >
              <input type="checkbox" {...register("rememberMe")} />
              Se souvenir de moi
            </label>
            <Link
              href="/admin/forgot-password"
              className="link-arrow"
              style={{ display: "inline" }}
            >
              Mot de passe oublie ?
            </Link>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
