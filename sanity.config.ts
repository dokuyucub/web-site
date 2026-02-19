import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  title: "Portfolio Studio",
  schema: {
    types: schemaTypes,
  },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("İçerik")
          .items([
            S.listItem()
              .title("Ana Sayfa")
              .child(
                S.document()
                  .schemaType("homepage")
                  .documentId("homepage")
                  .title("Ana Sayfa")
              ),
            S.listItem()
              .title("Hakkımda")
              .child(
                S.document()
                  .schemaType("about")
                  .documentId("about")
                  .title("Hakkımda")
              ),
            S.listItem()
              .title("Site Ayarları")
              .child(
                S.document()
                  .schemaType("settings")
                  .documentId("settings")
                  .title("Site Ayarları")
              ),
            S.divider(),
            S.documentTypeListItem("project").title("Projeler"),
            S.documentTypeListItem("category").title("Kategoriler"),
            S.divider(),
            S.documentTypeListItem("post").title("Journal Yazıları"),
            S.divider(),
            S.documentTypeListItem("contactSubmission").title("Mesajlar"),
          ]),
    }),
    visionTool({ defaultApiVersion: "2024-01-01" }),
  ],
});
