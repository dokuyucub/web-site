import { defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Journal Yazısı",
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
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Özet",
      type: "text",
      rows: 2,
      description: "Liste görünümünde kısa özet",
      validation: (Rule) => Rule.max(300),
    }),
    defineField({
      name: "coverImage",
      title: "Kapak Görseli (opsiyonel)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "body",
      title: "İçerik",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            { name: "caption", type: "string", title: "Altyazı" },
          ],
        },
      ],
    }),
    defineField({
      name: "publishedAt",
      title: "Yayın Tarihi",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seoFields",
    }),
  ],
  preview: {
    select: {
      title: "title",
      date: "publishedAt",
      media: "coverImage",
    },
    prepare(selection) {
      const { title, date, media } = selection as { title: string; date: string; media: unknown };
      return {
        title,
        subtitle: date ? new Date(date).toLocaleDateString("tr-TR") : "Taslak",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        media: media as any,
      };
    },
  },
});
