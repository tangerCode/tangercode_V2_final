import { setRequestLocale, getTranslations } from "next-intl/server";
import { ComingSoonContent } from "@/components/home/ComingSoonContent";

type Props = {
  params: { locale: string };
};

export default async function HomePage({ params }: Props) {
  setRequestLocale(params.locale);
  const t = await getTranslations("home");

  return (
    <ComingSoonContent
      title="TANGER CODE"
      subtitle={t("subtitle")}
      comingSoon={t("comingSoon")}
    />
  );
}
