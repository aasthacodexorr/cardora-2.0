// Uploads local files to Bunny Storage, served from BUNNY_CDN_URL.
// Usage: node --env-file=.env.local scripts/upload-bunny.mjs <remote-dir> <file...>
//   e.g. node --env-file=.env.local scripts/upload-bunny.mjs videos/web ./clip_web.mp4 ./clip_poster.jpg
import { readFile } from "node:fs/promises";
import { basename } from "node:path";

const { BUNNY_ACCESS_KEY, BUNNY_STORAGE_ZONE, BUNNY_UPLOAD_URL, BUNNY_CDN_URL } = process.env;
if (!BUNNY_ACCESS_KEY || !BUNNY_STORAGE_ZONE || !BUNNY_UPLOAD_URL || !BUNNY_CDN_URL) {
  console.error("Missing BUNNY_* variables, run with --env-file=.env.local");
  process.exit(1);
}

const [remoteDir, ...files] = process.argv.slice(2);
if (!remoteDir || files.length === 0) {
  console.error("Usage: node --env-file=.env.local scripts/upload-bunny.mjs <remote-dir> <file...>");
  process.exit(1);
}

const dir = remoteDir.replace(/^\/+|\/+$/g, "");
for (const file of files) {
  const remotePath = `${dir}/${basename(file)}`;
  const res = await fetch(`${BUNNY_UPLOAD_URL}/${BUNNY_STORAGE_ZONE}/${remotePath}`, {
    method: "PUT",
    headers: { AccessKey: BUNNY_ACCESS_KEY, "Content-Type": "application/octet-stream" },
    body: await readFile(file),
  });
  if (!res.ok) {
    console.error(`Failed ${remotePath}: ${res.status} ${await res.text()}`);
    process.exit(1);
  }
  console.log(`${BUNNY_CDN_URL}/${remotePath}`);
}
