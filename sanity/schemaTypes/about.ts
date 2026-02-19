import { defineField, defineType } from "sanity";

export const about = defineType({
  name: "about",
  title: "Hakkımda",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Ad Soyad",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "headline",
      title: "Başlık Cümlesi",
      type: "string",
      description: "Büyük ekranda gösterilecek kısa tanım (örn: 'Dijital Sanatçı & Tasarımcı')",
    }),
    defineField({
      name: "bio",
      title: "Biyografi",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "portrait",
      title: "Fotoğraf",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "skills",
      title: "Yetenekler & Araçlar",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "name", type: "string", title: "İsim", validation: (Rule) => Rule.required() },
            { name: "icon", type: "image", title: "İkon (opsiyonel)" },
            {
              name: "category",
              type: "string",
              title: "Kategori",
              options: {
                list: [
                  { title: "Tasarım", value: "Design" },
                  { title: "Motion", value: "Motion" },
                  { title: "3D", value: "3D" },
                  { title: "Geliştirme", value: "Development" },
                  { title: "Diğer", value: "Other" },
                ],
              },
            },
          ],
          preview: {
            select: { title: "name", subtitle: "category" },
          },
        },
      ],
    }),
    defineField({
      name: "cv",
      title: "CV (PDF)",
      type: "file",
      options: { accept: ".pdf" },
    }),
    defineField({
      name: "availability",
      title: "Müsaitlik Durumu",
      type: "string",
      options: {
        list: [
          { title: "🟢 Müsait — Yeni projeler için açık", value: "available" },
          { title: "🟡 Kısıtlı — Sınırlı kapasite", value: "limited" },
          { title: "🔴 Müsait Değil", value: "unavailable" },
        ],
        layout: "radio",
      },
      initialValue: "available",
    }),
    defineField({
      name: "availabilityText",
      title: "Müsaitlik Metni",
      type: "string",
      initialValue: "Yeni projeler için açık",
    }),
  ],
});
