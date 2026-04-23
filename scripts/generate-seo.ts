import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateRSSFeed, generateJSONFeed } from "../src/lib/rss";
import { generateSitemap, generateRobotsTxt } from "../src/lib/sitemap";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const publicDir = path.join(rootDir, "public");

await mkdir(publicDir, { recursive: true });

const outputs = [
  { name: "sitemap.xml", contents: generateSitemap() },
  { name: "rss.xml", contents: generateRSSFeed() },
  { name: "feed.json", contents: generateJSONFeed() },
  { name: "robots.txt", contents: generateRobotsTxt() },
];

await Promise.all(
  outputs.map((output) =>
    writeFile(path.join(publicDir, output.name), output.contents, "utf8")
  )
);

const fileList = outputs.map((output) => output.name).join(", ");
console.log(`Generated SEO assets: ${fileList}`);
