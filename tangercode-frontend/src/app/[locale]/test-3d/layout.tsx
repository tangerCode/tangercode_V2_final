import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Test 3D — TANGER CODE",
    description: "Page de test de la scène 3D Hero",
  };
}

export default async function Test3DLayout({ children, params }: Props) {
  setRequestLocale(params.locale);

  let messages;
  try {
    messages = await getMessages();
  } catch {
    messages = {};
  }

  return (
    <NextIntlClientProvider locale={params.locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
