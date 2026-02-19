import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "Kategori",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Başlık",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "color",
      title: "Renk (HEX)",
      type: "string",
      description: "Örnek: #FF4D00",
    }),
  ],
  preview: {
    select: { title: "title" },
  },
});
