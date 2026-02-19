import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["tr", "en"],
  defaultLocale: "tr",
  pathnames: {
    "/": "/",
    "/journal": {
      tr: "/journal",
      en: "/journal",
    },
    "/journal/[slug]": {
      tr: "/journal/[slug]",
      en: "/journal/[slug]",
    },
  },
});
