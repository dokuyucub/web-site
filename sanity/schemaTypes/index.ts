import { seoFields } from "./seoFields";
import { category } from "./category";
import { project } from "./project";
import { about } from "./about";
import { settings } from "./settings";
import { homepage } from "./homepage";
import { post } from "./post";
import { contactSubmission } from "./contactSubmission";

export const schemaTypes = [
  // Singletons
  homepage,
  about,
  settings,
  // Documents
  project,
  category,
  post,
  contactSubmission,
  // Objects
  seoFields,
];
