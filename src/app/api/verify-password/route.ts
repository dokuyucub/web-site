import { type NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sanityClient } from "../../../../sanity/lib/client";
import { groq } from "next-sanity";

export async function POST(req: NextRequest) {
  try {
    const { slug, password } = await req.json();

    if (!slug || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Fetch stored password for this project
    const project = await sanityClient.fetch(
      groq`*[_type == "project" && slug.current == $slug][0]{ password, isPasswordProtected }`,
      { slug }
    );

    if (!project?.isPasswordProtected) {
      return NextResponse.json({ error: "Not protected" }, { status: 400 });
    }

    // Compare plain text password (stored as plain in Sanity for simplicity)
    // In production, hash the password before storing
    const isValid =
      project.password === password ||
      (await bcrypt.compare(password, project.password ?? ""));

    if (!isValid) {
      return NextResponse.json({ error: "Wrong password" }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
