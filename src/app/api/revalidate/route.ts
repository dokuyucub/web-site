import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

const tag = (name: string) => revalidateTag(name, {});

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-sanity-webhook-secret");

  if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const type = body._type as string;
    const slug = body.slug?.current as string | undefined;

    switch (type) {
      case "project":
        tag("projects");
        if (slug) tag(`project-${slug}`);
        break;
      case "post":
        tag("posts");
        if (slug) tag(`post-${slug}`);
        break;
      case "homepage":
        tag("homepage");
        break;
      case "about":
        tag("about");
        break;
      case "settings":
        tag("settings");
        break;
      default:
        tag("projects");
        tag("posts");
        tag("homepage");
        tag("about");
        tag("settings");
    }

    return NextResponse.json({ revalidated: true, type });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
