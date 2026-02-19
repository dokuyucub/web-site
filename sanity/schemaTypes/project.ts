import { defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Proje",
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
      name: "coverImage",
      title: "Kapak Görseli",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "images",
      title: "Proje Görselleri",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "caption",
              title: "Altyazı",
              type: "string",
            },
            {
              name: "layout",
              title: "Düzen",
              type: "string",
              options: {
                list: [
                  { title: "Tam Genişlik", value: "full" },
                  { title: "İki Sütun", value: "two-column" },
                  { title: "Üç Sütun", value: "three-column" },
                ],
              },
            },
          ],
        },
      ],
    }),
    defineField({
      name: "category",
      title: "Kategori",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Etiketler",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "year",
      title: "Yıl",
      type: "number",
      validation: (Rule) => Rule.min(2000).max(2100),
    }),
    defineField({
      name: "shortDescription",
      title: "Kısa Açıklama",
      type: "text",
      rows: 2,
      description: "Proje kartında ve liste görünümünde gösterilir (max 200 karakter)",
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: "body",
      title: "Proje İçeriği",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            { name: "caption", type: "string", title: "Altyazı" },
            {
              name: "layout",
              type: "string",
              title: "Düzen",
              options: {
                list: [
                  { title: "Tam Genişlik", value: "full" },
                  { title: "İki Sütun", value: "two-column" },
                  { title: "Üç Sütun", value: "three-column" },
                ],
              },
            },
          ],
        },
        {
          type: "object",
          name: "videoEmbed",
          title: "Video",
          fields: [
            {
              name: "url",
              type: "url",
              title: "Vimeo veya YouTube URL",
            },
            {
              name: "caption",
              type: "string",
              title: "Altyazı",
            },
          ],
          preview: {
            select: { title: "url" },
            prepare(selection) {
              const { title } = selection as { title: string };
              return { title: `Video: ${title}` };
            },
          },
        },
      ],
    }),
    defineField({
      name: "tools",
      title: "Kullanılan Araçlar",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "projectUrl",
      title: "Canlı URL (opsiyonel)",
      type: "url",
    }),
    defineField({
      name: "featured",
      title: "Öne Çıkan",
      type: "boolean",
      description: "Ana sahnede öne çıkan büyük kart olarak göster",
      initialValue: false,
    }),
    defineField({
      name: "featuredOrder",
      title: "Öne Çıkan Sırası",
      type: "number",
      hidden: ({ document }) => !document?.featured,
    }),
    defineField({
      name: "cardSize",
      title: "Kart Boyutu (3D Sahnede)",
      type: "string",
      options: {
        list: [
          { title: "Küçük", value: "small" },
          { title: "Orta", value: "medium" },
          { title: "Büyük", value: "large" },
        ],
        layout: "radio",
      },
      initialValue: "medium",
    }),
    defineField({
      name: "scenePosition",
      title: "3D Sahne Pozisyonu (opsiyonel)",
      type: "object",
      description: "Boş bırakılırsa otomatik yerleştirilir",
      fields: [
        { name: "x", type: "number", title: "X" },
        { name: "y", type: "number", title: "Y" },
        { name: "z", type: "number", title: "Z (Derinlik)" },
      ],
    }),
    defineField({
      name: "isPasswordProtected",
      title: "Şifre Korumalı",
      type: "boolean",
      description: "Müşteri işleri için gizli tut",
      initialValue: false,
    }),
    defineField({
      name: "password",
      title: "Şifre",
      type: "string",
      description: "DÜZ METİN girin — sistem otomatik şifreler",
      hidden: ({ document }) => !document?.isPasswordProtected,
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seoFields",
    }),
    defineField({
      name: "publishedAt",
      title: "Yayın Tarihi",
      type: "datetime",
    }),
  ],
  preview: {
    select: {
      title: "title",
      year: "year",
      media: "coverImage",
      category: "category.title",
    },
    prepare(selection) {
      const { title, year, media, category } = selection as {
        title: string;
        year: number;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        media: any;
        category: string;
      };
      return {
        title,
        subtitle: [category, year].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
