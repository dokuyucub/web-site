import { getProjects, getAbout, getSettings, getHomepage } from "@sanity/lib/queries";
import { CornerNav } from "@/components/ui/CornerNav";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { ProjectDetail } from "@/components/overlays/ProjectDetail";
import { BioPanel } from "@/components/overlays/BioPanel";
import { ContactPanel } from "@/components/overlays/ContactPanel";
import { MobileExperience } from "@/components/mobile/MobileExperience";
import { SceneClient } from "@/components/canvas/SceneClient";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const settings = await getSettings();
  return {
    title: settings?.siteTitle ?? "Portfolio",
    description: settings?.siteDescription,
    alternates: {
      canonical: `/${locale}`,
      languages: { tr: "/tr", en: "/en" },
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;

  // Fetch all data in parallel
  const [projects, about, settings, homepage] = await Promise.all([
    getProjects(),
    getAbout(),
    getSettings(),
    getHomepage(),
  ]);

  return (
    <>
      {/* Loading screen */}
      <LoadingScreen />

      {/* WebGL Canvas (desktop only) */}
      <div className="hidden md:block">
        <SceneClient projects={projects ?? []} />
      </div>

      {/* Mobile fallback */}
      <div className="md:hidden">
        <MobileExperience projects={projects ?? []} homepage={homepage} />
      </div>

      {/* DOM Overlay layer */}
      <div className="dom-overlay">
        <CornerNav siteTitle={settings?.siteTitle ?? "Portfolio"} />
        <ProjectDetail />
        <BioPanel about={about} />
        <ContactPanel social={settings} />
      </div>
    </>
  );
}
