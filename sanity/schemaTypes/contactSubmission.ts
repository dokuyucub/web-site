import { defineField, defineType } from "sanity";

export const contactSubmission = defineType({
  name: "contactSubmission",
  title: "İletişim Mesajı",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Ad Soyad", type: "string" }),
    defineField({ name: "email", title: "E-posta", type: "string" }),
    defineField({ name: "message", title: "Mesaj", type: "text" }),
    defineField({ name: "budget", title: "Bütçe Aralığı", type: "string" }),
    defineField({ name: "receivedAt", title: "Alındı", type: "datetime" }),
    defineField({
      name: "isRead",
      title: "Okundu",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "email",
      date: "receivedAt",
    },
    prepare(selection) {
      const { title, subtitle, date } = selection as { title: string; subtitle: string; date: string };
      return {
        title,
        subtitle: `${subtitle} · ${date ? new Date(date).toLocaleDateString("tr-TR") : ""}`,
      };
    },
  },
});
