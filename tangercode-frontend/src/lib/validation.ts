import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(100),
  email: z.string().email("Format d'email invalide"),
  phone: z.string().max(30).optional().or(z.literal("")),
  company: z.string().max(200).optional().or(z.literal("")),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(5000),
  service_interested: z.string().optional().or(z.literal("")),
  recaptcha_token: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const newsletterSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  language: z.enum(["fr", "en", "ar"]).optional(),
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;

export const loginSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
