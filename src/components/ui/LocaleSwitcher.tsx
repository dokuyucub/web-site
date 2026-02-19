"use client";

import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  const otherLocale = locale === "tr" ? "en" : "tr";

  const switchLocale = () => {
    // Navigate to home page in the other locale
    router.replace("/", { locale: otherLocale });
  };

  return (
    <button
      onClick={switchLocale}
      className="text-sz-small font-medium tracking-widest opacity-40 hover:opacity-100 transition-opacity uppercase"
    >
      {otherLocale}
    </button>
  );
}
