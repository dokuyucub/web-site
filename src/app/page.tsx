// This page is handled by next-intl middleware which redirects to /tr or /en
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/tr");
}
