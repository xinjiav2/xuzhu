import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

// Empty for root hosting; e.g. /xuzhu for a GitHub Pages project site.
const prefix = (process.env.BASE_PATH || "").replace(/^\/+|\/+$/g, "");
if (prefix && !/^[a-zA-Z0-9._/-]+$/.test(prefix)) throw new Error("Invalid BASE_PATH");
export const basePath = prefix ? `/${prefix}` : "";
export const outputDirectory = pathToFileURL(resolve(process.env.OUTPUT_DIR || "dist") + "/");
