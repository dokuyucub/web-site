import { groq } from "next-sanity";
import { sanityClient } from "./client";

// ─── Project Queries ────────────────────────────────────────────────────────

export const projectsQuery = groq`
  *[_type == "project" && defined(publishedAt)] | order(featuredOrder asc, publishedAt desc) {
    _id,
    title,
    slug,
    "coverImage": coverImage {
      "url": asset->url,
      "lqip": asset->metadata.lqip,
      "dimensions": asset->metadata.dimensions,
      hotspot,
      crop
    },
    shortDescription,
    "category": category->{ title, slug, color },
    tags,
    year,
    featured,
    featuredOrder,
    cardSize,
    scenePosition,
    isPasswordProtected
  }
`;

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    "coverImage": coverImage {
      "url": asset->url,
      "lqip": asset->metadata.lqip,
      "dimensions": asset->metadata.dimensions,
      hotspot,
      crop
    },
    "images": images[] {
      "url": asset->url,
      "lqip": asset->metadata.lqip,
      "dimensions": asset->metadata.dimensions,
      caption,
      layout,
      hotspot,
      crop
    },
    "category": category->{ title, slug, color },
    tags,
    year,
    shortDescription,
    body[]{
      ...,
      _type == "image" => {
        ...,
        "url": asset->url,
        "lqip": asset->metadata.lqip
      }
    },
    tools,
    projectUrl,
    isPasswordProtected,
    seo
  }
`;

export const projectSlugsQuery = groq`
  *[_type == "project" && defined(publishedAt) && defined(slug.current)][].slug.current
`;

// ─── Adjacent Projects (prev/next) ───────────────────────────────────────────

export const adjacentProjectsQuery = groq`
  {
    "prev": *[_type == "project" && defined(publishedAt) && publishedAt < $publishedAt] | order(publishedAt desc)[0] {
      title, slug, "coverImage": coverImage { "url": asset->url, "lqip": asset->metadata.lqip }
    },
    "next": *[_type == "project" && defined(publishedAt) && publishedAt > $publishedAt] | order(publishedAt asc)[0] {
      title, slug, "coverImage": coverImage { "url": asset->url, "lqip": asset->metadata.lqip }
    }
  }
`;

// ─── Homepage ────────────────────────────────────────────────────────────────

export const homepageQuery = groq`
  *[_type == "homepage"][0] {
    heroHeadline,
    heroSubtext
  }
`;

// ─── About ────────────────────────────────────────────────────────────────────

export const aboutQuery = groq`
  *[_type == "about"][0] {
    name,
    headline,
    bio,
    "portrait": portrait {
      "url": asset->url,
      "lqip": asset->metadata.lqip,
      hotspot,
      crop
    },
    skills,
    "cv": cv.asset->url,
    availability,
    availabilityText
  }
`;

// ─── Settings ────────────────────────────────────────────────────────────────

export const settingsQuery = groq`
  *[_type == "settings"][0] {
    email,
    behance,
    dribbble,
    instagram,
    linkedin,
    github,
    twitter,
    siteTitle,
    siteDescription,
    "defaultOgImage": defaultOgImage.asset->url
  }
`;

// ─── Posts ───────────────────────────────────────────────────────────────────

export const postsQuery = groq`
  *[_type == "post" && defined(publishedAt)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    "coverImage": coverImage {
      "url": asset->url,
      "lqip": asset->metadata.lqip
    },
    publishedAt
  }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    title,
    slug,
    excerpt,
    "coverImage": coverImage {
      "url": asset->url,
      "lqip": asset->metadata.lqip
    },
    body[]{
      ...,
      _type == "image" => {
        ...,
        "url": asset->url,
        "lqip": asset->metadata.lqip
      }
    },
    publishedAt,
    seo
  }
`;

export const postSlugsQuery = groq`
  *[_type == "post" && defined(publishedAt) && defined(slug.current)][].slug.current
`;

// ─── Fetch helpers ───────────────────────────────────────────────────────────

export async function getProjects() {
  return sanityClient.fetch(projectsQuery, {}, { next: { tags: ["projects"] } }).catch(() => null);
}

export async function getProjectBySlug(slug: string) {
  return sanityClient.fetch(projectBySlugQuery, { slug }, { next: { tags: [`project-${slug}`] } }).catch(() => null);
}

export async function getHomepage() {
  return sanityClient.fetch(homepageQuery, {}, { next: { tags: ["homepage"] } }).catch(() => null);
}

export async function getAbout() {
  return sanityClient.fetch(aboutQuery, {}, { next: { tags: ["about"] } }).catch(() => null);
}

export async function getSettings() {
  return sanityClient.fetch(settingsQuery, {}, { next: { tags: ["settings"] } }).catch(() => null);
}

export async function getPosts() {
  return sanityClient.fetch(postsQuery, {}, { next: { tags: ["posts"] } }).catch(() => null);
}

export async function getPostBySlug(slug: string) {
  return sanityClient.fetch(postBySlugQuery, { slug }, { next: { tags: [`post-${slug}`] } }).catch(() => null);
}
