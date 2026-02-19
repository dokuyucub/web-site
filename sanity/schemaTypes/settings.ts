import { defineField, defineType } from "sanity";

export const settings = defineType({
  name: "settings",
  title: "Site Ayarları",
  type: "document",
  fields: [
    defineField({
      name: "email",
      title: "E-posta Adresi",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "behance",
      title: "Behance URL",
      type: "url",
    }),
    defineField({
      name: "dribbble",
      title: "Dribbble URL",
      type: "url",
    }),
    defineField({
      name: "instagram",
      title: "Instagram URL",
      type: "url",
    }),
    defineField({
      name: "linkedin",
      title: "LinkedIn URL",
      type: "url",
    }),
    defineField({
      name: "github",
      title: "GitHub URL (opsiyonel)",
      type: "url",
    }),
    defineField({
      name: "twitter",
      title: "X / Twitter URL (opsiyonel)",
      type: "url",
    }),
    defineField({
      name: "siteTitle",
      title: "Site Başlığı",
      type: "string",
      initialValue: "Portfolio",
    }),
    defineField({
      name: "siteDescription",
      title: "Site Açıklaması",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "defaultOgImage",
      title: "Varsayılan OG Görseli",
      type: "image",
    }),
  ],
});
