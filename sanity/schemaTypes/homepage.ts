import { defineField, defineType } from "sanity";

export const homepage = defineType({
  name: "homepage",
  title: "Ana Sayfa",
  type: "document",
  fields: [
    defineField({
      name: "heroHeadline",
      title: "Hero Başlık",
      type: "string",
      description: "Büyük ekranda gösterilecek ana başlık",
    }),
    defineField({
      name: "heroSubtext",
      title: "Hero Alt Metin",
      type: "string",
    }),
  ],
});
